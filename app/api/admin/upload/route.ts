import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/api";
import { uploadImage } from "@/lib/blob";
import { MAX_UPLOAD_BYTES, detectImageType } from "@/lib/image";

// POST /api/admin/upload — multipart/form-data with a single `file` field.
// Validates size + MIME + magic bytes, then stores it in Vercel Blob.
export async function POST(request: NextRequest) {
  try {
    await requireRole("admin");

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      throw new HttpError(400, "No file provided.");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new HttpError(400, "Image must be 4 MB or smaller.");
    }
    if (!file.type.startsWith("image/")) {
      throw new HttpError(400, "Only image files are allowed.");
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!detectImageType(bytes)) {
      throw new HttpError(400, "That file isn't a valid image.");
    }

    const url = await uploadImage(file);
    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    return errorResponse(error);
  }
}
