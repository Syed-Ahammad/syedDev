import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireSession } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Bookmark } from "@/models/Bookmark";
import { Project } from "@/models/Project";
import { fetchUserBookmarks } from "@/lib/bookmarks";
import { bookmarkSchema } from "@/lib/validations";

// GET /api/user/bookmarks — the signed-in user's bookmarks (populated project).
export async function GET() {
  try {
    const session = await requireSession();
    const items = await fetchUserBookmarks(session.user.id);
    return NextResponse.json({ success: true, data: { items } });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/user/bookmarks — bookmark a project. Idempotent (unique index).
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const json = await request.json().catch(() => null);
    const { projectId } = bookmarkSchema.parse(json);
    if (!isValidObjectId(projectId)) throw new HttpError(400, "Invalid project id.");

    await dbConnect();
    if (!(await Project.exists({ _id: projectId }))) {
      throw new HttpError(404, "Project not found.");
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId: session.user.id, projectId },
      { $setOnInsert: { userId: session.user.id, projectId } },
      { upsert: true, new: true },
    ).lean();

    return NextResponse.json(
      { success: true, data: { id: String(bookmark?._id) } },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
