'use client'
import { useState, useEffect } from 'react'

export default function AdminPricing() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [code, setCode] = useState(''); const [disc, setDisc] = useState('20'); const [maxUses, setMaxUses] = useState('100'); const [exp, setExp] = useState('')
  const [msg, setMsg] = useState('')
  const token = () => localStorage.getItem('mz_admin_token') || ''

  useEffect(() => {
    fetch('/api/admin/pricing-config', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(d => setCoupons(d.coupons || []))
  }, [])

  async function createCoupon() {
    if (!code) { setMsg('❌ Ingresa un código'); return }
    const res = await fetch('/api/admin/pricing-config', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() }, body: JSON.stringify({ type: 'coupon', code: code.toUpperCase(), discountPct: parseInt(disc), maxUses: parseInt(maxUses), expiresAt: exp || null }) })
    const d = await res.json()
    if (d.ok) { setMsg('✅ Cupón creado'); setCode(''); setCoupons(p => [{ id: Date.now(), code: code.toUpperCase(), discount_pct: parseInt(disc), max_uses: parseInt(maxUses), created_at: new Date().toISOString() }, ...p]) }
    else setMsg('❌ ' + d.error)
    setTimeout(() => setMsg(''), 3000)
  }

  async function deleteCoupon(id: string) {
    await fetch('/api/admin/pricing-config', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() }, body: JSON.stringify({ id }) })
    setCoupons(c => c.filter(x => x.id !== id))
  }

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>Pricing & Cupones</h1>
      <p style={{ color: 'var(--mz-ink-2)', fontSize: 14, marginBottom: 28 }}>Gestiona descuentos y crea cupones para free adoption y campañas.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Planes actuales */}
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Planes Activos</h2>
          {[
            { name: 'Free', price: '$0', features: '5 análisis/mes, herramientas básicas', color: 'var(--mz-ink-3)' },
            { name: 'Pro', price: '$49/mo', features: 'Ilimitado + Challenge + Valuation + Deck', color: 'var(--mz-orange)' },
            { name: 'Enterprise', price: 'Custom', features: 'Multi-seat, SLA, soporte prioritario', color: 'var(--mz-info)' },
          ].map(p => (
            <div key={p.name} style={{ padding: '14px 0', borderBottom: '1px solid var(--mz-border-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--mz-ink-3)', marginTop: 2 }}>{p.features}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: p.color }}>{p.price}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px', background: 'var(--mz-info-50)', borderRadius: 8, fontSize: 12, color: 'var(--mz-info)' }}>
            💡 Para cambiar precios, edita el archivo <code>src/app/(marketing)/pricing/page.tsx</code> y las integraciones PayPal/Stripe.
          </div>
        </div>

        {/* Crear cupón */}
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Crear Cupón de Descuento</h2>
          {msg && <div style={{ padding: '8px 12px', borderRadius: 6, background: msg.startsWith('✅') ? 'var(--mz-success-50)' : 'var(--mz-danger-50)', color: msg.startsWith('✅') ? 'var(--mz-success)' : 'var(--mz-danger)', fontSize: 12, marginBottom: 14 }}>{msg}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Código del Cupón</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="LAUNCH50" maxLength={20}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Descuento %</label>
                <input type="number" value={disc} onChange={e => setDisc(e.target.value)} min="1" max="100"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Máx. usos</label>
                <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Fecha Expiración (opcional)</label>
              <input type="date" value={exp} onChange={e => setExp(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
            </div>
            <button onClick={createCoupon} style={{ padding: 11, background: 'var(--mz-orange)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              ✨ Crear Cupón
            </button>
          </div>
        </div>
      </div>

      {/* Coupons list */}
      <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, overflow: 'hidden', marginTop: 24 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--mz-border-2)', background: 'var(--mz-cloud)', fontWeight: 600, fontSize: 13 }}>Cupones Activos ({coupons.length})</div>
        {coupons.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--mz-ink-3)' }}>Sin cupones creados.</div>
          : coupons.map((c, i) => (
            <div key={c.id} style={{ padding: '12px 20px', borderBottom: i < coupons.length - 1 ? '1px solid var(--mz-border-3)' : 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--mz-orange)', background: 'var(--mz-orange-50)', padding: '3px 10px', borderRadius: 5 }}>{c.code}</code>
              <span style={{ fontSize: 13, color: 'var(--mz-ink-2)' }}>{c.discount_pct}% descuento</span>
              <span style={{ fontSize: 12, color: 'var(--mz-ink-3)' }}>Máx. {c.max_uses} usos</span>
              {c.expires_at && <span style={{ fontSize: 12, color: 'var(--mz-ink-3)' }}>Vence: {new Date(c.expires_at).toLocaleDateString()}</span>}
              <div style={{ flex: 1 }} />
              <button onClick={() => deleteCoupon(c.id)} style={{ padding: '4px 10px', background: 'var(--mz-danger-50)', color: 'var(--mz-danger)', border: 'none', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Eliminar</button>
            </div>
          ))}
      </div>
    </div>
  )
}
