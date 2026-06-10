import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// Pipeline del spec: OpenAI = razonamiento/estructura, Claude = research/análisis
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "placeholder" });
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "placeholder" });

export async function claudeJSON(system: string, user: string, maxTokens = 4000) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: system + "\nResponde ÚNICAMENTE con JSON válido, sin backticks ni preámbulo.",
    messages: [{ role: "user", content: user }]
  });
  const text = msg.content.filter(b => b.type === "text").map(b => (b as any).text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
