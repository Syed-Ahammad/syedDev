import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { leadSchema } from "@/lib/validations";
import { HttpError } from "@/lib/api";
import { enforceLimit, leadsLimiter, clientIp } from "@/lib/ratelimit";

// POST /api/leads — public contact form submission (anonymous or logged-in).
export async function POST(request: NextRequest) {
  try {
    // Basic CSRF guard: reject cross-origin form posts when Origin is present.
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json(
        { success: false, error: "Invalid origin." },
        { status: 403 },
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = leadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    await enforceLimit(leadsLimiter, clientIp(request));

    await dbConnect();
    const { name, email, message, projectType, source } = parsed.data;
    const lead = await Lead.create({
      name,
      email,
      message,
      projectType: projectType || undefined,
      source: source ?? "portfolio",
    });

    return NextResponse.json(
      { success: true, data: { id: String(lead._id) } },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    console.error("POST /api/leads failed", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
