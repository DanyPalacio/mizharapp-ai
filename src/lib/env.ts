// Validación de variables de entorno requeridas
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
  'PAYPAL_SECRET',
  'NEXT_PUBLIC_APP_URL',
] as const

export function validateEnv() {
  const missing: string[] = []
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}`
    )
  }

  const optionalMissing: string[] = []
  optionalEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      optionalMissing.push(envVar)
    }
  })

  if (optionalMissing.length > 0) {
    console.warn(
      `ℹ️  Optional environment variables not set:\n${optionalMissing.map(v => `  - ${v}`).join('\n')}`
    )
  }

  return {
    isValid: missing.length === 0,
    missing,
    optionalMissing,
  }
}

// Export para uso en otros archivos
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  paypalSecret: process.env.PAYPAL_SECRET,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const
