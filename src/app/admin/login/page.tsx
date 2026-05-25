'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (data.ok) { localStorage.setItem('mz_admin_token', data.token); localStorage.setItem('mz_admin_name', data.name); router.push('/admin') }
    else { setError(data.error || 'Error'); setLoading(false) }
  }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--mz-graphite)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: 'var(--sh-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: 'var(--mz-orange)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18 }}>MIZHAR</div><div style={{ fontSize: 11, color: 'var(--mz-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</div></div>
        </div>
        <h1 style={{ fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>Bienvenido</h1>
        <p style={{ fontSize: 14, color: 'var(--mz-ink-2)', marginBottom: 28 }}>Acceso exclusivo para superadmin.</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)' }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)' }} />
          {error && <div style={{ background: 'var(--mz-danger-50)', color: 'var(--mz-danger)', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ padding: 12, background: 'var(--mz-orange)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4, fontFamily: 'var(--font-body)' }}>
            {loading ? 'Verificando...' : 'Ingresar al Admin →'}
          </button>
        </form>
      </div>
    </div>
  )
}
