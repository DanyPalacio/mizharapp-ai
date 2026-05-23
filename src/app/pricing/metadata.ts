import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Precios MIZHAR — Planes para Startups y Emprendedores | Business Intelligence',
  description: 'Planes y precios de MIZHAR. Desde $0/mes plan gratuito hasta $49/mes plan profesional. Herramientas de business intelligence, financial modeling, market research y más para startups y emprendedores.',
  keywords: [
    'precios mizhar',
    'pricing startup tools',
    'cuánto cuesta mizhar',
    'planes business intelligence',
    'software para startups precios',
    'herramientas emprendedores gratis',
    'business plan generator precio',
  ],
  url: '/pricing',
})
