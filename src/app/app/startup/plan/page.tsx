"use client"

import { useState } from "react"
import Topbar from "@/components/layout/topbar"
import { FileText, ChevronRight, Download, Edit3, CheckCircle } from "lucide-react"

type Section = "executive" | "problem" | "solution" | "market" | "gtm" | "business-model" | "financials" | "team" | "risks" | "roadmap"

interface PlanSection {
  key: Section
  title: string
  status: "complete" | "draft" | "empty"
  words: number
}

const SECTIONS: PlanSection[] = [
  { key: "executive",      title: "Executive Summary",     status: "complete", words: 284 },
  { key: "problem",        title: "Problem & Opportunity", status: "complete", words: 512 },
  { key: "solution",       title: "Solution & Product",    status: "complete", words: 631 },
  { key: "market",         title: "Market Analysis",       status: "complete", words: 748 },
  { key: "gtm",            title: "Go-to-Market Strategy", status: "draft",    words: 320 },
  { key: "business-model", title: "Business Model",        status: "complete", words: 410 },
  { key: "financials",     title: "Financial Projections", status: "draft",    words: 195 },
  { key: "team",           title: "Team & Advisors",       status: "empty",    words: 0 },
  { key: "risks",          title: "Risks & Mitigations",   status: "draft",    words: 240 },
  { key: "roadmap",        title: "Product Roadmap",       status: "empty",    words: 0 },
]

const SECTION_CONTENT: Partial<Record<Section, string>> = {
  executive: `**MIZHAR Startup** is building the next generation of AI-powered enterprise recruiting intelligence. Our platform reduces time-to-hire by 60% while improving candidate quality scores by 2.4× compared to traditional ATS solutions.

We target mid-market and enterprise HR teams (100–5,000 employees) facing acute talent acquisition pressure in a market where the average cost-per-hire has risen 34% since 2022. Our proprietary ML pipeline, trained on 14 million anonymized hiring outcomes, delivers candidate fit scores that outperform human screeners at 91% accuracy.

Founded in 2024, we have $124K ARR across 18 paying customers, a gross margin of 68%, and a Net Promoter Score of 62. We are raising a $2.5M seed round to accelerate enterprise sales hiring and expand our data partnership program.`,

  problem: `**The Hiring Crisis Is Structural, Not Cyclical**

Enterprise HR teams face a compounding crisis: the average time-to-fill an open role has risen to 44 days (up from 36 in 2019), while the cost-per-hire now exceeds $4,700 for technical roles. At the same time, candidate quality complaints from hiring managers have increased 28% YoY.

The root cause is not a shortage of candidates — LinkedIn alone hosts 900M+ profiles — but a signal-to-noise problem. Existing ATS tools (Workday, Greenhouse, Lever) are workflow management systems, not intelligence platforms. They route applications; they don't evaluate them.

HR teams spend 67% of their recruiting budget on screening labor that produces mediocre outcomes. The manual review bottleneck means that 73% of candidates never receive a substantive evaluation — they are eliminated by keyword filters designed in 2012.

**The opportunity**: A $28B recruiting software market where the intelligence layer has not yet been built.`,

  solution: `**MIZHAR's Recruiting Intelligence Engine**

MIZHAR replaces the manual screening layer with a purpose-built AI system that evaluates candidates across 140+ dimensions — including inferred skills, career trajectory signals, team fit indicators, and role-specific performance predictors.

**Core capabilities:**
- **Predictive fit scoring**: ML model trained on 14M+ hiring outcomes predicts 90-day performance with 91% accuracy
- **Bias detection**: Automated flagging of language and structural patterns that correlate with disparate impact
- **Interview intelligence**: AI-generated interview guides tailored to each candidate's specific profile gaps
- **Feedback loop**: Continuous model improvement from post-hire outcome data

**Integration**: One-click ATS integration (Workday, Greenhouse, Lever, Ashby). Implementation in < 2 hours. Zero data migration required.`,
}

export default function BusinessPlanPage() {
  const [activeSection, setActiveSection] = useState<Section>("executive")

  const completeCount = SECTIONS.filter(s => s.status === "complete").length
  const totalWords = SECTIONS.reduce((s, sec) => s + sec.words, 0)
  const completionPct = Math.round((completeCount / SECTIONS.length) * 100)

  const content = SECTION_CONTENT[activeSection]
  const sectionMeta = SECTIONS.find(s => s.key === activeSection)!

  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Business Plan" }]}
        meta={[{ label: `${totalWords.toLocaleString()} words · ${completionPct}% complete` }]}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
              <Edit3 size={13} /> Edit
            </button>
            <button className="btn btn--primary btn--sm" style={{ gap: 6 }}>
              <Download size={13} /> Export PDF
            </button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", height: "calc(100vh - 60px - 60px)", overflow: "hidden" }}>
        {/* Section nav */}
        <aside style={{ borderRight: "1px solid var(--mz-border-2)", overflow: "auto", padding: "20px 16px", background: "var(--mz-white)" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--mz-ink-3)" }}>Completion</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--mz-ink)" }}>{completionPct}%</span>
            </div>
            <div style={{ height: 4, background: "var(--mz-cloud)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${completionPct}%`, background: "var(--mz-orange)", borderRadius: 99 }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SECTIONS.map((sec, i) => {
              const isActive = sec.key === activeSection
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10, textAlign: "left",
                    background: isActive ? "var(--mz-orange-50)" : "transparent",
                    border: `1px solid ${isActive ? "var(--mz-orange-100)" : "transparent"}`,
                    cursor: "pointer", width: "100%",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    display: "grid", placeItems: "center",
                    background: sec.status === "complete" ? "var(--mz-success)" : sec.status === "draft" ? "var(--mz-warning-50)" : "var(--mz-cloud)",
                  }}>
                    {sec.status === "complete"
                      ? <CheckCircle size={12} style={{ color: "white" }} />
                      : <span style={{ fontSize: 9, fontWeight: 700, color: sec.status === "draft" ? "var(--mz-warning)" : "var(--mz-ink-4)" }}>{i + 1}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? "var(--mz-orange-700)" : "var(--mz-ink-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sec.title}</div>
                    <div style={{ fontSize: 11, color: "var(--mz-ink-4)", marginTop: 1 }}>
                      {sec.status === "empty" ? "Not started" : sec.status === "draft" ? `Draft · ${sec.words}w` : `${sec.words}w`}
                    </div>
                  </div>
                  <ChevronRight size={12} style={{ color: isActive ? "var(--mz-orange)" : "var(--mz-ink-4)", flexShrink: 0 }} />
                </button>
              )
            })}
          </div>
        </aside>

        {/* Content area */}
        <main style={{ overflow: "auto", padding: "40px 56px", background: "var(--mz-cloud)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <FileText size={16} style={{ color: "var(--mz-orange)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-orange)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {SECTIONS.findIndex(s => s.key === activeSection) + 1} of {SECTIONS.length}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "2px 8px", borderRadius: 99,
                background: sectionMeta.status === "complete" ? "var(--mz-success-50)" : sectionMeta.status === "draft" ? "var(--mz-warning-50)" : "var(--mz-cloud)",
                color: sectionMeta.status === "complete" ? "var(--mz-success)" : sectionMeta.status === "draft" ? "var(--mz-warning)" : "var(--mz-ink-4)",
                border: `1px solid ${sectionMeta.status === "complete" ? "rgba(52,199,89,.2)" : sectionMeta.status === "draft" ? "rgba(255,159,10,.2)" : "var(--mz-border-2)"}`,
              }}>
                {sectionMeta.status}
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, letterSpacing: "-0.025em", color: "var(--mz-ink)", marginBottom: 28 }}>
              {sectionMeta.title}
            </h1>

            {content ? (
              <div style={{ fontSize: 15, color: "var(--mz-ink-2)", lineHeight: 1.8, background: "var(--mz-white)", padding: "32px 36px", borderRadius: 14, border: "1px solid var(--mz-border-2)" }}>
                {content.split("\n\n").map((para, i) => {
                  if (para.startsWith("**") && para.split("**").length === 3) {
                    return <h3 key={i} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--mz-ink)", marginBottom: 12, marginTop: i > 0 ? 28 : 0 }}>{para.replace(/\*\*/g, "")}</h3>
                  }
                  if (para.includes("**") && !para.startsWith("**")) {
                    // Inline bold — render as paragraph with styled bolds
                    const parts = para.split(/(\*\*.*?\*\*)/)
                    return (
                      <p key={i} style={{ marginBottom: 16 }}>
                        {parts.map((part, j) =>
                          part.startsWith("**") ? <strong key={j} style={{ color: "var(--mz-ink)", fontWeight: 700 }}>{part.replace(/\*\*/g, "")}</strong> : part
                        )}
                      </p>
                    )
                  }
                  if (para.startsWith("- ")) {
                    return <ul key={i} style={{ paddingLeft: 20, marginBottom: 16 }}>{para.split("\n").map((item, j) => <li key={j} style={{ marginBottom: 6 }}>{item.replace(/^- /, "").replace(/\*\*/g, "")}</li>)}</ul>
                  }
                  return <p key={i} style={{ marginBottom: 16 }}>{para}</p>
                })}
              </div>
            ) : (
              <div style={{ background: "var(--mz-white)", padding: "56px 36px", borderRadius: 14, border: "2px dashed var(--mz-border)", textAlign: "center" }}>
                <FileText size={32} style={{ color: "var(--mz-ink-4)", margin: "0 auto 16px" }} />
                <div style={{ fontWeight: 600, fontSize: 16, color: "var(--mz-ink-2)", marginBottom: 8 }}>This section is empty</div>
                <p style={{ fontSize: 14, color: "var(--mz-ink-4)", marginBottom: 20 }}>Let Mizhar generate this section from your venture profile, or write it yourself.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <button className="btn btn--primary btn--sm">Generate with AI</button>
                  <button className="btn btn--secondary btn--sm">Write manually</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
