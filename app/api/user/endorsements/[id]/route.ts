import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireSession } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Endorsement } from "@/models/Endorsement";

// DELETE /api/user/endorsements/[id] — withdraw one of the user's endorsements.
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/user/endorsements/[id]">,
) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Endorsement not found.");

    await dbConnect();
    const deleted = await Endorsement.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    }).lean();
    if (!deleted) throw new HttpError(404, "Endorsement not found.");

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
