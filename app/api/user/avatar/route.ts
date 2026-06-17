import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/auth";
import { errorResponse } from "@/lib/api";
import { uploadImageFromForm } from "@/lib/blob";

// POST /api/user/avatar — multipart/form-data `file`; any signed-in user.
export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const form = await request.formData();
    const url = await uploadImageFromForm(form);
    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    return errorResponse(error);
  }
}
