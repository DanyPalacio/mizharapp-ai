import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyAdminToken } from "@/lib/admin-auth"
import mammoth from "mammoth"
export const dynamic = "force-dynamic"
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key")

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data } = await sb.from("knowledge_base").select("id,title,file_type,chunk_count,created_at").order("created_at", { ascending: false })
  return NextResponse.json({ documents: data || [] })
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get("file") as File
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
  
  let text = ""
  const buffer = Buffer.from(await file.arrayBuffer())
  
  if (file.name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer })
    text = result.value
  } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
    text = buffer.toString("utf-8")
  } else {
    text = buffer.toString("utf-8")
  }
  
  const chunkSize = 500
  const words = text.split(" ")
  const chunks = []
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "))
  }
  
  const { error } = await sb.from("knowledge_base").insert({
    title: file.name, file_type: file.name.split(".").pop(),
    content: text, chunk_count: chunks.length,
    created_at: new Date().toISOString()
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, chunks: chunks.length })
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("x-admin-token"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  await sb.from("knowledge_base").delete().eq("id", id)
  return NextResponse.json({ ok: true })
}
