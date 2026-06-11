import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai";
import { serviceClient } from "@/lib/supabase";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM = `Eres el motor de VisualStats.ai, una plataforma de Visual Intelligence.
Genera un dashboard ejecutivo en JSON con esta estructura exacta:
{
  "title": string,
  "slug": string (kebab-case, en inglés),
  "category": "AI"|"Technology"|"Business"|"Startups"|"Ecommerce"|"Finance"|"Marketing"|"Social Media"|"Sports"|"Economy",
  "executive_summary": string (2-3 frases con el hallazgo principal),
  "kpi_cards": [{ "label": string, "value": string (número grande ej "96.8B"), "change": string, "trend": "up"|"down"|"neutral" }] (4),
  "charts": [{ "title": string, "type": "line"|"bar"|"pie"|"area", "x_key": string, "keys": [string], "data": [objetos] }] (2-4 charts, 6-20 puntos),
  "ai_insight": string (1 frase memorable con un dato sorprendente),
  "key_conclusions": [string] (3-4 accionables),
  "sources": [{ "name": string, "url": string, "date": string }]
}
Si recibes datos de un archivo del usuario, TODOS los KPIs y charts deben salir de esos datos reales — no inventes cifras.
Si recibes una imagen, extrae métricas, tablas, KPIs y tendencias visibles y reconstrúyelas como dashboard.
Responde ÚNICAMENTE con JSON válido, sin backticks ni preámbulo.`;

function parseSpreadsheet(buf: Buffer, name: string): string {
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheets = wb.SheetNames.slice(0, 3).map(sn => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1 }) as any[][];
    const sample = rows.slice(0, 60).map(r => r.join(",")).join("\n");
    return `--- Hoja: ${sn} (${rows.length} filas) ---\n${sample}`;
  });
  return `Archivo: ${name}\n${sheets.join("\n\n")}`;
}

async function checkLimits(req: NextRequest, hasFile: boolean) {
  // Límites del spec: Free = 1 dashboard/día y 2 archivos/día; Pro = ilimitado/20 archivos.
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return { ok: true, userId: null }; // anónimo: probar 1 vez (sin persistencia)
  const db = serviceClient();
  const { data: { user } } = await db.auth.getUser(auth.slice(7));
  if (!user) return { ok: true, userId: null };
  const { data: profile } = await db.from("profiles").select("plan,role").eq("id", user.id).single();
  const isPro = profile?.plan === "pro" || profile?.role === "admin";
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await db.from("user_usage").select("*")
    .eq("user_id", user.id).eq("usage_date", today).single();
  const dash = usage?.dashboards_generated ?? 0;
  const files = usage?.files_uploaded ?? 0;
  if (!isPro && dash >= 1) return { ok: false, userId: user.id, error: "Límite del plan Free: 1 dashboard por día. Upgrade a Pro para dashboards ilimitados." };
  if (hasFile && ((!isPro && files >= 2) || (isPro && files >= 20)))
    return { ok: false, userId: user.id, error: isPro ? "Límite Pro: 20 archivos por día." : "Límite Free: 2 archivos por día. Upgrade a Pro." };
  await db.from("user_usage").upsert({
    user_id: user.id, usage_date: today,
    dashboards_generated: dash + 1,
    files_uploaded: files + (hasFile ? 1 : 0)
  }, { onConflict: "user_id,usage_date" });
  return { ok: true, userId: user.id };
}

export async function POST(req: NextRequest) {
  try {
    let prompt = "";
    let mode = "prompt_only";
    const content: any[] = [];

    const ctype = req.headers.get("content-type") || "";
    if (ctype.includes("multipart/form-data")) {
      const form = await req.formData();
      prompt = (form.get("prompt") as string) || "Analiza este archivo y genera un dashboard";
      const file = form.get("file") as File | null;

      if (file) {
        const buf = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split(".").pop()?.toLowerCase() || "";

        if (["csv", "xls", "xlsx"].includes(ext)) {
          mode = "prompt_file";
          if (buf.length > 4_000_000) {
            return NextResponse.json({ error: "Archivo demasiado grande (máx 4MB)" }, { status: 400 });
          }
          content.push({ type: "text", text: `${prompt}\n\nDATOS DEL ARCHIVO:\n${parseSpreadsheet(buf, file.name)}` });
        } else if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
          mode = "prompt_image";
          const media = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
          content.push(
            { type: "image", source: { type: "base64", media_type: media, data: buf.toString("base64") } },
            { type: "text", text: prompt }
          );
        } else {
          return NextResponse.json({ error: `Formato .${ext} no soportado. Usa CSV, XLS, XLSX, PNG, JPG o WEBP.` }, { status: 400 });
        }
      } else {
        content.push({ type: "text", text: prompt });
      }
    } else {
      const body = await req.json();
      prompt = body.prompt;
      content.push({ type: "text", text: prompt });
    }

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
    }

    const lim = await checkLimits(req, mode !== "prompt_only");
    if (!lim.ok) return NextResponse.json({ error: lim.error }, { status: 429 });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      system: SYSTEM,
      messages: [{ role: "user", content }]
    });
    const text = msg.content.filter(b => b.type === "text").map(b => (b as any).text).join("");
    const dashboard = JSON.parse(text.replace(/```json|```/g, "").trim());
    dashboard.slug = `${dashboard.slug}-${Date.now().toString(36)}`;

    const db = serviceClient();
    const { error } = await db.from("dashboards").insert({
      user_id: lim.userId,
      title: dashboard.title,
      slug: dashboard.slug,
      prompt,
      generation_mode: mode,
      executive_summary: dashboard.executive_summary,
      kpi_cards: dashboard.kpi_cards,
      charts: dashboard.charts,
      ai_insight: dashboard.ai_insight,
      key_conclusions: dashboard.key_conclusions,
      sources: dashboard.sources,
      category: dashboard.category,
      is_public: true,
      status: "ready"
    });
    if (error) throw error;

    return NextResponse.json({ slug: dashboard.slug });
  } catch (e: any) {
    console.error("generate error:", e);
    return NextResponse.json({ error: e.message || "Error generando dashboard" }, { status: 500 });
  }
}
