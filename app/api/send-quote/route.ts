import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fileName, dimensions, message } = body

    // Validate required fields
    if (!email || !fileName || !dimensions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const resend = new Resend("re_couzzkTw_8udMasz9TSS5ymZ2JZz7U1ZY")

    const emailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #333; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Nouvelle Demande de Devis - UTOPIE 3D</h2>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Email du client:</strong> ${email}</p>
        <p><strong>Fichier STL:</strong> ${fileName}</p>
        <p><strong>Dimensions:</strong></p>
        <ul>
          <li>Largeur: ${dimensions.width.toFixed(2)}mm</li>
          <li>Hauteur: ${dimensions.height.toFixed(2)}mm</li>
          <li>Profondeur: ${dimensions.depth.toFixed(2)}mm</li>
        </ul>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
      </div>

      <p style="color: #666; font-size: 14px;">Veuillez répondre directement à l'adresse email du client.</p>
    </div>
    `

    const { data, error } = await resend.emails.send({
      from: "UTOPIE 3D <onboarding@resend.dev>",
      to: "adhemnaiji@gmail.com",
      subject: `Demande de Devis - ${fileName}`,
      html: emailContent,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ error: "Failed to send email", details: error }, { status: 500 })
    }

    await resend.emails.send({
      from: "UTOPIE 3D <onboarding@resend.dev>",
      to: email,
      subject: "Votre demande de devis a été reçue",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #10b981;">Merci pour votre demande!</h2>
          <p>Nous avons bien reçu votre demande de devis pour le fichier <strong>${fileName}</strong>.</p>
          <p>Notre équipe UTOPIE 3D vous contactera dans les 24 heures.</p>
          <p style="margin-top: 20px; color: #666;">Cordialement,<br/><strong>L'équipe UTOPIE 3D</strong></p>
        </div>
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Demande de devis envoyée avec succès!",
        data,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Quote request error:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi de la demande",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
