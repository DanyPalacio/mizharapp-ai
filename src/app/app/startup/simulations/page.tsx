"use client"

import Topbar from "@/components/layout/topbar"
import { Lock, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"

const isPro = false

function ProGate() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(245,246,247,.95)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, borderRadius: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--mz-orange)", display: "grid", placeItems: "center", marginBottom: 20 }}>
        <Lock size={28} style={{ color: "white" }} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--mz-ink)", marginBottom: 8, textAlign: "center" }}>Simulations is a Pro feature</div>
      <p style={{ fontSize: 15, color: "var(--mz-ink-3)", textAlign: "center", maxWidth: 380, lineHeight: 1.6, marginBottom: 28 }}>Run Monte Carlo simulations, sensitivity analysis, and stress-test your venture across 100+ scenarios.</p>
      <Link href="/pricing" className="btn btn--primary" style={{ gap: 8 }}>
        <Zap size={16} /> Upgrade to Pro · $49/mo
      </Link>
    </div>
  )
}

export default function SimulationsPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "Startup" }, { label: "Simulations" }]} actions={<span style={{ fontSize: 11, fontWeight: 700, background: "var(--mz-orange)", color: "white", padding: "4px 10px", borderRadius: 99 }}>PRO</span>} />
      <div style={{ padding: "32px 40px", position: "relative" }}>
        {!isPro && <ProGate />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24, filter: isPro ? "none" : "blur(6px)", userSelect: "none" }}>
          {[{ label: "Monte Carlo Runs", value: "1,000", icon: TrendingUp }, { label: "Success Probability", value: "78%", icon: TrendingUp }, { label: "Breakeven Month", value: "Month 22", icon: TrendingUp }].map(card => (
            <div key={card.label} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <card.icon size={16} style={{ color: "var(--mz-orange)" }} />
                <span style={{ fontSize: 12, color: "var(--mz-ink-3)" }}>{card.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--mz-ink)", letterSpacing: "-0.03em" }}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
