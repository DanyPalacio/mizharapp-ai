'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: number; title: string; slug: string; excerpt: string; tags: string[]; sectors: string[]; published_at: string; author: string; read_time: number;
}

const MOCK_POSTS: BlogPost[] = [
  { id: 1, title: "How to Validate Your Startup in 48 Hours Using AI", slug: "validate-startup-48h-ai", excerpt: "A step-by-step framework for founders who want to move fast without burning runway on assumptions.", tags: ["Validation", "AI", "Strategy"], sectors: ["SaaS", "Startup"], published_at: "2026-05-23", author: "MIZHAR Analysis", read_time: 7 },
  { id: 2, title: "The VC Mindset: How Investors Really Evaluate Your Pitch", slug: "vc-mindset-pitch-evaluation", excerpt: "What VCs actually look for in early-stage startups — and how to stress-test your business against their mental models.", tags: ["Fundraising", "VC", "Pitch"], sectors: ["All Stages"], published_at: "2026-05-22", author: "MIZHAR Analysis", read_time: 9 },
  { id: 3, title: "TAM/SAM/SOM: Stop Getting It Wrong", slug: "tam-sam-som-startup-guide", excerpt: "Most founders overestimate their market. Here's how to calculate yours accurately and make it compelling to investors.", tags: ["Market Research", "Financial"], sectors: ["All Stages"], published_at: "2026-05-21", author: "MIZHAR Analysis", read_time: 6 },
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS)
  const [filter, setFilter] = useState("All")

  const allTags = ["All", ...Array.from(new Set(MOCK_POSTS.flatMap(p => p.tags)))]

  return (
    <div style={{ background: "var(--mz-white)", minHeight: "100vh" }}>
      {/* Nav */}
      <header style={{ height: 64, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--mz-border-2)", display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, background: "var(--mz-orange)", borderRadius: 6, display: "grid", placeItems: "center" }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 16V4l8 8 8-8v12" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16, letterSpacing: "0.04em" }}>MIZHAR</span>
        </Link>
        <nav style={{ display: "flex", gap: 24, fontSize: 14, color: "var(--mz-ink-2)" }}>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog" style={{ color: "var(--mz-orange)", fontWeight: 600 }}>Blog</Link>
        </nav>
        <Link href="/onboarding" style={{ padding: "7px 16px", background: "var(--mz-orange)", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Get Started</Link>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 40px" }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mz-orange)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Blog</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 48, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>
            Strategic Intelligence<br />
            <span style={{ color: "var(--mz-orange)" }}>for Founders.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--mz-ink-2)", maxWidth: 580, lineHeight: 1.6 }}>Frameworks, case studies, and tactics to help you build a venture-scale company with clarity.</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setFilter(tag)}
              style={{ padding: "6px 16px", borderRadius: 99, border: `1px solid ${filter === tag ? "var(--mz-orange)" : "var(--mz-border-2)"}`, background: filter === tag ? "var(--mz-orange)" : "white", color: filter === tag ? "white" : "var(--mz-ink-2)", fontSize: 13, fontWeight: filter === tag ? 700 : 400, cursor: "pointer", transition: "all 120ms", fontFamily: "var(--font-body)" }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {posts.filter(p => filter === "All" || p.tags.includes(filter)).map((p, i) => (
            <article key={p.id} style={{ background: i === 0 ? "var(--mz-graphite)" : "white", border: "1px solid var(--mz-border-2)", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 14, transition: "transform 150ms, box-shadow 150ms" }}>
              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ padding: "3px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: i === 0 ? "rgba(255,106,0,0.2)" : "var(--mz-orange-50)", color: "var(--mz-orange)" }}>{t}</span>
                ))}
              </div>
              {/* Title */}
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.015em", lineHeight: 1.25, color: i === 0 ? "white" : "var(--mz-ink)", flex: 1 }}>{p.title}</h2>
              {/* Excerpt */}
              <p style={{ fontSize: 14, color: i === 0 ? "rgba(255,255,255,0.65)" : "var(--mz-ink-3)", lineHeight: 1.6 }}>{p.excerpt}</p>
              {/* Meta + CTA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${i === 0 ? "rgba(255,255,255,0.08)" : "var(--mz-border-3)"}` }}>
                <div style={{ fontSize: 12, color: i === 0 ? "rgba(255,255,255,0.4)" : "var(--mz-ink-4)" }}>
                  {new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {p.read_time} min read
                </div>
                <Link href={`/blog/${p.slug}`} style={{ fontSize: 13, fontWeight: 700, color: "var(--mz-orange)", textDecoration: "none" }}>Read →</Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{ marginTop: 80, background: "var(--mz-cloud)", borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Apply these insights to your startup</h3>
          <p style={{ fontSize: 16, color: "var(--mz-ink-2)", marginBottom: 24, maxWidth: 480, margin: "12px auto 28px" }}>Get AI-powered strategic analysis tailored to your specific business, industry, and stage.</p>
          <Link href="/onboarding" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "var(--mz-orange)", color: "white", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "var(--sh-orange)" }}>
            Start Free Analysis →
          </Link>
        </div>
      </div>
    </div>
  )
}
