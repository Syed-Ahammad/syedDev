import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Project } from "@/models/Project";
import { projectUpdateSchema } from "@/lib/validations";

// PATCH /api/admin/projects/[id] — update a project incl. status (admin only).
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/projects/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Project not found.");

    const json = await request.json().catch(() => null);
    const data = projectUpdateSchema.parse(json);

    await dbConnect();
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).lean();
    if (!project) throw new HttpError(404, "Project not found.");

    // NOTE: revalidatePath('/', '/projects', '/projects/[slug]') is wired in 3.23.
    return NextResponse.json({ success: true, data: { id: String(project._id) } });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/admin/projects/[id] — delete a project (admin only).
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/projects/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Project not found.");

    await dbConnect();
    const deleted = await Project.findByIdAndDelete(id).lean();
    if (!deleted) throw new HttpError(404, "Project not found.");

    // NOTE: revalidatePath('/', '/projects', '/projects/[slug]') is wired in 3.23.
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
