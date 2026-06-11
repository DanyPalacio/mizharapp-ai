"use client";
import { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

// Simulations (feedback #11/#16): iconos SVG modernos por categoría, análisis
// estructurado con impacto a 3 tiempos, chart baseline vs scenario,
// cambio en unit economics y opciones estratégicas con pros/cons.

const Icon = ({ d }: { d: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

type Scenario = {
  id: string; icon: string; title: string; category: string;
  impact: { t: string; effect: string; tone: "bad" | "warn" | "good" }[];
  unitEcon: { metric: string; base: string; scenario: string; bad: boolean }[];
  baseline: number[]; scenario: number[];
  options: { name: string; pros: string; cons: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "cac", icon: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6", title: "CAC sube 60%", category: "Adquisición",
    impact: [
      { t: "0-3 meses", effect: "Burn mensual sube ~$4K; el payback pasa de 9 a 14 meses", tone: "bad" },
      { t: "3-9 meses", effect: "LTV/CAC cae de 3.4x a 2.1x — zona de alerta para inversionistas", tone: "warn" },
      { t: "9-18 meses", effect: "Si se valida segundo canal orgánico, el blended CAC se recupera a niveles fundables", tone: "good" }
    ],
    unitEcon: [
      { metric: "CAC", base: "$45", scenario: "$72", bad: true },
      { metric: "LTV/CAC", base: "3.4x", scenario: "2.1x", bad: true },
      { metric: "Payback", base: "9 meses", scenario: "14 meses", bad: true },
      { metric: "Runway", base: "16 meses", scenario: "11 meses", bad: true }
    ],
    baseline: [100, 112, 126, 141, 158, 177, 198, 222, 249, 279, 312, 350],
    scenario: [100, 106, 113, 120, 128, 136, 145, 158, 174, 193, 216, 243],
    options: [
      { name: "Activar canal orgánico (SEO programático)", pros: "CAC marginal cercano a cero, compounding", cons: "6+ meses para tracción; requiere contenido constante" },
      { name: "Subir pricing 25% al segmento de mayor fit", pros: "Recupera el LTV/CAC sin tocar adquisición", cons: "Riesgo de churn en cohortes sensibles a precio" },
      { name: "Reducir burn (congelar hires)", pros: "Extiende runway de 11 a 15 meses", cons: "Sacrifica velocidad de producto frente a competidores" }
    ]
  },
  {
    id: "pivot", icon: "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z", title: "Pivot a B2B", category: "Estrategia",
    impact: [
      { t: "0-3 meses", effect: "Revenue cae ~30% mientras se reconstruye el pipeline de ventas", tone: "bad" },
      { t: "3-9 meses", effect: "Ticket promedio sube 8-12x; ciclos de venta de 45-90 días", tone: "warn" },
      { t: "9-18 meses", effect: "Churn estructuralmente menor (B2B <2% mensual) y revenue más predecible", tone: "good" }
    ],
    unitEcon: [
      { metric: "Ticket promedio", base: "$12/mes", scenario: "$120/mes", bad: false },
      { metric: "Ciclo de venta", base: "1 día", scenario: "60 días", bad: true },
      { metric: "Churn mensual", base: "6%", scenario: "1.8%", bad: false },
      { metric: "NRR proyectado", base: "92%", scenario: "112%", bad: false }
    ],
    baseline: [100, 112, 126, 141, 158, 177, 198, 222, 249, 279, 312, 350],
    scenario: [100, 78, 72, 80, 95, 118, 148, 186, 234, 295, 372, 470],
    options: [
      { name: "Pivot completo a B2B", pros: "Economics superiores, NRR >100%", cons: "Valle de revenue de 6 meses; requiere skill de ventas" },
      { name: "Híbrido PLG + sales-assist", pros: "Mantiene el motor self-serve mientras crece B2B", cons: "Foco dividido, dos motiones de venta simultáneas" },
      { name: "Mantener B2C y optimizar retención", pros: "Sin valle de revenue", cons: "El churn de 6% limita el techo de crecimiento" }
    ]
  },
  {
    id: "nofunding", icon: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z", title: "Fundraising falla", category: "Capital",
    impact: [
      { t: "0-3 meses", effect: "Modo supervivencia: recorte de burn a esenciales (-40%)", tone: "bad" },
      { t: "3-9 meses", effect: "Foco total en revenue: el breakeven se vuelve el único milestone", tone: "warn" },
      { t: "9-18 meses", effect: "Si se alcanza default-alive, la posición negociadora ante VCs mejora radicalmente", tone: "good" }
    ],
    unitEcon: [
      { metric: "Burn mensual", base: "$26K", scenario: "$15.5K", bad: false },
      { metric: "Runway", base: "11 meses", scenario: "19 meses", bad: false },
      { metric: "Hires planeados", base: "4", scenario: "0", bad: true },
      { metric: "Breakeven", base: "M18", scenario: "M14", bad: false }
    ],
    baseline: [100, 112, 126, 141, 158, 177, 198, 222, 249, 279, 312, 350],
    scenario: [100, 104, 109, 115, 122, 130, 139, 149, 160, 172, 185, 199],
    options: [
      { name: "Default-alive (recorte agresivo)", pros: "Sobrevives sin capital externo; control total", cons: "Crecimiento lento; riesgo de perder ventana de mercado" },
      { name: "Revenue-based financing", pros: "Capital sin dilución con MRR estable", cons: "Presión de caja mensual del 5-8% del revenue" },
      { name: "Ronda puente con ángeles", pros: "6-9 meses extra de runway rápido", cons: "Valuación castigada; señal mixta al mercado" }
    ]
  }
];

const toneColor = { bad: "#dc2626", warn: "#FF6A00", good: "#16a34a" };

export default function Simulations() {
  const [active, setActive] = useState(SCENARIOS[0]);
  const chartData = active.baseline.map((b, i) => ({ mes: `M${i + 1}`, baseline: b, escenario: active.scenario[i] }));

  return (
    <main className="p-8 max-w-6xl">
      <div className="eyebrow">Simulations</div>
      <h1 className="font-display font-bold text-3xl mt-1">Motor "What If"</h1>
      <p className="text-ink/60 mt-2 max-w-2xl text-sm">
        Simula decisiones estratégicas y mira el impacto en revenue, unit economics y runway
        en tres horizontes de tiempo. En producción cada escenario se computa con los datos del venture.
      </p>

      {/* SELECTOR CON ICONOS SVG */}
      <div className="grid sm:grid-cols-3 gap-3 mt-7">
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => setActive(s)}
            className={`card p-5 text-left transition flex gap-4 items-start
              ${active.id === s.id ? "border-ember ring-1 ring-ember/30" : "hover:border-ember/50"}`}>
            <span className={`p-2.5 rounded-xl ${active.id === s.id ? "bg-ember text-white" : "bg-cloud text-ink"}`}>
              <Icon d={s.icon} />
            </span>
            <span>
              <span className="eyebrow block">{s.category}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </span>
          </button>
        ))}
      </div>

      {/* IMPACTO EN 3 TIEMPOS */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {active.impact.map(i => (
          <div key={i.t} className="card p-5 border-t-4" style={{ borderTopColor: toneColor[i.tone] }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: toneColor[i.tone] }}>{i.t}</div>
            <p className="text-sm text-ink/75 mt-2 leading-relaxed">{i.effect}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* BASELINE VS SCENARIO */}
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Revenue indexado — baseline vs escenario (12 meses)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                <XAxis dataKey="mes" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
                <Area dataKey="baseline" stroke="#1A1F24" fill="#1A1F24" fillOpacity={0.07} strokeWidth={2} strokeDasharray="5 4" />
                <Area dataKey="escenario" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.16} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UNIT ECONOMICS CHANGE */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Cambio en unit economics</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink text-white">
                <th className="text-left px-4 py-2.5 rounded-l-lg">Métrica</th>
                <th className="text-right px-4 py-2.5">Base</th>
                <th className="text-right px-4 py-2.5 rounded-r-lg">Escenario</th>
              </tr>
            </thead>
            <tbody>
              {active.unitEcon.map((u, i) => (
                <tr key={u.metric} className={i % 2 ? "bg-cloud" : ""}>
                  <td className="px-4 py-3 font-medium">{u.metric}</td>
                  <td className="px-4 py-3 text-right text-ink/60">{u.base}</td>
                  <td className={`px-4 py-3 text-right font-bold ${u.bad ? "text-red-600" : "text-green-600"}`}>
                    {u.scenario} {u.bad ? "▼" : "▲"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPCIONES ESTRATÉGICAS */}
      <h3 className="font-display font-bold text-xl mt-8 mb-4">Opciones estratégicas</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {active.options.map((o, i) => (
          <div key={o.name} className="card p-5 flex flex-col">
            <span className="w-7 h-7 rounded-full bg-ember text-white font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
            <h4 className="font-semibold text-sm mt-3">{o.name}</h4>
            <div className="mt-3 space-y-2 text-xs flex-1">
              <p><b className="text-green-700">Pros:</b> <span className="text-ink/70">{o.pros}</span></p>
              <p><b className="text-red-600">Contras:</b> <span className="text-ink/70">{o.cons}</span></p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
