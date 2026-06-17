import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { endorsementModerationSchema } from "@/lib/validations";
import { setEndorsementStatus } from "@/lib/endorsements";
import { revalidateEndorsements } from "@/lib/revalidate";

// PATCH /api/admin/endorsements/[id] — approve / reject / return to pending.
// Atomically syncs the attached project's endorsementCount (admin only).
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/endorsements/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Endorsement not found.");

    const json = await request.json().catch(() => null);
    const { status } = endorsementModerationSchema.parse(json);

    const result = await setEndorsementStatus(id, status);
    if (!result) throw new HttpError(404, "Endorsement not found.");

    revalidateEndorsements(result.projectSlug);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return errorResponse(error);
  }
}
