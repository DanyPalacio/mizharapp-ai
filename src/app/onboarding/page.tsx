"use client"

import Link from "next/link"
import { useState } from "react"
import { FileText, Upload, LayoutGrid, ArrowRight, CheckCircle, Loader2 } from "lucide-react"

type Path = "describe" | "upload" | "template"

const INDUSTRY_TEMPLATES = [
  "SaaS", "AI / ML", "Marketplace", "Fintech", "Consumer",
  "E-commerce", "Enterprise", "DTC", "Food & Beverage", "Consulting",
]

export default function OnboardingPage() {
  const [activePath, setActivePath] = useState<Path>("upload")
  const [description, setDescription] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("SaaS")

  return (
    <div style={{ minHeight: "100vh", background: "var(--mz-cloud)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header style={{ height: 64, background: "var(--mz-white)", borderBottom: "1px solid var(--mz-border-2)", display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16 }}>M</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em" }}>MIZHAR</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--mz-ink-3)" }}>Already have an account?</span>
          <Link href="/login" className="btn btn--secondary btn--sm">Sign in</Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div style={{ maxWidth: 800, width: "100%" }}>
          {/* Eyebrow */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Step 01 — Start</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
              How do you want to begin?
            </h1>
            <p style={{ color: "var(--mz-ink-3)", fontSize: 16, marginTop: 12, lineHeight: 1.5 }}>
              Mizhar analyzes your startup from any starting point. Choose what works for you.
            </p>
          </div>

          {/* Path selector */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {([
              { key: "describe" as Path, icon: FileText, label: "Describe",     sub: "Type your idea" },
              { key: "upload"   as Path, icon: Upload,   label: "Upload",       sub: "Existing documents", recommended: true },
              { key: "template" as Path, icon: LayoutGrid,label: "Template",    sub: "Industry starter" },
            ]).map(({ key, icon: Icon, label, sub, recommended }) => (
              <button
                key={key}
                onClick={() => setActivePath(key)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  padding: "24px 20px",
                  borderRadius: 14,
                  border: `2px solid ${activePath === key ? "var(--mz-orange)" : "var(--mz-border-2)"}`,
                  background: activePath === key ? "var(--mz-orange-50)" : "var(--mz-white)",
                  cursor: "pointer", position: "relative",
                  transition: "all var(--t-base) var(--ease-out)",
                }}
              >
                {recommended && (
                  <span style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "var(--mz-orange)", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>RECOMMENDED</span>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: activePath === key ? "var(--mz-orange)" : "var(--mz-cloud)", display: "grid", placeItems: "center", color: activePath === key ? "white" : "var(--mz-ink-3)" }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: activePath === key ? "var(--mz-orange-700)" : "var(--mz-ink)" }}>{label}</div>
                  <div style={{ fontSize: 12, color: "var(--mz-ink-3)", marginTop: 3 }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div style={{ background: "var(--mz-white)", border: "1px solid var(--mz-border-2)", borderRadius: 16, padding: 32 }}>
            {activePath === "describe" && (
              <DescribePath description={description} setDescription={setDescription} />
            )}
            {activePath === "upload" && (
              <UploadPath uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
            )}
            {activePath === "template" && (
              <TemplatePath selected={selectedTemplate} setSelected={setSelectedTemplate} />
            )}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Link href="/onboarding/interview" className="btn btn--primary btn--lg" style={{ gap: 10 }}>
              Continue to Strategic Interview
              <ArrowRight size={18} />
            </Link>
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--mz-ink-4)", marginTop: 14 }}>
            Mizhar will analyze your input before asking any questions
          </p>
        </div>
      </main>
    </div>
  )
}

/* ── DESCRIBE PATH ─────────────────────────────────────────────── */
function DescribePath({ description, setDescription }: { description: string; setDescription: (v: string) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Describe your startup</h3>
      <p style={{ fontSize: 14, color: "var(--mz-ink-3)", marginBottom: 20, lineHeight: 1.5 }}>
        Write a paragraph about your startup. Mizhar will extract your industry, business model, market, and strategic context automatically.
      </p>
      <textarea
        className="mz-textarea"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="We're building an AI-powered recruiting platform for enterprise companies. Our software helps HR teams automate candidate screening using machine learning, reducing time-to-hire by 60%. We charge a monthly SaaS fee based on job postings..."
        style={{ minHeight: 160, fontSize: 14, lineHeight: 1.6 }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {["AI SaaS recruiting tool", "B2B marketplace for logistics", "DTC health supplement brand", "Fintech lending platform"].map(tip => (
          <button key={tip} onClick={() => setDescription(tip)} style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid var(--mz-border)", background: "var(--mz-cloud)", fontSize: 12, color: "var(--mz-ink-2)", cursor: "pointer" }}>
            {tip}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── UPLOAD PATH ───────────────────────────────────────────────── */
function UploadPath({ uploadedFiles, setUploadedFiles }: { uploadedFiles: string[]; setUploadedFiles: (v: string[]) => void }) {
  const [dragOver, setDragOver] = useState(false)
  const [indexing, setIndexing] = useState<string[]>([])

  const simulateUpload = (name: string) => {
    setIndexing(prev => [...prev, name])
    setTimeout(() => {
      setIndexing(prev => prev.filter(f => f !== name))
      setUploadedFiles([...uploadedFiles, name])
    }, 1800)
  }

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Upload existing documents</h3>
      <p style={{ fontSize: 14, color: "var(--mz-ink-3)", marginBottom: 20, lineHeight: 1.5 }}>
        Mizhar will read and analyze your documents <strong>before</strong> asking any questions. The smarter the input, the sharper the intelligence.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault(); setDragOver(false)
          Array.from(e.dataTransfer.files).forEach(f => simulateUpload(f.name))
        }}
        onClick={() => simulateUpload("pitch-deck-2026.pdf")}
        style={{
          border: `2px dashed ${dragOver ? "var(--mz-orange)" : "var(--mz-border)"}`,
          borderRadius: 12, padding: "36px 24px", textAlign: "center",
          background: dragOver ? "var(--mz-orange-50)" : "var(--mz-cloud)",
          cursor: "pointer", transition: "all var(--t-base) var(--ease-out)",
        }}
      >
        <Upload size={28} style={{ color: "var(--mz-ink-4)", margin: "0 auto 12px" }} />
        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--mz-ink-2)" }}>Drop files here or click to upload</div>
        <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 6 }}>PDF · DOCX · PPTX · XLSX · MD · TXT</div>
      </div>

      {/* File list */}
      {(uploadedFiles.length > 0 || indexing.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
          {indexing.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--mz-warning-50)", border: "1px solid var(--mz-warning)", borderRadius: 8, fontSize: 13 }}>
              <Loader2 size={14} style={{ color: "var(--mz-warning)", animation: "spin 1s linear infinite" }} />
              <span style={{ flex: 1 }}>{f}</span>
              <span style={{ fontSize: 11, color: "var(--mz-warning)", fontWeight: 600 }}>Indexing…</span>
            </div>
          ))}
          {uploadedFiles.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--mz-success-50)", border: "1px solid var(--mz-success)", borderRadius: 8, fontSize: 13 }}>
              <CheckCircle size={14} style={{ color: "var(--mz-success)" }} />
              <span style={{ flex: 1 }}>{f}</span>
              <span style={{ fontSize: 11, color: "var(--mz-success)", fontWeight: 600 }}>Analyzed</span>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: 13, color: "var(--mz-ink-3)", background: "var(--mz-orange-50)", border: "1px solid var(--mz-orange-100)", borderRadius: 8, padding: "10px 14px", lineHeight: 1.5 }}>
        <strong style={{ color: "var(--mz-orange-700)" }}>Mizhar intelligence:</strong> AI will analyze your documents first and will never ask questions already answered in your files.
      </p>
    </div>
  )
}

/* ── TEMPLATE PATH ─────────────────────────────────────────────── */
function TemplatePath({ selected, setSelected }: { selected: string; setSelected: (v: string) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Choose an industry template</h3>
      <p style={{ fontSize: 14, color: "var(--mz-ink-3)", marginBottom: 20, lineHeight: 1.5 }}>
        Start with a pre-configured strategic framework for your industry. Mizhar will tailor the entire analysis to your sector.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
        {INDUSTRY_TEMPLATES.map(t => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            style={{
              padding: "12px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              border: `2px solid ${selected === t ? "var(--mz-orange)" : "var(--mz-border-2)"}`,
              background: selected === t ? "var(--mz-orange-50)" : "var(--mz-cloud)",
              color: selected === t ? "var(--mz-orange-700)" : "var(--mz-ink-2)",
              cursor: "pointer", transition: "all var(--t-fast) var(--ease-out)",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--mz-orange-50)", borderRadius: 8, border: "1px solid var(--mz-orange-100)", fontSize: 13, color: "var(--mz-orange-700)" }}>
          <strong>{selected}</strong> template loaded · Pre-configured with industry benchmarks, typical unit economics, and common risk factors.
        </div>
      )}
    </div>
  )
}
