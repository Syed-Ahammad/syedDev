import { NextResponse, type NextRequest } from "next/server";
import { fetchProjects, parseProjectParams } from "@/lib/projects";

// GET /api/projects — public listing with search (q), filter (type, stack),
// sort (recent|endorsed|alpha|status) and pagination (page, limit). Drafts hidden.
export async function GET(request: NextRequest) {
  try {
    const params = parseProjectParams(request.nextUrl.searchParams);
    const data = await fetchProjects(params);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/projects failed", error);
    return NextResponse.json(
      { success: false, error: "Failed to load projects." },
      { status: 500 },
    );
  }
}
