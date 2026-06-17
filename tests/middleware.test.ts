import { describe, it, expect } from "vitest";
import { authConfig } from "@/lib/auth.config";

type Role = "user" | "admin";

const authorized = authConfig.callbacks!.authorized!;

function check(pathname: string, role?: Role) {
  const nextUrl = new URL(`http://localhost:3000${pathname}`);
  const auth = role
    ? { user: { id: "1", role, name: "Test", email: "t@example.com" }, expires: "" }
    : null;
  return authorized({
    auth,
    request: { nextUrl },
  } as unknown as Parameters<typeof authorized>[0]);
}

function redirectTo(result: unknown): string {
  return result instanceof Response ? (result.headers.get("location") ?? "") : "";
}

describe("authorized (middleware) callback", () => {
  it("guards /admin to admins only", () => {
    expect(check("/admin/users", "admin")).toBe(true);
    expect(redirectTo(check("/admin/users", "user"))).toMatch(/\/dashboard$/);
    expect(check("/admin/users")).toBe(false); // unauth → signIn page
  });

  it("allows any signed-in user on /dashboard", () => {
    expect(check("/dashboard", "user")).toBe(true);
    expect(check("/dashboard", "admin")).toBe(true);
    expect(check("/dashboard")).toBe(false);
  });

  it("redirects signed-in users away from /login and /register", () => {
    expect(redirectTo(check("/login", "admin"))).toMatch(/\/admin$/);
    expect(redirectTo(check("/login", "user"))).toMatch(/\/dashboard$/);
    expect(redirectTo(check("/register", "user"))).toMatch(/\/dashboard$/);
    expect(check("/login")).toBe(true); // unauth can see it
  });
});
