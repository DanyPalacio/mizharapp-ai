"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

// Financials (feedback #7/#20): desglose de gastos editable (salarios, marketing,
// infraestructura, expansión), escenarios base/optimista/conservador,
// plan de inversión editable y runway calculator en vivo.

const C = ["#FF6A00", "#1A1F24", "#3D6DFF", "#8A2EFF", "#16a34a"];
type Scenario = "conservador" | "base" | "optimista";
const GROWTH: Record<Scenario, number> = { conservador: 0.05, base: 0.10, optimista: 0.18 };

export default function Financials() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const [cash, setCash] = useState(180000);          // caja actual USD
  const [mrr, setMrr] = useState(8500);              // MRR actual USD
  const [expenses, setExpenses] = useState([
    { cat: "Salarios & equipo", monthly: 14000 },
    { cat: "Marketing & adquisición", monthly: 6500 },
    { cat: "Infraestructura & APIs", monthly: 2200 },
    { cat: "Expansión & legal", monthly: 1800 },
    { cat: "Operación & otros", monthly: 1500 }
  ]);
  const [investment, setInvestment] = useState([
    { item: "Producto (12 meses dev)", amount: 220000 },
    { item: "Go-to-Market (paid + contenido)", amount: 150000 },
    { item: "Equipo clave (2 hires)", amount: 160000 },
    { item: "Infraestructura & data", amount: 45000 },
    { item: "Buffer operativo", amount: 75000 }
  ]);

  const burn = useMemo(() => expenses.reduce((a, e) => a + e.monthly, 0), [expenses]);
  const totalInvestment = useMemo(() => investment.reduce((a, i) => a + i.amount, 0), [investment]);

  // Proyección 18 meses con crecimiento de MRR por escenario
  const projection = useMemo(() => {
    const g = GROWTH[scenario];
    let c = cash, m = mrr;
    return Array.from({ length: 18 }, (_, i) => {
      c = c + m - burn;
      m = m * (1 + g);
      return { mes: `M${i + 1}`, caja: Math.round(c / 1000), mrr: Math.round(m / 1000) };
    });
  }, [cash, mrr, burn, scenario]);

  const runwayMonths = useMemo(() => {
    const g = GROWTH[scenario];
    let c = cash, m = mrr, i = 0;
    while (c > 0 && i < 60) { c += m - burn; m *= 1 + g; i++; }
    return i >= 60 ? "60+" : String(i);
  }, [cash, mrr, burn, scenario]);

  const breakeven = useMemo(() => {
    const g = GROWTH[scenario];
    let m = mrr, i = 0;
    while (m < burn && i < 60) { m *= 1 + g; i++; }
    return i >= 60 ? "—" : `M${i}`;
  }, [mrr, burn, scenario]);

  function editExpense(i: number, val: string) {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setExpenses(prev => prev.map((e, ei) => (ei === i ? { ...e, monthly: n } : e)));
  }
  function editInvestment(i: number, val: string) {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setInvestment(prev => prev.map((e, ei) => (ei === i ? { ...e, amount: n } : e)));
  }

  return (
    <main className="p-8 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow">Financials</div>
          <h1 className="font-display font-bold text-3xl mt-1">Motor financiero editable</h1>
          <p className="text-ink/60 mt-1 text-sm">Toda cifra es editable — el runway, breakeven y proyección se recalculan en vivo.</p>
        </div>
        {/* Selector de escenario */}
        <div className="flex gap-1 bg-white border border-line rounded-xl p-1 no-print">
          {(["conservador", "base", "optimista"] as Scenario[]).map(s => (
            <button key={s} onClick={() => setScenario(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition
                ${scenario === s ? "bg-ink text-white" : "text-ink/60 hover:text-ink"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs EN VIVO */}
      <div className="grid md:grid-cols-4 gap-4 mt-7">
        <div className="card p-6 bg-ink text-white border-ink">
          <div className="text-[11px] uppercase tracking-widest text-white/40">Runway</div>
          <div className="font-display font-bold text-4xl text-ember mt-1">{runwayMonths} <span className="text-lg text-white/50">meses</span></div>
        </div>
        {[
          ["Burn mensual", `$${(burn / 1000).toFixed(1)}K`],
          ["MRR actual", `$${(mrr / 1000).toFixed(1)}K`],
          ["Breakeven proyectado", breakeven]
        ].map(([l, v]) => (
          <div key={l} className="card p-6">
            <div className="eyebrow">{l}</div>
            <div className="kpi-value mt-2 text-3xl">{v}</div>
          </div>
        ))}
      </div>

      {/* INPUTS BASE */}
      <div className="grid grid-cols-2 gap-4 mt-5 max-w-md">
        <label className="text-sm">
          <span className="eyebrow block mb-1">Caja actual (USD)</span>
          <input defaultValue={cash} onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setCash(n); }}
            className="w-full border border-line rounded-lg px-3 py-2 bg-white" />
        </label>
        <label className="text-sm">
          <span className="eyebrow block mb-1">MRR actual (USD)</span>
          <input defaultValue={mrr} onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setMrr(n); }}
            className="w-full border border-line rounded-lg px-3 py-2 bg-white" />
        </label>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* GASTOS EDITABLES */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Gastos mensuales por categoría</h3>
            <span className="text-xs bg-ember/10 text-ember font-semibold px-3 py-1.5 rounded-full">✎ Editable</span>
          </div>
          {expenses.map((e, i) => (
            <div key={e.cat} className="flex items-center gap-3 py-2.5 border-b border-line/60 last:border-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: C[i % C.length] }} />
              <span className="flex-1 text-sm font-medium">{e.cat}</span>
              <input defaultValue={e.monthly} onBlur={ev => editExpense(i, ev.target.value)}
                className="w-24 text-right text-sm bg-cloud rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-ember/40" />
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold">
            <span>Total burn</span><span className="text-ember">${burn.toLocaleString()}/mes</span>
          </div>
        </div>

        {/* DISTRIBUCIÓN */}
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Distribución del burn</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenses} dataKey="monthly" nameKey="cat" innerRadius={62} outerRadius={100} paddingAngle={2}>
                  {expenses.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RUNWAY CHART */}
      <div className="card p-6 mt-6">
        <h3 className="font-semibold mb-2">
          Runway y MRR — 18 meses · escenario <span className="capitalize text-ember">{scenario}</span> (miles USD)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
              <XAxis dataKey="mes" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
              <Area dataKey="caja" stroke="#1A1F24" fill="#1A1F24" fillOpacity={0.07} strokeWidth={2.5} />
              <Area dataKey="mrr" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.18} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PLAN DE INVERSIÓN EDITABLE */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Plan de inversión (uso de fondos)</h3>
            <span className="text-xs bg-ember/10 text-ember font-semibold px-3 py-1.5 rounded-full">✎ Editable</span>
          </div>
          {investment.map((it, i) => (
            <div key={it.item} className="flex items-center gap-3 py-2.5 border-b border-line/60 last:border-0">
              <span className="flex-1 text-sm font-medium">{it.item}</span>
              <input defaultValue={it.amount} onBlur={ev => editInvestment(i, ev.target.value)}
                className="w-28 text-right text-sm bg-cloud rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-ember/40" />
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold">
            <span>Ronda objetivo</span><span className="text-ember">${totalInvestment.toLocaleString()}</span>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Uso de fondos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investment} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="item" width={180} fontSize={11.5} />
                <Tooltip />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={22}>
                  {investment.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
