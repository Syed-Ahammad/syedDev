import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import {
  parseEndorsementListParams,
  fetchAdminEndorsements,
} from "@/lib/endorsements";

// GET /api/admin/endorsements?status=&page= — moderation queue (admin only).
export async function GET(request: NextRequest) {
  try {
    await requireRole("admin");
    const params = parseEndorsementListParams(request.nextUrl.searchParams);
    const data = await fetchAdminEndorsements(params);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
