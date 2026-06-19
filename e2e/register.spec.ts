import { test, expect } from "@playwright/test";

// Registration — client validation surfaces field errors, then a valid unique
// account is created and the app signs the new user straight into the dashboard.

test("register page validates and shows confirmation message", async ({ page }) => {
  await page.goto("/register");

  await expect(
    page.getByRole("heading", { level: 1, name: /one account, the whole community/i }),
  ).toBeVisible();

  const form = page.locator("form").filter({ hasText: /create account/i });
  await form.getByLabel(/your name/i).fill("Test Visitor");
  await form.getByLabel(/^email$/i).fill("visitor@example.com");
  await form.getByLabel(/^password$/i).fill("short");
  await form.getByLabel(/confirm password/i).fill("short");
  await form.getByRole("button", { name: /create account/i }).click();
  await expect(form.getByRole("status")).toContainText(/highlighted fields/i);

  // A unique email keeps the create idempotent across runs; the schema needs a
  // digit in the password. On success the app signs in and redirects to /dashboard.
  await form.getByLabel(/^email$/i).fill(`visitor-${Date.now()}@example.com`);
  await form.getByLabel(/^password$/i).fill("longenough1");
  await form.getByLabel(/confirm password/i).fill("longenough1");
  await form.getByRole("button", { name: /create account/i }).click();
  await page.waitForURL(/\/dashboard/);
});
