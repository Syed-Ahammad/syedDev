import { test, expect } from "@playwright/test";

// Blog — the public index's tag filtering via URL, the detail page body/back-link,
// and the 404 for unknown slugs.

test("blog index filters by tag via URL", async ({ page }) => {
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { level: 1, name: /notes from what i.m building/i }),
  ).toBeVisible();
  await expect(page.getByText(/showing 3 posts/i)).toBeVisible();

  await page.goto("/blog?tag=Backend");
  await expect(page.getByText(/showing 1 post tagged "backend"/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /mongodb indexes/i }),
  ).toBeVisible();

  await page.goto("/blog?tag=ZzzNoMatch");
  await expect(page.getByText(/no posts under that tag yet/i)).toBeVisible();
});

test("blog detail page renders body and back link", async ({ page }) => {
  await page.goto("/blog/shipping-portfolio-in-next-16");
  await expect(
    page.getByRole("heading", { level: 1, name: /shipping a portfolio in next\.js 16/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /async params are the new normal/i }),
  ).toBeVisible();
  await expect(page.getByText(/turbopack is the default/i)).toBeVisible();

  await page.getByRole("link", { name: /all posts/i }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("unknown blog slug returns 404", async ({ page }) => {
  const res = await page.goto("/blog/zzznomatch");
  expect(res?.status()).toBe(404);
});
