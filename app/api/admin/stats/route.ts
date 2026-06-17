import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { getAdminStats } from "@/lib/stats";

// GET /api/admin/stats — counts for the overview cards (admin only).
export async function GET() {
  try {
    await requireRole("admin");
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return errorResponse(error);
  }
}
