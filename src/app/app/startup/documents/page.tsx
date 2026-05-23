"use client"

import Topbar from "@/components/layout/topbar"
import { Upload, FileText, Plus } from "lucide-react"

const DOCS = [
  { name: "Pitch Deck v3.pptx", size: "4.2 MB", type: "presentation", date: "May 15" },
  { name: "Financial Model 2026.xlsx", size: "1.8 MB", type: "spreadsheet", date: "May 14" },
  { name: "Market Research.pdf", size: "6.4 MB", type: "pdf", date: "May 10" },
]

export default function DocumentsPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "Startup" }, { label: "Documents" }]} />
      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--mz-ink)", marginBottom: 4 }}>Document Library</h2>
            <p style={{ fontSize: 14, color: "var(--mz-ink-3)" }}>Uploaded files and resources for your venture</p>
          </div>
          <button className="btn btn--primary" style={{ gap: 6 }}>
            <Plus size={14} /> Upload Document
          </button>
        </div>

        {/* Drop zone */}
        <div style={{ border: "2px dashed var(--mz-border)", borderRadius: 12, padding: "48px 24px", textAlign: "center", marginBottom: 24 }}>
          <Upload size={28} style={{ color: "var(--mz-ink-4)", margin: "0 auto 12px" }} />
          <div style={{ fontWeight: 600, fontSize: 15, color: "var(--mz-ink-2)" }}>Drop files here or click to upload</div>
          <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 6 }}>PDF · DOCX · PPTX · XLSX · Images</div>
        </div>

        {/* Existing docs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DOCS.map(doc => (
            <div key={doc.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--mz-cloud)", borderRadius: 10 }}>
              <FileText size={20} style={{ color: "var(--mz-orange)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--mz-ink)" }}>{doc.name}</div>
                <div style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>{doc.size} · {doc.date}</div>
              </div>
              <button className="btn btn--secondary btn--sm">Open</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
