"use client"

import Topbar from "@/components/layout/topbar"
import { TrendingUp, Target, Users, MessageSquare } from "lucide-react"

const CHANNELS = [
  { name: "Outbound / Sales", budget: "$12K/mo", cac: "$840",   months_to_payback: 8,   nrr: "110%" },
  { name: "Inbound / SEO",    budget: "$4K/mo",  cac: "$620",   months_to_payback: 5,   nrr: "115%" },
  { name: "Product-led Growth",budget: "$2K/mo", cac: "$480",   months_to_payback: 4,   nrr: "112%" },
  { name: "Paid Ads / PPC",   budget: "$3K/mo",  cac: "$1,240", months_to_payback: 12,  nrr: "108%" },
]

export default function MarketingPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "Startup" }, { label: "Marketing Plan" }]} />
      <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* GTM Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "Total Monthly Budget", value: "$21K",    icon: TrendingUp },
            { label: "Blended CAC", value: "$840",   icon: Target },
            { label: "Active Campaigns", value: "4",         icon: Users },
            { label: "Conversion Rate", value: "2.8%",        icon: MessageSquare },
          ].map(card => (
            <div key={card.label} className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <card.icon size={14} style={{ color: "var(--mz-orange)" }} />
                <span style={{ fontSize: 11, color: "var(--mz-ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--mz-ink)", letterSpacing: "-0.02em" }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Channel breakdown */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--mz-border-2)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>GTM Channels</h3>
            <p style={{ fontSize: 13, color: "var(--mz-ink-3)", marginTop: 4 }}>Monthly budget allocation and performance by channel</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--mz-cloud)" }}>
                {["Channel", "Budget", "CAC", "Payback", "NRR"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((ch, i) => (
                <tr key={ch.name} style={{ background: i % 2 === 0 ? "var(--mz-white)" : "var(--mz-cloud)", borderBottom: "1px solid var(--mz-border-2)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--mz-ink)" }}>{ch.name}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--mz-ink-2)" }}>{ch.budget}</td>
                  <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-ink-2)" }}>{ch.cac}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--mz-ink-2)" }}>{ch.months_to_payback} mo</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--mz-success)" }}>{ch.nrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quarterly roadmap */}
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)", marginBottom: 16 }}>12-Month Marketing Roadmap</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { q: "Q2 2026", init: "Channel setup & brand audit", target: "100 MQLs/mo" },
              { q: "Q3 2026", init: "Paid + organic ramping", target: "280 MQLs/mo" },
              { q: "Q4 2026", init: "PLG pilot + enterprise ABM", target: "420 MQLs/mo" },
              { q: "Q1 2027", init: "Scale winner channels", target: "600 MQLs/mo" },
            ].map(phase => (
              <div key={phase.q} style={{ padding: "16px", background: "var(--mz-cloud)", borderRadius: 10, border: "1px solid var(--mz-border-2)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mz-orange)", letterSpacing: "0.06em", marginBottom: 8 }}>{phase.q}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-ink)", marginBottom: 8 }}>{phase.init}</div>
                <div style={{ fontSize: 11, color: "var(--mz-ink-3)" }}>Target: <strong>{phase.target}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
