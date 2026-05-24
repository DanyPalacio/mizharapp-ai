import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noindex?: boolean
}

export function generateSEOMetadata({
  title = 'MIZHAR — AI-Powered Business Intelligence for Startups & Founders',
  description = 'Strategic intelligence platform that helps startup founders validate, challenge, and structure venture-scale business strategies with AI-powered insights, financial modeling, and market intelligence.',
  keywords = [
    // Primary Keywords - Emprendimiento
    'emprendimiento',
    'emprendedores',
    'startup business',
    'iniciar startup',
    'crear empresa',
    'business plan startup',
    
    // Primary Keywords - Business Intelligence
    'business intelligence',
    'business intelligence ai',
    'inteligencia de negocios',
    'análisis empresarial',
    'strategic intelligence',
    'venture intelligence',
    
    // Primary Keywords - Startup
    'startup tools',
    'startup platform',
    'herramientas para startups',
    'plataforma startups',
    'startup validation',
    'validar idea negocio',
    
    // Long-tail Keywords - Planning
    'business plan generator',
    'generador plan de negocios',
    'como hacer un business plan',
    'plan de negocios con ia',
    'ai business planning',
    
    // Long-tail Keywords - Financial
    'financial modeling startup',
    'modelo financiero startup',
    'proyecciones financieras',
    'financial projections ai',
    'startup valuation calculator',
    'valoración de startups',
    
    // Long-tail Keywords - Market
    'market research ai',
    'investigación de mercado',
    'análisis de mercado startup',
    'competitive analysis tool',
    'análisis competitivo',
    'market intelligence platform',
    
    // Long-tail Keywords - Funding
    'startup fundraising',
    'levantamiento de capital',
    'pitch deck generator',
    'investor presentation',
    'como conseguir inversión',
    
    // Long-tail Keywords - AI
    'ai for entrepreneurs',
    'ia para emprendedores',
    'artificial intelligence business',
    'claude ai business',
    'ai business advisor',
    
    // Intent Keywords
    'validate startup idea',
    'validar idea de negocio',
    'startup success probability',
    'probabilidad éxito startup',
    'business strategy ai',
    'estrategia empresarial ia',
    
    // Problem-solving Keywords
    'como validar startup',
    'crear modelo financiero',
    'análisis swot startup',
    'competidores startup',
    'pricing strategy',
    
    // Location Keywords
    'startup latinoamerica',
    'emprendimiento colombia',
    'startup mexico',
    'business intelligence latam',
  ],
  image = '/og-image.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'MIZHAR AI',
  noindex = false,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mizhar-ai.com'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'MIZHAR — Strategic Intelligence for Founders',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'es_ES',
      alternateLocale: ['en_US', 'es_MX', 'es_CO'],
      type,
      publishedTime,
      modifiedTime,
    } as any,

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
      creator: '@MizharAI',
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: 'google-site-verification-code',
    },

    // Alternates
    alternates: {
      canonical: fullUrl,
      languages: {
        'es': fullUrl,
        'en': `${fullUrl}?lang=en`,
      },
    },

    // Other
    category: 'Business Intelligence',
    classification: 'Business Software',
  }
}

// Google Analytics Component
export function GoogleAnalytics() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-9CH2G095SN"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9CH2G095SN');
          `,
        }}
      />
    </>
  )
}

// Schema.org JSON-LD
export function generateSchemaOrg(type: 'Organization' | 'SoftwareApplication' | 'Article' | 'Product', data?: any) {
  const schemas: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MIZHAR',
      alternateName: 'MIZHAR AI',
      url: process.env.NEXT_PUBLIC_APP_URL,
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      description: 'AI-powered strategic intelligence platform for startup founders and entrepreneurs',
      foundingDate: '2026',
      founders: [
        {
          '@type': 'Person',
          name: 'MIZHAR Team',
        },
      ],
      sameAs: [
        'https://twitter.com/MizharAI',
        'https://linkedin.com/company/mizhar-ai',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@mizhar-ai.com',
        availableLanguage: ['Spanish', 'English'],
      },
    },
    SoftwareApplication: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'MIZHAR AI Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        category: 'Free with Premium Options',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '127',
      },
      description: 'Strategic intelligence platform for startups with AI-powered business planning, financial modeling, and market analysis',
      features: [
        'AI Business Plan Generator',
        'Financial Modeling & Projections',
        'Market Intelligence & Research',
        'SWOT Analysis',
        'Competitor Analysis',
        'Pitch Deck Generator',
        'Valuation Calculator',
      ],
    },
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data?.title,
      description: data?.description,
      image: data?.image,
      datePublished: data?.publishedTime,
      dateModified: data?.modifiedTime,
      author: {
        '@type': 'Person',
        name: data?.author || 'MIZHAR Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'MIZHAR',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
        },
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas[type] || schemas.Organization) }}
    />
  )
}
