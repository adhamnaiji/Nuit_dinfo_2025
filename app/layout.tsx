import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STL Vision - Visualiseur 3D",
  description:
    "Explorez et visualisez vos modèles 3D en temps réel. Téléversez un fichier STL et manipulez-le avec rotation, zoom et plus encore.",
  generator: "",
  icons: {
    icon: [
      {
        url: "app/favicon.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "app/favicon.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "app/favicon.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "app/favicon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
