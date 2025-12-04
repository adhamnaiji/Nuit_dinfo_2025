"use client"

import { useEffect, useMemo, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { type Mesh, BufferGeometry, Float32BufferAttribute } from "three"

interface STLViewerProps {
  arrayBuffer: ArrayBuffer
  resetView: boolean
  onResetComplete: () => void
  wireframe: boolean
  color: string
}

function parseSTL(arrayBuffer: ArrayBuffer): Float32Array {
  const view = new DataView(arrayBuffer)

  // Check if binary or ASCII
  const isBinary = arrayBuffer.byteLength > 84

  if (isBinary) {
    // Binary STL format
    const triangles = view.getUint32(80, true)
    const vertices = new Float32Array(triangles * 9)

    let offset = 84
    let vertexIndex = 0

    for (let i = 0; i < triangles; i++) {
      // Skip normal vector (3 floats)
      offset += 12

      // Read vertices (3 vertices per triangle, 3 floats each)
      for (let j = 0; j < 3; j++) {
        vertices[vertexIndex++] = view.getFloat32(offset, true)
        vertices[vertexIndex++] = view.getFloat32(offset + 4, true)
        vertices[vertexIndex++] = view.getFloat32(offset + 8, true)
        offset += 12
      }

      // Skip attribute byte count
      offset += 2
    }

    return vertices
  } else {
    // ASCII STL format
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

function calculateNormals(vertices: Float32Array): Float32Array {
  const normals = new Float32Array(vertices.length)

  for (let i = 0; i < vertices.length; i += 9) {
    const v1x = vertices[i + 3] - vertices[i]
    const v1y = vertices[i + 4] - vertices[i + 1]
    const v1z = vertices[i + 5] - vertices[i + 2]

    const v2x = vertices[i + 6] - vertices[i]
    const v2y = vertices[i + 7] - vertices[i + 1]
    const v2z = vertices[i + 8] - vertices[i + 2]

    // Cross product
    const nx = v1y * v2z - v1z * v2y
    const ny = v1z * v2x - v1x * v2z
    const nz = v1x * v2y - v1y * v2x

    // Normalize
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

export default function STLViewer({ arrayBuffer, resetView, onResetComplete, wireframe, color }: STLViewerProps) {
  const meshRef = useRef<Mesh>(null)
  const { camera } = useThree()

  const geometry = useMemo(() => {
    const vertices = parseSTL(arrayBuffer)
    const normals = calculateNormals(vertices)

    const geom = new BufferGeometry()
    geom.setAttribute("position", new Float32BufferAttribute(vertices, 3))
    geom.setAttribute("normal", new Float32BufferAttribute(normals, 3))

    return geom
  }, [arrayBuffer])

  useEffect(() => {
    if (resetView && meshRef.current) {
      geometry.computeBoundingBox()
      const boundingBox = geometry.boundingBox

      if (boundingBox) {
        const size = new Float32Array(3)
        size[0] = boundingBox.max.x - boundingBox.min.x
        size[1] = boundingBox.max.y - boundingBox.min.y
        size[2] = boundingBox.max.z - boundingBox.min.z

        const maxDim = Math.max(size[0], size[1], size[2])
        const fov = camera.fov * (Math.PI / 180)
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        cameraZ *= 1.3

        camera.position.z = cameraZ
        camera.lookAt(0, 0, 0)
      }

      onResetComplete()
    }
  }, [resetView, geometry, camera, onResetComplete])

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
      <meshPhongMaterial color={color} wireframe={wireframe} specular={0x111111} shininess={200} />
    </mesh>
  )
}
