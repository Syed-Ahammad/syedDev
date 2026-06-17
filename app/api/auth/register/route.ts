import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validations";
import { HttpError } from "@/lib/api";
import { enforceLimit, registerLimiter, clientIp } from "@/lib/ratelimit";

// POST /api/auth/register — email/password registration (creates a `user` role).
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json(
        { success: false, error: "Invalid origin." },
        { status: 403 },
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    await enforceLimit(registerLimiter, clientIp(request));

    await dbConnect();
    const email = parsed.data.email.toLowerCase();
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await User.create({
      name: parsed.data.name,
      email,
      passwordHash,
      role: "user",
      provider: "credentials",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    // Unique-index race → treat as duplicate.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    console.error("POST /api/auth/register failed", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
