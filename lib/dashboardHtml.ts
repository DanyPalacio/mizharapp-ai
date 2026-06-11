// Genera un dashboard HTML autocontenido bajo el esquema BOSANET:
// header sticky + badge live, nav anclada, secciones eyebrow/sec-title/sec-sub,
// grid de KPIs, cards de Chart.js, bullets con dots, tabla de fuentes, footer.
// Compatible con WhatsApp/email: un solo archivo, fuentes Google + Chart.js por CDN.

type Kpi = { label: string; value: string; change?: string; trend?: string };
type Chart = { title: string; type: string; x_key: string; keys: string[]; colors?: string[]; data: any[] };
export type DashJSON = {
  title: string; category?: string; executive_summary?: string;
  kpi_cards?: Kpi[]; charts?: Chart[]; ai_insight?: string;
  key_conclusions?: string[]; sources?: { name: string; url?: string; date?: string }[];
};

const PALETTE = ["#E8590C", "#1D6FE0", "#0E9F6E", "#7C3AED", "#D97706"];

function esc(s: any) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function chartConfig(c: Chart, i: number) {
  const colors = c.colors?.length ? c.colors : PALETTE;
  const labels = c.data.map(d => d[c.x_key]);
  if (c.type === "pie") {
    return {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: c.data.map(d => d[c.keys[0]]), backgroundColor: colors, borderWidth: 0 }]
      },
      options: { plugins: { legend: { position: "right" } }, cutout: "62%" }
    };
  }
  return {
    type: c.type === "area" ? "line" : c.type,
    data: {
      labels,
      datasets: c.keys.map((k, ki) => ({
        label: k,
        data: c.data.map(d => d[k]),
        borderColor: colors[ki % colors.length],
        backgroundColor: c.type === "bar"
          ? colors[ki % colors.length]
          : colors[ki % colors.length] + "22",
        fill: c.type === "area",
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 0,
        borderRadius: c.type === "bar" ? 6 : 0
      }))
    },
    options: {
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true } } },
      scales: { y: { grid: { color: "#EEF0F4" } }, x: { grid: { display: false } } },
      maintainAspectRatio: false
    }
  };
}

export function dashboardToHtml(d: DashJSON): string {
  const today = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  const kpis = (d.kpi_cards ?? []).map((k, i) => `
    <div class="kpi">
      <div class="lbl">${esc(k.label)}</div>
      <div class="val"${i === 0 ? ' style="color:var(--orange)"' : ""}>${esc(k.value)}</div>
      ${k.change ? `<div class="note ${k.trend === "down" ? "dn" : k.trend === "up" ? "up" : ""}">${esc(k.change)}</div>` : ""}
    </div>`).join("");

  const charts = (d.charts ?? []).map((c, i) => `
    <div class="card">
      <div class="card-title">${esc(c.title)}</div>
      <div class="chart-box"><canvas id="ch${i}"></canvas></div>
    </div>`).join("");

  const bullets = (d.key_conclusions ?? []).map((c, i) => `
    <li><span class="bdot ${i === 0 ? "b-up" : i === 1 ? "b-neu" : "b-dn"}"></span>${esc(c)}</li>`).join("");

  const sources = (d.sources ?? []).map(s =>
    `<span class="src">${esc(s.name)}${s.date ? ` · ${esc(s.date)}` : ""}</span>`).join("");

  const configs = (d.charts ?? []).map((c, i) =>
    `new Chart(document.getElementById('ch${i}'),${JSON.stringify(chartConfig(c, i))});`).join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(d.title)} · VisualStats.ai</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
:root{--ink:#1A1D23;--ink-mid:#4B5263;--ink-dim:#8A91A0;--orange:#E8590C;--orange-soft:#FFF0E6;
--green:#0E9F6E;--green-soft:#E8F8F1;--red:#DC2626;--purple:#7C3AED;--purple-soft:#F3EDFE;
--card:#FFFFFF;--line:#E5E8EE;--line-soft:#EEF0F4}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;color:var(--ink);font-size:15px;line-height:1.6;
background:linear-gradient(180deg,#E9EBEF 0%,#F1F2F5 18%,#F8F9FB 45%,#FFFFFF 100%);
background-attachment:fixed;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.wrap{max-width:1180px;margin:0 auto;padding:0 clamp(14px,4vw,48px)}
section{padding:clamp(36px,5vw,64px) 0}
section+section{border-top:1px solid var(--line-soft)}
.eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:var(--orange);margin-bottom:10px}
.sec-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(20px,2.8vw,30px);font-weight:800;line-height:1.15;margin-bottom:8px;letter-spacing:-.4px}
.sec-sub{font-size:13.5px;color:var(--ink-mid);max-width:660px;line-height:1.75;margin-bottom:26px}
.hdr{position:sticky;top:0;z-index:300;background:rgba(255,255,255,.82);backdrop-filter:blur(18px);border-bottom:1px solid var(--line);padding:13px clamp(14px,4vw,48px);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.hdr-brand{font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:800;letter-spacing:-.2px}
.hdr-brand span{color:var(--orange)}
.hdr-sub{font-size:10.5px;color:var(--ink-dim);margin-top:1px}
.live{display:inline-flex;align-items:center;gap:6px;background:var(--green-soft);border:1px solid #A7E3C9;color:var(--green);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600}
.live::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.g4{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;box-shadow:0 1px 2px rgba(26,29,35,.04)}
.kpi .lbl{font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:var(--ink-dim)}
.kpi .val{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(24px,3vw,32px);font-weight:800;margin-top:6px;letter-spacing:-.5px}
.kpi .note{font-size:12px;color:var(--ink-mid);margin-top:3px}
.kpi .note.up{color:var(--green);font-weight:600}
.kpi .note.dn{color:var(--red);font-weight:600}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:0 1px 2px rgba(26,29,35,.04)}
.card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;margin-bottom:14px}
.chart-box{position:relative;height:300px}
.insight{background:var(--purple-soft);border:1px solid #DCCBFB;border-radius:16px;padding:20px 22px;margin-top:18px}
.insight .tag{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;color:var(--purple)}
.insight p{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:16px;margin-top:6px;color:#4C1D95;line-height:1.5}
.bullets{list-style:none;margin-top:20px}
.bullets li{display:flex;gap:10px;padding:9px 0;font-size:13.5px;color:var(--ink-mid);border-bottom:1px dashed var(--line-soft);align-items:baseline}
.bdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;position:relative;top:1px}
.b-up{background:var(--green)}.b-neu{background:var(--orange)}.b-dn{background:var(--red)}
.srcs{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px}
.src{font-size:12.5px;font-weight:600;color:var(--ink-mid);background:var(--card);border:1px solid var(--line);border-radius:10px;padding:7px 13px}
.footer{text-align:center;padding:34px 0 44px;font-size:12px;color:var(--ink-dim)}
.footer b{color:var(--orange)}
</style>
</head>
<body>
<header class="hdr">
  <div>
    <div class="hdr-brand">Visual<span>Stats</span>.ai</div>
    <div class="hdr-sub">${esc(d.category ?? "Dashboard")} · Generado ${esc(today)}</div>
  </div>
  <span class="live">Datos verificados</span>
</header>

<section id="sec-exec">
<div class="wrap">
  <div class="eyebrow">${esc(d.category ?? "Visual Intelligence")} · Dashboard Ejecutivo</div>
  <h2 class="sec-title">${esc(d.title)}</h2>
  ${d.executive_summary ? `<p class="sec-sub">${esc(d.executive_summary)}</p>` : ""}
  <div class="g4">${kpis}</div>
  ${d.ai_insight ? `<div class="insight"><div class="tag">✦ AI Insight</div><p>${esc(d.ai_insight)}</p></div>` : ""}
</div>
</section>

<section id="sec-charts">
<div class="wrap">
  <div class="eyebrow">Análisis Visual</div>
  <h2 class="sec-title">Métricas y tendencias</h2>
  <div class="g2">${charts}</div>
  ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
</div>
</section>

${sources ? `<section><div class="wrap"><div class="eyebrow">Fuentes</div><div class="srcs">${sources}</div></div></section>` : ""}

<footer class="footer">Generado con <b>VisualStats.ai</b> — Data That Tells Stories</footer>
<script>
Chart.defaults.font.family="'Inter',sans-serif";Chart.defaults.font.size=11.5;
${configs}
</script>
</body>
</html>`;
}
