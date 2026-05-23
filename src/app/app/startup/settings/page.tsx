"use client"

import Topbar from "@/components/layout/topbar"
import { Bell, Lock, Users, Trash2 } from "lucide-react"

const SETTINGS_SECTIONS = [
  { icon: Bell, label: "Notifications", desc: "Email alerts and digest frequency" },
  { icon: Lock, label: "Security & Privacy", desc: "Password, two-factor, data sharing" },
  { icon: Users, label: "Team & Billing", desc: "Invite members, manage subscription" },
  { icon: Trash2, label: "Danger Zone", desc: "Delete workspace, export data" },
]

export default function SettingsPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "Startup" }, { label: "Settings" }]} />
      <div style={{ padding: "32px 40px", maxWidth: 800 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--mz-ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>Workspace Settings</h1>
        <p style={{ fontSize: 15, color: "var(--mz-ink-3)", marginBottom: 32 }}>Manage your venture profile, team access, and account preferences.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SETTINGS_SECTIONS.map(section => (
            <a key={section.label} href="#" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "var(--mz-white)", border: "1px solid var(--mz-border-2)", borderRadius: 12, cursor: "pointer", textDecoration: "none", transition: "border-color var(--t-fast) var(--ease-out)" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--mz-orange)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--mz-border-2)"}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--mz-cloud)", display: "grid", placeItems: "center" }}>
                <section.icon size={18} style={{ color: "var(--mz-orange)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--mz-ink)" }}>{section.label}</div>
                <div style={{ fontSize: 12, color: "var(--mz-ink-4)", marginTop: 2 }}>{section.desc}</div>
              </div>
              <span style={{ color: "var(--mz-ink-3)" }}>→</span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
