import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { fetchAdminUsers, parseUserListParams } from "@/lib/users";

// GET /api/admin/users?role=&page= — list + filter (admin only).
export async function GET(request: NextRequest) {
  try {
    await requireRole("admin");
    const params = parseUserListParams(request.nextUrl.searchParams);
    const result = await fetchAdminUsers(params);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return errorResponse(error);
  }
}
