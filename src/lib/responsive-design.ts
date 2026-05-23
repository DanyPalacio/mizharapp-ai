/**
 * Mobile Optimization & Responsive Design
 * Phase 6: Mobile-First Design System
 */

export const BREAKPOINTS = {
  xs: 0,        // Extra small
  sm: 480,      // Small mobile
  md: 768,      // Tablet
  lg: 1024,     // Desktop
  xl: 1280,     // Large desktop
  '2xl': 1536,  // Extra large
};

export const MEDIA_QUERIES = {
  // Mobile First
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2xl']}px)`,

  // Mobile Only
  maxSm: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  maxMd: `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  maxLg: `@media (max-width: ${BREAKPOINTS.lg - 1}px)`,

  // Touch Devices
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
};

export const RESPONSIVE_FONT_SIZES = {
  h1: {
    mobile: '28px',
    tablet: '36px',
    desktop: '48px',
  },
  h2: {
    mobile: '24px',
    tablet: '30px',
    desktop: '36px',
  },
  h3: {
    mobile: '20px',
    tablet: '24px',
    desktop: '28px',
  },
  body: {
    mobile: '14px',
    tablet: '15px',
    desktop: '16px',
  },
  small: {
    mobile: '12px',
    tablet: '13px',
    desktop: '14px',
  },
};

export const TOUCH_TARGETS = {
  // Minimum touch target size: 44x44px (iOS standard)
  button: '44px',
  link: '44px',
  checkbox: '44px',
  radio: '44px',
  input: '44px',
  select: '44px',
};

export const SPACING_MOBILE = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '28px',
  '3xl': '36px',
  '4xl': '48px',
};

export const MOBILE_OPTIMIZATIONS = {
  // Touch-friendly navigation
  navigationHeight: '56px', // Mobile navigation bar height
  bottomNavigation: '56px', // Space for bottom navigation on mobile

  // Form inputs
  inputPadding: '12px 16px',
  inputHeight: '48px',
  inputBorderRadius: '8px',

  // Buttons
  buttonPadding: '12px 24px',
  buttonMinHeight: '44px',
  buttonBorderRadius: '8px',

  // Card spacing on mobile
  cardMargin: '12px',
  cardPadding: '16px',

  // Viewport optimization
  viewportMeta: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export const PWA_CONFIG = {
  name: 'MIZHAR - AI Business Intelligence',
  shortName: 'MIZHAR',
  description: 'AI-powered business planning and intelligence platform for startups',
  startUrl: '/',
  display: 'standalone',
  orientation: 'portrait-primary',
  theme_color: '#000000',
  background_color: '#ffffff',
  categories: ['business', 'productivity', 'utilities'],
  screenshots: [
    {
      src: '/screenshots/mobile-1.png',
      sizes: '540x720',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: '/screenshots/mobile-2.png',
      sizes: '540x720',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: '/screenshots/desktop-1.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
    },
  ],
  shortcuts: [
    {
      name: 'Business Plan',
      shortName: 'Plan',
      description: 'Create a business plan',
      url: '/tools/business-plan',
      icons: [
        {
          src: '/icons/business-plan.png',
          sizes: '192x192',
        },
      ],
    },
    {
      name: 'Market Analysis',
      shortName: 'Market',
      description: 'Analyze your market',
      url: '/intelligence/market-research',
      icons: [
        {
          src: '/icons/market-analysis.png',
          sizes: '192x192',
        },
      ],
    },
    {
      name: 'Financials',
      shortName: 'Finance',
      description: 'View financial projections',
      url: '/tools/financial-projections',
      icons: [
        {
          src: '/icons/financials.png',
          sizes: '192x192',
        },
      ],
    },
  ],
};

export const MOBILE_MENU_STRUCTURE = {
  primary: [
    {
      label: 'Tools',
      path: '/tools',
      icon: 'tools',
    },
    {
      label: 'Intelligence',
      path: '/intelligence',
      icon: 'brain',
    },
    {
      label: 'Knowledge',
      path: '/knowledge',
      icon: 'book',
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
  ],
  secondary: [
    {
      label: 'Pricing',
      path: '/pricing',
      icon: 'tag',
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: 'help',
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'settings',
    },
  ],
};

export const RESPONSIVE_GRID = {
  container: {
    mobile: '100%',
    tablet: '90%',
    desktop: '80%',
  },
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4,
  },
  gap: {
    mobile: '12px',
    tablet: '16px',
    desktop: '24px',
  },
};

export const PERFORMANCE_HINTS = {
  // Image optimization
  images: {
    sizes: {
      thumbnail: '48px',
      small: '128px',
      medium: '256px',
      large: '512px',
      xlarge: '1024px',
    },
    format: ['webp', 'jpeg'],
    loading: 'lazy',
  },

  // CSS optimizations
  criticalCSS: [
    'layout',
    'typography',
    'colors',
    'mobile-navigation',
    'buttons',
  ],

  // JS optimizations
  codeSpitting: {
    routes: true,
    vendors: true,
    async: true,
  },

  // Network optimization
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
  ],

  dns_prefetch: [
    'https://api.mizhar.com',
    'https://cdn.mizhar.com',
  ],
};

// Hook for responsive values
export const useResponsive = (mobile: any, tablet?: any, desktop?: any) => {
  // This would be used in React components to handle responsive values
  return {
    mobile,
    tablet: tablet || mobile,
    desktop: desktop || tablet || mobile,
  };
};
