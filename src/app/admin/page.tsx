'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

function StatCard({ label, value, sub, color = 'var(--mz-ink)' }: any) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mz-ink-3)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--mz-ink-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

const SHORTCUTS = [
  { label: 'Gestionar Usuarios', href: '/admin/users', icon: '👥', desc: 'Dar Pro, Free Trial, limits' },
  { label: 'Crear Blog con IA', href: '/admin/blog', icon: '✍️', desc: 'Artículos + link building' },
  { label: 'Configurar SEO', href: '/admin/seo', icon: '🔍', desc: 'Titles, descriptions, KWs' },
  { label: 'Banco de Conocimiento', href: '/admin/knowledge', icon: '📚', desc: 'Subir documentos al RAG' },
  { label: 'Pricing & Cupones', href: '/admin/pricing', icon: '💳', desc: 'Precios, descuentos, cupones' },
  { label: 'Branding', href: '/admin/branding', icon: '🎨', desc: 'Logo, favicon, colores, fuentes' },
]

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => { setToken(localStorage.getItem('mz_admin_token')) }, [])

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, marginBottom: 4 }}>Dashboard Admin</h1>
        <p style={{ color: 'var(--mz-ink-2)', fontSize: 14 }}>Control total de MIZHAR AI. Superadmin: danipalacio@gmail.com</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Usuarios Totales" value="—" sub="Conectar Supabase" />
        <StatCard label="Plan Pro" value="—" sub="activos" color="var(--mz-orange)" />
        <StatCard label="Artículos Blog" value="—" sub="publicados" />
        <StatCard label="Doc. Conocimiento" value="—" sub="en el RAG" color="var(--mz-success)" />
      </div>

      {/* Shortcuts */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Accesos Rápidos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
        {SHORTCUTS.map(s => (
          <Link key={s.href} href={s.href} style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'box-shadow 150ms' }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--mz-ink)' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--mz-ink-3)', marginTop: 4 }}>{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Env check */}
      <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Estado del Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {[
            { label: 'Anthropic API', key: 'ANTHROPIC_API_KEY' },
            { label: 'OpenAI API', key: 'OPENAI_API_KEY' },
            { label: 'Supabase URL', key: 'NEXT_PUBLIC_SUPABASE_URL' },
            { label: 'Supabase Key', key: 'SUPABASE_SERVICE_ROLE_KEY' },
            { label: 'FRED API', key: 'FRED_API_KEY' },
            { label: 'News API', key: 'NEWS_API_KEY' },
          ].map(env => (
            <div key={env.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--mz-cloud)', borderRadius: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--mz-ink-2)' }}>{env.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--mz-warning-50)', color: 'var(--mz-warning)' }}>VER ENV VARS</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--mz-ink-3)', marginTop: 16 }}>
          Configura las variables de entorno en Vercel → Project Settings → Environment Variables
        </p>
      </div>
    </div>
  )
}
