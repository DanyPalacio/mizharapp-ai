"use client"

import Topbar from "@/components/layout/topbar"
import { Download, FileText, Lock } from "lucide-react"

const EXPORTS = [
  { name: "Full Venture Report (PDF)", size: "8.2 MB", date: "2 hours ago", pro: false, icon: "📄" },
  { name: "Business Plan (DOCX)", size: "2.1 MB", date: "2 hours ago", pro: false, icon: "📝" },
  { name: "Financial Model (XLSX)", size: "1.4 MB", date: "2 hours ago", pro: false, icon: "📊" },
  { name: "Investor Pitch Deck (PPTX)", size: "5.8 MB", date: "2 hours ago", pro: true, icon: "🎯" },
  { name: "Data Room Bundle (ZIP)", size: "42 MB", date: "—", pro: true, icon: "📦" },
]

export default function ExportsPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "Startup" }, { label: "Exports" }]} />
      <div style={{ padding: "32px 40px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--mz-ink)", marginBottom: 8 }}>Available Exports</h2>
          <p style={{ fontSize: 14, color: "var(--mz-ink-3)" }}>Download your venture analysis in multiple formats. Pro exports include branding & customization.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EXPORTS.map(exp => (
            <div key={exp.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: "var(--mz-white)", border: "1px solid var(--mz-border-2)", borderRadius: 12 }}>
              <span style={{ fontSize: 24 }}>{exp.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "var(--mz-ink)" }}>{exp.name}</span>
                  {exp.pro && <span style={{ fontSize: 9, fontWeight: 700, background: "var(--mz-orange)", color: "white", padding: "2px 6px", borderRadius: 99 }}>PRO</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 3 }}>{exp.size} · {exp.date}</div>
              </div>
              <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
