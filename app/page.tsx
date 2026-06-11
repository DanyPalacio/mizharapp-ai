import { serviceClient } from "@/lib/supabase";
import PromptBox from "@/components/PromptBox";
import DashboardRenderer from "@/components/DashboardRenderer";

export const dynamic = "force-dynamic";

// HOME = VisualStats primero: prompt box → Dashboard of the Day → infografías
// → dashboards muestra → Mizhar como feature del plan Premium.
export default async function Home() {
  const db = serviceClient();
  const [{ data: dod }, { data: infos }, { data: samples }] = await Promise.all([
    db.from("dashboards").select("*").eq("is_dashboard_of_day", true).eq("status", "ready").limit(1).single(),
    db.from("infographics").select("title,slug,category,executive_summary,is_premium").eq("is_published", true).order("is_featured", { ascending: false }).limit(5),
    db.from("dashboards").select("title,slug,category,executive_summary").eq("is_public", true).eq("status", "ready").order("created_at", { ascending: false }).limit(6)
  ]);

  return (
    <main>
      <header className="bg-white border-b border-line sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-lg">
            Visual<span className="text-ember">Stats</span>.ai
          </a>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="/infographics" className="hover:text-ember">Infographics</a>
            <a href="/dashboards" className="hover:text-ember">Dashboards</a>
            <a href="/venture" className="hover:text-ember flex items-center gap-1.5">
              Mizhar AI <span className="text-[10px] bg-ember text-white font-bold px-1.5 py-0.5 rounded">PRO</span>
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium">Sign In</a>
            <a href="/pricing" className="btn-ember text-sm py-2">Upgrade</a>
          </div>
        </div>
      </header>

      {/* HERO: el prompt box es el producto */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.02] tracking-tight">
          ASK ANYTHING.
          <br />
          <span className="text-ember">GET A VISUAL DASHBOARD.</span>
        </h1>
        <p className="mt-5 text-lg text-ink/60 max-w-xl">
          Dashboards, insights y reportes visuales generados con IA en segundos —
          desde una pregunta, un spreadsheet o una imagen.
        </p>
        <PromptBox />
      </section>

      {/* DASHBOARD OF THE DAY */}
      {dod && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="eyebrow">Dashboard of the Day</div>
          <div className="card mt-3 p-8 grid lg:grid-cols-[1fr_320px] gap-8 items-center border-ember/30">
            <div>
              <span className="text-[10px] bg-ember text-white font-bold px-2 py-1 rounded uppercase tracking-widest">Featured</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-3">{dod.title}</h2>
              <p className="text-ink/60 mt-2 max-w-xl">{dod.executive_summary}</p>
              <a href={`/dashboards/${dod.slug}`} className="btn-ember inline-block mt-5 text-sm">View Dashboard →</a>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {(dod.kpi_cards as any[])?.slice(0, 4).map((k, i) => (
                <div key={i} className="bg-ink text-white rounded-xl p-4">
                  <div className="text-[9px] uppercase tracking-widest text-white/40">{k.label}</div>
                  <div className="font-display font-bold text-xl text-ember mt-1">{k.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPLORE INFOGRAPHICS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display font-bold text-2xl">Explore Infographics</h2>
          <a href="/infographics" className="text-sm font-medium text-ember">View all →</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {(infos ?? []).map(inf => (
            <a key={inf.slug} href={`/infographics/${inf.slug}`}
              className="card p-5 hover:border-ember transition flex flex-col">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full self-start uppercase
                ${inf.is_premium ? "bg-amber-100 text-amber-700" : "bg-ember/10 text-ember"}`}>
                {inf.is_premium ? "Premium" : "Public"}
              </span>
              <h3 className="font-semibold text-sm mt-3 leading-snug flex-1">{inf.title}</h3>
              <div className="eyebrow mt-3">{inf.category}</div>
            </a>
          ))}
        </div>
      </section>

      {/* DASHBOARDS MUESTRA */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display font-bold text-2xl">Dashboards generados</h2>
          <a href="/dashboards" className="text-sm font-medium text-ember">View all →</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {(samples ?? []).map(d => (
            <a key={d.slug} href={`/dashboards/${d.slug}`} className="card p-6 hover:border-ember transition">
              <div className="eyebrow">{d.category}</div>
              <h3 className="font-semibold mt-2 leading-snug">{d.title}</h3>
              <p className="text-sm text-ink/55 mt-2 line-clamp-2">{d.executive_summary}</p>
            </a>
          ))}
        </div>
      </section>

      {/* MIZHAR = FEATURE PREMIUM */}
      <section className="bg-ink text-white mt-10">
        <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-ember">
              Incluido en el plan Pro · $9.99/mes
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
              Mizhar AI — Venture Intelligence
            </h2>
            <p className="text-white/60 mt-4 max-w-lg">
              El sistema operativo estratégico para founders: valida tu startup, simula escenarios,
              genera business plans investor-grade, valuaciones, estrategia de fundraising e
              investor decks — con IA que razona como un VC partner.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="/pricing" className="btn-ember text-sm">Upgrade to Pro</a>
              <a href="/venture" className="border border-white/20 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-white/10 transition">
                Explorar Mizhar →
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Business Plan tipo deck", "Challenge Mode (VC review)", "Valuación + benchmark", "Fundraising LATAM", "Market Intelligence", "Investor Deck (6 temas)"].map(f => (
              <div key={f} className="border border-white/12 rounded-xl p-4 text-sm font-medium">
                <span className="text-ember">✦</span> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center text-sm text-ink/45">
        © 2026 VisualStats.ai — Data That Tells Stories
      </footer>
    </main>
  );
}
