import { test, expect } from "@playwright/test";

// About page — story, principles, stack and the closing CTA that routes to /contact.

test("about page renders story, principles and CTA", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", { level: 1, name: /business actually runs/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /path was not a straight line/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /four things i keep coming back to/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /tools i reach for first/i }),
  ).toBeVisible();

  const cta = page.getByRole("link", { name: /start a conversation/i });
  await cta.scrollIntoViewIfNeeded();
  await Promise.all([
    page.waitForURL(/\/contact$/, { timeout: 15000 }),
    cta.click(),
  ]);
});
