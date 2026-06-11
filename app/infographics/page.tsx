import { serviceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function InfographicsIndex() {
  const db = serviceClient();
  const { data } = await db.from("infographics")
    .select("title,slug,category,executive_summary,is_premium")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <a href="/" className="text-sm text-ink/50 hover:text-ember">← Home</a>
      <h1 className="font-display font-bold text-4xl mt-2">Infographics</h1>
      <p className="text-ink/60 mt-2">Inteligencia visual curada: datos, tendencias e insights del equipo VisualStats.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {(data ?? []).map(inf => (
          <a key={inf.slug} href={`/infographics/${inf.slug}`}
            className="card p-6 hover:border-ember transition flex flex-col">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{inf.category}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                ${inf.is_premium ? "bg-amber-100 text-amber-700" : "bg-ember/10 text-ember"}`}>
                {inf.is_premium ? "Premium" : "Public"}
              </span>
            </div>
            <h2 className="font-semibold text-lg mt-3 leading-snug">{inf.title}</h2>
            <p className="text-sm text-ink/55 mt-2 line-clamp-3 flex-1">{inf.executive_summary}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
