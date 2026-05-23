"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Check, Brain, Lightbulb } from "lucide-react"

type QuestionType = "choice" | "multiselect" | "slider" | "text"

interface Choice {
  key: string
  label: string
  sub?: string
}

interface Question {
  id: number
  category: string
  question: string
  type: QuestionType
  choices?: Choice[]
  sliderMin?: number
  sliderMax?: number
  sliderUnit?: string
  sliderLabels?: [string, string]
  placeholder?: string
  memoryKey: string
  memoryLabel: string
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Business Model",
    question: "How does your startup primarily generate revenue?",
    type: "choice",
    choices: [
      { key: "A", label: "SaaS / Subscription", sub: "Monthly or annual recurring revenue" },
      { key: "B", label: "Marketplace / Transaction", sub: "Take rate on GMV or volume" },
      { key: "C", label: "Product / E-commerce", sub: "One-time or repeat purchases" },
      { key: "D", label: "Services / Consulting", sub: "Time-based or project billing" },
      { key: "E", label: "Advertising / Data", sub: "Monetize audience or insights" },
      { key: "F", label: "Other / Hybrid", sub: "Multiple streams or unlisted model" },
    ],
    memoryKey: "businessModel",
    memoryLabel: "Business model",
  },
  {
    id: 2,
    category: "Target Market",
    question: "Who is your primary customer?",
    type: "choice",
    choices: [
      { key: "A", label: "Enterprise (1000+ employees)", sub: "Large organizations, long sales cycles" },
      { key: "B", label: "Mid-market (100–1000)", sub: "Growth-stage companies" },
      { key: "C", label: "SMB (1–100 employees)", sub: "Small businesses and teams" },
      { key: "D", label: "Consumer / Individual", sub: "Direct-to-consumer" },
      { key: "E", label: "Developer / Technical", sub: "API-first, PLG motion" },
      { key: "F", label: "Government / Nonprofit", sub: "Public sector or mission-driven orgs" },
    ],
    memoryKey: "targetMarket",
    memoryLabel: "Target customer",
  },
  {
    id: 3,
    category: "Stage & Traction",
    question: "What best describes your current stage?",
    type: "choice",
    choices: [
      { key: "A", label: "Idea / Pre-product", sub: "Validating problem and solution" },
      { key: "B", label: "MVP / Beta", sub: "First users or pilot customers" },
      { key: "C", label: "Early Revenue", sub: "$0–$100K ARR" },
      { key: "D", label: "Growing", sub: "$100K–$1M ARR" },
      { key: "E", label: "Scaling", sub: "$1M+ ARR" },
      { key: "F", label: "Pre-IPO / Late Stage", sub: "Series B+ with significant traction" },
    ],
    memoryKey: "stage",
    memoryLabel: "Current stage",
  },
  {
    id: 4,
    category: "Competitive Landscape",
    question: "Which of these best describes your competitive position? (Select all that apply)",
    type: "multiselect",
    choices: [
      { key: "A", label: "First mover in a new category" },
      { key: "B", label: "Better / cheaper than incumbents" },
      { key: "C", label: "Niche focus within a large market" },
      { key: "D", label: "Vertical-specific solution" },
      { key: "E", label: "Network effects or data moat" },
      { key: "F", label: "Regulatory or IP advantage" },
    ],
    memoryKey: "competitive",
    memoryLabel: "Competitive position",
  },
  {
    id: 5,
    category: "Team",
    question: "How many full-time people are on your founding team?",
    type: "slider",
    sliderMin: 1,
    sliderMax: 10,
    sliderUnit: "founders",
    sliderLabels: ["Solo founder", "10+ co-founders"],
    memoryKey: "teamSize",
    memoryLabel: "Founding team size",
  },
  {
    id: 6,
    category: "Funding",
    question: "What is your current funding situation?",
    type: "choice",
    choices: [
      { key: "A", label: "Bootstrapped / Self-funded", sub: "No outside capital raised" },
      { key: "B", label: "Friends & Family", sub: "Pre-seed informal round" },
      { key: "C", label: "Pre-seed / Angel", sub: "$50K–$500K raised" },
      { key: "D", label: "Seed", sub: "$500K–$3M raised" },
      { key: "E", label: "Series A+", sub: "$3M+ institutional capital" },
      { key: "F", label: "Actively fundraising", sub: "Currently running a raise process" },
    ],
    memoryKey: "funding",
    memoryLabel: "Funding status",
  },
  {
    id: 7,
    category: "GTM Strategy",
    question: "How do you plan to acquire your first 100 customers?",
    type: "multiselect",
    choices: [
      { key: "A", label: "Outbound / Cold outreach" },
      { key: "B", label: "Content / SEO / Inbound" },
      { key: "C", label: "Paid acquisition (ads)" },
      { key: "D", label: "Product-led growth (PLG)" },
      { key: "E", label: "Partnerships / Channel" },
      { key: "F", label: "Events / Community" },
    ],
    memoryKey: "gtm",
    memoryLabel: "GTM channels",
  },
  {
    id: 8,
    category: "Unit Economics",
    question: "What is your target gross margin at scale?",
    type: "slider",
    sliderMin: 10,
    sliderMax: 95,
    sliderUnit: "%",
    sliderLabels: ["Hardware / physical (10%)", "Pure software (80–95%)"],
    memoryKey: "grossMargin",
    memoryLabel: "Target gross margin",
  },
  {
    id: 9,
    category: "Primary Risk",
    question: "What is the single biggest risk to your venture right now?",
    type: "choice",
    choices: [
      { key: "A", label: "Market timing", sub: "Too early or too late" },
      { key: "B", label: "Technical execution", sub: "Can we build it?" },
      { key: "C", label: "Competition", sub: "Someone else gets there first" },
      { key: "D", label: "Distribution", sub: "Can we reach enough customers?" },
      { key: "E", label: "Regulation", sub: "Policy or compliance headwinds" },
      { key: "F", label: "Team / talent", sub: "Finding and keeping the right people" },
    ],
    memoryKey: "primaryRisk",
    memoryLabel: "Biggest risk",
  },
  {
    id: 10,
    category: "Vision",
    question: "In one or two sentences, what is the long-term vision for your startup?",
    type: "text",
    placeholder: "We want to become the global intelligence layer for venture-backed founders, used by every serious startup before their first investor meeting...",
    memoryKey: "vision",
    memoryLabel: "Long-term vision",
  },
]

type Answers = Record<string, string | string[] | number>

interface Memory {
  key: string
  label: string
  value: string
}

export default function InterviewPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [memory, setMemory] = useState<Memory[]>([])
  const [textValue, setTextValue] = useState("")
  const [sliderValue, setSliderValue] = useState(0)
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [isAdvancing, setIsAdvancing] = useState(false)

  const q = QUESTIONS[current]

  // Initialize slider value
  useEffect(() => {
    if (q.type === "slider") {
      const existing = answers[q.memoryKey]
      setSliderValue(typeof existing === "number" ? existing : q.sliderMin ?? 1)
    }
    if (q.type === "text") {
      const existing = answers[q.memoryKey]
      setTextValue(typeof existing === "string" ? existing : "")
    }
    if (q.type === "multiselect") {
      const existing = answers[q.memoryKey]
      setMultiSelected(Array.isArray(existing) ? existing : [])
    }
  }, [current, q])

  const recordAnswer = useCallback((value: string | string[] | number) => {
    setAnswers(prev => ({ ...prev, [q.memoryKey]: value }))
    const displayVal = Array.isArray(value)
      ? value.join(", ")
      : q.type === "slider"
      ? `${value}${q.sliderUnit ?? ""}`
      : String(value)
    setMemory(prev => {
      const without = prev.filter(m => m.key !== q.memoryKey)
      return [...without, { key: q.memoryKey, label: q.memoryLabel, value: displayVal }]
    })
  }, [q])

  const advance = useCallback(() => {
    if (isAdvancing) return
    if (current < QUESTIONS.length - 1) {
      setIsAdvancing(true)
      setTimeout(() => {
        setCurrent(c => c + 1)
        setIsAdvancing(false)
      }, 200)
    } else {
      router.push("/onboarding/processing")
    }
  }, [current, isAdvancing, router])

  // Keyboard shortcuts for choice/multiselect
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return
      const key = e.key.toUpperCase()

      if (q.type === "choice" && q.choices) {
        const match = q.choices.find(c => c.key === key)
        if (match) {
          recordAnswer(match.label)
          setTimeout(advance, 300)
        }
      }
      if (q.type === "multiselect" && key >= "A" && key <= "F") {
        const match = q.choices?.find(c => c.key === key)
        if (match) {
          setMultiSelected(prev =>
            prev.includes(match.label)
              ? prev.filter(v => v !== match.label)
              : [...prev, match.label]
          )
        }
      }
      if (e.key === "Enter") {
        if (q.type === "multiselect" && multiSelected.length > 0) {
          recordAnswer(multiSelected)
          advance()
        } else if (q.type === "slider") {
          recordAnswer(sliderValue)
          advance()
        } else if (q.type === "text" && textValue.trim()) {
          recordAnswer(textValue.trim())
          advance()
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [q, multiSelected, sliderValue, textValue, recordAnswer, advance])

  const canAdvance =
    q.type === "choice" ? !!answers[q.memoryKey] :
    q.type === "multiselect" ? multiSelected.length > 0 :
    q.type === "slider" ? true :
    textValue.trim().length > 10

  const progress = ((current) / QUESTIONS.length) * 100

  return (
    <div style={{ minHeight: "100vh", background: "var(--mz-cloud)", display: "grid", gridTemplateColumns: "260px 1fr 280px" }}>
      {/* LEFT — Stepper */}
      <aside style={{ background: "var(--mz-white)", borderRight: "1px solid var(--mz-border-2)", padding: "40px 24px", display: "flex", flexDirection: "column" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
          <div style={{ width: 28, height: 28, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 14 }}>M</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 15, letterSpacing: "0.04em" }}>MIZHAR</span>
        </Link>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-orange)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Step 02 — Interview</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {QUESTIONS.map((question, i) => {
            const isDone = i < current
            const isActive = i === current
            return (
              <button
                key={question.id}
                onClick={() => i <= current && setCurrent(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  background: isActive ? "var(--mz-orange-50)" : "transparent",
                  border: `1px solid ${isActive ? "var(--mz-orange-100)" : "transparent"}`,
                  cursor: i <= current ? "pointer" : "default",
                  textAlign: "left", width: "100%",
                  transition: "all var(--t-base) var(--ease-out)",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700,
                  background: isDone ? "var(--mz-success)" : isActive ? "var(--mz-orange)" : "var(--mz-cloud)",
                  color: isDone || isActive ? "white" : "var(--mz-ink-4)",
                  transition: "all var(--t-base) var(--ease-out)",
                }}>
                  {isDone ? <Check size={12} /> : question.id}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: isActive ? "var(--mz-orange)" : "var(--mz-ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{question.category}</div>
                  <div style={{ fontSize: 12, color: isActive ? "var(--mz-orange-700)" : isDone ? "var(--mz-ink-2)" : "var(--mz-ink-4)", fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {isDone && answers[question.memoryKey]
                      ? (Array.isArray(answers[question.memoryKey])
                          ? (answers[question.memoryKey] as string[]).slice(0, 2).join(", ")
                          : String(answers[question.memoryKey]).split(" ").slice(0, 4).join(" ") + (String(answers[question.memoryKey]).split(" ").length > 4 ? "…" : ""))
                      : question.question.split(" ").slice(0, 5).join(" ") + "…"
                    }
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>Progress</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--mz-ink-2)" }}>{current}/{QUESTIONS.length}</span>
          </div>
          <div style={{ height: 4, background: "var(--mz-cloud)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--mz-orange)", borderRadius: 99, transition: "width 0.4s var(--ease-out)" }} />
          </div>
        </div>
      </aside>

      {/* CENTER — Question */}
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 48px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 620, width: "100%", opacity: isAdvancing ? 0 : 1, transform: isAdvancing ? "translateY(8px)" : "translateY(0)", transition: "all 0.2s var(--ease-out)" }}>
          {/* Category + question number */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-orange)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{q.category}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--mz-border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mz-ink-4)", letterSpacing: "0.08em" }}>{current + 1} of {QUESTIONS.length}</span>
          </div>

          {/* Question */}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--mz-ink)", marginBottom: 36 }}>
            {q.question}
          </h2>

          {/* Answer input */}
          {q.type === "choice" && q.choices && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.choices.map(choice => {
                const isSelected = answers[q.memoryKey] === choice.label
                return (
                  <button
                    key={choice.key}
                    onClick={() => { recordAnswer(choice.label); setTimeout(advance, 300) }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 12, textAlign: "left",
                      border: `2px solid ${isSelected ? "var(--mz-orange)" : "var(--mz-border-2)"}`,
                      background: isSelected ? "var(--mz-orange-50)" : "var(--mz-white)",
                      cursor: "pointer",
                      transition: "all var(--t-fast) var(--ease-out)",
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                      border: `1.5px solid ${isSelected ? "var(--mz-orange)" : "var(--mz-border)"}`,
                      background: isSelected ? "var(--mz-orange)" : "var(--mz-cloud)",
                      display: "grid", placeItems: "center",
                      fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                      color: isSelected ? "white" : "var(--mz-ink-3)",
                      transition: "all var(--t-fast) var(--ease-out)",
                    }}>{choice.key}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: isSelected ? "var(--mz-orange-700)" : "var(--mz-ink)" }}>{choice.label}</div>
                      {choice.sub && <div style={{ fontSize: 12, color: isSelected ? "var(--mz-orange)" : "var(--mz-ink-4)", marginTop: 2 }}>{choice.sub}</div>}
                    </div>
                    {isSelected && <Check size={16} style={{ color: "var(--mz-orange)", flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          )}

          {q.type === "multiselect" && q.choices && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {q.choices.map(choice => {
                  const isSelected = multiSelected.includes(choice.label)
                  return (
                    <button
                      key={choice.key}
                      onClick={() => setMultiSelected(prev =>
                        prev.includes(choice.label)
                          ? prev.filter(v => v !== choice.label)
                          : [...prev, choice.label]
                      )}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 18px", borderRadius: 12, textAlign: "left",
                        border: `2px solid ${isSelected ? "var(--mz-orange)" : "var(--mz-border-2)"}`,
                        background: isSelected ? "var(--mz-orange-50)" : "var(--mz-white)",
                        cursor: "pointer",
                        transition: "all var(--t-fast) var(--ease-out)",
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                        border: `1.5px solid ${isSelected ? "var(--mz-orange)" : "var(--mz-border)"}`,
                        background: isSelected ? "var(--mz-orange)" : "var(--mz-cloud)",
                        display: "grid", placeItems: "center",
                        fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                        color: isSelected ? "white" : "var(--mz-ink-3)",
                        transition: "all var(--t-fast) var(--ease-out)",
                      }}>{isSelected ? <Check size={12} /> : choice.key}</span>
                      <span style={{ fontWeight: 600, fontSize: 15, color: isSelected ? "var(--mz-orange-700)" : "var(--mz-ink)" }}>{choice.label}</span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => { if (multiSelected.length > 0) { recordAnswer(multiSelected); advance() } }}
                disabled={multiSelected.length === 0}
                className="btn btn--primary"
                style={{ gap: 8, opacity: multiSelected.length === 0 ? 0.4 : 1 }}
              >
                Continue <ArrowRight size={16} />
              </button>
              <span style={{ marginLeft: 12, fontSize: 12, color: "var(--mz-ink-4)" }}>or press <kbd style={{ fontFamily: "var(--font-mono)", background: "var(--mz-cloud)", padding: "1px 5px", borderRadius: 4, border: "1px solid var(--mz-border)" }}>Enter</kbd></span>
            </div>
          )}

          {q.type === "slider" && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 56, color: "var(--mz-orange)", letterSpacing: "-0.03em" }}>{sliderValue}</span>
                  <span style={{ fontSize: 18, color: "var(--mz-ink-3)", marginLeft: 6 }}>{q.sliderUnit}</span>
                </div>
                <input
                  type="range"
                  min={q.sliderMin}
                  max={q.sliderMax}
                  value={sliderValue}
                  onChange={e => setSliderValue(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--mz-orange)", height: 6, cursor: "pointer" }}
                />
                {q.sliderLabels && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>{q.sliderLabels[0]}</span>
                    <span style={{ fontSize: 11, color: "var(--mz-ink-4)" }}>{q.sliderLabels[1]}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => { recordAnswer(sliderValue); advance() }}
                className="btn btn--primary"
                style={{ gap: 8 }}
              >
                Continue <ArrowRight size={16} />
              </button>
              <span style={{ marginLeft: 12, fontSize: 12, color: "var(--mz-ink-4)" }}>or press <kbd style={{ fontFamily: "var(--font-mono)", background: "var(--mz-cloud)", padding: "1px 5px", borderRadius: 4, border: "1px solid var(--mz-border)" }}>Enter</kbd></span>
            </div>
          )}

          {q.type === "text" && (
            <div>
              <textarea
                className="mz-textarea"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                placeholder={q.placeholder}
                style={{ minHeight: 120, fontSize: 15, lineHeight: 1.65, marginBottom: 16 }}
                autoFocus
              />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => { if (textValue.trim().length > 10) { recordAnswer(textValue.trim()); advance() } }}
                  disabled={textValue.trim().length <= 10}
                  className="btn btn--primary"
                  style={{ gap: 8, opacity: textValue.trim().length <= 10 ? 0.4 : 1 }}
                >
                  {current === QUESTIONS.length - 1 ? "Finish Interview" : "Continue"} <ArrowRight size={16} />
                </button>
                <span style={{ fontSize: 12, color: "var(--mz-ink-4)" }}>{textValue.length} chars</span>
              </div>
            </div>
          )}

          {/* Keyboard hint */}
          {(q.type === "choice" || q.type === "multiselect") && (
            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--mz-ink-4)" }}>Press</span>
              {q.choices?.slice(0, 3).map(c => (
                <kbd key={c.key} style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: "var(--mz-cloud)", padding: "2px 6px", borderRadius: 4, border: "1px solid var(--mz-border)", color: "var(--mz-ink-3)" }}>{c.key}</kbd>
              ))}
              <span style={{ fontSize: 12, color: "var(--mz-ink-4)" }}>… to select</span>
            </div>
          )}

          {/* Prev / skip navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--mz-border-2)" }}>
            <button
              onClick={() => current > 0 && setCurrent(c => c - 1)}
              disabled={current === 0}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: current === 0 ? "var(--mz-ink-4)" : "var(--mz-ink-2)", background: "none", border: "none", cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            {!canAdvance && current < QUESTIONS.length - 1 && (
              <button
                onClick={advance}
                style={{ fontSize: 13, color: "var(--mz-ink-3)", background: "none", border: "none", cursor: "pointer" }}
              >
                Skip for now →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT — Memory panel */}
      <aside style={{ background: "var(--mz-white)", borderLeft: "1px solid var(--mz-border-2)", padding: "40px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Brain size={16} style={{ color: "var(--mz-orange)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--mz-ink)" }}>Mizhar Memory</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--mz-ink-4)", marginBottom: 20, lineHeight: 1.5 }}>
          What Mizhar has learned about your venture so far.
        </p>

        {memory.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: 0.5 }}>
            <Lightbulb size={28} style={{ color: "var(--mz-ink-4)" }} />
            <span style={{ fontSize: 12, color: "var(--mz-ink-4)", textAlign: "center", lineHeight: 1.5 }}>Answer questions to build your venture profile</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {memory.map(m => (
              <div key={m.key} style={{ padding: "12px 14px", background: "var(--mz-cloud)", borderRadius: 10, border: "1px solid var(--mz-border-2)" }}>
                <div style={{ fontSize: 10, color: "var(--mz-ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mz-ink)", lineHeight: 1.4 }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {memory.length > 0 && (
          <div style={{ marginTop: 20, padding: "12px 14px", background: "var(--mz-orange-50)", borderRadius: 10, border: "1px solid var(--mz-orange-100)" }}>
            <div style={{ fontSize: 11, color: "var(--mz-orange-700)", fontWeight: 600, marginBottom: 4 }}>Confidence building…</div>
            <div style={{ height: 4, background: "var(--mz-orange-100)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(memory.length / QUESTIONS.length) * 100}%`, background: "var(--mz-orange)", borderRadius: 99, transition: "width 0.4s var(--ease-out)" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--mz-ink-3)", marginTop: 6 }}>{memory.length} of {QUESTIONS.length} signals captured</div>
          </div>
        )}
      </aside>
    </div>
  )
}
