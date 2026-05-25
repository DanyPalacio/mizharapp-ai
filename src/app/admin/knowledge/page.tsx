'use client'
import { useState, useEffect, useRef } from 'react'

export default function AdminKnowledge() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const token = () => localStorage.getItem('mz_admin_token') || ''

  useEffect(() => {
    fetch('/api/admin/knowledge-upload', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(d => { setDocs(d.documents || []); setLoading(false) })
  }, [])

  async function uploadFile(file: File) {
    if (!file) return
    setUploading(true); setMsg('')
    const formData = new FormData(); formData.append('file', file)
    const res = await fetch('/api/admin/knowledge-upload', { method: 'POST', headers: { 'x-admin-token': token() }, body: formData })
    const d = await res.json()
    if (d.ok) { setMsg(`✅ "${file.name}" subido. ${d.chunks} fragmentos en el RAG.`); setDocs(prev => [{ id: Date.now(), title: file.name, file_type: file.name.split('.').pop(), chunk_count: d.chunks, created_at: new Date().toISOString() }, ...prev]) }
    else setMsg('❌ ' + d.error)
    setUploading(false)
  }

  async function deleteDoc(id: string) {
    await fetch('/api/admin/knowledge-upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token() }, body: JSON.stringify({ id }) })
    setDocs(d => d.filter(x => x.id !== id))
  }

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f) }

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>Banco de Conocimiento</h1>
      <p style={{ color: 'var(--mz-ink-2)', fontSize: 14, marginBottom: 24 }}>Sube documentos (PDFs, Word, TXT) al RAG. La IA los usará para responder con más contexto y precisión.</p>

      {msg && <div style={{ padding: '10px 16px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--mz-success-50)' : 'var(--mz-danger-50)', color: msg.startsWith('✅') ? 'var(--mz-success)' : 'var(--mz-danger)', marginBottom: 16, fontSize: 13 }}>{msg}</div>}

      {/* Upload zone */}
      <div
        onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragOver ? 'var(--mz-orange)' : 'var(--mz-border)'}`, borderRadius: 12, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--mz-orange-50)' : 'white', transition: 'all 200ms', marginBottom: 24 }}>
        <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md" hidden onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
        <div style={{ fontSize: 32, marginBottom: 12 }}>📎</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
          {uploading ? '⏳ Procesando documento...' : 'Arrastra o haz clic para subir'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--mz-ink-3)' }}>PDF, DOCX, TXT, MD — Máx. 10MB por archivo</div>
        {uploading && <div style={{ marginTop: 12, fontSize: 12, color: 'var(--mz-orange)' }}>Extrayendo texto y creando fragmentos para el RAG...</div>}
      </div>

      {/* Documents list */}
      <div style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--mz-border-2)', background: 'var(--mz-cloud)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Documentos en el RAG</span>
          <span style={{ fontSize: 12, color: 'var(--mz-ink-3)' }}>{docs.length} documentos</span>
        </div>
        {loading ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--mz-ink-3)' }}>Cargando...</div>
          : docs.length === 0 ? <div style={{ padding: 32, textAlign: 'center', color: 'var(--mz-ink-3)' }}>Sin documentos. Sube tu primer documento para enriquecer la IA.</div>
          : docs.map((d, i) => (
            <div key={d.id} style={{ padding: '14px 20px', borderBottom: i < docs.length - 1 ? '1px solid var(--mz-border-3)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{{ pdf: '📕', docx: '📘', txt: '📄', md: '📝' }[d.file_type] || '📎'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: 'var(--mz-ink-3)', marginTop: 2 }}>{d.chunk_count} fragmentos · {d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: 'var(--mz-success-50)', color: 'var(--mz-success)' }}>ACTIVO</span>
              <button onClick={() => deleteDoc(d.id)} style={{ padding: '5px 10px', background: 'var(--mz-danger-50)', color: 'var(--mz-danger)', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Eliminar</button>
            </div>
          ))}
      </div>
    </div>
  )
}
