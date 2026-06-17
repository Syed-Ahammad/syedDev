import { put } from "@vercel/blob";

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
