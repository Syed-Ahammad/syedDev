import { NextResponse, type NextRequest } from "next/server";
import { errorResponse } from "@/lib/api";
import { fetchApprovedEndorsements } from "@/lib/endorsements";

// GET /api/endorsements?projectId= — approved endorsements (public read).
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId") ?? undefined;
    const data = await fetchApprovedEndorsements({ projectId });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
