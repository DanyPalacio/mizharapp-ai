'use client'
import { useState, useEffect } from 'react'

const FONTS_DISPLAY = ['Satoshi', 'Space Grotesk', 'Syne', 'Plus Jakarta Sans', 'DM Sans', 'Outfit']
const FONTS_BODY = ['Inter', 'DM Sans', 'Plus Jakarta Sans', 'Nunito Sans', 'Manrope']

export default function AdminBranding() {
  const [config, setConfig] = useState({ primaryColor: '#FF6A00', darkBg: '#1A1F24', fontDisplay: 'Satoshi', fontBody: 'Inter', siteName: 'MIZHAR', tagline: 'Strategic Intelligence for Founders' })
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState('')
  const token = () => localStorage.getItem('mz_admin_token') || ''

  useEffect(() => {
    fetch('/api/admin/branding-config', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(d => { if (d.config) setConfig(d.config) })
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/branding-config', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() }, body: JSON.stringify(config) })
    setSaving(false); setMsg('✅ Guardado. Redeploya para ver cambios.'); setTimeout(() => setMsg(''), 4000)
  }

  const set = (k: string, v: string) => setConfig(c => ({ ...c, [k]: v }))

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>Branding</h1>
      <p style={{ color: 'var(--mz-ink-2)', fontSize: 14, marginBottom: 28 }}>Personaliza colores, fuentes, logo y favicon. Los cambios se guardan en Supabase.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Identidad</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Nombre del Sitio</label>
                <input value={config.siteName} onChange={e => set('siteName', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Tagline</label>
                <input value={config.tagline} onChange={e => set('tagline', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} /></div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Colores</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Color Primario (Naranja)</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={config.primaryColor} onChange={e => set('primaryColor', e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--mz-border)', cursor: 'pointer', padding: 2 }} />
                  <input value={config.primaryColor} onChange={e => set('primaryColor', e.target.value)} style={{ flex: 1, padding: '9px 10px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 13, fontFamily: 'var(--font-mono)' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Color Sidebar (Graphite)</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={config.darkBg} onChange={e => set('darkBg', e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--mz-border)', cursor: 'pointer', padding: 2 }} />
                  <input value={config.darkBg} onChange={e => set('darkBg', e.target.value)} style={{ flex: 1, padding: '9px 10px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 13, fontFamily: 'var(--font-mono)' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Tipografía</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Fuente Display (Títulos)</label>
                <select value={config.fontDisplay} onChange={e => set('fontDisplay', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                  {FONTS_DISPLAY.map(f => <option key={f}>{f}</option>)}
                </select></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 5 }}>Fuente Body (Texto)</label>
                <select value={config.fontBody} onChange={e => set('fontBody', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                  {FONTS_BODY.map(f => <option key={f}>{f}</option>)}
                </select></div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Preview</h2>
          <div style={{ background: config.darkBg, borderRadius: 10, padding: '16px 14px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: config.primaryColor, borderRadius: 6, display: 'grid', placeItems: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 15, letterSpacing: '0.04em' }}>{config.siteName}</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Sidebar preview</div>
            {['Overview', 'Challenge Mode', 'Business Plan'].map(item => (
              <div key={item} style={{ padding: '6px 8px', borderRadius: 5, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>• {item}</div>
            ))}
          </div>
          <button style={{ width: '100%', padding: 12, background: config.primaryColor, color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'default', fontFamily: 'var(--font-body)', marginBottom: 8 }}>
            Get Started →
          </button>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{config.siteName}</div>
          <div style={{ fontSize: 13, color: 'var(--mz-ink-3)' }}>{config.tagline}</div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={save} disabled={saving} style={{ padding: '12px 28px', background: 'var(--mz-orange)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          {saving ? 'Guardando...' : '💾 Guardar Branding'}
        </button>
        {msg && <span style={{ fontSize: 13, color: 'var(--mz-success)', fontWeight: 600 }}>{msg}</span>}
      </div>
    </div>
  )
}
