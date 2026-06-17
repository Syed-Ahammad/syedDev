import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireSession } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Bookmark } from "@/models/Bookmark";

// DELETE /api/user/bookmarks/[id] — remove one of the user's own bookmarks.
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/user/bookmarks/[id]">,
) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Bookmark not found.");

    await dbConnect();
    const deleted = await Bookmark.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    }).lean();
    if (!deleted) throw new HttpError(404, "Bookmark not found.");

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
