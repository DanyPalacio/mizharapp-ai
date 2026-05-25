'use client'
import { useState, useEffect } from 'react'

type User = { id: string; email: string; name: string; plan: string; usage_limit: number; plan_expires_at: string; created_at: string }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<User | null>(null)
  const [plan, setPlan] = useState(''); const [limit, setLimit] = useState(''); const [expires, setExpires] = useState('')
  const [msg, setMsg] = useState('')

  const token = () => typeof window !== 'undefined' ? localStorage.getItem('mz_admin_token') || '' : ''

  useEffect(() => {
    fetch('/api/admin/users-manage', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false) })
  }, [])

  async function saveUser() {
    const res = await fetch('/api/admin/users-manage', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() },
      body: JSON.stringify({ userId: editing!.id, plan, usageLimit: parseInt(limit), expiresAt: expires || null })
    })
    const d = await res.json()
    if (d.ok) { setMsg('✅ Usuario actualizado'); setEditing(null); setUsers(u => u.map(x => x.id === editing!.id ? { ...x, plan, usage_limit: parseInt(limit) } : x)) }
    else setMsg('❌ ' + d.error)
  }

  const planBadge = (p: string) => ({
    pro: { bg: 'var(--mz-orange-50)', color: 'var(--mz-orange)' },
    free: { bg: 'var(--mz-cloud)', color: 'var(--mz-ink-3)' },
    trial: { bg: 'var(--mz-info-50)', color: 'var(--mz-info)' },
  }[p] || { bg: 'var(--mz-cloud)', color: 'var(--mz-ink-3)' })

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>Gestión de Usuarios</h1>
      <p style={{ color: 'var(--mz-ink-2)', fontSize: 14, marginBottom: 24 }}>Asigna planes Pro, Free Trial limitado o acceso de prueba por número de usos.</p>

      {msg && <div style={{ padding: '10px 16px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--mz-success-50)' : 'var(--mz-danger-50)', color: msg.startsWith('✅') ? 'var(--mz-success)' : 'var(--mz-danger)', marginBottom: 16, fontSize: 13 }}>{msg}</div>}

      {loading ? <div>Cargando usuarios...</div> : (
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--mz-cloud)', borderBottom: '1px solid var(--mz-border-2)' }}>
                {['Email', 'Nombre', 'Plan', 'Límite usos', 'Registrado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mz-ink-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--mz-ink-3)' }}>
                  Sin usuarios aún. Conecta Supabase y configura las env vars.
                </td></tr>
              ) : users.map((u, i) => {
                const badge = planBadge(u.plan)
                return (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--mz-border-3)' : 'none' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--mz-ink)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--mz-ink-2)' }}>{u.name || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: badge.bg, color: badge.color }}>{u.plan || 'free'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--mz-ink-2)' }}>{u.usage_limit ?? '∞'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--mz-ink-3)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => { setEditing(u); setPlan(u.plan || 'free'); setLimit(String(u.usage_limit || '')); setExpires(u.plan_expires_at || '') }}
                        style={{ padding: '5px 12px', background: 'var(--mz-graphite)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Editar Plan
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Editar Plan</h2>
            <p style={{ fontSize: 13, color: 'var(--mz-ink-2)', marginBottom: 24 }}>{editing.email}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Plan</label>
                <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                  <option value="free">Free (básico)</option>
                  <option value="trial">Trial Limitado (X usos)</option>
                  <option value="pro">Pro (completo)</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              {plan === 'trial' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Límite de Usos</label>
                  <input type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="Ej: 5"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
                  <p style={{ fontSize: 11, color: 'var(--mz-ink-3)', marginTop: 4 }}>Número de análisis permitidos gratis para free adoption</p>
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Fecha de Expiración (opcional)</label>
                <input type="date" value={expires} onChange={e => setExpires(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={saveUser} style={{ flex: 1, padding: '10px', background: 'var(--mz-orange)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Guardar</button>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '10px', background: 'var(--mz-cloud)', color: 'var(--mz-ink)', border: '1px solid var(--mz-border)', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
