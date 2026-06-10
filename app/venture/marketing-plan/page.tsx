"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

// Marketing Plan (feedback #6/#14): 6 tabs funcionales — Overview, Segmentación,
// Canales, Budget/ROI, Briefs de Campaña, KPIs/Timeline. Cifras editables para simulación.

const TABS = ["Overview", "Segmentación", "Canales", "Budget & ROI", "Briefs de Campaña", "KPIs & Timeline"] as const;
const C = ["#FF6A00", "#1A1F24", "#3D6DFF", "#8A2EFF", "#16a34a", "#f59e0b"];

const SEGMENTS = [
  { name: "PYMEs digitalizadas LATAM", size: "120K empresas", fit: 92, pain: "Reportería manual y costosa", icp: "CEO/CMO, 10-50 empleados, $500K-$5M revenue" },
  { name: "Agencias de marketing", size: "18K agencias", fit: 84, pain: "Entregables visuales lentos para clientes", icp: "Founder/Director, 5-30 empleados" },
  { name: "Consultores independientes", size: "45K profesionales", fit: 71, pain: "Sin equipo de diseño ni data", icp: "Solo-consultant, ticket alto, marca personal" },
  { name: "Corporativos (innovación)", size: "2.4K empresas", fit: 58, pain: "Ciclos de compra largos", icp: "Gerente de innovación / BI" }
];

const BRIEFS = [
  { name: "Lanzamiento LinkedIn Thought-Leadership", channel: "LinkedIn Orgánico + Ads", objective: "Awareness y captura de demanda en PYMEs", audience: "CEOs y CMOs LATAM, 28-55, interés en IA aplicada", message: "Deja de pagar $2,000 por un reporte: pregúntale a tus datos", offer: "Dashboard gratis con tu primer archivo", kpi: "CPL < $8 USD · 500 leads / 90 días", budget: 240000 },
  { name: "Performance Google Search", channel: "Google Ads (Search)", objective: "Captura de intención: 'dashboard generator', 'reporte de ventas IA'", audience: "Búsquedas transaccionales ES/EN en LATAM + USA hispano", message: "Tu dashboard ejecutivo en 60 segundos", offer: "Free plan: 1 dashboard/día", kpi: "CAC < $45 · conversión free→pro 8%", budget: 300000 },
  { name: "Email Nurture B2B", channel: "Email (5 secuencias)", objective: "Convertir free users a Pro", audience: "Usuarios free con 3+ dashboards generados", message: "Tus dashboards sin watermark + PDF export", offer: "20% off primer trimestre Pro", kpi: "Open 42% · upgrade rate 12%", budget: 120000 }
];

const TACTICS = [
  { t: "SEO programático (dashboards públicos)", ch: "Orgánico", obj: "Tráfico compuesto vía URLs indexables", kpi: "10K visitas/mes en mes 6" },
  { t: "LinkedIn Ads — Lead Gen Forms", ch: "Paid Social", obj: "Leads calificados PYME", kpi: "CPL < $8" },
  { t: "Google Search — alta intención", ch: "Paid Search", obj: "Conversión directa a registro", kpi: "CAC < $45" },
  { t: "Webinars con casos reales", ch: "Eventos", obj: "Educación + confianza", kpi: "200 asistentes/mes" },
  { t: "Email nurture free→pro", ch: "Email", obj: "Monetización de base", kpi: "Upgrade 12%" }
];

export default function MarketingPlan() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  // Budget editable (simulación en vivo)
  const [budget, setBudget] = useState([
    { ch: "LinkedIn Ads", monthly: 80000, roi: 3.2 },
    { ch: "Google Search", monthly: 100000, roi: 4.1 },
    { ch: "Email Marketing", monthly: 40000, roi: 6.8 },
    { ch: "Contenido & SEO", monthly: 60000, roi: 5.2 },
    { ch: "Webinars & Eventos", monthly: 40000, roi: 2.7 }
  ]);
  const [cac, setCac] = useState(45);
  const [ticket, setTicket] = useState(120);

  const totalBudget = useMemo(() => budget.reduce((a, b) => a + b.monthly, 0), [budget]);
  const projectedRevenue = useMemo(
    () => budget.reduce((a, b) => a + b.monthly * b.roi, 0), [budget]);
  const leads = useMemo(() => Math.round(totalBudget / Math.max(cac, 1)), [totalBudget, cac]);

  const monthlyProjection = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const ramp = Math.min(1, 0.25 + i * 0.07);
      return {
        mes: `M${i + 1}`,
        inversión: Math.round(totalBudget / 1000),
        revenue: Math.round((projectedRevenue * ramp) / 1000)
      };
    });
  }, [totalBudget, projectedRevenue]);

  function editBudget(i: number, field: "monthly" | "roi", val: string) {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setBudget(prev => prev.map((b, bi) => (bi === i ? { ...b, [field]: n } : b)));
  }

  const funnel = [
    { stage: "Awareness", n: leads * 18 }, { stage: "Interés", n: leads * 5 },
    { stage: "Consideración", n: Math.round(leads * 1.6) }, { stage: "Leads", n: leads },
    { stage: "Clientes", n: Math.round(leads * 0.08) }
  ];

  return (
    <main className="p-8 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow">Marketing Plan</div>
          <h1 className="font-display font-bold text-3xl mt-1">Go-to-Market completo</h1>
        </div>
        <button onClick={() => window.print()} className="btn-ember text-sm no-print">Export PDF</button>
      </div>

      {/* TABS FUNCIONALES */}
      <div className="flex gap-1 mt-6 border-b border-line overflow-x-auto no-print">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition
              ${tab === t ? "border-ember text-ember" : "border-transparent text-ink/55 hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {tab === "Overview" && (
        <div className="mt-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              ["Budget mensual", `$${(totalBudget / 1000).toFixed(0)}K`],
              ["CAC objetivo", `$${cac}`],
              ["Leads/mes", leads.toLocaleString()],
              ["Revenue proyectado", `$${(projectedRevenue / 1000).toFixed(0)}K/mes`]
            ].map(([l, v]) => (
              <div key={l} className="card p-5">
                <div className="eyebrow">{l}</div>
                <div className="kpi-value mt-1 text-3xl">{v}</div>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Funnel de adquisición</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="stage" width={110} fontSize={13} />
                  <Tooltip />
                  <Bar dataKey="n" radius={[0, 8, 8, 0]} barSize={26}>
                    {funnel.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Tácticas clave</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="text-left px-4 py-2.5 rounded-l-lg">Táctica</th>
                  <th className="text-left px-4 py-2.5">Canal</th>
                  <th className="text-left px-4 py-2.5">Objetivo</th>
                  <th className="text-left px-4 py-2.5 rounded-r-lg">KPI</th>
                </tr>
              </thead>
              <tbody>
                {TACTICS.map((t, i) => (
                  <tr key={t.t} className={i % 2 ? "bg-cloud" : ""}>
                    <td className="px-4 py-3 font-medium">{t.t}</td>
                    <td className="px-4 py-3"><span className="bg-ember/10 text-ember text-xs font-semibold px-2.5 py-1 rounded-full">{t.ch}</span></td>
                    <td className="px-4 py-3 text-ink/70">{t.obj}</td>
                    <td className="px-4 py-3 font-semibold">{t.kpi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: SEGMENTACIÓN */}
      {tab === "Segmentación" && (
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {SEGMENTS.map(s => (
            <div key={s.name} className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{s.name}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0
                  ${s.fit >= 80 ? "bg-green-100 text-green-700" : s.fit >= 65 ? "bg-ember/10 text-ember" : "bg-cloud text-ink/50"}`}>
                  Fit {s.fit}%
                </span>
              </div>
              <div className="mt-3 h-1.5 bg-cloud rounded-full overflow-hidden">
                <div className="h-full bg-ember rounded-full" style={{ width: `${s.fit}%` }} />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="eyebrow inline">Tamaño · </dt><dd className="inline font-medium">{s.size}</dd></div>
                <div><dt className="eyebrow inline">Dolor · </dt><dd className="inline text-ink/70">{s.pain}</dd></div>
                <div><dt className="eyebrow inline">ICP · </dt><dd className="inline text-ink/70">{s.icp}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      )}

      {/* TAB: CANALES */}
      {tab === "Canales" && (
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Distribución de inversión</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budget} dataKey="monthly" nameKey="ch" innerRadius={62} outerRadius={100} paddingAngle={2}>
                    {budget.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">ROI por canal</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budget}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                  <XAxis dataKey="ch" fontSize={11} interval={0} angle={-12} height={50} />
                  <YAxis fontSize={12} /><Tooltip />
                  <Bar dataKey="roi" fill="#FF6A00" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BUDGET & ROI (EDITABLE) */}
      {tab === "Budget & ROI" && (
        <div className="mt-6 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Budget editable por canal (COP/mes)</h3>
              <span className="text-xs bg-ember/10 text-ember font-semibold px-3 py-1.5 rounded-full">✎ Edita para simular</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="text-left px-4 py-2.5 rounded-l-lg">Canal</th>
                  <th className="text-right px-4 py-2.5">Mensual (COP miles)</th>
                  <th className="text-right px-4 py-2.5">ROI esperado (x)</th>
                  <th className="text-right px-4 py-2.5 rounded-r-lg">Retorno (COP miles)</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((b, i) => (
                  <tr key={b.ch} className={i % 2 ? "bg-cloud" : ""}>
                    <td className="px-4 py-2.5 font-medium">{b.ch}</td>
                    <td className="px-2 py-1.5 text-right">
                      <input defaultValue={b.monthly} onBlur={e => editBudget(i, "monthly", e.target.value)}
                        className="w-24 text-right bg-transparent rounded-md px-2 py-1.5 outline-none focus:bg-cloud focus:ring-2 focus:ring-ember/40" />
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <input defaultValue={b.roi} onBlur={e => editBudget(i, "roi", e.target.value)}
                        className="w-16 text-right bg-transparent rounded-md px-2 py-1.5 outline-none focus:bg-cloud focus:ring-2 focus:ring-ember/40" />
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-ember">
                      {Math.round(b.monthly * b.roi).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink">
                  <td className="px-4 py-3 font-bold">Total</td>
                  <td className="px-4 py-3 text-right font-bold">{totalBudget.toLocaleString()}</td>
                  <td />
                  <td className="px-4 py-3 text-right font-bold text-ember">{Math.round(projectedRevenue).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div className="grid grid-cols-2 gap-4 mt-5 max-w-md">
              <label className="text-sm">
                <span className="eyebrow block mb-1">CAC simulado (USD)</span>
                <input defaultValue={cac} onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setCac(n); }}
                  className="w-full border border-line rounded-lg px-3 py-2" />
              </label>
              <label className="text-sm">
                <span className="eyebrow block mb-1">Ticket mensual (USD)</span>
                <input defaultValue={ticket} onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setTicket(n); }}
                  className="w-full border border-line rounded-lg px-3 py-2" />
              </label>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Proyección 12 meses: inversión vs revenue (miles)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                  <XAxis dataKey="mes" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
                  <Area dataKey="inversión" stroke="#1A1F24" fill="#1A1F24" fillOpacity={0.08} strokeWidth={2} />
                  <Area dataKey="revenue" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.15} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BRIEFS DE CAMPAÑA */}
      {tab === "Briefs de Campaña" && (
        <div className="mt-6 space-y-5">
          {BRIEFS.map((b, i) => (
            <div key={b.name} className="card p-7 border-l-4" style={{ borderLeftColor: C[i % C.length] }}>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: C[i % C.length] }}>
                    Brief #{i + 1} · {b.channel}
                  </div>
                  <h3 className="font-display font-bold text-xl mt-1">{b.name}</h3>
                </div>
                <div className="text-right">
                  <div className="eyebrow">Budget 90 días</div>
                  <div className="font-display font-bold text-xl text-ember">${(b.budget / 1000).toFixed(0)}K</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mt-5 text-sm">
                {[["Objetivo", b.objective], ["Audiencia", b.audience], ["Mensaje central", b.message], ["Oferta", b.offer]].map(([l, v]) => (
                  <div key={l}>
                    <div className="eyebrow">{l}</div>
                    <p className="mt-1 text-ink/80">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-cloud rounded-xl px-4 py-3 text-sm font-semibold">🎯 KPI: {b.kpi}</div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: KPIs & TIMELINE */}
      {tab === "KPIs & Timeline" && (
        <div className="mt-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[["CPL objetivo", "< $8"], ["CAC blended", `$${cac}`], ["Free → Pro", "8-12%"], ["LTV/CAC", `${(ticket * 14 / Math.max(cac, 1)).toFixed(1)}x`]].map(([l, v]) => (
              <div key={l} className="card p-5">
                <div className="eyebrow">{l}</div>
                <div className="kpi-value mt-1 text-3xl">{v}</div>
              </div>
            ))}
          </div>
          <div className="card p-7">
            <h3 className="font-semibold mb-6">Roadmap de ejecución</h3>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-line" />
              {[
                ["Mes 1-2", "Setup de tracking, landing pages por segmento, primeras campañas search"],
                ["Mes 3-4", "Escalar LinkedIn Ads, lanzar secuencias de nurture, primer webinar"],
                ["Mes 5-6", "SEO programático activo, optimización CAC, casos de éxito publicados"],
                ["Mes 7-12", "Escalar canales ganadores, expansión USA hispano, partnerships"]
              ].map(([q, label]) => (
                <div key={q} className="relative pb-6 last:pb-0">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-ember border-4 border-white shadow" />
                  <div className="text-xs font-bold text-ember uppercase tracking-widest">{q}</div>
                  <div className="font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
