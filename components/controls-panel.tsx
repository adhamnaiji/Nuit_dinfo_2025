"use client"

import { RotateCcw, Eye, EyeOff, Upload, RotateCw } from "lucide-react"

interface ControlsPanelProps {
  fileName: string
  wireframe: boolean
  setWireframe: (value: boolean) => void
  meshColor: string
  setMeshColor: (value: string) => void
  autoRotate: boolean
  setAutoRotate: (value: boolean) => void
  onReset: () => void
  onNewFile: () => void
}

export default function ControlsPanel({
  fileName,
  wireframe,
  setWireframe,
  meshColor,
  setMeshColor,
  autoRotate,
  setAutoRotate,
  onReset,
  onNewFile,
}: ControlsPanelProps) {
  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Green", value: "#10b981" },
    { name: "Orange", value: "#f97316" },
    { name: "Cyan", value: "#06b6d4" },
  ]

  return (
    <div className="space-y-6">
      {/* File Info */}
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-2">Loaded File</p>
        <p className="text-sm font-medium text-white truncate">{fileName || "No file"}</p>
      </div>

      {/* Display Options */}
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white">Display</h3>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="text-sm text-white">Auto-rotate</span>
          <RotateCw size={16} className={autoRotate ? "text-blue-400" : "text-gray-400"} />
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="text-sm text-white">{wireframe ? "Wireframe Mode" : "Solid Mode"}</span>
          {wireframe ? <Eye size={16} className="text-blue-400" /> : <EyeOff size={16} className="text-gray-400" />}
        </button>
        {/* </CHANGE> */}
      </div>

      {/* Color Selector */}
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white">Color</h3>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((col) => (
            <button
              key={col.value}
              onClick={() => setMeshColor(col.value)}
              className={`group relative h-10 rounded-lg transition-all duration-200 ${
                meshColor === col.value ? "ring-2 ring-white scale-105" : "hover:scale-110"
              }`}
              style={{ backgroundColor: col.value }}
              title={col.name}
            >
              <span className="sr-only">{col.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200"
        >
          <RotateCcw size={16} />
          Reset View
        </button>

        <button
          onClick={onNewFile}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200"
        >
          <Upload size={16} />
          New File
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-xs text-blue-200">
          <strong>Tip:</strong> Left-click to rotate, scroll to zoom, right-click to pan the view.
        </p>
      </div>
    </div>
  )
}
