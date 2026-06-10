"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

// Fundraising (feedback #10/#17): simulador con sliders (monto/valuación),
// 6 rutas de financiamiento, inversores LATAM con match score, dilution chart
// acumulado por rondas, elevator pitch y timeline de levantamiento.

const ROUTES = [
  { name: "Venture Capital (seed LATAM)", fit: 88, when: "ARR > $100K y crecimiento >8% m/m", pros: "Capital grande + red", cons: "Dilución 15-25%, proceso de 3-6 meses" },
  { name: "Aceleradoras (YC, Platanus, 500)", fit: 84, when: "Pre-seed con tracción temprana", pros: "Sello + red + velocidad", cons: "Cheque pequeño, dilución 5-10%" },
  { name: "Ángeles estratégicos", fit: 79, when: "Cualquier etapa con narrativa fuerte", pros: "Rápido, smart money sectorial", cons: "Tickets de $10-50K, hay que agregar varios" },
  { name: "Venture Debt / Revenue-based", fit: 58, when: "MRR estable > $20K", pros: "Sin dilución", cons: "Presión de caja mensual" },
  { name: "Corporate VC", fit: 52, when: "Producto complementario a un corporativo", pros: "Distribución + validación", cons: "Lento, posibles vetos estratégicos" },
  { name: "Grants & concursos", fit: 67, when: "Siempre en paralelo", pros: "Capital no dilutivo", cons: "Montos bajos, mucha burocracia" }
];

const INVESTORS = [
  { name: "Magma Partners", geo: "Chile/LATAM", stage: "Pre-seed/Seed", thesis: "B2B SaaS LATAM→US", match: 91 },
  { name: "Platanus Ventures", geo: "Chile/MX", stage: "Pre-seed", thesis: "Founders técnicos LATAM", match: 87 },
  { name: "500 LatAm", geo: "MX/LATAM", stage: "Seed", thesis: "SaaS, fintech, marketplaces", match: 82 },
  { name: "Newtopia VC", geo: "Argentina/LATAM", stage: "Pre-seed/Seed", thesis: "Tech regional escalable", match: 78 },
  { name: "Rockstart LATAM", geo: "Colombia", stage: "Pre-seed", thesis: "Impacto + digital CO", match: 74 },
  { name: "Marathon VC", geo: "CO/MX", stage: "Seed", thesis: "AI-first B2B", match: 86 }
];

const TIMELINE = [
  { phase: "Semanas 1-2", label: "Data room + deck + lista de 60 inversores priorizada por match" },
  { phase: "Semanas 3-6", label: "Primeras 30 reuniones — calibrar narrativa, detectar objeciones" },
  { phase: "Semanas 7-10", label: "Segundas reuniones + due diligence con interesados" },
  { phase: "Semanas 11-14", label: "Term sheets, negociación y cierre con lead" }
];

export default function Fundraising() {
  const [amount, setAmount] = useState(650);   // monto a levantar (K USD)
  const [preMoney, setPreMoney] = useState(3200); // pre-money (K USD)

  const postMoney = preMoney + amount;
  const dilution = (amount / postMoney) * 100;

  // Dilución acumulada en rondas sucesivas
  const dilutionChart = useMemo(() => {
    let founders = 100;
    const rounds = [
      { r: "Hoy", d: 0 },
      { r: "Esta ronda", d: dilution },
      { r: "Series A", d: 20 },
      { r: "Series B", d: 15 }
    ];
    return rounds.map(x => {
      founders = founders * (1 - x.d / 100);
      return { ronda: x.r, founders: Math.round(founders * 10) / 10, inversores: Math.round((100 - founders) * 10) / 10 };
    });
  }, [dilution]);

  const pitch = useMemo(() =>
    `Levantamos $${amount}K a $${(preMoney / 1000).toFixed(1)}M pre-money para llegar a ` +
    `$${Math.round(amount * 2.2)}K de ARR en 18 meses. La ronda financia producto y go-to-market ` +
    `en Colombia y México, con economics de LTV/CAC > 3x ya validados. Cediendo ${dilution.toFixed(1)}%, ` +
    `el inversionista entra antes de la inflexión de crecimiento que los comparables del sector ` +
    `capturaron a 3-4x esta valuación.`,
  [amount, preMoney, dilution]);

  return (
    <main className="p-8 max-w-6xl">
      <div className="eyebrow">Fundraising</div>
      <h1 className="font-display font-bold text-3xl mt-1">Estrategia completa de levantamiento</h1>

      {/* SIMULADOR */}
      <div className="grid lg:grid-cols-3 gap-6 mt-7">
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold">Simulador de ronda</h3>
          <label className="block text-sm">
            <span className="eyebrow block mb-1">Monto a levantar: <b className="text-ember">${amount}K</b></span>
            <input type="range" min={100} max={3000} step={50} value={amount}
              onChange={e => setAmount(parseInt(e.target.value))} className="w-full accent-[#FF6A00]" />
          </label>
          <label className="block text-sm">
            <span className="eyebrow block mb-1">Pre-money: <b className="text-ember">${(preMoney / 1000).toFixed(1)}M</b></span>
            <input type="range" min={500} max={15000} step={100} value={preMoney}
              onChange={e => setPreMoney(parseInt(e.target.value))} className="w-full accent-[#FF6A00]" />
          </label>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-cloud rounded-xl p-4">
              <div className="eyebrow">Post-money</div>
              <div className="font-display font-bold text-xl mt-1">${(postMoney / 1000).toFixed(2)}M</div>
            </div>
            <div className="bg-ink text-white rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Dilución</div>
              <div className="font-display font-bold text-xl mt-1 text-ember">{dilution.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* DILUTION CHART */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold mb-2">Evolución del ownership de founders (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dilutionChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                <XAxis dataKey="ronda" fontSize={12} /><YAxis fontSize={12} domain={[0, 100]} /><Tooltip /><Legend />
                <Area dataKey="founders" stackId="1" stroke="#FF6A00" fill="#FF6A00" fillOpacity={0.7} />
                <Area dataKey="inversores" stackId="1" stroke="#1A1F24" fill="#1A1F24" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ELEVATOR PITCH */}
      <div className="mt-6 rounded-2xl p-6 bg-gradient-to-r from-[#8A2EFF]/10 to-[#3D6DFF]/10 border border-[#8A2EFF]/25">
        <div className="eyebrow text-[#8A2EFF]">✦ Elevator pitch de la ronda (generado con tus números)</div>
        <p className="mt-2 font-display font-semibold text-lg text-[#3a1880] leading-relaxed">{pitch}</p>
      </div>

      {/* 6 RUTAS */}
      <h3 className="font-display font-bold text-xl mt-10 mb-4">Rutas de financiamiento — 6 estrategias</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROUTES.map(r => (
          <div key={r.name} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-snug">{r.name}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0
                ${r.fit >= 80 ? "bg-green-100 text-green-700" : r.fit >= 60 ? "bg-ember/10 text-ember" : "bg-cloud text-ink/50"}`}>
                {r.fit}%
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-cloud rounded-full overflow-hidden">
              <div className="h-full bg-ember rounded-full" style={{ width: `${r.fit}%` }} />
            </div>
            <dl className="mt-3 space-y-1.5 text-xs text-ink/70 flex-1">
              <div><dt className="font-bold inline text-ink">Cuándo: </dt><dd className="inline">{r.when}</dd></div>
              <div><dt className="font-bold inline text-green-700">Pros: </dt><dd className="inline">{r.pros}</dd></div>
              <div><dt className="font-bold inline text-red-600">Contras: </dt><dd className="inline">{r.cons}</dd></div>
            </dl>
          </div>
        ))}
      </div>

      {/* INVERSORES LATAM */}
      <h3 className="font-display font-bold text-xl mt-10 mb-4">Inversores LATAM recomendados</h3>
      <div className="card p-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="bg-ink text-white">
              <th className="text-left px-4 py-2.5 rounded-l-lg">Fondo</th>
              <th className="text-left px-4 py-2.5">Geo</th>
              <th className="text-left px-4 py-2.5">Etapa</th>
              <th className="text-left px-4 py-2.5">Tesis</th>
              <th className="text-right px-4 py-2.5 rounded-r-lg">Match</th>
            </tr>
          </thead>
          <tbody>
            {[...INVESTORS].sort((a, b) => b.match - a.match).map((inv, i) => (
              <tr key={inv.name} className={i % 2 ? "bg-cloud" : ""}>
                <td className="px-4 py-3 font-semibold">{inv.name}</td>
                <td className="px-4 py-3">{inv.geo}</td>
                <td className="px-4 py-3">{inv.stage}</td>
                <td className="px-4 py-3 text-ink/70">{inv.thesis}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-ember rounded-full" style={{ width: `${inv.match}%` }} />
                    </div>
                    <span className="font-bold w-8 text-right">{inv.match}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink/45 mt-3">
          Verifica tesis y estado de cada fondo antes de contactar — los focos de inversión cambian.
          En producción esta lista se genera vía IA con datos vigentes del ecosistema.
        </p>
      </div>

      {/* TIMELINE */}
      <h3 className="font-display font-bold text-xl mt-10 mb-5">Timeline de levantamiento (14 semanas)</h3>
      <div className="card p-7">
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-line" />
          {TIMELINE.map(t => (
            <div key={t.phase} className="relative pb-6 last:pb-0">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-ember border-4 border-white shadow" />
              <div className="text-xs font-bold text-ember uppercase tracking-widest">{t.phase}</div>
              <div className="font-medium mt-0.5">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
