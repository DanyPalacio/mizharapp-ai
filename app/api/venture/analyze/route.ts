import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai";
import { serviceClient } from "@/lib/supabase";
import { getEconomicContext, getIndustryNews } from "@/lib/intel";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM = `Eres el motor de inteligencia de Mizhar, un Venture OS para founders.
Combinas metodología de Harvard Case Method, frameworks McKinsey (MECE, Porter, unit economics)
y razonamiento de VC (YC, Sequoia). Nunca validas fantasías: eres escéptico pero basado en evidencia.

Recibirás la descripción de un startup, respuestas de una entrevista estratégica y contexto
de mercado en vivo (datos macro FRED + noticias del sector). Genera un análisis en JSON exacto:
{
  "venture_score": number (0-100),
  "score_breakdown": [
    { "dimension": "Market Opportunity"|"Strategic Risk"|"Unit Economics"|"Fundraising Readiness"|"Founder Readiness"|"Timing",
      "score": number (0-100), "weight": number (suma 100), "rationale": string (2-3 frases ESPECÍFICAS a este startup, citando supuestos del founder y contexto de mercado) }
  ] (6 dimensiones),
  "archetype": string (qué tipo de negocio ES realmente: ej "vertical SaaS", "servicios disfrazados de SaaS", "logistics-heavy"),
  "backability": "venture-backable"|"bootstrap"|"lifestyle"|"operational"|"enterprise-scale"|"niche",
  "challenges": [ { "severity": number (0-100), "level": "Crítico"|"Alto"|"Medio", "title": string, "detail": string (crítica VC específica + recomendación accionable) } ] (4-6),
  "strategic_rewrite": string (1 párrafo: arquitectura de negocio más fuerte que el founder debería considerar),
  "economic_context_note": string (1-2 frases sobre cómo el clima macro actual afecta a ESTE startup)
}
Responde SOLO JSON válido, sin backticks.`;

export async function POST(req: NextRequest) {
  try {
    const { name, description, industry, answers, userId } = await req.json();
    if (!description?.trim()) return NextResponse.json({ error: "Descripción requerida" }, { status: 400 });

    // Intel en vivo (FRED + News) — tolerante a fallos
    let economic: any = null, news: any[] = [];
    try { [economic, news] = await Promise.all([getEconomicContext(), getIndustryNews(industry || description.slice(0, 40))]); } catch {}

    const user = `STARTUP: ${name || "Sin nombre"}
DESCRIPCIÓN: ${description}
INDUSTRIA: ${industry || "por inferir"}
ENTREVISTA ESTRATÉGICA: ${JSON.stringify(answers || {})}
CONTEXTO MACRO (FRED): ${economic ? `Fed funds ${economic.fed_funds}%, desempleo ${economic.unemployment}%, clima de fundraising: ${economic.fundraising_climate}` : "no disponible"}
NOTICIAS RECIENTES DEL SECTOR: ${news.slice(0, 5).map((n: any) => n.title).join(" | ") || "no disponibles"}`;

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 5000,
      system: SYSTEM,
      messages: [{ role: "user", content: user }]
    });
    const text = msg.content.filter(b => b.type === "text").map(b => (b as any).text).join("");
    const analysis = JSON.parse(text.replace(/```json|```/g, "").trim());

    // Persistir venture (si hay usuario autenticado)
    let ventureId: string | null = null;
    if (userId) {
      const db = serviceClient();
      const { data } = await db.from("ventures").insert({
        user_id: userId,
        name: name || "Mi startup",
        description,
        industry,
        interview_answers: answers || {},
        venture_score: analysis.venture_score,
        score_breakdown: analysis.score_breakdown,
        ai_analysis: analysis,
        status: "active"
      }).select("id").single();
      ventureId = data?.id ?? null;
      if (ventureId) {
        await db.from("venture_documents").insert({
          venture_id: ventureId, doc_type: "challenge_mode",
          content: { challenges: analysis.challenges, strategic_rewrite: analysis.strategic_rewrite }
        });
      }
    }

    return NextResponse.json({ analysis, ventureId });
  } catch (e: any) {
    console.error("venture analyze error:", e);
    return NextResponse.json({ error: e.message || "Error en el análisis" }, { status: 500 });
  }
}
