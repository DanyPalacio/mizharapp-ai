"use client";
import { useMemo, useState } from "react";

// Investor Deck (feedback #12/#18): layout estilo webinar con sidebar de navegación,
// iconos SVG pro por slide, 6 temas visuales + selector de fuente,
// stats por slide (TAM/SAM/SOM, métricas) y export HTML autocontenido.

const THEMES = [
  { id: "graphite", name: "Graphite Executive", bg: "#1A1F24", accent: "#FF6A00", text: "#FFFFFF", soft: "rgba(255,255,255,.08)" },
  { id: "midnight", name: "Midnight Navy", bg: "#0B1437", accent: "#3D6DFF", text: "#FFFFFF", soft: "rgba(255,255,255,.08)" },
  { id: "violet", name: "AI Violet", bg: "#19102E", accent: "#B14EFF", text: "#FFFFFF", soft: "rgba(255,255,255,.08)" },
  { id: "paper", name: "Minimal Paper", bg: "#FFFFFF", accent: "#E8590C", text: "#1A1D23", soft: "#F4F5F7" },
  { id: "forest", name: "Forest Capital", bg: "#0E2A1F", accent: "#34D399", text: "#FFFFFF", soft: "rgba(255,255,255,.08)" },
  { id: "boardroom", name: "Boardroom Gray", bg: "#F1F2F5", accent: "#1D6FE0", text: "#1A1D23", soft: "#FFFFFF" }
] as const;

const FONTS = [
  { id: "grotesk", name: "Space Grotesk", css: "'Space Grotesk', sans-serif" },
  { id: "jakarta", name: "Plus Jakarta Sans", css: "'Plus Jakarta Sans', sans-serif" },
  { id: "inter", name: "Inter", css: "'Inter', sans-serif" }
] as const;

// Iconos SVG pro (stroke 1.8, lineal, sin emojis genéricos)
const Icon = ({ d, accent }: { d: string; accent: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={accent}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS: Record<string, string> = {
  problem: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  solution: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z",
  market: "M3 3v18h18M7 14l4-4 3 3 5-6",
  product: "M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7l8.7 5 8.7-5M12 22V12",
  traction: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
  model: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  team: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  ask: "M12 2v20M2 12h20"
};

const SLIDES = [
  { icon: "problem", title: "El problema", body: "Las PYMEs gastan 8-15 horas al mes y hasta $3,000 USD en reportería manual que llega tarde y sin insights accionables.", stats: [["Horas/mes perdidas", "8-15h"], ["Costo analistas", "$1.5-3K/mes"], ["Reportes a tiempo", "32%"]] },
  { icon: "solution", title: "La solución", body: "Pregunta en lenguaje natural — o sube tu archivo — y recibe un dashboard ejecutivo interactivo en 60 segundos, con insights de IA.", stats: [["Tiempo de generación", "60 seg"], ["Formatos soportados", "CSV·XLSX·IMG"], ["Insight automático", "Sí"]] },
  { icon: "market", title: "Mercado", body: "El mercado de BI self-service crece 21% anual. Nuestra cuña: la PYME latina que ningún incumbente atiende en su idioma ni a su precio.", stats: [["TAM", "$62B"], ["SAM", "$8.4B"], ["SOM (5 años)", "$120M"]] },
  { icon: "product", title: "Producto", body: "Plataforma AI-native: dashboards HTML interactivos, análisis de imágenes y spreadsheets, export profesional, SEO programático de cada dashboard público.", stats: [["Modos de generación", "5"], ["Export", "HTML·PNG·PDF"], ["Time-to-value", "1 prompt"]] },
  { icon: "traction", title: "Tracción", body: "Crecimiento orgánico vía dashboards públicos indexables: cada dashboard generado es un canal de adquisición.", stats: [["MRR", "$8.5K"], ["Crecimiento m/m", "+11%"], ["Free→Pro", "8%"]] },
  { icon: "model", title: "Modelo de negocio", body: "Freemium B2B: free con límites diarios, Pro $9.99/mes con exports y dashboards ilimitados. Expansión a equipos y API.", stats: [["Ticket Pro", "$9.99/mes"], ["Margen bruto", "82%"], ["LTV/CAC", "3.4x"]] },
  { icon: "team", title: "Equipo", body: "Founder con 25+ años en e-commerce y marketing digital, profesor universitario y constructor de múltiples plataformas AI en producción.", stats: [["Plataformas lanzadas", "6+"], ["Años de industria", "25+"], ["Velocidad de shipping", "Semanal"]] },
  { icon: "ask", title: "The Ask", body: "Levantamos $650K a $3.2M pre-money para producto y go-to-market en Colombia y México: 18 meses de runway hacia $250K de ARR.", stats: [["Ronda", "$650K"], ["Pre-money", "$3.2M"], ["Runway", "18 meses"]] }
];

export default function InvestorDeck() {
  const [theme, setTheme] = useState<(typeof THEMES)[number]>(THEMES[0]);
  const [font, setFont] = useState<(typeof FONTS)[number]>(FONTS[0]);
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  const exportHtml = useMemo(() => () => {
    const slidesHtml = SLIDES.map((s, i) => `
      <section class="slide" id="s${i}">
        <div class="n">${String(i + 1).padStart(2, "0")} / ${String(SLIDES.length).padStart(2, "0")}</div>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${theme.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[s.icon]}"/></svg>
        <h2>${s.title}</h2>
        <p>${s.body}</p>
        <div class="stats">${s.stats.map(([l, v]) => `<div class="st"><div class="l">${l}</div><div class="v">${v}</div></div>`).join("")}</div>
      </section>`).join("");
    const nav = SLIDES.map((s, i) => `<a href="#s${i}">${String(i + 1).padStart(2, "0")} · ${s.title}</a>`).join("");
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Investor Deck</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Plus+Jakarta+Sans:wght@600;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{display:flex;font-family:${font.css};background:${theme.bg};color:${theme.text}}
aside{width:240px;min-height:100vh;position:sticky;top:0;padding:28px 18px;border-right:1px solid ${theme.soft};flex-shrink:0}
aside b{color:${theme.accent};display:block;font-size:18px;margin-bottom:22px;letter-spacing:-.3px}
aside a{display:block;color:${theme.text};opacity:.55;text-decoration:none;font-size:12.5px;padding:8px 10px;border-radius:8px;margin-bottom:2px}
aside a:hover{opacity:1;background:${theme.soft}}
main{flex:1}
.slide{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:8vh 8vw;border-bottom:1px solid ${theme.soft};scroll-margin-top:0}
.n{font-size:12px;letter-spacing:3px;opacity:.4;margin-bottom:18px}
h2{font-size:clamp(32px,5vw,56px);font-weight:800;letter-spacing:-1px;margin:14px 0 18px}
p{font-size:clamp(15px,1.6vw,19px);line-height:1.7;opacity:.8;max-width:640px}
.stats{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap}
.st{background:${theme.soft};border:1px solid ${theme.soft};border-radius:14px;padding:16px 22px;min-width:150px}
.st .l{font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:.55}
.st .v{font-size:26px;font-weight:800;color:${theme.accent};margin-top:4px}
@media(max-width:760px){aside{display:none}}
@media print{.slide{page-break-after:always;min-height:auto;padding:60px}}
</style></head><body>
<aside><b>INVESTOR DECK</b>${nav}</aside><main>${slidesHtml}</main>
</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = "investor-deck.html";
    a.click();
  }, [theme, font]);

  return (
    <main className="p-8 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="eyebrow">Investor Deck</div>
          <h1 className="font-display font-bold text-3xl mt-1">Deck con estructura webinar</h1>
        </div>
        <button onClick={exportHtml} className="btn-ember text-sm no-print">⬇ Export HTML completo</button>
      </div>

      {/* SELECTOR DE TEMA Y FUENTE */}
      <div className="flex flex-wrap items-center gap-5 mt-5 no-print">
        <div className="flex gap-2">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t)} title={t.name}
              className={`w-9 h-9 rounded-full border-2 transition ${theme.id === t.id ? "border-ember scale-110" : "border-line"}`}
              style={{ background: `linear-gradient(135deg, ${t.bg} 60%, ${t.accent} 60%)` }} />
          ))}
        </div>
        <span className="text-sm text-ink/50 font-medium">{theme.name}</span>
        <select value={font.id} onChange={e => setFont(FONTS.find(f => f.id === e.target.value)!)}
          className="border border-line rounded-lg px-3 py-2 text-sm bg-white">
          {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {/* PREVIEW ESTILO WEBINAR: SIDEBAR IZQUIERDO + SLIDE */}
      <div className="mt-6 rounded-2xl overflow-hidden shadow-deck flex min-h-[520px]"
        style={{ background: theme.bg, color: theme.text, fontFamily: font.css }}>
        <aside className="w-56 shrink-0 p-5 hidden md:block" style={{ borderRight: `1px solid ${theme.soft}` }}>
          <div className="font-bold mb-5" style={{ color: theme.accent }}>INVESTOR DECK</div>
          {SLIDES.map((s, i) => (
            <button key={s.title} onClick={() => setActive(i)}
              className="block w-full text-left text-xs px-3 py-2 rounded-lg mb-0.5 transition"
              style={{
                background: active === i ? theme.soft : "transparent",
                opacity: active === i ? 1 : 0.55
              }}>
              {String(i + 1).padStart(2, "0")} · {s.title}
            </button>
          ))}
        </aside>

        <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
          <div className="text-xs tracking-[3px] opacity-40">
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </div>
          <div className="mt-4"><Icon d={ICONS[slide.icon]} accent={theme.accent} /></div>
          <h2 className="font-bold mt-3" style={{ fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-1px" }}>
            {slide.title}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed" style={{ opacity: 0.8 }}>{slide.body}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            {slide.stats.map(([l, v]) => (
              <div key={l} className="rounded-xl px-5 py-3.5 min-w-[140px]" style={{ background: theme.soft }}>
                <div className="text-[10px] uppercase tracking-widest" style={{ opacity: 0.55 }}>{l}</div>
                <div className="font-bold text-xl mt-0.5" style={{ color: theme.accent }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-10 no-print">
            <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30"
              style={{ background: theme.soft }}>← Anterior</button>
            <button onClick={() => setActive(Math.min(SLIDES.length - 1, active + 1))} disabled={active === SLIDES.length - 1}
              className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-30"
              style={{ background: theme.accent, color: theme.id === "paper" || theme.id === "boardroom" ? "#fff" : theme.bg }}>
              Siguiente →</button>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink/45 mt-4">
        El export genera un HTML autocontenido con el tema y fuente seleccionados: sidebar de
        navegación, slides fullscreen con scroll, stats por slide y estilos de impresión para PDF.
        El contenido de los slides se genera desde los datos del venture en producción.
      </p>
    </main>
  );
}
