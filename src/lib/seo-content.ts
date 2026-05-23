import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'MIZHAR — Inteligencia Empresarial con IA para Startups y Emprendedores | Business Intelligence',
  description: 'Plataforma de inteligencia estratégica con IA que ayuda a fundadores de startups y emprendedores a validar, analizar y estructurar estrategias de negocio. Incluye generador de business plan, modelo financiero, análisis de mercado, SWOT, competencia y pitch deck. Perfecto para emprendimiento en Latinoamérica.',
  keywords: [
    // Core Spanish Keywords
    'business intelligence',
    'inteligencia empresarial',
    'inteligencia de negocios',
    'business intelligence para startups',
    
    // Emprendimiento
    'emprendimiento',
    'emprendedores',
    'emprendimiento digital',
    'ideas de emprendimiento',
    'como emprender un negocio',
    'emprendimiento en latinoamerica',
    'emprendimiento colombia',
    'emprendimiento mexico',
    
    // Startup
    'startup',
    'startups latinoamerica',
    'crear startup',
    'como crear una startup',
    'validar startup',
    'herramientas para startups',
    'plataforma startups',
    'startup tools',
    
    // Business Plan
    'business plan',
    'plan de negocios',
    'como hacer un business plan',
    'generador de business plan',
    'business plan generator',
    'plan de negocios con ia',
    'plantilla business plan',
    'modelo de negocio',
    
    // Financial
    'modelo financiero',
    'proyecciones financieras',
    'financial model',
    'financial projections',
    'valoración de empresas',
    'valoración de startups',
    'valuation calculator',
    'como hacer proyecciones financieras',
    
    // Market Analysis
    'análisis de mercado',
    'investigación de mercado',
    'market research',
    'estudio de mercado',
    'análisis competitivo',
    'competitive analysis',
    'análisis de competencia',
    
    // SWOT & Strategy
    'análisis swot',
    'swot analysis',
    'matriz swot',
    'análisis foda',
    'estrategia empresarial',
    'business strategy',
    'estrategia de negocio',
    
    // Funding & Investment
    'pitch deck',
    'presentación inversionistas',
    'levantamiento de capital',
    'fundraising',
    'como conseguir inversión',
    'inversión startup',
    'capital semilla',
    'venture capital',
    
    // AI & Technology
    'ia para negocios',
    'ai for business',
    'artificial intelligence business',
    'claude ai',
    'chatgpt negocios',
    'ia emprendedores',
    'ai entrepreneurs',
    
    // Problem-Solving
    'validar idea de negocio',
    'validate business idea',
    'como validar una startup',
    'probabilidad de éxito startup',
    'riesgos de una startup',
    
    // Long-tail
    'mejor software para startups',
    'plataforma de análisis empresarial',
    'herramientas de business intelligence',
    'software de inteligencia de negocios',
    'ai business planning tool',
  ],
  url: '/',
})

// SEO-optimized content snippets for use in the page
export const seoContent = {
  h1: 'Inteligencia Empresarial con IA para Startups y Emprendedores',
  h1Alt: 'Business Intelligence Platform for Startup Founders',
  
  heroDescription: 'Valida, analiza y estructura tu startup con inteligencia artificial. MIZHAR te ayuda a crear business plans, modelos financieros, análisis de mercado y pitch decks profesionales en minutos.',
  
  features: [
    {
      title: 'Generador de Business Plan con IA',
      description: 'Crea planes de negocio profesionales en minutos con nuestra IA especializada en emprendimiento.',
      keywords: ['business plan generator', 'plan de negocios', 'ai business planning'],
    },
    {
      title: 'Modelo Financiero y Proyecciones',
      description: 'Genera proyecciones financieras detalladas, análisis de punto de equilibrio y valoración de tu startup.',
      keywords: ['financial modeling', 'proyecciones financieras', 'valuation'],
    },
    {
      title: 'Investigación y Análisis de Mercado',
      description: 'Analiza tu mercado objetivo, identifica oportunidades y comprende a tu competencia con datos en tiempo real.',
      keywords: ['market research', 'análisis de mercado', 'competitive intelligence'],
    },
    {
      title: 'Análisis SWOT y Estrategia',
      description: 'Identifica fortalezas, debilidades, oportunidades y amenazas de tu negocio con análisis estratégico avanzado.',
      keywords: ['swot analysis', 'análisis foda', 'business strategy'],
    },
    {
      title: 'Generador de Pitch Deck',
      description: 'Crea presentaciones profesionales para inversionistas con nuestra herramienta de pitch deck impulsada por IA.',
      keywords: ['pitch deck generator', 'investor presentation', 'fundraising'],
    },
  ],
  
  benefits: [
    'Valida tu idea de negocio antes de invertir tiempo y dinero',
    'Ahorra cientos de horas en investigación y análisis',
    'Toma decisiones basadas en datos e inteligencia artificial',
    'Aumenta tus probabilidades de éxito y financiamiento',
    'Accede a herramientas de nivel enterprise a precio startup',
  ],
  
  cta: {
    primary: 'Comienza Gratis',
    secondary: 'Ver Demo',
    tertiary: 'Habla con Ventas',
  },
  
  faq: [
    {
      question: '¿Qué es MIZHAR y cómo ayuda a los emprendedores?',
      answer: 'MIZHAR es una plataforma de business intelligence impulsada por IA que ayuda a fundadores de startups a validar ideas, crear business plans, generar modelos financieros y análisis de mercado de forma rápida y profesional.',
    },
    {
      question: '¿Necesito conocimientos técnicos para usar MIZHAR?',
      answer: 'No. MIZHAR está diseñado para emprendedores sin conocimientos técnicos. La IA te guía paso a paso en la creación de tu plan de negocio y análisis estratégico.',
    },
    {
      question: '¿Cuánto cuesta MIZHAR?',
      answer: 'Ofrecemos un plan gratuito con funciones básicas y planes profesionales desde $49/mes con acceso completo a todas las herramientas de business intelligence.',
    },
  ],
}
