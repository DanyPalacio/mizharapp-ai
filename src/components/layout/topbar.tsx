"use client"

import Link from "next/link"
import { Share2, Upload } from "lucide-react"

type Crumb = string | { label: string; href?: string }
type MetaItem = string | { label: string }

interface TopbarProps {
  crumbs?: Crumb[]
  meta?: MetaItem[]
  actions?: React.ReactNode
}

export default function Topbar({ crumbs = [], meta = [], actions }: TopbarProps) {
  const crumbLabel = (c: Crumb) => typeof c === "string" ? c : c.label
  const crumbHref  = (c: Crumb) => typeof c === "string" ? undefined : c.href
  const metaLabel  = (m: MetaItem) => typeof m === "string" ? m : m.label

  return (
    <header className="topbar">
      <div className="topbar__crumbs">
        {crumbs.map((crumb, i) => {
          const label = crumbLabel(crumb)
          const href  = crumbHref(crumb)
          return (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className="sep">/</span>}
              {href
                ? <Link href={href} style={{ color: "var(--mz-ink-3)", textDecoration: "none" }}>{label}</Link>
                : <span className={i === crumbs.length - 1 ? "current" : ""}>{label}</span>
              }
            </span>
          )
        })}
      </div>

      {meta.length > 0 && (
        <div className="topbar__meta">
          {meta.map((m, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {i > 0 && <span style={{ color: "var(--mz-ink-4)" }}>·</span>}
              {metaLabel(m)}
            </span>
          ))}
        </div>
      )}

      <div className="topbar__actions">
        {actions ?? (
          <>
            <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
              <Share2 size={14} /> Share
            </button>
            <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
              <Upload size={14} /> Export
            </button>
            <Link href="/pricing" className="btn btn--primary btn--sm">
              Upgrade to Pro
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
