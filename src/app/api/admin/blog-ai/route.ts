import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { verifyAdminToken } from "@/lib/admin-auth"
export const dynamic = "force-dynamic"
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key")
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "placeholder-key" })

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data } = await sb.from("blog_posts").select("id,title,slug,status,created_at,word_count").order("created_at", { ascending: false })
  return NextResponse.json({ posts: data || [] })
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, keywords, wordCount = 1200, internalLinks = [], action } = await req.json()
  
  if (action === "generate") {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `Write a ${wordCount}-word SEO blog post for MIZHAR (AI strategic intelligence platform for founders).
Title: "${title}"
Target keywords: ${keywords.join(", ")}
Internal links to include: ${internalLinks.join(", ")}

Requirements:
- Professional, founder-focused tone
- Include H2/H3 headers
- Include target keywords naturally (density 1-2%)
- Add 2-3 internal links to: ${internalLinks.length > 0 ? internalLinks.join(", ") : "https://mizhar-ai.com/pricing, https://mizhar-ai.com/onboarding"}
- Include a CTA at the end pointing to MIZHAR
- Format in Markdown
- Add meta description (max 155 chars) at the top as: META: [description]`
      }]
    })
    const content = msg.content[0].type === "text" ? msg.content[0].text : ""
    const metaMatch = content.match(/META: (.+)\n/)
    const metaDescription = metaMatch ? metaMatch[1] : title
    const cleanContent = content.replace(/META: .+\n/, "")
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const wordCountActual = cleanContent.split(" ").length
    const { data: post, error } = await sb.from("blog_posts").insert({
      title, slug, content: cleanContent, meta_description: metaDescription,
      keywords, status: "draft", word_count: wordCountActual,
      created_at: new Date().toISOString()
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, post })
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, status, title, content } = await req.json()
  const { error } = await sb.from("blog_posts").update({ status, title, content, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
