import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { quoteRequestSchema } from "@/lib/validations";
import { fetchUserQuotes, createQuoteRequest } from "@/lib/quotes";

// GET /api/user/quote-requests — the signed-in user's own briefs.
export async function GET() {
  try {
    const session = await requireSession();
    const data = await fetchUserQuotes(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/user/quote-requests — submit a brief; name/email come from session.
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const json = await request.json().catch(() => null);
    const input = quoteRequestSchema.parse(json);

    // NOTE: Upstash rate limiting wired in step 3.25.
    const data = await createQuoteRequest({
      userId: session.user.id,
      name: session.user.name ?? "Member",
      email: session.user.email ?? "",
      input,
    });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
