import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { parseLeadListParams, fetchLeads } from "@/lib/leads";

// GET /api/admin/leads?status=&page= — paginated lead inbox (admin only).
export async function GET(request: NextRequest) {
  try {
    await requireRole("admin");
    const params = parseLeadListParams(request.nextUrl.searchParams);
    const data = await fetchLeads(params);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
