import { serviceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardsIndex() {
  const db = serviceClient();
  const { data } = await db.from("dashboards")
    .select("title,slug,category,created_at")
    .eq("is_public", true).eq("status", "ready")
    .order("created_at", { ascending: false }).limit(24);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-4xl">Dashboards</h1>
      <p className="text-ink/60 mt-2">Dashboards generados con IA a partir de datos reales.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {(data ?? []).map(d => (
          <a key={d.slug} href={`/dashboards/${d.slug}`} className="card p-6 hover:border-ember transition">
            <div className="eyebrow">{d.category}</div>
            <h2 className="font-semibold text-lg mt-2">{d.title}</h2>
          </a>
        ))}
        {!data?.length && <p className="text-ink/50">Aún no hay dashboards públicos. Genera el primero desde el home.</p>}
      </div>
    </main>
  );
}
