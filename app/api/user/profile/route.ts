import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { profileUpdateSchema } from "@/lib/validations";
import { getUserProfile, updateUserProfile } from "@/lib/user-profile";

// GET /api/user/profile — the signed-in user's own profile.
export async function GET() {
  try {
    const session = await requireSession();
    const profile = await getUserProfile(session.user.id);
    if (!profile) throw new HttpError(404, "Profile not found.");
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return errorResponse(error);
  }
}

// PATCH /api/user/profile — update name, bio, image, notification prefs.
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession();
    const json = await request.json().catch(() => null);
    const input = profileUpdateSchema.parse(json);

    const profile = await updateUserProfile(session.user.id, input);
    if (!profile) throw new HttpError(404, "Profile not found.");
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return errorResponse(error);
  }
}
