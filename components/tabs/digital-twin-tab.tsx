"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Bounds } from "@react-three/drei"
import UploadSection from "@/components/upload-section"
import STLViewer from "@/components/stl-viewer"
import QuoteRequestDialog from "@/components/quote-request-dialog"
import CheckoutPaymentDialog from "@/components/checkout-payment-dialog"

interface STLDimensions {
  width: number
  height: number
  depth: number
}

export default function DigitalTwinTab() {
  const [uploadedFile, setUploadedFile] = useState<ArrayBuffer | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [dimensions, setDimensions] = useState<STLDimensions | null>(null)
  const [resetView, setResetView] = useState(false)
  const [wireframe, setWireframe] = useState(false)
  const [meshColor, setMeshColor] = useState("#10b981")
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)

  const calculateSTLDimensions = (buffer: ArrayBuffer): STLDimensions => {
    const view = new DataView(buffer)
    let minX = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY
    let minZ = Number.POSITIVE_INFINITY,
      maxZ = Number.NEGATIVE_INFINITY

    const isBinary = buffer.byteLength > 84
    const vertices: number[] = []

    if (isBinary) {
      const triangles = view.getUint32(80, true)
      let offset = 84
      for (let i = 0; i < triangles; i++) {
        offset += 12 // Skip normal
        for (let j = 0; j < 3; j++) {
          const x = view.getFloat32(offset, true)
          const y = view.getFloat32(offset + 4, true)
          const z = view.getFloat32(offset + 8, true)
          vertices.push(x, y, z)
          offset += 12
        }
        offset += 2 // Skip attribute byte count
      }
    } else {
      const text = new TextDecoder().decode(buffer)
      const vertexPattern =
        /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g
      let match
      while ((match = vertexPattern.exec(text)) !== null) {
        vertices.push(Number.parseFloat(match[1]), Number.parseFloat(match[3]), Number.parseFloat(match[5]))
      }
    }

    for (let i = 0; i < vertices.length; i += 3) {
      minX = Math.min(minX, vertices[i])
      maxX = Math.max(maxX, vertices[i])
      minY = Math.min(minY, vertices[i + 1])
      maxY = Math.max(maxY, vertices[i + 1])
      minZ = Math.min(minZ, vertices[i + 2])
      maxZ = Math.max(maxZ, vertices[i + 2])
    }

    return {
      width: Math.abs(maxX - minX),
      height: Math.abs(maxY - minY),
      depth: Math.abs(maxZ - minZ),
    }
  }

  const handleFileUpload = (file: File, buffer: ArrayBuffer) => {
    setFileName(file.name)
    setUploadedFile(buffer)
    const dims = calculateSTLDimensions(buffer)
    setDimensions(dims)
    setResetView(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Virtual World - 3D Model */}
        <Card className="border border-white/10 bg-black/30 backdrop-blur p-6 lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                  Monde Virtuel
                </h2>
                <p className="text-sm text-gray-400 mt-1">Modèle STL • Conception 3D • Prototype numérique</p>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Conception</Badge>
            </div>

            {!uploadedFile ? (
              <div className="flex items-center justify-center min-h-[500px]">
                <UploadSection onFileUpload={handleFileUpload} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-white/5">
                  <div>
                    <p className="text-sm text-gray-300 font-mono">{fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">Fichier STL chargé avec succès</p>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null)
                      setFileName("")
                      setDimensions(null)
                    }}
                    className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
                <div
                  className="bg-black/50 rounded-lg border border-white/5 overflow-hidden"
                  style={{ height: "500px" }}
                >
                  <Canvas>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[10, 10, 5]} intensity={0.8} />
                    <pointLight position={[-10, -10, -10]} intensity={0.3} />
                    <Bounds fit clip observe margin={1.2}>
                      <STLViewer
                        arrayBuffer={uploadedFile}
                        resetView={resetView}
                        onResetComplete={() => setResetView(false)}
                        wireframe={wireframe}
                        color={meshColor}
                      />
                      <OrbitControls makeDefault autoRotate autoRotateSpeed={2} enableDamping dampingFactor={0.05} />
                    </Bounds>
                  </Canvas>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setWireframe(!wireframe)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      wireframe
                        ? "bg-purple-600 text-white"
                        : "bg-black/50 text-gray-300 border border-white/10 hover:border-white/30"
                    }`}
                  >
                    {wireframe ? "Solide" : "Filaire"}
                  </button>
                  <div className="flex items-center gap-2 bg-black/50 rounded-lg border border-white/10 px-3">
                    <input
                      type="color"
                      value={meshColor}
                      onChange={(e) => setMeshColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer"
                    />
                    <span className="text-xs text-gray-400">Couleur</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Real World - Manufacturing */}
        <div className="space-y-4">
          <Card className="border border-white/10 bg-black/30 backdrop-blur p-6">
            <div className="space-y-4 h-full">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  Monde Réel
                </h3>
                <p className="text-sm text-gray-400 mt-1">Fabrication • Production • Durabilité</p>
              </div>

              {uploadedFile && dimensions ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Dimensions</p>
                    <div className="text-sm text-green-300 mt-2 space-y-1 font-mono text-xs">
                      <p>L: {dimensions.width.toFixed(2)}mm</p>
                      <p>H: {dimensions.height.toFixed(2)}mm</p>
                      <p>P: {dimensions.depth.toFixed(2)}mm</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Matériaux écologiques</p>
                    <p className="text-sm text-blue-300 mt-2">PLA • PETG • Nylon durable</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Principes NIRD</p>
                    <p className="text-sm text-amber-300 mt-2">♻️ Réutilisable • 📊 Traçable • 🌱 Durable</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setQuoteDialogOpen(true)}
                      className="py-2 px-3 rounded-lg bg-green-600/20 border border-green-500/50 text-green-300 text-sm font-semibold hover:bg-green-600/30 transition-all"
                    >
                      Demande Devis
                    </button>
                    <button
                      onClick={() => setCheckoutDialogOpen(true)}
                      className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all"
                    >
                      Démarrer Création
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center py-8">
                  <p className="text-sm text-gray-500">Téléversez un modèle STL pour explorer les options</p>
                </div>
              )}
            </div>
          </Card>

          {/* Impact Metrics */}
          <Card className="border border-white/10 bg-black/30 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-3">Impact Écologique</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-black/50">
                <span className="text-xs text-gray-400">Économie matière</span>
                <span className="text-xs font-semibold text-green-300">85%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/50">
                <span className="text-xs text-gray-400">Réduction CO₂</span>
                <span className="text-xs font-semibold text-blue-300">72%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/50">
                <span className="text-xs text-gray-400">Matériaux recyclés</span>
                <span className="text-xs font-semibold text-cyan-300">92%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <QuoteRequestDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        fileName={fileName}
        dimensions={dimensions || { width: 0, height: 0, depth: 0 }}
      />
      <CheckoutPaymentDialog
        open={checkoutDialogOpen}
        onOpenChange={setCheckoutDialogOpen}
        fileName={fileName}
        dimensions={dimensions || { width: 0, height: 0, depth: 0 }}
      />
    </div>
  )
}
