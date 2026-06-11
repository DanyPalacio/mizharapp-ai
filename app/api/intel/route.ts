import { NextRequest, NextResponse } from "next/server";
import { getEconomicContext, getIndustryNews } from "@/lib/intel";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const industry = req.nextUrl.searchParams.get("industry") || "startups";
    const [economic, news] = await Promise.all([getEconomicContext(), getIndustryNews(industry)]);
    return NextResponse.json({ economic, news });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
