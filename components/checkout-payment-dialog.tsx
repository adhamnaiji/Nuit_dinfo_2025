"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Loader2, CheckCircle } from "lucide-react"

interface STLDimensions {
  width: number
  height: number
  depth: number
}

interface CheckoutPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  dimensions: STLDimensions
}

export default function CheckoutPaymentDialog({
  open,
  onOpenChange,
  fileName,
  dimensions,
}: CheckoutPaymentDialogProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVC, setCardCVC] = useState("")

  const handleCardNumberChange = (e: string) => {
    const value = e.replace(/\s/g, "").slice(0, 16)
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim()
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: string) => {
    const value = e.replace(/\D/g, "").slice(0, 4)
    if (value.length >= 2) {
      const formatted = value.slice(0, 2) + "/" + value.slice(2)
      setCardExpiry(formatted)
    } else {
      setCardExpiry(value)
    }
  }

  const handleStartPayment = async () => {
    if (!email || !cardNumber || !cardExpiry || !cardCVC) {
      alert("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true)
      setLoading(false)
    }, 2000)
  }

  const handleClose = () => {
    setPaymentSuccess(false)
    setEmail("")
    setCardNumber("")
    setCardExpiry("")
    setCardCVC("")
    onOpenChange(false)
  }

  if (paymentSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-black/40 backdrop-blur border border-white/10">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400" />
            <DialogTitle className="text-2xl text-white">Paiement Confirmé!</DialogTitle>
            <p className="text-gray-400 text-center">
              Votre fabrication 3D a été lancée avec succès. Vous recevrez des mises à jour par email.
            </p>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 w-full">
              <p className="text-sm text-gray-300">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Fichier:</strong> {fileName}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Montant:</strong> <span className="text-green-300 font-bold">€49.00</span>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
              Retour à l'accueil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black/40 backdrop-blur border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Commencer la Fabrication
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Paiement sécurisé - Fabrication 3D avec UTOPIE 3D
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-sm text-gray-300 mb-3">
              <strong>Fichier:</strong> {fileName}
            </p>
            <p className="text-sm text-gray-300 mb-3">
              <strong>Dimensions:</strong> {dimensions.width.toFixed(2)}mm × {dimensions.height.toFixed(2)}mm ×{" "}
              {dimensions.depth.toFixed(2)}mm
            </p>
            <p className="text-sm text-gray-300">
              <strong>Prix:</strong> <span className="text-xl text-white font-bold">€49.00</span>
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email pour la commande *</label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
            />
          </div>

          {/* Mock Card Details */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Numéro de Carte *</label>
            <Input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              maxLength={19}
              className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-mono"
            />
            <p className="text-xs text-gray-500">Démo: 4242 4242 4242 4242</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Expiration *</label>
              <Input
                type="text"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                maxLength={5}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">CVC *</label>
              <Input
                type="text"
                placeholder="123"
                value={cardCVC}
                onChange={(e) => setCardCVC(e.target.value.slice(0, 3))}
                maxLength={3}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-300">
              ⓘ Mode démonstration - Aucun paiement réel n'est effectué. Utilisez n'importe quels numéros de carte.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <p className="text-xs text-green-300">✓ Après paiement, votre projet sera lancé immédiatement</p>
            <p className="text-xs text-green-300 mt-1">✓ Vous recevrez des mises à jour par email</p>
          </div>

          <Button
            onClick={handleStartPayment}
            disabled={!email || !cardNumber || !cardExpiry || !cardCVC || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              "Procéder au paiement"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
