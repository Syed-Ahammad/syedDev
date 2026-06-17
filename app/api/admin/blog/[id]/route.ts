import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { blogUpdateSchema } from "@/lib/validations";

// PATCH /api/admin/blog/[id] — update a post (admin only). First publish
// (published false → true) stamps publishedAt.
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/blog/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Post not found.");

    const json = await request.json().catch(() => null);
    const data = blogUpdateSchema.parse(json);

    await dbConnect();
    const existing = await BlogPost.findById(id).select("published publishedAt").lean();
    if (!existing) throw new HttpError(404, "Post not found.");

    const patch: Record<string, unknown> = { ...data };
    if (data.published === true && !existing.published) {
      patch.publishedAt = existing.publishedAt ?? new Date();
    }

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true, runValidators: true },
    ).lean();
    if (!updated) throw new HttpError(404, "Post not found.");

    // NOTE: revalidatePath('/blog', '/blog/[slug]', '/') wired in step 3.23.
    return NextResponse.json({ success: true, data: { id: String(updated._id) } });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/admin/blog/[id] — delete a post (admin only).
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/blog/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Post not found.");

    await dbConnect();
    const deleted = await BlogPost.findByIdAndDelete(id).lean();
    if (!deleted) throw new HttpError(404, "Post not found.");

    // NOTE: revalidatePath('/blog', '/') wired in step 3.23.
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
