"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import STLViewer from "@/components/stl-viewer";
import UploadSection from "@/components/upload-section";
import ControlsPanel from "@/components/controls-panel";
import STLChatbot from "@/components/stl-chatbot";

export default function STLVisionTab() {
  const [stlFileData, setStlFileData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [resetView, setResetView] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [meshColor, setMeshColor] = useState("3b82f6");
  const [autoRotate, setAutoRotate] = useState(false);
  const [stlFileInfo, setStlFileInfo] = useState<any>(null);

  // ✅ Calculate STL dimensions
  const calculateSTLDimensions = (buffer: ArrayBuffer) => {
    try {
      const view = new DataView(buffer);
      let minX = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY;
      let minZ = Number.POSITIVE_INFINITY,
        maxZ = Number.NEGATIVE_INFINITY;

      const isBinary = buffer.byteLength >= 84;
      const vertices: number[] = [];

      if (isBinary) {
        const triangles = view.getUint32(80, true);
        let offset = 84;

        for (let i = 0; i < triangles; i++) {
          offset += 12;
          for (let j = 0; j < 3; j++) {
            const x = view.getFloat32(offset, true);
            const y = view.getFloat32(offset + 4, true);
            const z = view.getFloat32(offset + 8, true);
            vertices.push(x, y, z);
            offset += 12;
          }
          offset += 2;
        }
      }

      for (let i = 0; i < vertices.length; i += 3) {
        minX = Math.min(minX, vertices[i]);
        maxX = Math.max(maxX, vertices[i]);
        minY = Math.min(minY, vertices[i + 1]);
        maxY = Math.max(maxY, vertices[i + 1]);
        minZ = Math.min(minZ, vertices[i + 2]);
        maxZ = Math.max(maxZ, vertices[i + 2]);
      }

      return {
        width: Math.abs(maxX - minX),
        height: Math.abs(maxY - minY),
        depth: Math.abs(maxZ - minZ),
      };
    } catch (err) {
      console.error("❌ Erreur lors du calcul des dimensions:", err);
      return { width: 0, height: 0, depth: 0 };
    }
  };

  // ✅ Handle file upload from both UploadSection and STLChatbot
  const handleFileUpload = (file: File, buffer: ArrayBuffer) => {
    console.log("📥 Fichier téléchargé:", file.name);
    setFileName(file.name);
    setStlFileData(buffer);
    setResetView(true);

    const fileSize = buffer.byteLength;
    const dimensions = calculateSTLDimensions(buffer);

    const fileInfo = {
      name: file.name,
      size: fileSize,
      isValid: true,
      dimensions: dimensions,
      triangles: Math.floor((fileSize - 84) / 50),
    };

    console.log("✅ ensemble d'informations sur le fichier:", fileInfo);
    setStlFileInfo(fileInfo);
  };

  // ✅ Listen for file upload from chatbot
  useEffect(() => {
    const handleFileSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      const file = customEvent.detail.file as File;
      
      console.log("📁 Fichier de chatbot sélectionné:", file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        if (buffer) {
          handleFileUpload(file, buffer);
        }
      };
      reader.onerror = () => {
        console.error("❌ Erreur de lecture du fichier");
      };
      reader.readAsArrayBuffer(file);
    };

    document.addEventListener("stl-file-selected", handleFileSelected);
    console.log("✅ Écouteur d'événements enregistré pour le fichier STL sélectionné");

    return () => {
      document.removeEventListener("fichier stl sélectionné", handleFileSelected);
    };
  }, []);

  const handleReset = () => {
    setResetView(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 3D Viewer Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* 3D Canvas */}
        <div
          className="bg-black/40 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          style={{ height: "500px" }}
        >
          {!stlFileData ? (
            <div className="flex items-center justify-center h-full">
              <UploadSection onFileUpload={handleFileUpload} />
            </div>
          ) : (
            <Canvas>
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.3} />

              <Bounds fit clip observe margin={1.2}>
                <STLViewer
                  arrayBuffer={stlFileData}
                  resetView={resetView}
                  onResetComplete={() => setResetView(false)}
                  wireframe={wireframe}
                  color={meshColor}
                />
              </Bounds>

              <OrbitControls
                makeDefault
                autoRotate={autoRotate}
                autoRotateSpeed={4}
                enableDamping
                dampingFactor={0.05}
              />
            </Canvas>
          )}
        </div>

        {/* Control Buttons */}
        {stlFileData && (
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
                value={"#" + meshColor}
                onChange={(e) => setMeshColor(e.target.value.slice(1))}
                className="w-8 h-8 cursor-pointer"
              />
              <span className="text-xs text-gray-400">Couleur</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Controls + Chatbot */}
      <div className="lg:col-span-2 space-y-4 flex flex-col h-[500px]">
        {/* Controls Panel */}
        {stlFileData && (
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
              setStlFileData(null);
              setFileName("");
              setStlFileInfo(null);
            }}
          />
        )}

        {/* STL Chatbot */}
        <STLChatbot stlFileInfo={stlFileInfo} fileName={fileName} />
      </div>
    </div>
  );
}