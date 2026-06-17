import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { getAnalytics, parseAnalyticsRange } from "@/lib/analytics";

// GET /api/admin/analytics?range= — time-series + breakdowns for charts (admin).
export async function GET(request: NextRequest) {
  try {
    await requireRole("admin");
    const weeks = parseAnalyticsRange(request.nextUrl.searchParams);
    const data = await getAnalytics(weeks);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
