import { test, expect } from "@playwright/test";

// Projects — the public catalog's URL-driven search/filter/sort/pagination, plus
// the detail page sections, related-projects rail, and the 404 for unknown slugs.

test("projects page filters, sorts, paginates via URL", async ({ page }) => {
  await page.goto("/projects");
  await expect(
    page.getByRole("heading", { level: 1, name: /everything i.ve built so far/i }),
  ).toBeVisible();
  await expect(page.getByText(/showing 8 of 11 projects/i)).toBeVisible();

  await page.goto("/projects?type=Internal%20tool");
  await expect(page.getByText(/showing 2 of 2 projects/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /restaurant pos/i })).toBeVisible();

  await page.goto("/projects?sort=alpha");
  const firstCardName = page.locator('a[href^="/projects/"] h3').first();
  await expect(firstCardName).toContainText(/cafe loyalty/i);

  await page.goto("/projects?page=2");
  await expect(page.getByText(/showing 3 of 11 projects/i)).toBeVisible();
  await expect(page.locator("a[aria-current='page']")).toHaveText("2");

  await page.goto("/projects?q=zzznomatch");
  await expect(page.getByText(/no matches/i)).toBeVisible();
});

test("project detail page renders sections and related", async ({ page }) => {
  await page.goto("/projects/dirham");

  await expect(page.getByRole("heading", { level: 1, name: /dirham/i })).toBeVisible();
  await expect(page.getByText(/the problem/i).first()).toBeVisible();
  await expect(page.getByText(/my approach/i).first()).toBeVisible();
  await expect(page.getByText(/outcome/i).first()).toBeVisible();

  await expect(page.getByRole("heading", { level: 2, name: /key info/i })).toBeVisible();
  await expect(page.getByText(/^year$/i)).toBeVisible();
  await expect(page.getByText(/^role$/i)).toBeVisible();
  await expect(page.getByText(/^stack$/i)).toBeVisible();

  const relatedHeading = page.getByRole("heading", {
    level: 2,
    name: /other projects in the same space/i,
  });
  await relatedHeading.scrollIntoViewIfNeeded();
  await expect(relatedHeading).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 0));
  await Promise.all([
    page.waitForURL(/\/projects$/, { timeout: 15000 }),
    page.getByRole("link", { name: /all projects/i }).click(),
  ]);
});

test("unknown project slug returns 404", async ({ page }) => {
  const res = await page.goto("/projects/zzznomatch");
  expect(res?.status()).toBe(404);
});
