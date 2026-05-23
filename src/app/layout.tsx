import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "MIZHAR — Strategic Intelligence for Founders",
  description: "Validate, challenge, simulate and structure venture-scale business strategies with AI-powered venture intelligence.",
  keywords: ["startup", "venture capital", "AI", "business plan", "strategic intelligence"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        {/* Satoshi from Fontshare — can't use next/font for external CDN */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
