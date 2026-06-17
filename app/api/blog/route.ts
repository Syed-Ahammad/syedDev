import { NextResponse, type NextRequest } from "next/server";
import { errorResponse } from "@/lib/api";
import { fetchPublishedPostsPage } from "@/lib/blog";

// GET /api/blog?tag=&page= — published posts, newest first (public read).
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const tag = sp.get("tag")?.trim() || undefined;
    const page = Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1);
    const data = await fetchPublishedPostsPage({ tag, page });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
