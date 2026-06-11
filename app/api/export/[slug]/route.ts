import { NextRequest, NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase";
import { dashboardToHtml } from "@/lib/dashboardHtml";

export const dynamic = "force-dynamic";

// Next.js 15: params es Promise
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = serviceClient();
  const { data: d } = await db.from("dashboards").select("*").eq("slug", slug).single();
  if (!d) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const html = dashboardToHtml(d);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.html"`
    }
  });
}
