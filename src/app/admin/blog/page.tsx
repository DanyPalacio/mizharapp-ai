'use client'
import { useState, useEffect } from 'react'

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [wordCount, setWordCount] = useState('1200')
  const [internalLinks, setInternalLinks] = useState('https://mizhar-ai.com/pricing\nhttps://mizhar-ai.com/onboarding')
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'list' | 'create'>('list')

  const token = () => localStorage.getItem('mz_admin_token') || ''

  useEffect(() => {
    fetch('/api/admin/blog-ai', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false) })
  }, [])

  async function generate() {
    if (!title || !keywords) { setMsg('❌ Completa título y palabras clave'); return }
    setGenerating(true); setMsg('')
    const res = await fetch('/api/admin/blog-ai', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() },
      body: JSON.stringify({ title, keywords: keywords.split(',').map(k => k.trim()), wordCount: parseInt(wordCount), internalLinks: internalLinks.split('\n').filter(Boolean), action: 'generate' })
    })
    const d = await res.json()
    if (d.ok) { setMsg(`✅ Artículo "${title}" creado como borrador (${d.post?.word_count} palabras)`); setPosts(p => [d.post, ...p]); setTitle(''); setKeywords('') }
    else setMsg('❌ ' + (d.error || 'Error al generar'))
    setGenerating(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/blog-ai', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() }, body: JSON.stringify({ id, status }) })
    setPosts(p => p.map(x => x.id === id ? { ...x, status } : x))
  }

  const statusBadge = (s: string) => ({ published: { bg: 'var(--mz-success-50)', c: 'var(--mz-success)' }, draft: { bg: 'var(--mz-warning-50)', c: 'var(--mz-warning)' }, archived: { bg: 'var(--mz-cloud)', c: 'var(--mz-ink-3)' } }[s] || { bg: 'var(--mz-cloud)', c: 'var(--mz-ink-3)' })

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>Blog + IA</h1>
      <p style={{ color: 'var(--mz-ink-2)', fontSize: 14, marginBottom: 24 }}>Genera artículos SEO con Claude AI. Define el tema, KWs y enlaces internos. El artículo se escribe solo.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--mz-cloud)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {([['list','📋 Artículos'], ['create','✍️ Crear con IA']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', fontWeight: tab === k ? 600 : 400, fontSize: 13, background: tab === k ? 'white' : 'transparent', color: 'var(--mz-ink)', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: tab === k ? 'var(--sh-sm)' : 'none' }}>{l}</button>
        ))}
      </div>

      {msg && <div style={{ padding: '10px 16px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--mz-success-50)' : 'var(--mz-danger-50)', color: msg.startsWith('✅') ? 'var(--mz-success)' : 'var(--mz-danger)', marginBottom: 16, fontSize: 13 }}>{msg}</div>}

      {tab === 'create' ? (
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 28, maxWidth: 720 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Generar Artículo con IA</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Título del Artículo *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Cómo validar tu startup con IA en 2026"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Palabras Clave (separadas por coma) *</label>
              <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="validar startup, business plan IA, emprendimiento"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Longitud del Artículo</label>
              <select value={wordCount} onChange={e => setWordCount(e.target.value)} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
                <option value="800">800 palabras (corto)</option>
                <option value="1200">1,200 palabras (estándar)</option>
                <option value="1800">1,800 palabras (largo)</option>
                <option value="2500">2,500 palabras (pillar)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mz-ink-2)', display: 'block', marginBottom: 6 }}>Links Internos (uno por línea)</label>
              <textarea value={internalLinks} onChange={e => setInternalLinks(e.target.value)} rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--mz-border)', fontSize: 13, fontFamily: 'var(--font-mono)', resize: 'vertical', boxSizing: 'border-box' }} />
              <p style={{ fontSize: 11, color: 'var(--mz-ink-3)', marginTop: 4 }}>La IA incluirá estos enlaces naturalmente en el artículo para link building</p>
            </div>
            <button onClick={generate} disabled={generating}
              style={{ padding: '12px 24px', background: generating ? 'var(--mz-ink-4)' : 'var(--mz-orange)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: generating ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
              {generating ? '⏳ Generando artículo con Claude AI...' : '✨ Generar Artículo con IA'}
            </button>
            {generating && <p style={{ fontSize: 12, color: 'var(--mz-ink-3)', textAlign: 'center' }}>Claude está escribiendo tu artículo. Puede tomar 15-30 segundos...</p>}
          </div>
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--mz-cloud)', borderBottom: '1px solid var(--mz-border-2)' }}>
              {['Título', 'Slug', 'Estado', 'Palabras', 'Fecha', 'Acciones'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mz-ink-3)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--mz-ink-3)' }}>Cargando...</td></tr>
                : posts.length === 0 ? <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--mz-ink-3)' }}>Sin artículos. Crea tu primero con IA.</td></tr>
                : posts.map((p, i) => {
                  const b = statusBadge(p.status)
                  return <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid var(--mz-border-3)' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.title}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--mz-ink-3)' }}>{p.slug}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: b.bg, color: b.c }}>{p.status}</span></td>
                    <td style={{ padding: '12px 16px', color: 'var(--mz-ink-3)' }}>{p.word_count || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--mz-ink-3)' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 16px', display: 'flex', gap: 6 }}>
                      {p.status !== 'published' && <button onClick={() => updateStatus(p.id, 'published')} style={{ padding: '4px 10px', background: 'var(--mz-success-50)', color: 'var(--mz-success)', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Publicar</button>}
                      {p.status !== 'draft' && <button onClick={() => updateStatus(p.id, 'draft')} style={{ padding: '4px 10px', background: 'var(--mz-warning-50)', color: 'var(--mz-warning)', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Borrador</button>}
                    </td>
                  </tr>
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
