"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Shield, FileText, Megaphone, TrendingUp,
  Globe, LayoutGrid, Users, DollarSign, Layers, RefreshCcw,
  Monitor, MessageSquare, Upload, FolderOpen, Settings,
  Sparkles, ChevronDown
} from "lucide-react"

const NAV_MAIN = [
  { key: "overview",     label: "Overview",           icon: LayoutDashboard, href: "/app/startup/overview" },
  { key: "challenge",    label: "Challenge Mode",     icon: Shield,          href: "/app/startup/challenge",    badge: "PRO" },
  { key: "business",     label: "Business Plan",      icon: FileText,        href: "/app/startup/plan" },
  { key: "marketing",    label: "Marketing Plan",     icon: Megaphone,       href: "/app/startup/marketing" },
  { key: "financials",   label: "Financials",         icon: TrendingUp,      href: "/app/startup/financials" },
  { key: "market",       label: "Market Intelligence",icon: Globe,           href: "/app/startup/market" },
  { key: "swot",         label: "SWOT Analysis",      icon: LayoutGrid,         href: "/app/startup/swot" },
  { key: "competitors",  label: "Competitors",        icon: Users,           href: "/app/startup/competitors" },
  { key: "valuation",    label: "Valuation",          icon: DollarSign,      href: "/app/startup/valuation",    badge: "PRO" },
  { key: "fundraising",  label: "Fundraising",        icon: Layers,          href: "/app/startup/fundraising",  badge: "PRO" },
  { key: "simulations",  label: "Simulations",        icon: RefreshCcw,      href: "/app/startup/simulations",  badge: "PRO" },
  { key: "deck",         label: "Investor Deck",      icon: Monitor,         href: "/app/startup/deck" },
  { key: "chat",         label: "AI Chat",            icon: MessageSquare,   href: "/app/startup/chat" },
]

const NAV_BOTTOM = [
  { key: "exports",   label: "Exports",   icon: Upload,     href: "/app/startup/exports" },
  { key: "documents", label: "Documents", icon: FolderOpen, href: "/app/startup/documents" },
  { key: "settings",  label: "Settings",  icon: Settings,   href: "/app/startup/settings" },
]

interface SidebarProps {
  workspace?: string
  plan?: "free" | "pro"
  userInitials?: string
  userName?: string
}

export default function Sidebar({
  workspace = "Tesla Energy Expansion",
  plan = "free",
  userInitials = "DP",
  userName = "Daniel Palacio",
}: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">M</div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span className="sidebar__brand-name">MIZHAR</span>
          <span className="sidebar__brand-tag">Strategic Intelligence<br />for Founders</span>
        </div>
      </div>

      <div className="workspace-pill">
        <div className="workspace-pill__icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        </div>
        <div className="workspace-pill__text">
          <div className="workspace-pill__name">{workspace}</div>
          <div className="workspace-pill__sub">Active Workspace</div>
        </div>
        <ChevronDown size={12} style={{ color: "var(--mz-ink-on-dark-3)" }} />
      </div>

      <nav className="sidebar__nav">
        {NAV_MAIN.map(({ key, label, icon: Icon, href, badge }) => (
          <Link
            key={key}
            href={href}
            className={`nav-item ${isActive(href) ? "nav-item--active" : ""}`}
          >
            <Icon className="nav-item__icon" size={18} />
            <span>{label}</span>
            {badge && (
              <span className="nav-item__badge nav-item__badge--lock">{badge}</span>
            )}
          </Link>
        ))}

        <div className="sidebar__group-label">Workspace</div>

        {NAV_BOTTOM.map(({ key, label, icon: Icon, href }) => (
          <Link
            key={key}
            href={href}
            className={`nav-item ${isActive(href) ? "nav-item--active" : ""}`}
          >
            <Icon className="nav-item__icon" size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {plan === "free" && (
        <div className="sidebar__upsell">
          <div className="sidebar__upsell-icon">
            <Sparkles size={14} />
          </div>
          <div className="sidebar__upsell-text">
            Unlock unlimited<br />analyses & exports
          </div>
          <Link href="/pricing" className="btn btn--primary btn--sm" style={{ width: "100%", justifyContent: "center" }}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      <div className="sidebar__user">
        <div className="sidebar__avatar">{userInitials}</div>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div className="sidebar__user-name">{userName}</div>
          <div className="sidebar__user-role">{plan === "pro" ? "Pro Plan" : "Founder · Free"}</div>
        </div>
        <ChevronDown size={14} style={{ color: "var(--mz-ink-on-dark-3)" }} />
      </div>
    </aside>
  )
}
