'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const MENU = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Usuarios', href: '/admin/users', icon: '👥' },
  { label: 'Blog + IA', href: '/admin/blog', icon: '✍️' },
  { label: 'SEO & Keywords', href: '/admin/seo', icon: '🔍' },
  { label: 'Conocimiento', href: '/admin/knowledge', icon: '📚' },
  { label: 'Pricing & Cupones', href: '/admin/pricing', icon: '💳' },
  { label: 'Branding', href: '/admin/branding', icon: '🎨' },
  { label: 'Configuración', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    if (pathname === '/admin/login') { setReady(true); return }
    const token = localStorage.getItem('mz_admin_token')
    const name = localStorage.getItem('mz_admin_name') || 'Admin'
    if (!token) { router.push('/admin/login'); return }
    setAdminName(name)
    setReady(true)
  }, [pathname, router])

  if (!ready) return <div style={{ minHeight: '100vh', background: 'var(--mz-graphite)', display: 'grid', placeItems: 'center' }}><div style={{ color: 'white', fontSize: 14 }}>Cargando...</div></div>
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: 'var(--mz-cloud)' }}>
      {/* Admin Sidebar */}
      <aside style={{ background: '#0F1419', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
          <div style={{ width: 30, height: 30, background: 'var(--mz-orange)', borderRadius: 6, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'white', letterSpacing: '0.04em' }}>MIZHAR</div>
            <div style={{ fontSize: 9, color: '#FF6A00', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700 }}>SUPER ADMIN</div>
          </div>
        </div>

        {/* Nav */}
        {MENU.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'white' : 'rgba(255,255,255,0.5)', background: active ? 'rgba(255,106,0,0.15)' : 'transparent', textDecoration: 'none', transition: 'all 120ms' }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* View site */}
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 4 }}>
          🌐 Ver sitio →
        </Link>

        {/* User */}
        <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => { localStorage.removeItem('mz_admin_token'); router.push('/admin/login') }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--mz-orange)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>D</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminName}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Cerrar sesión</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
