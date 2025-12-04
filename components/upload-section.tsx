"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface UploadSectionProps {
  onFileUpload: (file: File, buffer: ArrayBuffer) => void
}

export default function UploadSection({ onFileUpload }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".stl")) {
      alert("Please select an STL file")
      return
    }

    setIsLoading(true)
    try {
      const buffer = await file.arrayBuffer()
      onFileUpload(file, buffer)
    } catch (error) {
      console.error("Error loading file:", error)
      alert("Error loading file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Upload your 3D Model</h2>
          <p className="text-gray-300">Upload an STL file to visualize and explore your 3D model in real-time</p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? "scale-105" : ""}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur transition-all duration-300 ${
              isDragging ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`relative bg-black/40 backdrop-blur border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 ${
              isDragging ? "border-blue-400 bg-blue-500/10" : "border-white/20 hover:border-white/40"
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={`p-4 rounded-full transition-all duration-300 ${
                  isDragging ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/60 group-hover:text-white/80"
                }`}
              >
                <Upload size={32} />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {isDragging ? "Drop your file here" : "Drag your STL file here"}
                </h3>
                <p className="text-sm text-gray-400">or click to browse</p>
              </div>

              <div className="pt-4 border-t border-white/10 w-full">
                <p className="text-xs text-gray-500 text-center">Supported format: .STL (ASCII or binary)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".stl"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0]
            if (file) handleFile(file)
          }}
          className="hidden"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <p className="text-gray-400">Loading file...</p>
          </div>
        )}
      </div>
    </div>
  )
}
