import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { userUpdateSchema } from "@/lib/validations";
import { deleteUserWithCascade, updateUser } from "@/lib/users";

// PATCH /api/admin/users/[id] — change role or suspend/reinstate (admin only).
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/users/[id]">,
) {
  try {
    const session = await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "User not found.");
    if (id === session.user.id)
      throw new HttpError(400, "You can't change your own account here.");

    const json = await request.json().catch(() => null);
    const patch = userUpdateSchema.parse(json);

    const user = await updateUser(id, patch);
    if (!user) throw new HttpError(404, "User not found.");

    // No public revalidation: /admin/* pages are force-dynamic.
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/admin/users/[id] — delete user + cascade bookmarks/endorsements.
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/users/[id]">,
) {
  try {
    const session = await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "User not found.");
    if (id === session.user.id)
      throw new HttpError(400, "You can't delete your own account.");

    const ok = await deleteUserWithCascade(id);
    if (!ok) throw new HttpError(404, "User not found.");

    // No public revalidation: /admin/* pages are force-dynamic.
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
