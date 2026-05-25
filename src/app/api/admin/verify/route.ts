import { NextRequest, NextResponse } from "next/server"
import { verifySuperAdmin, createAdminToken } from "@/lib/admin-auth"
export const dynamic = "force-dynamic"
export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (verifySuperAdmin(email, password)) {
    return NextResponse.json({ ok: true, token: createAdminToken(), name: "Daniel Palacio", role: "superadmin" })
  }
  return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 })
}
