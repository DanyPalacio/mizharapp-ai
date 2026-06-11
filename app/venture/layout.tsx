const NAV = [
  { href: "/venture", label: "Overview", icon: "◳" },
  { href: "/venture/challenge", label: "Challenge Mode", icon: "⚠" },
  { href: "/venture/business-plan", label: "Business Plan", icon: "▤" },
  { href: "/venture/marketing-plan", label: "Marketing Plan", icon: "◎" },
  { href: "/venture/financials", label: "Financials", icon: "Σ" },
  { href: "/venture/market-intelligence", label: "Market Intelligence", icon: "◈" },
  { href: "/venture/valuation", label: "Valuation", icon: "◆" },
  { href: "/venture/fundraising", label: "Fundraising", icon: "↗" },
  { href: "/venture/simulations", label: "Simulations", icon: "∿" },
  { href: "/venture/investor-deck", label: "Investor Deck", icon: "▣" }
];

import ProGate from "@/components/ProGate";

export default function VentureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-ink text-white flex flex-col shrink-0 no-print">
        <div className="px-5 py-6">
          <div className="font-display font-bold text-lg tracking-wide">MIZHAR</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
            Strategic Intelligence
          </div>
        </div>
        <a href="/venture/new" className="mx-3 mb-2 flex items-center justify-center gap-2 bg-ember text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition">+ Nuevo análisis</a>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(n => (
            <a key={n.href} href={n.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition">
              <span className="text-ember w-4 text-center">{n.icon}</span>{n.label}
            </a>
          ))}
        </nav>
        <div className="p-4">
          <a href="/pricing" className="block text-center btn-ember text-sm">Upgrade to Pro</a>
        </div>
      </aside>
      <div className="flex-1 bg-cloud"><ProGate />{children}</div>
    </div>
  );
}
