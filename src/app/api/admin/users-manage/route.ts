import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyAdminToken } from "@/lib/admin-auth"
export const dynamic = "force-dynamic"
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key")
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data } = await sb.from("users").select("id,email,name,plan,usage_limit,plan_expires_at,created_at").order("created_at", { ascending: false }).limit(200)
  return NextResponse.json({ users: data || [] })
}
export async function PATCH(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { userId, plan, usageLimit, expiresAt } = await req.json()
  const { error } = await sb.from("users").update({ plan, usage_limit: usageLimit, plan_expires_at: expiresAt }).eq("id", userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
