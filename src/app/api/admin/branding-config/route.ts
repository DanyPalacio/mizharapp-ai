import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyAdminToken } from "@/lib/admin-auth"
export const dynamic = "force-dynamic"
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key")
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data } = await sb.from("branding_config").select("*").limit(1).single()
  return NextResponse.json({ config: data || defaultBranding })
}
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  await sb.from("branding_config").upsert({ ...body, id: 1, updated_at: new Date().toISOString() })
  return NextResponse.json({ ok: true })
}
const defaultBranding = {
  primaryColor: "#FF6A00", darkBg: "#1A1F24", fontDisplay: "Satoshi",
  fontBody: "Inter", logoUrl: "/logo-mizhar.png", faviconUrl: "/favicon.ico",
  siteName: "MIZHAR", tagline: "Strategic Intelligence for Founders"
}
