import { serviceClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Next.js 15: params es Promise
export default async function InfographicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = serviceClient();
  const { data: inf } = await db.from("infographics").select("*").eq("slug", slug).single();
  if (!inf || !inf.is_published) notFound();

  const { data: related } = await db.from("infographics")
    .select("title,slug,category").eq("is_published", true)
    .eq("category", inf.category).neq("slug", slug).limit(3);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <a href="/infographics" className="text-sm text-ink/50 hover:text-ember">← Infographics</a>
      <div className="flex items-center gap-3 mt-3">
        <span className="eyebrow">{inf.category}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
          ${inf.is_premium ? "bg-amber-100 text-amber-700" : "bg-ember/10 text-ember"}`}>
          {inf.is_premium ? "Premium" : "Public"}
        </span>
      </div>
      <h1 className="font-display font-bold text-3xl md:text-4xl mt-2">{inf.title}</h1>

      {inf.is_premium ? (
        <div className="card mt-8 p-10 text-center border-amber-300">
          <div className="text-4xl">🔒</div>
          <h2 className="font-display font-bold text-xl mt-3">Contenido Premium</h2>
          <p className="text-ink/60 mt-2 max-w-md mx-auto">
            Esta infografía es parte del plan Pro ($9.99/mes), que incluye infografías premium,
            dashboards ilimitados, exports sin watermark y Mizhar AI.
          </p>
          <a href="/pricing" className="btn-ember inline-block mt-5 text-sm">Upgrade to Pro</a>
        </div>
      ) : (
        <>
          {inf.cover_image_url && (
            <img src={inf.cover_image_url} alt={inf.title} className="rounded-2xl mt-8 w-full" />
          )}
          <div className="card mt-8 p-7">
            <div className="eyebrow mb-2">Executive Summary</div>
            <p className="text-ink/80 leading-relaxed">{inf.executive_summary}</p>
          </div>
          <div className="card mt-5 p-7">
            <div className="eyebrow mb-3">Key Insights</div>
            <ul className="space-y-2">
              {(inf.key_insights as string[])?.map((k, i) => (
                <li key={i} className="flex gap-3 text-ink/80"><span className="text-ember font-bold">→</span>{k}</li>
              ))}
            </ul>
          </div>
          {(inf.sources as any[])?.length ? (
            <div className="card mt-5 p-7">
              <div className="eyebrow mb-3">Fuentes</div>
              <div className="flex flex-wrap gap-5 text-sm font-medium">
                {(inf.sources as any[]).map((s, i) => <span key={i}>{s.name}</span>)}
              </div>
            </div>
          ) : null}
        </>
      )}

      {related?.length ? (
        <div className="mt-10">
          <h3 className="font-semibold mb-4">Related Infographics</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(r => (
              <a key={r.slug} href={`/infographics/${r.slug}`} className="card p-5 hover:border-ember transition">
                <div className="eyebrow">{r.category}</div>
                <div className="font-semibold text-sm mt-2 leading-snug">{r.title}</div>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
