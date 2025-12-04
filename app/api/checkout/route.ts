import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// ✅ Lazy load Stripe - only initialize at runtime, not during build
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured")
    }
    stripeInstance = new Stripe(apiKey)
  }
  return stripeInstance
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, dimensions, userEmail } = body

    if (!fileName || !dimensions || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ✅ FIX: Get Stripe instance inside POST function
    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Service de Fabrication 3D - UTOPIE 3D",
              description: `Fichier: ${fileName} | Dimensions: ${dimensions.width.toFixed(0)}x${dimensions.height.toFixed(0)}x${dimensions.depth.toFixed(0)}mm`,
              metadata: {
                fileName,
                dimensions: JSON.stringify(dimensions),
              },
            },
            unit_amount: 4900, // €49.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`,
      customer_email: userEmail,
      metadata: {
        fileName,
        userEmail,
        dimensions: JSON.stringify(dimensions),
      },
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error("[Checkout] Error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    )
  }
}

// Optional: Health check
export async function GET() {
  try {
    getStripe()
    return NextResponse.json({
      status: "ok",
      message: "Checkout API ready",
    })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "STRIPE_SECRET_KEY not configured" },
      { status: 503 }
    )
  }
}
