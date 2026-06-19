import { test, expect } from "@playwright/test";

// Demo-login flow — the /login page's client validation plus the one-click
// "Demo User" button that performs a real credentials sign-in and redirects into
// the dashboard. (The deeper session-cookie/middleware coverage lives in auth.spec.ts.)

test("login page validates then signs in with a demo account", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { level: 1, name: /welcome back/i }),
  ).toBeVisible();

  const form = page.locator("form").filter({ hasText: /sign in/i });
  await form.getByRole("button", { name: /sign in/i }).click();
  await expect(form.getByRole("status")).toContainText(/highlighted fields/i);

  // The demo button performs a real credentials sign-in and redirects in.
  await form.getByRole("button", { name: /demo user/i }).click();
  await page.waitForURL(/\/dashboard/);
});

test("demo admin button signs in and lands on the admin area", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: /demo admin/i }).click();
  await page.waitForURL(/\/admin/);
});
