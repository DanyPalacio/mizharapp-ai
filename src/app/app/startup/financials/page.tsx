"use client"

import { useState } from "react"
import Topbar from "@/components/layout/topbar"
import { TrendingUp, TrendingDown, Download, Settings } from "lucide-react"

type Scenario = "base" | "bull" | "bear"

const SCENARIOS: Record<Scenario, { label: string; color: string; multiplier: number }> = {
  base:  { label: "Base Case",  color: "var(--mz-orange)",  multiplier: 1 },
  bull:  { label: "Bull Case",  color: "var(--mz-success)", multiplier: 1.6 },
  bear:  { label: "Bear Case",  color: "var(--mz-danger)",  multiplier: 0.55 },
}

const BASE_ROWS = [
  { metric: "ARR",           y1: 124,   y2: 620,   y3: 2100,  unit: "K",  trend: "up"   },
  { metric: "MRR",          y1: 10.3,  y2: 51.7,  y3: 175,   unit: "K",  trend: "up"   },
  { metric: "New Customers", y1: 18,    y2: 74,    y3: 210,   unit: "",   trend: "up"   },
  { metric: "Gross Margin",  y1: 68,    y2: 72,    y3: 78,    unit: "%",  trend: "up"   },
  { metric: "Burn Rate",     y1: 42,    y2: 95,    y3: 210,   unit: "K",  trend: "down" },
  { metric: "CAC",          y1: 840,   y2: 680,   y3: 520,   unit: "$",  trend: "up"   },
  { metric: "LTV",          y1: 2688,  y2: 3400,  y3: 4800,  unit: "$",  trend: "up"   },
  { metric: "LTV:CAC",     y1: 3.2,   y2: 5.0,   y3: 9.2,   unit: "×",  trend: "up"   },
  { metric: "Runway",       y1: 18,    y2: 14,    y3: 22,    unit: "mo", trend: "up"   },
  { metric: "Net Revenue Retention", y1: 108, y2: 115, y3: 124, unit: "%", trend: "up" },
]

const ARR_MONTHLY = [10, 18, 24, 32, 41, 52, 65, 80, 95, 108, 116, 124]
const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]

function fmt(val: number, unit: string, mult: number): string {
  const v = val * mult
  if (unit === "K") return `$${Math.round(v)}K`
  if (unit === "$") return `$${Math.round(v).toLocaleString()}`
  if (unit === "%") return `${Math.round(v)}%`
  if (unit === "×") return `${(v).toFixed(1)}×`
  if (unit === "mo") return `${Math.round(v)} mo`
  return `${Math.round(v)}`
}

export default function FinancialsPage() {
  const [scenario, setScenario] = useState<Scenario>("base")
  const mult = SCENARIOS[scenario].multiplier

  const maxArr = Math.max(...ARR_MONTHLY) * mult
  const chartH = 120, chartW = 560

  return (
    <>
      <Topbar
        crumbs={[{ label: "Startup" }, { label: "Financials" }]}
        meta={[{ label: "3-year model · Updated today" }]}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}><Settings size={13} /> Assumptions</button>
            <button className="btn btn--primary btn--sm" style={{ gap: 6 }}><Download size={13} /> Export XLSX</button>
          </div>
        }
      />

      <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Scenario selector */}
        <div style={{ display: "flex", gap: 8 }}>
          {(Object.entries(SCENARIOS) as [Scenario, typeof SCENARIOS[Scenario]][]).map(([key, sc]) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              style={{
                padding: "8px 20px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: scenario === key ? sc.color : "var(--mz-white)",
                border: `2px solid ${scenario === key ? sc.color : "var(--mz-border-2)"}`,
                color: scenario === key ? "white" : "var(--mz-ink-2)",
                transition: "all var(--t-fast) var(--ease-out)",
              }}
            >{sc.label}</button>
          ))}
          <div style={{ marginLeft: "auto", padding: "8px 14px", background: "var(--mz-white)", border: "1px solid var(--mz-border-2)", borderRadius: 10, fontSize: 12, color: "var(--mz-ink-3)" }}>
            Assumptions: $42K/mo burn · 2% monthly churn · 34% YoY growth
          </div>
        </div>

        {/* ARR Chart */}
        <div className="card" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>ARR Trajectory — TTM</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--mz-ink)", letterSpacing: "-0.02em" }}>
                ${Math.round(124 * mult)}K ARR
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={14} style={{ color: "var(--mz-success)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-success)" }}>+{Math.round(31 * mult)}% QoQ</span>
            </div>
          </div>

          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 30}`} preserveAspectRatio="none" style={{ height: 150 }}>
            <defs>
              <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SCENARIOS[scenario].color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={SCENARIOS[scenario].color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(pct => (
              <line key={pct} x1={0} y1={chartH * pct} x2={chartW} y2={chartH * pct} stroke="var(--mz-border-2)" strokeWidth={0.5} />
            ))}
            {/* Area + line */}
            {(() => {
              const toX = (i: number) => (i / (ARR_MONTHLY.length - 1)) * chartW
              const toY = (v: number) => chartH - ((v * mult) / maxArr) * chartH
              const poly = ARR_MONTHLY.map((v, i) => `${toX(i)},${toY(v)}`).join(" ")
              const area = `M0,${chartH} ` + ARR_MONTHLY.map((v, i) => `L${toX(i)},${toY(v)}`).join(" ") + ` L${chartW},${chartH} Z`
              return (
                <>
                  <path d={area} fill="url(#arrGrad)" />
                  <polyline points={poly} fill="none" stroke={SCENARIOS[scenario].color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={toX(ARR_MONTHLY.length - 1)} cy={toY(ARR_MONTHLY[ARR_MONTHLY.length - 1])} r="4" fill={SCENARIOS[scenario].color} />
                </>
              )
            })()}
            {/* Month labels */}
            {MONTHS.map((m, i) => (
              <text key={m} x={(i / (MONTHS.length - 1)) * chartW} y={chartH + 20} fontSize={10} fill="var(--mz-ink-4)" textAnchor="middle">{m}</text>
            ))}
          </svg>
        </div>

        {/* Financial table */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--mz-border-2)", display: "flex", alignItems: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)" }}>3-Year Projections</h3>
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--mz-ink-4)" }}>— {SCENARIOS[scenario].label}</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--mz-cloud)" }}>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Metric</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Year 1 (Now)</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Year 2</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Year 3</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "var(--mz-ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {BASE_ROWS.map((row, i) => (
                <tr key={row.metric} style={{ background: i % 2 === 0 ? "var(--mz-white)" : "var(--mz-cloud)", borderBottom: "1px solid var(--mz-border-2)" }}>
                  <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 600, color: "var(--mz-ink)" }}>{row.metric}</td>
                  <td style={{ padding: "14px 24px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-ink-2)" }}>{fmt(row.y1, row.unit, mult)}</td>
                  <td style={{ padding: "14px 24px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mz-ink-2)" }}>{fmt(row.y2, row.unit, mult)}</td>
                  <td style={{ padding: "14px 24px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--mz-ink)" }}>{fmt(row.y3, row.unit, mult)}</td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
                      {row.trend === "up"
                        ? <TrendingUp size={14} style={{ color: "var(--mz-success)" }} />
                        : <TrendingDown size={14} style={{ color: "var(--mz-danger)" }} />
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VC benchmark comparison */}
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--mz-ink)", marginBottom: 16 }}>VC Benchmark Comparison</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { label: "ARR Growth (YoY)",  yours: "401%",   median: "220%",  verdict: "above" },
              { label: "Gross Margin",       yours: `${Math.round(68 * (scenario === "bull" ? 1.05 : scenario === "bear" ? 0.9 : 1))}%`, median: "72%",   verdict: scenario === "bull" ? "above" : "below" },
              { label: "LTV:CAC",           yours: `${(3.2 * mult).toFixed(1)}×`, median: "3×",    verdict: mult >= 1 ? "above" : "below" },
              { label: "NRR",               yours: "108%",   median: "105%",  verdict: "above" },
            ].map(b => (
              <div key={b.label} style={{ padding: "16px", background: "var(--mz-cloud)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "var(--mz-ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{b.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--mz-ink)", marginBottom: 4 }}>{b.yours}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>Median: {b.median}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: b.verdict === "above" ? "var(--mz-success-50)" : "var(--mz-danger-50)", color: b.verdict === "above" ? "var(--mz-success)" : "var(--mz-danger)" }}>
                    {b.verdict === "above" ? "↑ Above" : "↓ Below"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
