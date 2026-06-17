import { NextResponse, type NextRequest } from "next/server";
import {
  getProjectBySlugCountingView,
  getRelatedProjects,
} from "@/lib/projects";

// GET /api/projects/[slug] — one published project (increments its view count)
// plus up to 3 related projects of the same type.
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/projects/[slug]">,
) {
  try {
    const { slug } = await ctx.params;
    const project = await getProjectBySlugCountingView(slug);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 },
      );
    }

    const related = await getRelatedProjects(project);
    return NextResponse.json({ success: true, data: { project, related } });
  } catch (error) {
    console.error("GET /api/projects/[slug] failed", error);
    return NextResponse.json(
      { success: false, error: "Failed to load project." },
      { status: 500 },
    );
  }
}
