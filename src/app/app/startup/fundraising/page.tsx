"use client"

import Topbar from "@/components/layout/topbar"
import { Lock, Zap, Target, Users, DollarSign, FileText } from "lucide-react"
import Link from "next/link"

const isPro = false

function ProGate() {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(245,246,247,.95)",
      backdropFilter: "blur(8px)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", zIndex: 10, borderRadius: 16,
    }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--mz-orange)", display: "grid", placeItems: "center", marginBottom: 20 }}>
        <Lock size={28} style={{ color: "white" }} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--mz-ink)", marginBottom: 8, textAlign: "center" }}>
        Fundraising is a Pro feature
      </div>
      <p style={{ fontSize: 15, color: "var(--mz-ink-3)", textAlign: "center", maxWidth: 380, lineHeight: 1.6, marginBottom: 28 }}>
        AI-curated investor targeting, outreach sequencing, data room builder, and term sheet analysis.
      </p>
      <Link href="/pricing" className="btn btn--primary" style={{ gap: 8 }}>
        <Zap size={16} /> Upgrade to Pro · $49/mo
      </Link>
      <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
        {["Investor targeting", "Outreach templates", "Data room", "Term sheet analysis", "Cap table builder"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--mz-ink-3)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--mz-orange)", display: "inline-block" }} />
            {f}
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCK_INVESTORS = [
  { name: "Andreessen Horowitz",  stage: "Seed–Series A", thesis: "Enterprise SaaS, AI/ML, Future of Work", checkSize: "$500K–$5M",  fit: 94 },
  { name: "First Round Capital",  stage: "Pre-seed–Seed", thesis: "B2B SaaS, Future of Work, ML infrastructure", checkSize: "$250K–$3M", fit: 91 },
  { name: "Accel",                stage: "Seed–Series A", thesis: "Enterprise software, AI applications",         checkSize: "$1M–$10M",  fit: 88 },
  { name: "General Catalyst",     stage: "Seed–Series B", thesis: "Resilience, AI, enterprise platforms",         checkSize: "$1M–$15M",  fit: 85 },
  { name: "Unusual Ventures",     stage: "Pre-seed–Seed", thesis: "Founder-first, B2B SaaS, AI",                  checkSize: "$100K–$2M", fit: 82 },
]

export default function FundraisingPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Fundraising" }]}
        meta={[{ label: "Investor targeting + data room · Pro feature" }]}
        actions={
          <span style={{ fontSize: 11, fontWeight: 700, background: "var(--mz-orange)", color: "white", padding: "4px 10px", borderRadius: 99 }}>PRO</span>
        }
      />

      <div style={{ padding: "32px 40px", position: "relative" }}>
        {!isPro && <ProGate />}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24, filter: isPro ? "none" : "blur(6px)", userSelect: "none" }}>
          {[
            { label: "Target Raise",      value: "$2.5M",     icon: DollarSign },
            { label: "Investors Matched", value: "47",         icon: Users },
            { label: "Outreach Sent",     value: "0",          icon: Target },
            { label: "Data Room Items",   value: "8 of 12",    icon: FileText },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <stat.icon size={14} style={{ color: "var(--mz-orange)" }} />
                <span style={{ fontSize: 11, color: "var(--mz-ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--mz-ink)", letterSpacing: "-0.02em" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Investor list */}
        <div className="card" style={{ padding: 0, overflow: "hidden", filter: isPro ? "none" : "blur(6px)", userSelect: "none" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--mz-border-2)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Top Matched Investors</h3>
            <p style={{ fontSize: 13, color: "var(--mz-ink-3)", marginTop: 4 }}>Ranked by thesis fit score — based on your venture profile</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {MOCK_INVESTORS.map((inv, i) => (
              <div key={inv.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < MOCK_INVESTORS.length - 1 ? "1px solid var(--mz-border-2)" : "none", background: i % 2 === 0 ? "var(--mz-white)" : "var(--mz-cloud)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--mz-cloud)", display: "grid", placeItems: "center", border: "1px solid var(--mz-border-2)" }}>
                  <Users size={16} style={{ color: "var(--mz-ink-3)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--mz-ink)" }}>{inv.name}</div>
                  <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 2 }}>{inv.stage} · {inv.checkSize}</div>
                  <div style={{ fontSize: 11, color: "var(--mz-ink-3)", marginTop: 3 }}>{inv.thesis}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: inv.fit >= 90 ? "var(--mz-success)" : inv.fit >= 80 ? "var(--mz-orange)" : "var(--mz-ink-2)" }}>{inv.fit}%</div>
                  <div style={{ fontSize: 10, color: "var(--mz-ink-4)" }}>fit score</div>
                </div>
                <button className="btn btn--secondary btn--sm">
                  Contact →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
