import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { Project } from "@/models/Project";
import { fetchAdminProjects } from "@/lib/projects";
import { revalidateProject } from "@/lib/revalidate";
import { projectCreateSchema } from "@/lib/validations";

// GET /api/admin/projects?page= — all projects incl. drafts (admin only).
export async function GET(request: NextRequest) {
  try {
    await requireRole("admin");
    const page = Math.max(
      1,
      Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1,
    );
    const data = await fetchAdminProjects(page);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/admin/projects — create a project (admin only).
export async function POST(request: NextRequest) {
  try {
    await requireRole("admin");
    const json = await request.json().catch(() => null);
    const data = projectCreateSchema.parse(json);

    await dbConnect();
    if (await Project.findOne({ slug: data.slug })) {
      throw new HttpError(409, "A project with this slug already exists.");
    }
    const project = await Project.create(data);

    revalidateProject(project.slug);
    return NextResponse.json(
      { success: true, data: { id: String(project._id), slug: project.slug } },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
