"use client"

import Topbar from "@/components/layout/topbar"
import { Lock, Zap, BarChart2, DollarSign } from "lucide-react"
import Link from "next/link"

const VALUATION_METHODS = [
  { method: "Revenue Multiple (ARR × 8–12×)",   low: "$0.99M",  mid: "$1.24M", high: "$1.49M", note: "Based on $124K ARR at typical early-stage SaaS multiples" },
  { method: "Berkus Method",                      low: "$1.5M",   mid: "$2.0M",  high: "$2.5M",  note: "Qualitative scoring: team, idea, prototype, strategic, customers" },
  { method: "Scorecard Method",                   low: "$1.8M",   mid: "$2.2M",  high: "$2.8M",  note: "Benchmarked against $2.5M seed median for your stage" },
  { method: "DCF (5-year)",                       low: "$3.1M",   mid: "$4.4M",  high: "$6.2M",  note: "WACC 35%, terminal growth 3%, 3× revenue year 5" },
  { method: "Comparable Transactions",            low: "$2.0M",   mid: "$2.8M",  high: "$3.6M",  note: "Based on 12 comparable pre-seed/seed AI SaaS deals in 2025" },
]

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
        Valuation is a Pro feature
      </div>
      <p style={{ fontSize: 15, color: "var(--mz-ink-3)", textAlign: "center", maxWidth: 380, lineHeight: 1.6, marginBottom: 28 }}>
        Unlock multi-method valuations, comparable deal data, dilution modeling, and investor-ready cap table projections.
      </p>
      <Link href="/pricing" className="btn btn--primary" style={{ gap: 8 }}>
        <Zap size={16} /> Upgrade to Pro · $49/mo
      </Link>
      <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
        {["5 valuation methods", "Comparable deals", "Cap table model", "Dilution scenarios"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--mz-ink-3)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--mz-orange)", display: "inline-block" }} />
            {f}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ValuationPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Valuation" }]}
        meta={[{ label: "Multi-method · Pro feature" }]}
        actions={
          <span style={{ fontSize: 11, fontWeight: 700, background: "var(--mz-orange)", color: "white", padding: "4px 10px", borderRadius: 99 }}>PRO</span>
        }
      />

      <div style={{ padding: "32px 40px", position: "relative" }}>
        {!isPro && <ProGate />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24, filter: isPro ? "none" : "blur(6px)", userSelect: "none" }}>
          {[
            { label: "Pre-money Valuation (mid)", value: "$2.4M",  icon: DollarSign, color: "var(--mz-orange)" },
            { label: "Post-money (at $2.5M raise)", value: "$4.9M", icon: BarChart2,  color: "#0A84FF" },
            { label: "Dilution at target raise",    value: "33.8%", icon: Zap,        color: "var(--mz-warning)" },
          ].map(card => (
            <div key={card.label} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <card.icon size={16} style={{ color: card.color }} />
                <span style={{ fontSize: 12, color: "var(--mz-ink-3)" }}>{card.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--mz-ink)", letterSpacing: "-0.03em" }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", filter: isPro ? "none" : "blur(6px)", userSelect: "none" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--mz-border-2)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>Valuation by Method</h3>
            <p style={{ fontSize: 13, color: "var(--mz-ink-3)", marginTop: 4 }}>5 methodologies · Range reflects market uncertainty</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--mz-cloud)" }}>
                {["Method", "Low", "Mid", "High", "Note"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: h === "Note" || h === "Method" ? "left" : "right", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VALUATION_METHODS.map((row, i) => (
                <tr key={row.method} style={{ background: i % 2 === 0 ? "var(--mz-white)" : "var(--mz-cloud)", borderBottom: "1px solid var(--mz-border-2)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--mz-ink)" }}>{row.method}</td>
                  <td style={{ padding: "14px 20px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-ink-3)" }}>{row.low}</td>
                  <td style={{ padding: "14px 20px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--mz-orange)" }}>{row.mid}</td>
                  <td style={{ padding: "14px 20px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-ink-3)" }}>{row.high}</td>
                  <td style={{ padding: "14px 20px", fontSize: 12, color: "var(--mz-ink-3)", maxWidth: 280 }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
