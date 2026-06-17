import { NextResponse, type NextRequest } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { getPublishedPost } from "@/lib/blog";

// GET /api/blog/[slug] — one published post (public read).
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/blog/[slug]">,
) {
  try {
    const { slug } = await ctx.params;
    const post = await getPublishedPost(slug);
    if (!post) throw new HttpError(404, "Post not found.");
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return errorResponse(error);
  }
}
