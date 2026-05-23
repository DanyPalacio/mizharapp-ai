"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

const PIPELINE_STEPS = [
  { id: 1, label: "Parsing your documents and context",        duration: 1800 },
  { id: 2, label: "Indexing industry knowledge base",          duration: 2200 },
  { id: 3, label: "Mapping competitive landscape",             duration: 1600 },
  { id: 4, label: "Retrieving market benchmarks (FRED + CB)",  duration: 2000 },
  { id: 5, label: "Calibrating unit economics model",          duration: 1400 },
  { id: 6, label: "Running Monte Carlo simulations",           duration: 2400 },
  { id: 7, label: "Stress-testing strategic assumptions",      duration: 1800 },
  { id: 8, label: "Generating venture intelligence report",    duration: 2600 },
]

const FRAMEWORK_CHIPS = [
  "Porter's Five Forces", "TAM / SAM / SOM", "Unit Economics",
  "SWOT Analysis", "Burn Rate", "LTV:CAC", "Rule of 40",
  "Beachhead Market", "Network Effects", "Moat Analysis",
  "Go-to-Market", "Cohort Analysis", "NRR / GRR",
]

export default function ProcessingPage() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let elapsed = 0
    const totalDuration = PIPELINE_STEPS.reduce((s, step) => s + step.duration, 0)

    PIPELINE_STEPS.forEach((step, i) => {
      // Mark step as active
      setTimeout(() => {
        setStepIndex(i)
        // Activate a chip every time a step starts
        const chip = FRAMEWORK_CHIPS[i % FRAMEWORK_CHIPS.length]
        setActiveChips(prev => {
          const next = [...prev, chip]
          return next.slice(-5) // keep last 5 visible
        })
      }, elapsed)

      // Mark step as done
      elapsed += step.duration
      const elapsedAtDone = elapsed
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.id])
        setProgress(Math.round((elapsedAtDone / totalDuration) * 100))
        if (i === PIPELINE_STEPS.length - 1) {
          setTimeout(() => setDone(true), 600)
          setTimeout(() => router.push("/app/startup/overview"), 2200)
        }
      }, elapsed)
    })
  }, [router])

  const circumference = 2 * Math.PI * 56
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B0E12",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(255,106,0,.12) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(255,106,0,.06) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Floating framework chips */}
      <div style={{
        position: "absolute", top: 40, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap",
        padding: "0 80px",
        opacity: 0.7,
      }}>
        {FRAMEWORK_CHIPS.map((chip, i) => (
          <span
            key={chip}
            style={{
              padding: "4px 12px",
              borderRadius: 99,
              background: activeChips.includes(chip) ? "rgba(255,106,0,.15)" : "rgba(255,255,255,.03)",
              border: `1px solid ${activeChips.includes(chip) ? "rgba(255,106,0,.4)" : "rgba(255,255,255,.06)"}`,
              fontSize: 11,
              color: activeChips.includes(chip) ? "rgba(255,106,0,.9)" : "rgba(255,255,255,.25)",
              fontWeight: 500,
              transition: "all 0.6s ease",
              transitionDelay: `${i * 40}ms`,
              whiteSpace: "nowrap",
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <div style={{ maxWidth: 560, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 56 }}>
          <div style={{ width: 28, height: 28, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 14 }}>M</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15, letterSpacing: "0.04em", color: "white" }}>MIZHAR</span>
        </div>

        {/* Progress ring */}
        <div style={{ position: "relative", width: 136, height: 136, marginBottom: 40 }}>
          <svg width="136" height="136" viewBox="0 0 136 136" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="68" cy="68" r="56" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6" />
            <circle
              cx="68" cy="68" r="56"
              fill="none"
              stroke="var(--mz-orange)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.6s var(--ease-out)" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            {done ? (
              <CheckCircle size={36} style={{ color: "var(--mz-orange)" }} />
            ) : (
              <>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "white", letterSpacing: "-0.03em" }}>{progress}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 2 }}>%</span>
              </>
            )}
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, letterSpacing: "-0.025em", color: "white", lineHeight: 1.1, marginBottom: 12 }}>
          {done ? "Intelligence report ready." : "Building your venture intelligence."}
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", lineHeight: 1.6, marginBottom: 48, maxWidth: 400 }}>
          {done
            ? "Your strategic analysis is complete. Redirecting to your dashboard…"
            : "Mizhar is analyzing your startup across 40+ strategic dimensions using live market data."
          }
        </p>

        {/* Pipeline steps */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {PIPELINE_STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(step.id)
            const isActive = stepIndex === i && !isCompleted
            const isPending = stepIndex < i

            return (
              <div
                key={step.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", borderRadius: 10,
                  background: isActive
                    ? "rgba(255,106,0,.08)"
                    : isCompleted
                    ? "rgba(255,255,255,.03)"
                    : "transparent",
                  border: `1px solid ${isActive ? "rgba(255,106,0,.2)" : "rgba(255,255,255,.04)"}`,
                  transition: "all 0.4s ease",
                  opacity: isPending ? 0.3 : 1,
                }}
              >
                <div style={{ flexShrink: 0, width: 18, display: "flex", justifyContent: "center" }}>
                  {isCompleted ? (
                    <CheckCircle size={16} style={{ color: "var(--mz-success)" }} />
                  ) : isActive ? (
                    <Loader2 size={16} style={{ color: "var(--mz-orange)", animation: "spin 1s linear infinite" }} />
                  ) : (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
                  )}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isCompleted ? "rgba(255,255,255,.5)" : isActive ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.3)",
                  transition: "color 0.3s ease",
                  textAlign: "left",
                }}>
                  {step.label}
                </span>
                {isCompleted && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--mz-success)", fontWeight: 600, whiteSpace: "nowrap" }}>Done</span>
                )}
                {isActive && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--mz-orange)", fontWeight: 600, whiteSpace: "nowrap" }}>Running…</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Footnote */}
        <p style={{ marginTop: 32, fontSize: 11, color: "rgba(255,255,255,.2)", lineHeight: 1.6 }}>
          Analysis uses live data from FRED, Crunchbase, SEC EDGAR, and Google Trends.
          <br />All processing is encrypted end-to-end.
        </p>
      </div>
    </div>
  )
}
