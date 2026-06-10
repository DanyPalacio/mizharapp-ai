"use client";
import { useState } from "react";

// Cada card de score lleva su rationale: por qué obtuvo ese puntaje (feedback #3/#22)
type ScoreCard = { dimension: string; score: number; weight: number; rationale: string };

const DEMO: ScoreCard[] = [
  { dimension: "Venture Score", score: 78, weight: 100, rationale: "Promedio ponderado de las 6 dimensiones. Fortaleza en oportunidad de mercado y unit economics; penalizado por riesgo competitivo y dependencia de un solo canal de adquisición." },
  { dimension: "Market Opportunity", score: 86, weight: 25, rationale: "TAM estimado superior a $1B con CAGR de doble dígito en la categoría. El timing es favorable: la adopción del problema que resuelves está en fase de aceleración, no de saturación." },
  { dimension: "Strategic Risk", score: 62, weight: 20, rationale: "Riesgo medio-alto: el moat declarado es débil frente a incumbentes con distribución existente. Mitigable con velocidad de ejecución y data propietaria acumulada." },
  { dimension: "Unit Economics", score: 81, weight: 20, rationale: "LTV/CAC proyectado >3x con payback inferior a 12 meses según tus supuestos del interview. Validar CAC real en los primeros 90 días: hoy es el supuesto más frágil del modelo." },
  { dimension: "Fundraising Readiness", score: 71, weight: 15, rationale: "Narrativa y tracción inicial suficientes para pre-seed/seed regional. Falta: métricas de retención de 3+ meses y un pipeline de inversores activo. El deck aún no comunica el moat." },
  { dimension: "Founder Readiness", score: 84, weight: 20, rationale: "Experiencia de dominio fuerte y track record de ejecución. Gap identificado: ningún cofundador técnico full-time, lo que los VCs leerán como riesgo de velocidad de producto." }
];

function ScoreRing({ value }: { value: number }) {
  const color = value >= 75 ? "#16a34a" : value >= 55 ? "#FF6A00" : "#dc2626";
  const c = 2 * Math.PI * 28;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="28" fill="none" stroke="#DADDE1" strokeWidth="6" />
      <circle cx="36" cy="36" r="28" fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${(value / 100) * c} ${c}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <text x="36" y="41" textAnchor="middle" className="font-display" fontSize="17" fontWeight="700" fill="#1A1F24">
        {value}
      </text>
    </svg>
  );
}

export default function Overview() {
  const [open, setOpen] = useState<string | null>("Venture Score");

  return (
    <main className="p-8 max-w-6xl">
      <div className="eyebrow">Overview</div>
      <h1 className="font-display font-bold text-3xl mt-1">Inteligencia ejecutiva del venture</h1>
      <p className="text-ink/60 mt-2 max-w-2xl">
        Haz clic en cualquier card para ver <strong>por qué</strong> obtuvo ese score: cada
        puntaje incluye el razonamiento del análisis y su peso en el Venture Score global.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {DEMO.map(s => {
          const expanded = open === s.dimension;
          return (
            <button key={s.dimension} onClick={() => setOpen(expanded ? null : s.dimension)}
              className={`card p-5 text-left transition ${expanded ? "border-ember ring-1 ring-ember/30" : "hover:border-ember/50"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{s.dimension}</div>
                  <div className="text-xs text-ink/45 mt-0.5">Peso {s.weight}%</div>
                </div>
                <ScoreRing value={s.score} />
              </div>
              {expanded && (
                <div className="mt-4 pt-4 border-t border-line text-sm text-ink/75 leading-relaxed">
                  <span className="eyebrow block mb-1.5 text-ember">¿Por qué este score?</span>
                  {s.rationale}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
