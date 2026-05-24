/**
 * SEO Head Component
 * Handles metadata, structured data, and Open Graph tags
 */

import React from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product';
  locale?: 'en' | 'es';
  author?: string;
  publishDate?: string;
  updateDate?: string;
  structuredData?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  keywords,
  imageUrl = 'https://mizhar.com/og-image.jpg',
  imageAlt = 'MIZHAR - AI Business Intelligence Platform',
  type = 'website',
  locale = 'en',
  author = 'MIZHAR',
  publishDate,
  updateDate,
  structuredData,
}) => {
  // This component would be rendered in Next.js Head component
  // Example of what would be output:

  const metaTags = [
    // Essential Meta Tags
    { name: 'description', content: description },
    { name: 'keywords', content: keywords?.join(', ') || '' },
    { name: 'author', content: author },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#000000' },

    // Open Graph Tags
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical || 'https://mizhar.com' },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: imageAlt },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: locale === 'es' ? 'es_ES' : 'en_US' },
    { property: 'og:site_name', content: 'MIZHAR' },

    // Twitter Card Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:creator', content: '@mizharplatform' },
    { name: 'twitter:site', content: '@mizharplatform' },

    // Article Tags (if applicable)
    ...(publishDate ? [{ property: 'article:published_time', content: publishDate }] : []),
    ...(updateDate ? [{ property: 'article:modified_time', content: updateDate }] : []),

    // Language and Locale
    { property: 'og:locale:alternate', content: locale === 'es' ? 'en_US' : 'es_ES' },
  ];

  return (
    <>
      <title>{title}</title>
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Meta Tags */}
      {metaTags.map((tag, index) => {
        if ('property' in tag) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        }
        return <meta key={index} name={tag.name} content={tag.content} />;
      })}

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Additional Link Tags */}
      <link rel="alternate" hrefLang="en" href={canonical || 'https://mizhar.com'} />
      <link rel="alternate" hrefLang="es" href={`${canonical || 'https://mizhar.com'}/es`} />

      {/* Preconnect to CDNs */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </>
  );
};

export default SEOHead;
