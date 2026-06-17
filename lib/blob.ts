import { put } from "@vercel/blob";
import { HttpError } from "@/lib/api";
import { MAX_UPLOAD_BYTES, detectImageType } from "@/lib/image";

/**
 * Upload a validated image to Vercel Blob and return its public URL.
 * Reads BLOB_READ_WRITE_TOKEN from the environment.
 */
export async function uploadImage(file: File): Promise<string> {
  const blob = await put(`uploads/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return blob.url;
}

/**
 * Validate the `file` field of a multipart form (size + MIME + magic bytes)
 * and upload it. Shared by the admin image upload and user avatar routes.
 */
export async function uploadImageFromForm(form: FormData): Promise<string> {
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

  return uploadImage(file);
}
