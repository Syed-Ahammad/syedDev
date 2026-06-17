import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { leadUpdateSchema } from "@/lib/validations";

// PATCH /api/admin/leads/[id] — update a lead's status (admin only).
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/leads/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Lead not found.");

    const json = await request.json().catch(() => null);
    const { status } = leadUpdateSchema.parse(json);

    await dbConnect();
    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!lead) throw new HttpError(404, "Lead not found.");

    return NextResponse.json({
      success: true,
      data: { id: String(lead._id), status: lead.status },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/admin/leads/[id] — delete a lead (admin only).
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/leads/[id]">,
) {
  try {
    await requireRole("admin");
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new HttpError(404, "Lead not found.");

    await dbConnect();
    const deleted = await Lead.findByIdAndDelete(id).lean();
    if (!deleted) throw new HttpError(404, "Lead not found.");

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
