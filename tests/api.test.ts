import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { HttpError, errorResponse } from "@/lib/api";

describe("errorResponse", () => {
  it("maps an HttpError to its status and message", async () => {
    const res = errorResponse(new HttpError(403, "no access"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ success: false, error: "no access" });
  });

  it("maps a ZodError to 400 with the first issue message", async () => {
    const parsed = z.object({ name: z.string() }).safeParse({});
    const res = errorResponse(parsed.success ? null : parsed.error);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("falls back to a logged 500 for unknown errors", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = errorResponse(new Error("boom"));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      success: false,
      error: "Something went wrong.",
    });
    spy.mockRestore();
  });
});
