// Pricing del spec: Free vs Pro $9.99 — Mizhar AI incluido en Pro.
const FREE = ["1 dashboard por día", "2 archivos subidos por día", "Infografías públicas", "Exports con watermark", "Insights básicos"];
const PRO = ["Dashboards ilimitados", "Hasta 20 archivos por día", "Infografías premium", "Export HTML, PNG y PDF", "Guardar dashboards + historial", "Sin watermark", "✦ Mizhar AI — Venture Intelligence completo"];

const PAYPAL_URL = process.env.NEXT_PUBLIC_PAYPAL_PLAN_URL || "/login";

export default function Pricing() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <a href="/" className="text-sm text-ink/50 hover:text-ember">← Home</a>
      <h1 className="font-display font-bold text-4xl mt-2 text-center">Elige tu plan</h1>
      <p className="text-ink/60 text-center mt-2">Cancela cuando quieras.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="card p-8">
          <h2 className="font-display font-bold text-xl">Free</h2>
          <div className="mt-3"><span className="kpi-value">$0</span> <span className="text-ink/50 text-sm">para siempre</span></div>
          <ul className="mt-6 space-y-3 text-sm">
            {FREE.map(f => <li key={f} className="flex gap-2.5"><span className="text-green-600 font-bold">✓</span>{f}</li>)}
          </ul>
          <a href="/login" className="block text-center border border-line rounded-xl px-5 py-3 mt-8 font-semibold text-sm hover:border-ink transition">
            Get Started
          </a>
        </div>

        <div className="card p-8 border-ember ring-1 ring-ember/30 relative">
          <span className="absolute -top-3 left-8 bg-ember text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Incluye Mizhar AI
          </span>
          <h2 className="font-display font-bold text-xl">Pro</h2>
          <div className="mt-3"><span className="kpi-value text-ember">$9.99</span> <span className="text-ink/50 text-sm">/ mes</span></div>
          <ul className="mt-6 space-y-3 text-sm">
            {PRO.map(f => (
              <li key={f} className={`flex gap-2.5 ${f.startsWith("✦") ? "font-semibold text-ember" : ""}`}>
                <span className="text-green-600 font-bold">✓</span>{f}
              </li>
            ))}
          </ul>
          <a href={PAYPAL_URL} className="btn-ember block text-center mt-8 text-sm">Upgrade to Pro — $9.99/mes</a>
          <p className="text-xs text-ink/45 text-center mt-3">Pago con PayPal o MercadoPago · Cancel anytime</p>
        </div>
      </div>
    </main>
  );
}
