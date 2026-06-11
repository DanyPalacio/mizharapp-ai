"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine
} from "recharts";

// Valuation (feedback #9/#21): calculator con múltiplos, benchmark del sector
// y competidores, claridad del horizonte temporal (valuación HOY) y proyección
// a 5 períodos (12 meses vista + escenarios), con disclaimer.

const SECTOR_BENCHMARKS = [
  { sector: "SaaS B2B (LATAM seed)", multiple: "4-7x ARR", median: 5.5 },
  { sector: "SaaS B2B (US seed)", multiple: "8-15x ARR", median: 11 },
  { sector: "AI-native apps", multiple: "10-20x ARR", median: 14 },
  { sector: "Marketplaces", multiple: "2-5x GMV neto", median: 3.5 },
  { sector: "Fintech LATAM", multiple: "6-12x ARR", median: 9 }
];

const COMPARABLES = [
  { name: "Comparable A (BI self-service, seed US)", raised: "$3.5M", val: "$16M", mult: "12x ARR" },
  { name: "Comparable B (AI analytics, seed MX)", raised: "$1.2M", val: "$6.5M", mult: "7x ARR" },
  { name: "Comparable C (dashboards SMB, pre-seed CO)", raised: "$450K", val: "$2.8M", mult: "—（pre-revenue）" }
];

export default function Valuation() {
  const [arr, setArr] = useState(102000);       // ARR actual USD
  const [growth, setGrowth] = useState(110);    // crecimiento anual %
  const [multiple, setMultiple] = useState(8);  // múltiplo aplicado

  const valToday = useMemo(() => arr * multiple, [arr, multiple]);

  // Proyección 5 períodos (cada 12 meses), con el múltiplo comprimiéndose levemente
  const projection = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const yearArr = arr * Math.pow(1 + growth / 100, i);
      const m = Math.max(multiple - i * 0.5, 3);
      return {
        periodo: i === 0 ? "Hoy" : `+${i * 12}m`,
        valuación: Math.round((yearArr * m) / 1000)
      };
    });
  }, [arr, growth, multiple]);

  const in12m = projection[1]?.valuación ?? 0;

  return (
    <main className="p-8 max-w-6xl">
      <div className="eyebrow">Valuation</div>
      <h1 className="font-display font-bold text-3xl mt-1">Valuación con contexto sectorial</h1>
      <p className="text-ink/60 mt-2 max-w-2xl text-sm">
        La valuación calculada corresponde al <strong>día de hoy</strong> con tu ARR actual.
        La proyección muestra cómo evoluciona en horizontes de 12 meses si se cumple el crecimiento simulado.
      </p>

      {/* CALCULATOR */}
      <div className="grid lg:grid-cols-3 gap-6 mt-7">
        <div className="card p-6 lg:col-span-1 space-y-5">
          <h3 className="font-semibold">Calculator</h3>
          <label className="block text-sm">
            <span className="eyebrow block mb-1">ARR actual (USD)</span>
            <input defaultValue={arr} onBlur={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setArr(n); }}
              className="w-full border border-line rounded-lg px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="eyebrow block mb-1">Crecimiento anual: <b className="text-ember">{growth}%</b></span>
            <input type="range" min={20} max={300} value={growth}
              onChange={e => setGrowth(parseInt(e.target.value))}
              className="w-full accent-[#FF6A00]" />
          </label>
          <label className="block text-sm">
            <span className="eyebrow block mb-1">Múltiplo ARR: <b className="text-ember">{multiple}x</b></span>
            <input type="range" min={3} max={20} step={0.5} value={multiple}
              onChange={e => setMultiple(parseFloat(e.target.value))}
              className="w-full accent-[#FF6A00]" />
            <span className="text-xs text-ink/45 mt-1 block">
              Referencia: AI-native apps operan en 10-20x; SaaS LATAM seed en 4-7x.
            </span>
          </label>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-6 bg-ink text-white border-ink">
              <div className="text-[11px] uppercase tracking-widest text-white/40">Valuación HOY</div>
              <div className="font-display font-bold text-4xl text-ember mt-1">
                ${(valToday / 1_000_000).toFixed(2)}M
              </div>
              <div className="text-sm text-white/55 mt-1">{multiple}x sobre ARR de ${(arr / 1000).toFixed(0)}K</div>
            </div>
            <div className="card p-6">
              <div className="eyebrow">Proyectada a 12 meses</div>
              <div className="kpi-value mt-1 text-4xl">${(in12m / 1000).toFixed(2)}M</div>
              <div className="text-sm text-green-600 font-medium mt-1">
                +{valToday > 0 ? Math.round((in12m * 1000 / valToday - 1) * 100) : 0}% si se cumple el crecimiento de {growth}%
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-2">Proyección de valuación — 5 períodos (USD miles)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DADDE1" />
                  <XAxis dataKey="periodo" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                  <ReferenceLine y={projection[0]?.valuación} stroke="#1A1F24" strokeDasharray="4 4" />
                  <Bar dataKey="valuación" radius={[8, 8, 0, 0]}>
                    {projection.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#1A1F24" : "#FF6A00"} fillOpacity={i === 0 ? 1 : 0.55 + i * 0.11} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* BENCHMARK SECTORIAL */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Benchmark de múltiplos por sector</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink text-white">
                <th className="text-left px-4 py-2.5 rounded-l-lg">Sector</th>
                <th className="text-right px-4 py-2.5 rounded-r-lg">Múltiplo típico</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_BENCHMARKS.map((s, i) => (
                <tr key={s.sector} className={i % 2 ? "bg-cloud" : ""}>
                  <td className="px-4 py-2.5 font-medium">{s.sector}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-ember">{s.multiple}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Comparables del sector</h3>
          <div className="space-y-3">
            {COMPARABLES.map(c => (
              <div key={c.name} className="border border-line rounded-xl p-4">
                <div className="font-medium text-sm">{c.name}</div>
                <div className="flex gap-5 mt-2 text-sm">
                  <span><span className="eyebrow">Levantó · </span><b>{c.raised}</b></span>
                  <span><span className="eyebrow">Valuación · </span><b className="text-ember">{c.val}</b></span>
                  <span><span className="eyebrow">Múltiplo · </span><b>{c.mult}</b></span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/45 mt-3">
            En producción estos comparables se generan vía el pipeline de IA con datos
            de rondas recientes y quedan en <code className="bg-cloud px-1 rounded">venture_documents</code>.
          </p>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
        <b>⚠ Disclaimer:</b> esta valuación es una estimación informativa basada en múltiplos
        de mercado y los supuestos que ingresaste. No constituye asesoría financiera ni una
        valoración formal — la valuación real de una ronda la define la negociación con inversionistas.
      </div>
    </main>
  );
}
