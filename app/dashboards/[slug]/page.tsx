import { serviceClient } from "@/lib/supabase";
import DashboardRenderer from "@/components/DashboardRenderer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Next.js 15: params es Promise
export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = serviceClient();
  const { data: d } = await db.from("dashboards").select("*").eq("slug", slug).single();
  if (!d) notFound();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <a href="/dashboards" className="text-sm text-ink/50 hover:text-ember">← Dashboards</a>
      <div className="flex items-start justify-between mt-2 mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl">{d.title}</h1>
          {d.executive_summary && <p className="mt-3 text-ink/60 max-w-2xl">{d.executive_summary}</p>}
        </div>
        <a href={`/api/export/${slug}`}
          className="btn-ember text-sm no-print shrink-0">⬇ Download HTML</a>
      </div>
      <DashboardRenderer d={d} />
    </main>
  );
}
