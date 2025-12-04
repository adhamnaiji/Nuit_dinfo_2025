'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute } from 'three'

interface STLViewerProps {
  arrayBuffer: ArrayBuffer
  resetView: boolean
  onResetComplete: () => void
  wireframe: boolean
  color: string
  enableSlicing?: boolean
  currentLayer?: number
  totalLayers?: number
}

// Parse STL file (binary and ASCII support)
function parseSTL(arrayBuffer: ArrayBuffer): Float32Array {
  const view = new DataView(arrayBuffer)
  const isBinary = arrayBuffer.byteLength > 84

  if (isBinary) {
    const triangles = view.getUint32(80, true)
    const vertices = new Float32Array(triangles * 9)
    let offset = 84
    let vertexIndex = 0

    for (let i = 0; i < triangles; i++) {
      offset += 12 // Skip normal
      for (let j = 0; j < 3; j++) {
        vertices[vertexIndex++] = view.getFloat32(offset, true)
        vertices[vertexIndex++] = view.getFloat32(offset + 4, true)
        vertices[vertexIndex++] = view.getFloat32(offset + 8, true)
        offset += 12
      }
      offset += 2 // Skip attribute byte count
    }
    return vertices
  } else {
    const text = new TextDecoder().decode(arrayBuffer)
    const vertices: number[] = []
    const vertexPattern =
      /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g
    let match
    while ((match = vertexPattern.exec(text)) !== null) {
      vertices.push(Number.parseFloat(match[1]))
      vertices.push(Number.parseFloat(match[3]))
      vertices.push(Number.parseFloat(match[5]))
    }
    return new Float32Array(vertices)
  }
}

// Calculate normals for lighting
function calculateNormals(vertices: Float32Array): Float32Array {
  const normals = new Float32Array(vertices.length)
  for (let i = 0; i < vertices.length; i += 9) {
    const v1x = vertices[i + 3] - vertices[i]
    const v1y = vertices[i + 4] - vertices[i + 1]
    const v1z = vertices[i + 5] - vertices[i + 2]
    const v2x = vertices[i + 6] - vertices[i]
    const v2y = vertices[i + 7] - vertices[i + 1]
    const v2z = vertices[i + 8] - vertices[i + 2]

    const nx = v1y * v2z - v1z * v2y
    const ny = v1z * v2x - v1x * v2z
    const nz = v1x * v2y - v1y * v2x

    const length = Math.sqrt(nx * nx + ny * ny + nz * nz)
    const lx = nx / length
    const ly = ny / length
    const lz = nz / length

    for (let j = 0; j < 3; j++) {
      normals[i + j * 3] = lx
      normals[i + j * 3 + 1] = ly
      normals[i + j * 3 + 2] = lz
    }
  }
  return normals
}

// Build overhang detection geometry (faces pointing down)
function buildOverhangGeometry(
  vertices: Float32Array,
  normals: Float32Array,
  threshold = 0.15
) {
  const overhangPositions: number[] = []

  for (let i = 0; i < normals.length; i += 9) {
    // Check if face normal points downward
    const nz = (normals[i + 2] + normals[i + 5] + normals[i + 8]) / 3
    if (nz < -threshold) {
      // Add triangle vertices
      for (let j = 0; j < 9; j++) {
        overhangPositions.push(vertices[i + j])
      }
    }
  }

  if (overhangPositions.length === 0) return null

  const geom = new BufferGeometry()
  geom.setAttribute(
    'position',
    new Float32BufferAttribute(new Float32Array(overhangPositions), 3)
  )
  geom.computeVertexNormals()
  return geom
}

export default function STLViewer({
  arrayBuffer,
  resetView,
  onResetComplete,
  wireframe,
  color,
  enableSlicing = false,
  currentLayer = 0,
  totalLayers = 100,
}: STLViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const planeRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const [geometry, setGeometry] = useState<BufferGeometry | null>(null)
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null)
  const [overhangGeometry, setOverhangGeometry] = useState<BufferGeometry | null>(null)

  // Parse STL and setup geometry
  useEffect(() => {
    const vertices = parseSTL(arrayBuffer)
    const normals = calculateNormals(vertices)

    const geom = new BufferGeometry()
    geom.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geom.setAttribute('normal', new Float32BufferAttribute(normals, 3))
    geom.computeBoundingBox()

    const overhang = buildOverhangGeometry(vertices, normals)

    setGeometry(geom)
    setBoundingBox(geom.boundingBox)
    setOverhangGeometry(overhang)
  }, [arrayBuffer])

  // Handle camera fit on reset
  useEffect(() => {
    if (resetView && geometry && meshRef.current && boundingBox) {
      const size = new THREE.Vector3()
      boundingBox.getSize(size)

      const maxDim = Math.max(size.x, size.y, size.z)
      let cameraZ: number

      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const perspective = camera as THREE.PerspectiveCamera
        const fov = perspective.fov * (Math.PI / 180)
        cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2))
      } else {
        cameraZ = maxDim
      }

      cameraZ *= 1.5
      camera.position.z = cameraZ
      camera.lookAt(0, 0, 0)
      onResetComplete()
    }
  }, [resetView, geometry, camera, boundingBox, onResetComplete])

  // Update slice plane position
  useEffect(() => {
    if (!planeRef.current || !boundingBox) return

    const minZ = boundingBox.min.z
    const maxZ = boundingBox.max.z
    const height = maxZ - minZ

    const t = totalLayers > 0 ? currentLayer / totalLayers : 0
    const sliceZ = minZ + t * height

    planeRef.current.position.z = sliceZ

    const sizeX = boundingBox.max.x - boundingBox.min.x
    const sizeY = boundingBox.max.y - boundingBox.min.y
    planeRef.current.scale.set(sizeX * 1.1, sizeY * 1.1, 1)
  }, [currentLayer, totalLayers, boundingBox])

  if (!geometry) return null

  return (
    <>
      {/* Main mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial
          color={color}
          wireframe={wireframe}
          specular={0x111111}
          shininess={80}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Overhang visualization (red) */}
      {overhangGeometry && (
        <mesh geometry={overhangGeometry}>
          <meshPhongMaterial
            color="#ef4444"
            emissive="#991b1b"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Slicing visualization */}
      {enableSlicing && boundingBox && (
        <>
          {/* Horizontal SLICE PLANE (XY plane) - Moves in Z */}
          <mesh ref={planeRef} position={[0, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Vertical REFERENCE PLANE 1 (YZ plane at center X) - Red */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Vertical REFERENCE PLANE 2 (XZ plane at center Y) - Blue */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#3b82f6"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Grid helper for reference */}
          <gridHelper
            args={[
              Math.max(
                boundingBox.max.x - boundingBox.min.x,
                boundingBox.max.y - boundingBox.min.y
              ) * 1.5,
              20,
              0x444444,
              0x888888,
            ]}
            position={[0, 0, boundingBox.min.z - 5]}
          />

          {/* Axes helper */}
          <axesHelper
            args={[
              Math.max(
                boundingBox.max.x - boundingBox.min.x,
                boundingBox.max.y - boundingBox.min.y
              ) * 0.7,
            ]}
          />
        </>
      )}
    </>
  )
}