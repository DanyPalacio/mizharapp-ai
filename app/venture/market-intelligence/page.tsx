"use client";
import { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from "recharts";

// Market Intelligence (feedback #8/#19): 5 sub-tabs — TAM/SAM/SOM visual,
// proyección de mercado, radar de atractivo, segmentación con fit score,
// competidores, prioridad geográfica e ICP detallado.

const TABS = ["Tamaño de Mercado", "Proyección", "Segmentación", "Competidores", "Geografía & ICP"] as const;
const C = ["#FF6A00", "#1A1F24", "#3D6DFF", "#8A2EFF", "#16a34a"];

const MARKET_PROJ = Array.from({ length: 7 }, (_, i) => ({
  año: 2024 + i,
  mercado: Math.round(48 * Math.pow(1.21, i))
}));

const RADAR = [
  { dim: "Tamaño", v: 88 }, { dim: "Crecimiento", v: 91 }, { dim: "Competencia", v: 56 },
  { dim: "Barreras de entrada", v: 62 }, { dim: "Timing", v: 85 }, { dim: "Regulación", v: 78 }
];

const SEGMENTS = [
  { s: "PYMEs digitalizadas", tam: 18.4, fit: 92 },
  { s: "Agencias & consultoras", tam: 7.2, fit: 84 },
  { s: "Mid-market corporativo", tam: 14.8, fit: 63 },
  { s: "Enterprise", tam: 21.5, fit: 41 }
];

const COMPETITORS = [
  { name: "Tableau / Power BI", type: "Incumbente BI", price: "$$$", strength: "Distribución enterprise", weakness: "Curva de aprendizaje alta, no conversacional", threat: 72 },
  { name: "Canva (charts)", type: "Design tool", price: "$", strength: "Base de usuarios masiva", weakness: "Sin inteligencia de datos real", threat: 58 },
  { name: "ChatGPT + plugins", type: "AI generalista", price: "$$", strength: "Capacidad de análisis", weakness: "Sin output visual profesional persistente", threat: 81 },
  { name: "Startups verticales", type: "Emergente", price: "$$", strength: "Velocidad", weakness: "Sin distribución ni marca", threat: 47 }
];

const GEO = [
  { region: "Colombia", priority: 1, why: "Home market: red, marca y costo de adquisición bajo" },
  { region: "México", priority: 2, why: "Mercado PYME 4x Colombia, misma lengua y dolor" },
  { region: "USA hispano", priority: 3, why: "Ticket 3x superior, 5M+ negocios hispanos" },
  { region: "Brasil", priority: 4, why: "Mayor mercado LATAM — requiere localización PT" }
];

function TamSamSom() {
  // Visual concéntrico TAM/SAM/SOM
  const rings = [
    { label: "TAM", value: "$62B", d: 320, color: "#1A1F24", note: "Business intelligence + analytics global" },
    { label: "SAM", value: "$8.4B", d: 210, color: "#3D6DFF", note: "BI self-service PYME en mercados objetivo" },
    { label: "SOM", value: "$120M", d: 110, color: "#FF6A00", note: "Capturable a 5 años (1.4% del SAM)" }
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-6 items-center">
      <div className="relative mx-auto" style={{ width: 340, height: 340 }}>
        {rings.map(r => (
          <div key={r.label}
            className="absolute rounded-full flex items-start justify-center"
            style={{
              width: r.d, height: r.d, left: (340 - r.d) / 2, top: (340 - r.d) / 2,
              background: r.color + (r.label === "SOM" ? "" : "18"),
              border: `2px solid ${r.color}`
            }}>
            <span className="text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full"
              style={{ background: r.color, color: "#fff" }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {rings.map(r => (
          <div key={r.label} className="card p-5 border-l-4" style={{ borderLeftColor: r.color }}>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-2xl" style={{ color: r.color }}>{r.value}</span>
              <span className="eyebrow">{r.label}</span>
            </div>
            <p className="text-sm text-ink/65 mt-1">{r.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketIntelligence() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tamaño de Mercado");

  return (
    <main className="p-8 max-w-6xl">
      <div className="eyebrow">Market Intelligence</div>
      <h1 className="font-display font-bold text-3xl mt-1">Inteligencia de mercado PRO</h1>
      <p className="text-ink/60 mt-2 max-w-2xl text-sm">
        En producción, estas cifras se generan vía el pipeline de IA con datos de mercado actuales
        y quedan guardadas en <code className="bg-cloud px-1.5 py-0.5 rounded">venture_documents</code>.
      </p>

      <div className="flex gap-1 mt-6 border-b border-line overflow-x-auto no-print">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition
              ${tab === t ? "border-ember text-ember" : "border-transparent text-ink/55 hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Tamaño de Mercado" && (
        <div className="mt-8 space-y-6">
          <TamSamSom />
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Radar de atractivo del mercado</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR}>
                  <PolarGrid stroke="#DADDE1" />
                  <PolarAngleAxis dataKey="dim" fontSize={12} />
                  <Radar dataKey="v" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "Proyección" && (
        <div className="mt-6 card p-6">
          <h3 className="font-semibold mb-2">Mercado direccionable 2024-2030 (USD B) · CAGR 21%</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MARKET_PROJ}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                <XAxis dataKey="año" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                <Area dataKey="mercado" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.15} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "Segmentación" && (
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-2">TAM por segmento (USD B)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SEGMENTS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                  <XAxis dataKey="s" fontSize={11} interval={0} angle={-10} height={50} />
                  <YAxis fontSize={12} /><Tooltip />
                  <Bar dataKey="tam" radius={[6, 6, 0, 0]}>
                    {SEGMENTS.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            {SEGMENTS.map((s, i) => (
              <div key={s.s} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{s.s}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${s.fit >= 80 ? "bg-green-100 text-green-700" : s.fit >= 60 ? "bg-ember/10 text-ember" : "bg-cloud text-ink/50"}`}>
                    Fit {s.fit}%
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 bg-cloud rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.fit}%`, background: C[i % C.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Competidores" && (
        <div className="mt-6 card p-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="bg-ink text-white">
                <th className="text-left px-4 py-3 rounded-l-lg">Competidor</th>
                <th className="text-left px-4 py-3">Tipo</th>
                <th className="text-left px-4 py-3">Precio</th>
                <th className="text-left px-4 py-3">Fortaleza</th>
                <th className="text-left px-4 py-3">Debilidad</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Amenaza</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c, i) => (
                <tr key={c.name} className={i % 2 ? "bg-cloud" : ""}>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3"><span className="bg-signal/10 text-signal text-xs font-semibold px-2.5 py-1 rounded-full">{c.type}</span></td>
                  <td className="px-4 py-3 font-mono">{c.price}</td>
                  <td className="px-4 py-3 text-ink/70">{c.strength}</td>
                  <td className="px-4 py-3 text-ink/70">{c.weakness}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 h-1.5 bg-line rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${c.threat}%`, background: c.threat >= 70 ? "#dc2626" : c.threat >= 55 ? "#FF6A00" : "#16a34a" }} />
                      </div>
                      <span className="font-bold w-8 text-right">{c.threat}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Geografía & ICP" && (
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Prioridad geográfica</h3>
            {GEO.map(g => (
              <div key={g.region} className="card p-5 flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-ember text-white font-display font-bold flex items-center justify-center shrink-0">
                  {g.priority}
                </span>
                <div>
                  <div className="font-semibold">{g.region}</div>
                  <p className="text-sm text-ink/65 mt-0.5">{g.why}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">ICP detallado — segmento prioritario</h3>
            <dl className="space-y-3 text-sm">
              {[
                ["Perfil", "PYME digitalizada, 10-50 empleados, $500K-$5M revenue anual"],
                ["Decisor", "CEO o CMO con presión por reportería hacia junta/inversionistas"],
                ["Dolor cuantificado", "8-15 horas/mes armando reportes manuales; $1,500-3,000/mes en analistas externos"],
                ["Disparador de compra", "Cierre de mes, ronda de inversión, reporte a casa matriz"],
                ["Presupuesto", "$50-300/mes en herramientas de productividad"],
                ["Canal de llegada", "LinkedIn, Google Search en español, referidos de agencia"]
              ].map(([l, v]) => (
                <div key={l} className="pb-3 border-b border-line/60 last:border-0">
                  <dt className="eyebrow">{l}</dt>
                  <dd className="mt-1 text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </main>
  );
}
