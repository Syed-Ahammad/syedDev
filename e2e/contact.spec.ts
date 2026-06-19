import { test, expect } from "@playwright/test";

// Contact page — the dedicated /contact route's lead form (separate from the inline
// contact form on the home page, which home.spec.ts covers).

test("contact page submits the form successfully", async ({ page }) => {
  await page.goto("/contact");

  await expect(
    page.getByRole("heading", { level: 1, name: /let.s start something useful/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /how to reach me/i }),
  ).toBeVisible();

  const form = page.locator("form").filter({ hasText: /tell me about it/i });
  await form.getByLabel(/your name/i).fill("Test Visitor");
  await form.getByLabel(/^email$/i).fill("visitor@example.com");
  await form
    .getByLabel(/tell me about it/i)
    .fill("Hi — I'd love to chat about a small storefront build for my bakery.");
  await form.getByRole("button", { name: /send message/i }).click();
  await expect(form.getByRole("status")).toContainText(/reply within 24 hours/i);
});
