import { serviceClient } from "@/lib/supabase";

async function cached(provider: string, key: string, ttlHours: number, fetcher: () => Promise<any>) {
  const db = serviceClient();
  const { data: hit } = await db.from("api_cache").select("payload,expires_at")
    .eq("provider", provider).eq("cache_key", key).single();
  if (hit && new Date(hit.expires_at) > new Date()) return hit.payload;
  const payload = await fetcher();
  await db.from("api_cache").upsert({
    provider, cache_key: key, payload,
    cached_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + ttlHours * 3600_000).toISOString()
  }, { onConflict: "provider,cache_key" });
  return payload;
}

// FRED: contexto macroeconómico para Challenge Mode / Market Intelligence
export async function getEconomicContext() {
  return cached("fred", "macro-core", 24, async () => {
    const key = process.env.FRED_API_KEY;
    const series = ["FEDFUNDS", "UNRATE", "CPIAUCSL"];
    const out: Record<string, any> = {};
    for (const s of series) {
      const r = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${s}&api_key=${key}&file_type=json&sort_order=desc&limit=13`
      );
      const j = await r.json();
      out[s] = (j.observations ?? []).map((o: any) => ({ date: o.date, value: parseFloat(o.value) })).reverse();
    }
    const latest = (s: string) => out[s]?.at(-1)?.value ?? null;
    return {
      series: out,
      fed_funds: latest("FEDFUNDS"),
      unemployment: latest("UNRATE"),
      fundraising_climate: (latest("FEDFUNDS") ?? 5) > 4 ? "challenging" : "favorable"
    };
  });
}

// NewsAPI: señales de mercado por industria
export async function getIndustryNews(industry: string) {
  return cached("newsapi", industry.toLowerCase(), 12, async () => {
    const r = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(industry)}&language=en&sortBy=publishedAt&pageSize=8&apiKey=${process.env.NEWS_API_KEY}`
    );
    const j = await r.json();
    return (j.articles ?? []).map((a: any) => ({
      title: a.title, source: a.source?.name, url: a.url, publishedAt: a.publishedAt
    }));
  });
}
