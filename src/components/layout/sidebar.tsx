"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Shield, FileText, Megaphone, TrendingUp,
  Globe, LayoutGrid, Users, DollarSign, Layers, RefreshCcw,
  Monitor, MessageSquare, Upload, FolderOpen, Settings,
  Sparkles, ChevronDown, BarChart3, ChevronRight
} from "lucide-react"

const NAV_MAIN = [
  { key: "overview",     label: "Overview",           icon: LayoutDashboard, href: "/app/startup/overview" },
  { key: "challenge",    label: "Challenge Mode",     icon: Shield,          href: "/app/startup/challenge",   badge: "PRO" },
  { key: "business",     label: "Business Plan",      icon: FileText,        href: "/app/startup/plan" },
  { key: "marketing",    label: "Marketing Plan",     icon: Megaphone,       href: "/app/startup/marketing" },
  { key: "financials",   label: "Financials",         icon: TrendingUp,      href: "/app/startup/financials" },
  { key: "market",       label: "Market Intelligence",icon: Globe,           href: "/app/startup/market" },
  { key: "swot",         label: "SWOT Analysis",      icon: LayoutGrid,      href: "/app/startup/swot" },
  { key: "competitors",  label: "Competitors",        icon: Users,           href: "/app/startup/competitors" },
  { key: "valuation",    label: "Valuation",          icon: DollarSign,      href: "/app/startup/valuation",   badge: "PRO" },
  { key: "fundraising",  label: "Fundraising",        icon: Layers,          href: "/app/startup/fundraising", badge: "PRO" },
  { key: "simulations",  label: "Simulations",        icon: RefreshCcw,      href: "/app/startup/simulations", badge: "PRO" },
  { key: "deck",         label: "Investor Deck",      icon: Monitor,         href: "/app/startup/deck" },
  { key: "chat",         label: "AI Chat",            icon: MessageSquare,   href: "/app/startup/chat" },
  { key: "analytics",   label: "Analytics",           icon: BarChart3,       href: "/app/startup/analytics" },
]

const NAV_BOTTOM = [
  { key: "exports",   label: "Exports",   icon: Upload,     href: "/app/startup/exports" },
  { key: "documents", label: "Documents", icon: FolderOpen, href: "/app/startup/documents" },
  { key: "settings",  label: "Settings",  icon: Settings,   href: "/app/startup/settings" },
]

/* ── MIZHAR M MARK ────────────────────────────────────────────── */
function MizharMark({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      background: "var(--mz-orange)",
      borderRadius: 7,
      display: "grid", placeItems: "center",
      flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="white">
        <path d="M2 16V4l8 8 8-8v12M2 4l8 8 8-8" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
  )
}

/* ── NAV ITEM ─────────────────────────────────────────────────── */
function NavItem({ item, active }: { item: typeof NAV_MAIN[0]; active: boolean }) {
  const Icon = item.icon
  return (
    <Link href={item.href} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 10px",
      borderRadius: "var(--r-sm)",
      fontSize: 13,
      fontWeight: active ? 600 : 500,
      color: active ? "white" : "var(--mz-ink-on-dark-2)",
      background: active ? "rgba(255,106,0,0.18)" : "transparent",
      transition: "all var(--t-fast) var(--ease-out)",
      textDecoration: "none",
      position: "relative",
    }}
    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)" }}
    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent" }}
    >
      <Icon size={15} style={{ color: active ? "var(--mz-orange)" : "var(--mz-ink-on-dark-3)", flexShrink: 0 }} />
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {item.label}
      </span>
      {item.badge && (
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
          padding: "2px 5px", borderRadius: 3,
          background: item.badge === "PRO" ? "rgba(255,106,0,0.22)" : "rgba(255,255,255,0.1)",
          color: item.badge === "PRO" ? "var(--mz-orange)" : "var(--mz-ink-on-dark-3)",
        }}>
          {item.badge}
        </span>
      )}
      {active && (
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 18, borderRadius: "0 2px 2px 0",
          background: "var(--mz-orange)",
        }} />
      )}
    </Link>
  )
}

/* ── SIDEBAR ──────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      background: "var(--mz-graphite)",
      color: "var(--mz-ink-on-dark)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 14px",
      gap: 16,
      position: "sticky",
      top: 0,
      height: "100vh",
      width: "var(--layout-sidebar-w)",
      overflowY: "auto",
    }}>

      {/* Brand */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "2px 4px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <MizharMark size={32} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 17, letterSpacing: "0.04em", color: "white" }}>
            MIZHAR
          </div>
          <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "var(--mz-ink-on-dark-3)", marginTop: 4, textTransform: "uppercase" }}>
            Strategic Intelligence
          </div>
        </div>
      </div>

      {/* Workspace Pill */}
      <div style={{
        background: "var(--mz-graphite-2)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "var(--r-md)",
        padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: "rgba(255,106,0,0.15)",
          color: "var(--mz-orange)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Sparkles size={13} />
        </div>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            My Startup
          </div>
          <div style={{ fontSize: 11, color: "var(--mz-ink-on-dark-3)", marginTop: 3 }}>
            Free Plan
          </div>
        </div>
        <ChevronDown size={12} style={{ color: "var(--mz-ink-on-dark-3)", flexShrink: 0 }} />
      </div>

      {/* Main Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--mz-ink-on-dark-3)", padding: "8px 10px 4px", fontWeight: 600 }}>
          Analysis
        </div>
        {NAV_MAIN.map(item => (
          <NavItem key={item.key} item={item} active={pathname?.startsWith(item.href) ?? false} />
        ))}
      </nav>

      {/* Bottom Nav */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_BOTTOM.map(item => (
          <NavItem key={item.key} item={item} active={pathname?.startsWith(item.href) ?? false} />
        ))}
      </div>

      {/* User / Upgrade */}
      <div style={{
        background: "var(--mz-graphite-2)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "var(--r-md)",
        padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--mz-orange), var(--mz-orange-700))",
          display: "grid", placeItems: "center",
          fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
        }}>D</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Daniel Palacio</div>
          <div style={{ fontSize: 11, color: "var(--mz-ink-on-dark-3)", marginTop: 1 }}>Pro Plan</div>
        </div>
        <ChevronRight size={12} style={{ color: "var(--mz-ink-on-dark-3)" }} />
      </div>
    </aside>
  )
}
