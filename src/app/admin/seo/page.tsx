'use client'
import { useState, useEffect } from 'react'

const DEFAULT_PAGES = [
  { page: '/', title: 'MIZHAR — AI-Powered Strategic Intelligence for Founders', description: 'Validate, challenge and structure venture-scale business strategies with AI that reasons like a VC partner.', keywords: 'startup intelligence, business plan AI, emprendimiento, startup latinoamerica' },
  { page: '/pricing', title: 'MIZHAR Pricing — Free & Pro Plans for Founders', description: 'Start free. Unlock the full strategic intelligence suite with Pro. Built for startup founders.', keywords: 'mizhar pricing, startup tools pricing, business intelligence platform' },
  { page: '/blog', title: 'MIZHAR Blog — Strategic Intelligence for Founders', description: 'Insights, frameworks and tactics for startup founders building venture-scale companies.', keywords: 'startup blog, founder insights, business strategy' },
  { page: '/onboarding', title: 'Start Your Strategic Analysis — MIZHAR', description: 'Upload your business documents or answer 10 strategic questions. Get investor-grade analysis in minutes.', keywords: 'business analysis, startup validation, venture intelligence' },
]

export default function AdminSEO() {
  const [pages, setPages] = useState(DEFAULT_PAGES)
  const [active, setActive] = useState(0)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const token = () => localStorage.getItem('mz_admin_token') || ''

  useEffect(() => {
    fetch('/api/admin/seo-config', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(d => { if (d.pages?.length) setPages(d.pages) })
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/seo-config', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() }, body: JSON.stringify(pages[active]) })
    setSaving(false); setMsg('✅ Guardado')
    setTimeout(() => setMsg(''), 3000)
  }

  const p = pages[active]
  const update = (field: string, value: string) => setPages(prev => prev.map((x, i) => i === active ? { ...x, [field]: value } : x))

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>SEO & Keywords</h1>
      <p style={{ color: 'var(--mz-ink-2)', fontSize: 14, marginBottom: 24 }}>Gestiona titles, descriptions y keywords de cada página. Afecta directamente el ranking en Google.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Page list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {pages.map((p, i) => (
            <button key={p.page} onClick={() => setActive(i)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid', borderColor: i === active ? 'var(--mz-orange)' : 'var(--mz-border-2)', background: i === active ? 'var(--mz-orange-50)' : 'white', color: i === active ? 'var(--mz-orange)' : 'var(--mz-ink)', fontWeight: i === active ? 600 : 400, fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
              {p.page === '/' ? '🏠 Home' : `📄 ${p.page}`}
            </button>
          ))}
          <button onClick={() => setPages(prev => [...prev, { page: '/nueva-pagina', title: '', description: '', keywords: '' }])}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px dashed var(--mz-border)', background: 'transparent', color: 'var(--mz-ink-3)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: 4 }}>
            + Agregar página
          </button>
        </div>

        {/* Editor */}
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Página: {p.page}</h2>
            {msg && <span style={{ fontSize: 13, color: 'var(--mz-success)', fontWeight: 600 }}>{msg}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>URL / Ruta</label>
              <input value={p.page} onChange={e => update('page', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', marginBottom: 6, display: 'block' }}>Title Tag (SEO)</label>
                <span style={{ fontSize: 11, color: p.title.length > 60 ? 'var(--mz-danger)' : 'var(--mz-ink-3)' }}>{p.title.length}/60 chars</span>
              </div>
              <input value={p.title} onChange={e => update('title', e.target.value)} placeholder="Título SEO de la página"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', marginBottom: 6, display: 'block' }}>Meta Description</label>
                <span style={{ fontSize: 11, color: p.description.length > 155 ? 'var(--mz-danger)' : 'var(--mz-ink-3)' }}>{p.description.length}/155 chars</span>
              </div>
              <textarea value={p.description} onChange={e => update('description', e.target.value)} rows={3} placeholder="Descripción para Google..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', marginBottom: 6, display: 'block' }}>Keywords (separadas por coma)</label>
              <input value={p.keywords} onChange={e => update('keywords', e.target.value)} placeholder="startup, business plan, emprendimiento latam"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
            </div>

            {/* Preview */}
            <div style={{ background: 'var(--mz-cloud)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--mz-ink-3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview Google</div>
              <div style={{ fontSize: 18, color: '#1a0dab', fontWeight: 500 }}>{p.title || 'Sin título'}</div>
              <div style={{ fontSize: 13, color: '#006621' }}>mizhar-ai.com{p.page}</div>
              <div style={{ fontSize: 13, color: '#545454', marginTop: 2 }}>{p.description || 'Sin descripción'}</div>
            </div>

            <button onClick={save} disabled={saving} style={{ padding: '11px', background: 'var(--mz-orange)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {saving ? 'Guardando...' : '💾 Guardar SEO'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
