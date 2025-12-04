"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Mail, Loader2 } from "lucide-react"

interface STLDimensions {
  width: number
  height: number
  depth: number
}

interface QuoteRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  dimensions: STLDimensions
}

export default function QuoteRequestDialog({ open, onOpenChange, fileName, dimensions }: QuoteRequestDialogProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fileName,
          dimensions,
          message,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setEmail("")
          setMessage("")
          setSubmitted(false)
          onOpenChange(false)
        }, 2000)
      }
    } catch (error) {
      console.error("[v0] Failed to send quote request:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/40 backdrop-blur border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-400" />
            Demande de Devis
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Demandez un devis personnalisé pour votre projet de fabrication 3D
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="text-4xl">✓</div>
            <p className="text-white font-semibold">Demande envoyée!</p>
            <p className="text-sm text-gray-400">Nous vous contacterons dans les 24 heures</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Votre email *</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Fichier</label>
              <div className="p-3 rounded-lg bg-black/50 border border-white/10">
                <p className="text-sm text-white font-mono">{fileName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {dimensions.width.toFixed(2)}mm × {dimensions.height.toFixed(2)}mm × {dimensions.depth.toFixed(2)}mm
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Message (optionnel)</label>
              <Textarea
                placeholder="Décrivez votre projet, vos exigences spéciales..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={!email || loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer la demande"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
