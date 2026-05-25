import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyAdminToken } from "@/lib/admin-auth"
export const dynamic = "force-dynamic"
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key")
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const [plans, coupons] = await Promise.all([
    sb.from("pricing_plans").select("*"),
    sb.from("coupons").select("*").order("created_at", { ascending: false })
  ])
  return NextResponse.json({ plans: plans.data || [], coupons: coupons.data || [] })
}
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  if (body.type === "coupon") {
    const { error } = await sb.from("coupons").insert({ code: body.code, discount_pct: body.discountPct, max_uses: body.maxUses, expires_at: body.expiresAt, created_at: new Date().toISOString() })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  await sb.from("coupons").delete().eq("id", id)
  return NextResponse.json({ ok: true })
}
