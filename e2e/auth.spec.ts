import { test, expect, type BrowserContext, type Page } from "@playwright/test";

// Full authentication-system coverage. These exercise the *real* auth layer
// (NextAuth JWT cookie + middleware route protection), not the mocked identity
// the dashboard/admin topbars display. Test #4 is the regression guard for the
// logout bug: "Sign out" used to be a plain <Link href="/"> that never cleared
// the session cookie, so a signed-in user stayed signed in forever.
//
// Prerequisite: the DB must be seeded (`npm run seed`) so the demo credentials
// authenticate against MongoDB.

/** The NextAuth session cookie (v5 → `authjs.session-token`; prefix-agnostic). */
async function sessionCookie(context: BrowserContext) {
  const cookies = await context.cookies();
  return cookies.find((c) => /session-token/.test(c.name));
}

/** Sign in via the demo buttons and wait for the post-login redirect. */
async function loginAs(page: Page, which: "user" | "admin") {
  await page.goto("/login");
  const label = which === "admin" ? /demo admin/i : /demo user/i;
  await page.getByRole("button", { name: label }).click();
  await page.waitForURL(which === "admin" ? /\/admin/ : /\/dashboard/);
}

test("logged-out users are redirected away from protected routes", async ({
  page,
  context,
}) => {
  await context.clearCookies();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});

test("logging in sets a real session cookie", async ({ page, context }) => {
  await loginAs(page, "user");

  await expect(page).toHaveURL(/\/dashboard/);
  expect(await sessionCookie(context)).toBeDefined();
});

test("the session persists across a reload", async ({ page }) => {
  await loginAs(page, "user");

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard/);
});

test("signing out clears the session and re-protects routes", async ({
  page,
  context,
}) => {
  await loginAs(page, "user");
  expect(await sessionCookie(context)).toBeDefined();

  await page.getByRole("button", { name: /signed in as/i }).click();

  // The fix calls NextAuth signOut(), which POSTs to /api/auth/signout before
  // redirecting home. The old <Link href="/"> never made this request.
  const signoutRequest = page.waitForRequest((r) =>
    r.url().includes("/api/auth/signout"),
  );
  await page.getByRole("menuitem", { name: /sign out/i }).click();
  await signoutRequest;
  await page.waitForURL("/");

  // Session cookie is gone...
  expect(await sessionCookie(context)).toBeUndefined();

  // ...and protected routes bounce us back to login again.
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("role protection keeps non-admins out of /admin", async ({ page }) => {
  await loginAs(page, "user");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("admins can reach /admin", async ({ page }) => {
  await loginAs(page, "admin");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin/);
});
