"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Wizard del spec: describe startup → máx 10 preguntas multiple choice estilo
// Typeform/Linear → AI processing screen → análisis real (Claude + FRED + News)
// con score por dimensión y rationale. Guarda el venture si hay sesión.

const QUESTIONS = [
  { id: "gtm", q: "¿Cuál es tu estrategia principal de distribución?", opts: ["Adquisición pagada", "Ventas enterprise", "Partnerships", "Contenido orgánico / SEO", "Community-led growth", "Marketplace / efectos de red"] },
  { id: "monetization", q: "¿Cómo monetiza la compañía?", opts: ["Suscripción", "Licenciamiento SaaS", "Comisión de marketplace", "Fee por transacción", "Publicidad", "Híbrido servicios + software"] },
  { id: "priority", q: "¿Qué optimizas en los próximos 24 meses?", opts: ["Crecimiento", "Rentabilidad", "Fundraising readiness", "Expansión geográfica", "Eficiencia operativa", "Captura de mercado"] },
  { id: "stage", q: "¿En qué etapa estás?", opts: ["Idea", "MVP sin revenue", "Primeros clientes de pago", "Product-market fit", "Escalando", "Expansión internacional"] },
  { id: "team", q: "¿Cómo es el equipo fundador?", opts: ["Solo founder técnico", "Solo founder de negocio", "Cofundadores técnico + negocio", "Equipo completo (3+)", "Con empleados clave contratados"] },
  { id: "moat", q: "¿Cuál es tu ventaja defendible principal?", opts: ["Data propietaria", "Efectos de red", "Switching costs", "Marca / distribución", "Tecnología difícil de replicar", "Aún no la tengo clara"] },
  { id: "competition", q: "¿Cómo es el panorama competitivo?", opts: ["Sin competidores directos", "Incumbentes grandes y lentos", "Startups bien financiadas", "Mercado fragmentado", "Commoditizado / guerra de precios"] },
  { id: "funding", q: "¿Cuál es tu plan de capital?", opts: ["Bootstrap total", "Levantar pre-seed/seed pronto", "Ya levanté y voy por la siguiente", "Revenue-based / deuda", "Aún no lo defino"] }
];

type Phase = "describe" | "interview" | "processing" | "results";

const PROCESSING_STEPS = [
  "Analizando arquetipo de negocio…",
  "Consultando contexto macroeconómico (FRED)…",
  "Escaneando señales del sector (News API)…",
  "Aplicando frameworks McKinsey…",
  "Simulando perspectiva de investment committee…",
  "Calculando Venture Score…"
];

export default function NewVenture() {
  const [phase, setPhase] = useState<Phase>("describe");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  function answer(opt: string) {
    const q = QUESTIONS[qIndex];
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (qIndex + 1 < QUESTIONS.length) setQIndex(qIndex + 1);
    else analyze(next);
  }

  async function analyze(finalAnswers: Record<string, string>) {
    setPhase("processing");
    const timer = setInterval(() => setStep(s => Math.min(s + 1, PROCESSING_STEPS.length - 1)), 1800);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch("/api/venture/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, industry, answers: finalAnswers, userId: user?.id ?? null })
      });
      const data = await res.json();
      if (data.analysis) { setResult(data.analysis); setPhase("results"); }
      else { setError(data.error || "Error en el análisis"); setPhase("describe"); }
    } catch {
      setError("Error de conexión"); setPhase("describe");
    } finally { clearInterval(timer); }
  }

  if (phase === "describe") return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="eyebrow">Nuevo análisis estratégico</div>
        <h1 className="font-display font-bold text-4xl mt-2">Describe tu startup</h1>
        <p className="text-ink/55 mt-2">Mizhar extrae industria, modelo, riesgos y arquetipo — luego solo te pregunta lo que no puede inferir.</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del startup"
          className="w-full border border-line rounded-xl px-4 py-3 mt-6 bg-white" />
        <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Industria (ej: SaaS B2B, fintech, ecommerce)"
          className="w-full border border-line rounded-xl px-4 py-3 mt-3 bg-white" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
          placeholder="Describe tu startup o idea de negocio: qué problema resuelve, para quién, cómo monetiza…"
          className="w-full border border-line rounded-xl px-4 py-3 mt-3 bg-white resize-none" />
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <button onClick={() => description.trim() && setPhase("interview")} className="btn-ember mt-5">
          Iniciar entrevista estratégica →
        </button>
      </div>
    </main>
  );

  if (phase === "interview") {
    const q = QUESTIONS[qIndex];
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-ember rounded-full transition-all" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-ink/45">{qIndex + 1}/{QUESTIONS.length}</span>
          </div>
          <h2 className="font-display font-bold text-3xl">{q.q}</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            {q.opts.map(o => (
              <button key={o} onClick={() => answer(o)}
                className="card p-4 text-left text-sm font-medium hover:border-ember hover:text-ember transition">
                {o}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (phase === "processing") return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-full border-4 border-line border-t-ember animate-spin" />
        <h2 className="font-display font-bold text-2xl mt-8">Computación estratégica en curso</h2>
        <div className="mt-6 space-y-2 text-left">
          {PROCESSING_STEPS.map((s, i) => (
            <div key={s} className={`flex gap-3 text-sm transition ${i <= step ? "text-ink" : "text-ink/30"}`}>
              <span className={i < step ? "text-green-600" : i === step ? "text-ember" : ""}>{i < step ? "✓" : i === step ? "◌" : "·"}</span>{s}
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  // RESULTS
  const r = result;
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="eyebrow">Análisis completo · {name || "Tu startup"}</div>
      <div className="flex items-end gap-6 mt-3 flex-wrap">
        <div>
          <div className="font-display font-bold text-6xl text-ember">{r.venture_score}<span className="text-2xl text-ink/40">/100</span></div>
          <div className="text-sm text-ink/55 mt-1">Venture Score</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-ink text-white text-xs font-bold px-3 py-1.5 rounded-full">{r.archetype}</span>
          <span className="bg-ember/10 text-ember text-xs font-bold px-3 py-1.5 rounded-full">{r.backability}</span>
        </div>
      </div>

      {r.economic_context_note && (
        <p className="mt-4 text-sm bg-signal/5 border border-signal/20 rounded-xl p-4 text-ink/75">
          📊 <b>Contexto macro (FRED):</b> {r.economic_context_note}
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {r.score_breakdown?.map((s: any) => (
          <div key={s.dimension} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{s.dimension}</span>
              <span className="font-display font-bold text-2xl" style={{ color: s.score >= 75 ? "#16a34a" : s.score >= 55 ? "#FF6A00" : "#dc2626" }}>{s.score}</span>
            </div>
            <div className="mt-2 h-1.5 bg-cloud rounded-full overflow-hidden">
              <div className="h-full bg-ember rounded-full" style={{ width: `${s.score}%` }} />
            </div>
            <p className="text-xs text-ink/65 mt-3 leading-relaxed"><b className="text-ember">¿Por qué?</b> {s.rationale}</p>
          </div>
        ))}
      </div>

      <h3 className="font-display font-bold text-xl mt-10 mb-4">⚠ Challenge Mode — objeciones del comité</h3>
      <div className="space-y-3">
        {r.challenges?.map((c: any, i: number) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: c.level === "Crítico" ? "#dc2626" : c.level === "Alto" ? "#FF6A00" : "#f59e0b" }}>{c.level}</span>
              <span className="font-semibold text-sm">{c.title}</span>
            </div>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">{c.detail}</p>
          </div>
        ))}
      </div>

      {r.strategic_rewrite && (
        <div className="mt-8 rounded-2xl p-6 bg-gradient-to-r from-[#8A2EFF]/10 to-[#3D6DFF]/10 border border-[#8A2EFF]/25">
          <div className="eyebrow text-[#8A2EFF]">✦ Strategic Rewrite — arquitectura más fuerte</div>
          <p className="mt-2 text-ink/85 leading-relaxed">{r.strategic_rewrite}</p>
        </div>
      )}

      <div className="flex gap-3 mt-10 no-print">
        <a href="/venture" className="btn-ember text-sm">Ir al dashboard del venture →</a>
        <button onClick={() => window.print()} className="border border-line bg-white rounded-xl px-5 py-3 text-sm font-semibold">Export PDF</button>
      </div>
    </main>
  );
}
