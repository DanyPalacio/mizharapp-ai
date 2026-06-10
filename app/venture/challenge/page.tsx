"use client";
import { useState } from "react";
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";

// Challenge Mode evolucionado (feedback #4/#15): radar de dimensiones,
// distribución de riesgos, VC Grade, summary con métricas y cards expandibles.

const RADAR = [
  { dim: "Mercado", score: 86 }, { dim: "Producto", score: 74 },
  { dim: "Moat", score: 48 }, { dim: "Equipo", score: 80 },
  { dim: "Unit Economics", score: 78 }, { dim: "Timing", score: 82 }
];

const RISK_DIST = [
  { sev: "Crítico", n: 1, color: "#dc2626" },
  { sev: "Alto", n: 2, color: "#FF6A00" },
  { sev: "Medio", n: 3, color: "#f59e0b" },
  { sev: "Bajo", n: 4, color: "#16a34a" }
];

const CHALLENGES = [
  { sev: 92, level: "Crítico", color: "#dc2626", title: "Moat débil detectado",
    detail: "La diferenciación declarada depende de features replicables en <6 meses por incumbentes con distribución existente. Un comité de inversión preguntará: ¿qué acumulas con el tiempo que un competidor bien financiado no pueda comprar? Recomendación: articular data propietaria, efectos de red o switching costs medibles antes de salir a levantar." },
  { sev: 76, level: "Alto", color: "#FF6A00", title: "Supuestos de CAC sin validar",
    detail: "El LTV/CAC de 3.4x descansa en un CAC proyectado, no medido. Los benchmarks del sector muestran CACs 1.8–2.5x superiores en los primeros 12 meses. Recomendación: correr 90 días de adquisición pagada con presupuesto controlado y reemplazar el supuesto por dato real." },
  { sev: 71, level: "Alto", color: "#FF6A00", title: "Dependencia de un solo canal",
    detail: "El 80% del crecimiento proyectado proviene de un único canal de adquisición. Cualquier cambio de algoritmo o de costos de ese canal compromete todo el plan. Recomendación: validar un segundo canal antes del mes 6." },
  { sev: 54, level: "Medio", color: "#f59e0b", title: "Riesgo de complejidad operativa",
    detail: "El roadmap compromete 3 líneas de producto simultáneas con un equipo de 6 personas. La probabilidad de cumplir los milestones declarados con ese headcount es baja según benchmarks de ejecución seed." }
];

function grade(scores: number[]) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 85) return { g: "A", note: "Investment-ready" };
  if (avg >= 72) return { g: "B+", note: "Fundable con correcciones" };
  if (avg >= 60) return { g: "B-", note: "Requiere de-risking" };
  return { g: "C", note: "Pre-tracción" };
}

export default function ChallengeMode() {
  const [open, setOpen] = useState<number | null>(0);
  const vc = grade(RADAR.map(r => r.score));

  return (
    <main className="p-8 max-w-6xl">
      <div className="eyebrow text-ember">Challenge Mode</div>
      <h1 className="font-display font-bold text-3xl mt-1">Comité de inversión simulado</h1>
      <p className="text-ink/60 mt-2 max-w-2xl">
        Análisis adversarial del venture: contradicciones estratégicas, supuestos frágiles y
        riesgos que un VC partner levantaría en un investment committee.
      </p>

      {/* SUMMARY METRICS + VC GRADE */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        <div className="card p-6 bg-ink text-white border-ink">
          <div className="text-[11px] uppercase tracking-widest text-white/40">VC Grade</div>
          <div className="font-display font-bold text-5xl text-ember mt-1">{vc.g}</div>
          <div className="text-sm text-white/60 mt-1">{vc.note}</div>
        </div>
        {[["Riesgos detectados", "10"], ["Críticos + Altos", "3"], ["Supuestos sin validar", "4"]].map(([l, v]) => (
          <div key={l} className="card p-6">
            <div className="eyebrow">{l}</div>
            <div className="kpi-value mt-2">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* RADAR DE DIMENSIONES */}
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Radar estratégico</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR}>
                <PolarGrid stroke="#DADDE1" />
                <PolarAngleAxis dataKey="dim" fontSize={12} />
                <Radar dataKey="score" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUCIÓN DE RIESGOS */}
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Distribución de riesgos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RISK_DIST} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="sev" fontSize={13} width={70} />
                <Tooltip />
                <Bar dataKey="n" radius={[0, 8, 8, 0]} barSize={26}>
                  {RISK_DIST.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CARDS EXPANDIBLES CON SEVERITY BAR */}
      <div className="space-y-3 mt-6">
        {CHALLENGES.map((c, i) => {
          const expanded = open === i;
          return (
            <button key={i} onClick={() => setOpen(expanded ? null : i)}
              className="card w-full p-5 text-left hover:border-ember/50 transition">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0"
                  style={{ background: c.color }}>{c.level}</span>
                <span className="font-semibold flex-1">{c.title}</span>
                <span className="text-ink/40 text-sm">{expanded ? "−" : "+"}</span>
              </div>
              <div className="mt-3 h-1.5 bg-cloud rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.sev}%`, background: c.color }} />
              </div>
              {expanded && (
                <p className="mt-4 text-sm text-ink/75 leading-relaxed border-t border-line pt-4">{c.detail}</p>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
