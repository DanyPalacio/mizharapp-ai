"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { FileText, Upload, LayoutGrid, ArrowRight, X, Send, Sparkles, CheckCircle2, Loader2 } from "lucide-react"

type Path = "describe" | "upload" | "template"

type ChatMsg = { role: "user" | "ai"; text: string }

const INDUSTRY_TEMPLATES = ["SaaS", "AI / ML", "Marketplace", "Fintech", "Consumer", "E-commerce", "Enterprise", "DTC", "Food & Beverage", "Consulting"]
const QUICK_IDEAS = ["AI SaaS recruiting tool", "B2B marketplace for logistics", "DTC health supplement brand", "Fintech lending platform", "EdTech for Latin America", "No-code platform for SMBs"]

export default function OnboardingPage() {
  const [activePath, setActivePath] = useState<Path>("describe")
  const [description, setDescription] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("SaaS")

  return (
    <div style={{ minHeight: "100vh", background: "var(--mz-cloud)", display: "flex", flexDirection: "column" }}>
      <header style={{ height: 64, background: "var(--mz-white)", borderBottom: "1px solid var(--mz-border-2)", display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center" }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em" }}>MIZHAR</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--mz-ink-3)" }}>Already have an account?</span>
          <Link href="/login" style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid var(--mz-border)", background: "white", fontSize: 13, fontWeight: 600, color: "var(--mz-ink)", textDecoration: "none" }}>Sign in</Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 860, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Step 01 — Start</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
              How do you want to begin?
            </h1>
            <p style={{ fontSize: 16, color: "var(--mz-ink-3)", marginTop: 12 }}>Mizhar analyzes your startup from any starting point. Choose what works for you.</p>
          </div>

          {/* Path selector */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
            {([
              { key: "describe", icon: <FileText size={28}/>, label: "Describe", sub: "Type your idea", recommended: false },
              { key: "upload", icon: <Upload size={28}/>, label: "Upload", sub: "Existing documents", recommended: true },
              { key: "template", icon: <LayoutGrid size={28}/>, label: "Template", sub: "Industry starter", recommended: false },
            ] as const).map(p => (
              <button key={p.key} onClick={() => setActivePath(p.key)}
                style={{ padding: "28px 20px", borderRadius: 14, border: `2px solid ${activePath === p.key ? "var(--mz-orange)" : "var(--mz-border-2)"}`, background: activePath === p.key ? "var(--mz-orange-50)" : "white", cursor: "pointer", position: "relative", transition: "all 150ms", fontFamily: "var(--font-body)" }}>
                {p.recommended && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--mz-orange)", color: "white", fontSize: 9, fontWeight: 800, letterSpacing: "0.10em", padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>RECOMMENDED</div>}
                <div style={{ color: activePath === p.key ? "var(--mz-orange)" : "var(--mz-ink-3)", marginBottom: 10, display: "flex", justifyContent: "center" }}>{p.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: activePath === p.key ? "var(--mz-orange)" : "var(--mz-ink)" }}>{p.label}</div>
                <div style={{ fontSize: 13, color: "var(--mz-ink-3)", marginTop: 4 }}>{p.sub}</div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--mz-border-2)", padding: 32, marginBottom: 24 }}>
            {activePath === "describe" && <DescribePath description={description} setDescription={setDescription} />}
            {activePath === "upload" && <UploadPath uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />}
            {activePath === "template" && <TemplatePath selected={selectedTemplate} setSelected={setSelectedTemplate} />}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <Link href="/onboarding/interview"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 36px", background: "var(--mz-orange)", color: "white", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "var(--sh-orange)" }}>
              Continue to Strategic Interview <ArrowRight size={18}/>
            </Link>
            <p style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 12 }}>Mizhar will analyze your input before asking any questions</p>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ── DESCRIBE PATH ─────────────────────────────────────────────── */
function DescribePath({ description, setDescription }: { description: string; setDescription: (v: string) => void }) {
  const [showAI, setShowAI] = useState(false)
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: "ai", text: "¡Hola! Soy el asistente de MIZHAR. Cuéntame sobre tu idea de negocio y te ayudo a estructurarla para el análisis. ¿Cuál es tu startup idea?" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  async function sendMsg() {
    if (!input.trim() || loading) return
    const userMsg = input.trim(); setInput(""); setLoading(true)
    setMsgs(m => [...m, { role: "user", text: userMsg }])
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context: "onboarding_idea_validation", history: msgs.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })) })
      })
      const data = await res.json()
      const reply = data.response || data.message || "Interesante idea. ¿Puedes darme más detalles sobre tu mercado objetivo y modelo de negocio?"
      setMsgs(m => [...m, { role: "ai", text: reply }])
      if (reply.length > 100 && !description) setDescription(userMsg)
    } catch {
      setMsgs(m => [...m, { role: "ai", text: "Cuéntame más sobre tu idea de negocio. ¿Cuál es el problema que resuelves?" }])
    }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Describe your startup</h3>
          <p style={{ fontSize: 14, color: "var(--mz-ink-3)", lineHeight: 1.55 }}>Write about your startup. Mizhar will extract your industry, business model, market, and strategic context automatically.</p>
        </div>
        <button onClick={() => setShowAI(!showAI)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--mz-orange)", background: showAI ? "var(--mz-orange)" : "var(--mz-orange-50)", color: showAI ? "white" : "var(--mz-orange)", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 16, fontFamily: "var(--font-body)", flexShrink: 0 }}>
          <Sparkles size={14}/> {showAI ? "Ocultar IA" : "Validar con IA"}
        </button>
      </div>

      {showAI ? (
        /* ── AI CHAT ── */
        <div style={{ border: "1px solid var(--mz-border-2)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", background: "var(--mz-graphite)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, background: "var(--mz-orange)", borderRadius: 4, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Sparkles size={12} color="white"/>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "white" }}>MIZHAR AI — Idea Validator</span>
            <span style={{ fontSize: 11, color: "var(--mz-ink-on-dark-3)", marginLeft: 4 }}>Valida y estructura tu idea de negocio</span>
          </div>
          {/* Messages */}
          <div style={{ height: 300, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "var(--mz-cloud)" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "ai" && <div style={{ width: 28, height: 28, background: "var(--mz-orange)", borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, marginRight: 8 }}><svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? "var(--mz-orange)" : "white", color: m.role === "user" ? "white" : "var(--mz-ink)", fontSize: 14, lineHeight: 1.5, border: m.role === "ai" ? "1px solid var(--mz-border-2)" : "none", boxShadow: "var(--sh-sm)" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 28, height: 28, background: "var(--mz-orange)", borderRadius: "50%", display: "grid", placeItems: "center" }}><Loader2 size={12} color="white" style={{ animation: "spin 1s linear infinite" }}/></div><div style={{ background: "white", border: "1px solid var(--mz-border-2)", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", fontSize: 13, color: "var(--mz-ink-3)" }}>Analizando tu idea...</div></div>}
            <div ref={endRef}/>
          </div>
          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--mz-border-2)", display: "flex", gap: 10, background: "white" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMsg()}
              placeholder="Cuéntame sobre tu idea de negocio..." disabled={loading}
              style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "1px solid var(--mz-border)", fontSize: 14, outline: "none", fontFamily: "var(--font-body)" }}/>
            <button onClick={sendMsg} disabled={loading || !input.trim()}
              style={{ width: 38, height: 38, borderRadius: 8, background: "var(--mz-orange)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}>
              <Send size={16} color="white"/>
            </button>
          </div>
        </div>
      ) : (
        /* ── TEXTAREA ── */
        <div>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder={"We're building an AI-powered recruiting platform for enterprise companies. Our software helps HR teams automate candidate screening using machine learning, reducing time-to-hire by 60%. We charge a monthly SaaS fee based on job postings...\n\nDescribe: what you do, who your customer is, how you make money, and what market you're targeting."}
            style={{ width: "100%", minHeight: 220, padding: "14px 16px", border: "1px solid var(--mz-border)", borderRadius: 10, fontSize: 14, lineHeight: 1.65, resize: "vertical", fontFamily: "var(--font-body)", outline: "none", color: "var(--mz-ink)", background: "var(--mz-cloud)", boxSizing: "border-box" }}/>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {QUICK_IDEAS.map(tip => (
              <button key={tip} onClick={() => setDescription(tip)}
                style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid var(--mz-border)", background: "white", fontSize: 12, color: "var(--mz-ink-2)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 120ms" }}>
                {tip}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 12 }}>💡 Not sure what to write? Click <strong style={{ color: "var(--mz-orange)" }}>Validar con IA →</strong> and our AI will help you structure your idea.</p>
        </div>
      )}
    </div>
  )
}

/* ── UPLOAD PATH ───────────────────────────────────────────────── */
function UploadPath({ uploadedFiles, setUploadedFiles }: { uploadedFiles: string[]; setUploadedFiles: (v: string[]) => void }) {
  const [dragOver, setDragOver] = useState(false)
  const [indexing, setIndexing] = useState<string[]>([])
  const simulateUpload = (name: string) => {
    setIndexing(prev => [...prev, name])
    setTimeout(() => { setIndexing(prev => prev.filter(f => f !== name)); setUploadedFiles([...uploadedFiles, name]) }, 1800)
  }
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Upload existing documents</h3>
      <p style={{ fontSize: 14, color: "var(--mz-ink-3)", marginBottom: 20, lineHeight: 1.55 }}>Mizhar will read and analyze your documents before asking questions. The smarter the input, the sharper the intelligence.</p>
      <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); Array.from(e.dataTransfer.files).forEach(f => simulateUpload(f.name)) }}
        onClick={() => document.getElementById("file-input")?.click()}
        style={{ border: `2px dashed ${dragOver ? "var(--mz-orange)" : "var(--mz-border)"}`, borderRadius: 12, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "var(--mz-orange-50)" : "var(--mz-cloud)", transition: "all 200ms" }}>
        <input id="file-input" type="file" multiple accept=".pdf,.docx,.txt,.pptx" hidden onChange={e => Array.from(e.target.files || []).forEach(f => simulateUpload(f.name))}/>
        <Upload size={32} style={{ color: "var(--mz-ink-4)", margin: "0 auto 12px" }}/>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drag documents here or click to browse</div>
        <div style={{ fontSize: 13, color: "var(--mz-ink-3)" }}>PDF, DOCX, TXT, PPTX — up to 20MB each</div>
      </div>
      {(indexing.length > 0 || uploadedFiles.length > 0) && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {indexing.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--mz-orange-50)", borderRadius: 8, fontSize: 13 }}><Loader2 size={14} color="var(--mz-orange)" style={{ animation: "spin 1s linear infinite" }}/><span style={{ flex: 1 }}>{f}</span><span style={{ fontSize: 11, color: "var(--mz-orange)", fontWeight: 600 }}>Indexing...</span></div>)}
          {uploadedFiles.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--mz-success-50)", borderRadius: 8, fontSize: 13 }}><CheckCircle2 size={14} color="var(--mz-success)"/><span style={{ flex: 1 }}>{f}</span><span style={{ fontSize: 11, color: "var(--mz-success)", fontWeight: 600 }}>Ready</span></div>)}
        </div>
      )}
    </div>
  )
}

/* ── TEMPLATE PATH ─────────────────────────────────────────────── */
function TemplatePath({ selected, setSelected }: { selected: string; setSelected: (v: string) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Choose an industry template</h3>
      <p style={{ fontSize: 14, color: "var(--mz-ink-3)", marginBottom: 20, lineHeight: 1.55 }}>Start with a pre-built framework for your industry. Mizhar will customize the analysis for your specific context.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
        {INDUSTRY_TEMPLATES.map(t => (
          <button key={t} onClick={() => setSelected(t)}
            style={{ padding: "14px 10px", borderRadius: 10, border: `2px solid ${selected === t ? "var(--mz-orange)" : "var(--mz-border-2)"}`, background: selected === t ? "var(--mz-orange-50)" : "white", fontSize: 13, fontWeight: selected === t ? 700 : 400, color: selected === t ? "var(--mz-orange)" : "var(--mz-ink)", cursor: "pointer", transition: "all 120ms", fontFamily: "var(--font-body)" }}>
            {t}
          </button>
        ))}
      </div>
      {selected && <p style={{ fontSize: 13, color: "var(--mz-ink-2)", marginTop: 16, padding: "10px 14px", background: "var(--mz-info-50)", borderRadius: 8 }}>✓ <strong>{selected}</strong> template selected. Mizhar will tailor all frameworks and benchmarks to this industry.</p>}
    </div>
  )
}
