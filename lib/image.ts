export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type ImageKind = "jpeg" | "png" | "gif" | "webp";

function matches(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

/**
 * Detect an image by its magic bytes — so a renamed `.png` of an executable is
 * rejected regardless of the claimed MIME type. Returns null if unrecognized.
 */
export function detectImageType(bytes: Uint8Array): ImageKind | null {
  if (matches(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
  if (matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (matches(bytes, [0x47, 0x49, 0x46, 0x38])) return "gif";
  if (matches(bytes, [0x52, 0x49, 0x46, 0x46]) && matches(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "webp";
  }
  return null;
}
