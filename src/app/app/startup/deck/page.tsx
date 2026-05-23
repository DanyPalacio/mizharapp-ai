"use client"

import Topbar from "@/components/layout/topbar"
import { FileText, Plus, Download } from "lucide-react"

const SLIDES = [
  { num: 1, title: "Title Slide", desc: "Company name & tagline" },
  { num: 2, title: "The Problem", desc: "Market pain & opportunity" },
  { num: 3, title: "The Solution", desc: "Your product & differentiation" },
  { num: 4, title: "Market Size", desc: "TAM / SAM / SOM" },
  { num: 5, title: "Go-to-Market", desc: "Customer acquisition strategy" },
  { num: 6, title: "Traction", desc: "Metrics & milestones" },
  { num: 7, title: "Business Model", desc: "Revenue & unit economics" },
  { num: 8, title: "The Team", desc: "Founders & key hires" },
  { num: 9, title: "Use of Funds", desc: "$2.5M allocation" },
  { num: 10, title: "The Ask", desc: "Investment terms" },
]

export default function DeckPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "Startup" }, { label: "Investor Deck" }]} meta={[{ label: "10 slides · Auto-synced from venture profile" }]} actions={<button className="btn btn--primary btn--sm" style={{ gap: 6 }}><Download size={13} /> Export PDF</button>} />
      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
          {SLIDES.map(slide => (
            <div key={slide.num} className="card" style={{ padding: "16px 14px", cursor: "pointer", transition: "border-color var(--t-fast) var(--ease-out)" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--mz-orange)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--mz-border-2)"}>
              <div style={{ width: "100%", aspectRatio: "4/3", background: "var(--mz-cloud)", borderRadius: 8, marginBottom: 10, display: "grid", placeItems: "center", color: "var(--mz-ink-4)" }}>
                <FileText size={24} />
              </div>
              <div style={{ fontSize: 11, color: "var(--mz-ink-4)", marginBottom: 4 }}>Slide {slide.num}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-ink)" }}>{slide.title}</div>
              <div style={{ fontSize: 11, color: "var(--mz-ink-3)", marginTop: 2 }}>{slide.desc}</div>
            </div>
          ))}
        </div>
        <button className="btn btn--secondary" style={{ gap: 8 }}>
          <Plus size={16} /> Add custom slide
        </button>
      </div>
    </>
  )
}
