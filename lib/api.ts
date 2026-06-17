import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** Error carrying an HTTP status, thrown by guards/handlers and mapped below. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Centralized API error → JSON response. Use in every route's catch block:
 * `catch (error) { return errorResponse(error); }`. Maps HttpError to its
 * status, ZodError to 400, and anything else to a logged 500.
 */
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status },
    );
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { success: false, error: error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  // MongoDB duplicate-key (e.g. unique slug/email race) → 409.
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return NextResponse.json(
      { success: false, error: "That already exists." },
      { status: 409 },
    );
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { success: false, error: "Something went wrong." },
    { status: 500 },
  );
}
