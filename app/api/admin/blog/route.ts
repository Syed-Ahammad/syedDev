import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { fetchAdminPosts } from "@/lib/blog";
import { blogCreateSchema } from "@/lib/validations";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/blog?page= — all posts incl. drafts (admin only).
export async function GET(request: NextRequest) {
  try {
    await requireRole("admin");
    const page = Math.max(
      1,
      Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1,
    );
    const data = await fetchAdminPosts(page);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/admin/blog — create a post (admin only). Slug derived from title.
export async function POST(request: NextRequest) {
  try {
    await requireRole("admin");
    const json = await request.json().catch(() => null);
    const data = blogCreateSchema.parse(json);

    await dbConnect();
    const base = slugify(data.title) || "post";
    let slug = base;
    for (let n = 2; await BlogPost.exists({ slug }); n++) slug = `${base}-${n}`;

    const post = await BlogPost.create({
      ...data,
      slug,
      published: data.published ?? false,
      publishedAt: data.published ? new Date() : undefined,
    });

    // NOTE: revalidatePath('/blog', '/') wired in step 3.23.
    return NextResponse.json(
      { success: true, data: { id: String(post._id), slug: post.slug } },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
