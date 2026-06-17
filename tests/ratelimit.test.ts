import { describe, it, expect } from "vitest";
import { clientIp, enforceLimit } from "@/lib/ratelimit";

describe("clientIp", () => {
  it("takes the first IP from x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip, then 'unknown'", () => {
    const withReal = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(clientIp(withReal)).toBe("9.9.9.9");
    expect(clientIp(new Request("http://localhost"))).toBe("unknown");
  });
});

describe("enforceLimit", () => {
  it("no-ops (fails open) when no limiter is configured", async () => {
    await expect(enforceLimit(null, "any-id")).resolves.toBeUndefined();
  });
});
