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
