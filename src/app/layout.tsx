import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { generateSEOMetadata, GoogleAnalytics, generateSchemaOrg } from "@/lib/seo"

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

export const metadata: Metadata = generateSEOMetadata({
  title: 'MIZHAR — AI-Powered Business Intelligence for Startups & Founders',
  description: 'Strategic intelligence platform that helps startup founders validate, challenge, and structure venture-scale business strategies with AI-powered insights, financial modeling, market intelligence, and investor-ready tools. Perfect for entrepreneurs in Latin America.',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* Schema.org Structured Data */}
        {generateSchemaOrg('Organization')}
        {generateSchemaOrg('SoftwareApplication')}
        
        {/* Satoshi from Fontshare */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap"
        />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
