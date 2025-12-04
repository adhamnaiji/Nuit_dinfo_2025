"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, AlertCircle, FileIcon, Upload, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface STLFileInfo {
  name: string;
  size: number;
  isValid?: boolean;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  triangles?: number;
}

export default function STLChatbot({ 
  stlFileInfo, 
  fileName 
}: { 
  stlFileInfo?: STLFileInfo | null;
  fileName?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stlFileInfo) {
      console.log('✅ STL File Info disponible dans chatbot:');
      console.log('   - Nom:', stlFileInfo.name);
      console.log('   - Taille:', stlFileInfo.size, 'bytes');
      console.log('   - Dimensions:', stlFileInfo.dimensions);
    } else {
      console.log('❌ Pas de stlFileInfo disponible');
    }
  }, [stlFileInfo]);

  const activeFileInfo = stlFileInfo || (fileName ? { name: fileName, size: 0 } : null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      console.log('📁 Fichier sélectionné:', file.name);
      const event = new CustomEvent('stl-file-selected', { detail: { file } });
      document.dispatchEvent(event);
      e.currentTarget.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setError(null);
    const userMessage = input.trim();
    setInput("");

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      console.log('📤 === ENVOI AU CHATBOT ===');
      console.log('   Nombre de messages:', updatedMessages.length);
      console.log('   Dernier message:', userMessage);
      console.log('   Fichier info envoyé:', activeFileInfo);
      
      const requestBody = {
        messages: updatedMessages,
        stlFileInfo: activeFileInfo || null,
      };
      
      console.log('📦 Corps de la requête:', JSON.stringify(requestBody, null, 2));

      const response = await fetch("/api/chat-stl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log('📥 Réponse reçue:', { 
        status: response.status, 
        success: data.success,
        error: data.error 
      });

      if (!response.ok) {
        throw new Error(data.error || "Erreur API");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur de connexion";
      setError(errorMsg);
      console.error("❌ Chat error:", err);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-blue-500/20 flex flex-col h-full shadow-2xl">
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-blue-500/20">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm md:text-base bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                STL Assistant
              </h3>
              {activeFileInfo ? (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <p className="text-xs text-slate-300">
                    {activeFileInfo.name}
                    {activeFileInfo.size > 0 && ` • ${(activeFileInfo.size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                  <p className="text-xs text-slate-400">No file loaded</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-red-400"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {!activeFileInfo && (
              <button
                onClick={triggerFileInput}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap"
                title="Upload STL file"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".stl"
          hidden
          onChange={handleFileInputChange}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0 pr-2">
          {messages.length === 0 && !error && (
            <div className="text-center text-slate-300 text-sm h-full flex flex-col items-center justify-center gap-4">
              {activeFileInfo ? (
                <>
                  <div className="text-4xl">📊</div>
                  <div>
                    <p className="font-semibold text-white mb-2">File Ready: {activeFileInfo.name}</p>
                    <p className="text-xs text-slate-400 mb-4">Ask anything about your 3D model</p>
                    <ul className="text-xs text-slate-400 space-y-1.5 text-left inline-block">
                      <li>💾 What's the file size?</li>
                      <li>📐 What are the dimensions?</li>
                      <li>🔺 How many triangles?</li>
                      <li>⚙️ How to optimize it?</li>
                      <li>🖨️ Ready for 3D printing?</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl">🎯</div>
                  <div>
                    <p className="font-semibold text-white mb-2">STL File Assistant</p>
                    <p className="text-xs text-slate-400">Upload an STL file to get started</p>
                    <button
                      onClick={triggerFileInput}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-sm transition inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Select File
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-white font-bold">AI</span>
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-lg text-sm break-words ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                    : "bg-slate-700/50 text-slate-100 rounded-bl-none border border-slate-600/50 backdrop-blur"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white font-bold">AI</span>
              </div>
              <div className="bg-slate-700/50 text-slate-100 px-4 py-2.5 rounded-lg rounded-bl-none border border-slate-600/50">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-2.5 rounded-lg flex items-center gap-2.5 text-xs max-w-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-slate-700/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={activeFileInfo ? "Ask about your STL file..." : "Upload a file first"}
            disabled={loading || !activeFileInfo}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !activeFileInfo}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}