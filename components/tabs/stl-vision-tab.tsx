"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Bounds } from "@react-three/drei"
import STLViewer from "@/components/stl-viewer"
import UploadSection from "@/components/upload-section"
import ControlsPanel from "@/components/controls-panel"

export default function STLVisionTab() {
  const [stlFile, setStlFile] = useState<ArrayBuffer | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [resetView, setResetView] = useState(false)
  const [wireframe, setWireframe] = useState(false)
  const [meshColor, setMeshColor] = useState("#3b82f6")
  const [autoRotate, setAutoRotate] = useState(false)

  const handleFileUpload = (file: File, buffer: ArrayBuffer) => {
    setFileName(file.name)
    setStlFile(buffer)
    setResetView(true)
  }

  const handleReset = () => {
    setResetView(true)
  }

  return (
    <div>
      {!stlFile ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <UploadSection onFileUpload={handleFileUpload} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D Canvas */}
          <div className="lg:col-span-3">
            <div
              className="bg-black/40 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              style={{ height: "600px" }}
            >
              <Canvas>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} />
                <Bounds fit clip observe margin={1.2}>
                  <STLViewer
                    arrayBuffer={stlFile}
                    resetView={resetView}
                    onResetComplete={() => setResetView(false)}
                    wireframe={wireframe}
                    color={meshColor}
                  />
                  <OrbitControls
                    makeDefault
                    autoRotate={autoRotate}
                    autoRotateSpeed={4}
                    enableDamping={true}
                    dampingFactor={0.05}
                  />
                </Bounds>
              </Canvas>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <ControlsPanel
              fileName={fileName}
              wireframe={wireframe}
              setWireframe={setWireframe}
              meshColor={meshColor}
              setMeshColor={setMeshColor}
              autoRotate={autoRotate}
              setAutoRotate={setAutoRotate}
              onReset={handleReset}
              onNewFile={() => {
                setStlFile(null)
                setFileName("")
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
