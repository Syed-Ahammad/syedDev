import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { adminProfileSchema } from "@/lib/validations";
import { getProfile, updateProfile } from "@/lib/profile";
import { revalidateProfile } from "@/lib/revalidate";

// GET /api/admin/profile — read the Profile singleton (admin only).
export async function GET() {
  try {
    await requireRole("admin");
    const profile = await getProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return errorResponse(error);
  }
}

// PATCH /api/admin/profile — update the Profile singleton (admin only).
export async function PATCH(request: NextRequest) {
  try {
    await requireRole("admin");
    const json = await request.json().catch(() => null);
    const input = adminProfileSchema.parse(json);

    const profile = await updateProfile(input);
    revalidateProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return errorResponse(error);
  }
}
