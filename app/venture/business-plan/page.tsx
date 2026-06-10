"use client";
import { useMemo, useState } from "react";

// Business Plan estilo deck corporativo (feedback #5/#13):
// cover page, secciones en tarjetas con color, timeline de milestones,
// tabla financiera EDITABLE celda a celda (simulación), export HTML/Print-PDF y CSV (Excel).

const YEARS = ["2026E", "2027E", "2028E", "2029E", "2030E"];
const BASE_ROWS = [
  { label: "Revenue (USD M)", values: [0.6, 2.1, 5.4, 11.2, 19.8] },
  { label: "Gross Margin %", values: [62, 66, 70, 72, 74] },
  { label: "EBITDA (USD M)", values: [-0.4, -0.2, 0.9, 2.8, 5.6] },
  { label: "Headcount", values: [6, 14, 26, 41, 58] }
];

const SECTIONS = [
  { tag: "01 · Mercado", color: "#FF6A00", title: "Oportunidad", body: "Definición del problema, tamaño de mercado (TAM/SAM/SOM) y timing. Esta sección se genera desde Market Intelligence y se mantiene sincronizada." },
  { tag: "02 · Producto", color: "#3D6DFF", title: "Solución", body: "Propuesta de valor, diferenciación y roadmap de producto presentados como bloques infográficos, no como párrafos planos." },
  { tag: "03 · Modelo", color: "#8A2EFF", title: "Modelo de negocio", body: "Cómo monetiza el venture: pricing, unit economics y motores de crecimiento, con cifras vinculadas a la tabla financiera editable." },
  { tag: "04 · GTM", color: "#16a34a", title: "Go-to-Market", body: "Canales, ICP y secuencia de entrada al mercado. Se alimenta del Marketing Plan para evitar inconsistencias entre documentos." }
];

const MILESTONES = [
  { q: "Q3 2026", label: "MVP en producción + primeros 10 clientes de pago" },
  { q: "Q1 2027", label: "Product-market fit medido: retención M3 > 60%" },
  { q: "Q3 2027", label: "Ronda seed cerrada" },
  { q: "Q2 2028", label: "Expansión a 3 mercados LATAM" }
];

export default function BusinessPlan() {
  const [rows, setRows] = useState(BASE_ROWS);

  const revenueCagr = useMemo(() => {
    const v = rows[0].values;
    const yrs = v.length - 1;
    if (v[0] <= 0) return "—";
    return `${((Math.pow(v[yrs] / v[0], 1 / yrs) - 1) * 100).toFixed(1)}%`;
  }, [rows]);

  function edit(r: number, c: number, val: string) {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setRows(prev => prev.map((row, ri) =>
      ri === r ? { ...row, values: row.values.map((v, ci) => (ci === c ? n : v)) } : row
    ));
  }

  function exportCSV() {
    const csv = ["Métrica," + YEARS.join(",")]
      .concat(rows.map(r => `${r.label},${r.values.join(",")}`))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "business-plan-financials.csv";
    a.click();
  }

  return (
    <main className="p-8 max-w-5xl space-y-8">
      <div className="flex items-center justify-between no-print">
        <div>
          <div className="eyebrow">Business Plan · v2</div>
          <h1 className="font-display font-bold text-3xl mt-1">Deck corporativo</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="border border-line bg-white rounded-xl px-4 py-2 text-sm font-medium">
            Exportar Excel (CSV)
          </button>
          <button onClick={() => window.print()} className="btn-ember text-sm">Export PDF / Print</button>
        </div>
      </div>

      {/* COVER PAGE */}
      <section className="deck-page bg-ink text-white p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-ember/20 blur-3xl" />
        <div className="eyebrow text-ember">Business Plan · Confidencial</div>
        <h2 className="font-display font-bold text-5xl mt-4 leading-tight">Nombre del Venture</h2>
        <p className="text-white/60 mt-3 max-w-md">Construyendo la próxima plataforma de la categoría.</p>
        <div className="grid grid-cols-4 gap-4 mt-12">
          {[["TAM", "$1.2B"], ["Revenue 5Y", "$19.8M"], ["CAGR", revenueCagr], ["Ronda", "Seed"]].map(([l, v]) => (
            <div key={l} className="border border-white/15 rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-widest text-white/40">{l}</div>
              <div className="font-display font-bold text-2xl mt-1 text-ember">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIONES EN TARJETAS VISUALES */}
      <section className="grid md:grid-cols-2 gap-5">
        {SECTIONS.map(s => (
          <div key={s.tag} className="deck-page p-7 border-t-4" style={{ borderTopColor: s.color }}>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: s.color }}>{s.tag}</div>
            <h3 className="font-display font-bold text-xl mt-2">{s.title}</h3>
            <p className="text-ink/65 mt-2 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>

      {/* TIMELINE DE MILESTONES */}
      <section className="deck-page p-8">
        <h3 className="font-display font-bold text-xl mb-6">Milestones</h3>
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-line" />
          {MILESTONES.map(m => (
            <div key={m.q} className="relative pb-6 last:pb-0">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-ember border-4 border-white shadow" />
              <div className="text-xs font-bold text-ember uppercase tracking-widest">{m.q}</div>
              <div className="font-medium mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TABLA FINANCIERA EDITABLE */}
      <section className="deck-page p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-xl">Financial highlights</h3>
          <span className="text-xs bg-ember/10 text-ember font-semibold px-3 py-1.5 rounded-full no-print">
            ✎ Edita cualquier celda para simular
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink text-white">
                <th className="text-left px-4 py-3 rounded-l-lg font-semibold">USD millions</th>
                {YEARS.map(y => <th key={y} className="px-4 py-3 font-semibold text-right last:rounded-r-lg">{y}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r.label} className={ri % 2 ? "bg-cloud" : ""}>
                  <td className="px-4 py-3 font-medium">{r.label}</td>
                  {r.values.map((v, ci) => (
                    <td key={ci} className="px-2 py-1.5 text-right">
                      <input
                        defaultValue={v}
                        onBlur={e => edit(ri, ci, e.target.value)}
                        className={`w-20 text-right bg-transparent rounded-md px-2 py-1.5 outline-none
                          focus:bg-white focus:ring-2 focus:ring-ember/40
                          ${ci === r.values.length - 1 ? "font-bold text-ember" : ""}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink/45 mt-4">
          CAGR de revenue recalculado en vivo: <strong className="text-ember">{revenueCagr}</strong>.
          Los cambios alimentan las pantallas de Financials y Valuation.
        </p>
      </section>
    </main>
  );
}
