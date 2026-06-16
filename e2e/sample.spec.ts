import { test, expect } from "@playwright/test";

test("home page renders hero and navbar", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: /i build .* reliable web apps/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /start a project/i })).toBeVisible();

  await page
    .getByRole("heading", { level: 2, name: /what it adds up to/i })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { level: 2, name: /what it adds up to/i }),
  ).toBeVisible();

  await page
    .getByRole("heading", { level: 2, name: /what people .* say/i })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { level: 2, name: /what people .* say/i }),
  ).toBeVisible();

  await page
    .getByRole("heading", { level: 2, name: /notes from what i.m building/i })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { level: 2, name: /notes from what i.m building/i }),
  ).toBeVisible();

  await page
    .getByRole("heading", { level: 2, name: /questions i hear a lot/i })
    .scrollIntoViewIfNeeded();
  const firstFaq = page.locator("details", { hasText: /typical project timeline/i }).first();
  await expect(firstFaq).toBeVisible();
  await firstFaq.locator("summary").click();
  await expect(firstFaq).toContainText(/share a weekly demo/i);

  await page
    .getByRole("heading", { level: 2, name: /short notes when i ship/i })
    .scrollIntoViewIfNeeded();
  const newsletter = page.locator("form").filter({ hasText: /subscribe/i });
  const emailField = newsletter.getByLabel(/email address/i);
  const subscribe = newsletter.getByRole("button", { name: /subscribe/i });
  await emailField.fill("nope");
  await subscribe.click();
  await expect(newsletter.getByRole("status")).toContainText(/valid email/i);
  await emailField.fill("hello@example.com");
  await subscribe.click();
  await expect(newsletter.getByRole("status")).toContainText(/worth reading/i);

  await page
    .getByRole("heading", { level: 2, name: /have a project in mind/i })
    .scrollIntoViewIfNeeded();
  const contactForm = page.locator("form").filter({ hasText: /tell me about it/i });
  await contactForm.getByLabel(/your name/i).fill("Test Visitor");
  await contactForm.getByLabel(/^email$/i).fill("visitor@example.com");
  await contactForm
    .getByLabel(/tell me about it/i)
    .fill("Hi — I'd love to chat about a small storefront build for my bakery.");
  await contactForm.getByRole("button", { name: /send message/i }).click();
  await expect(contactForm.getByRole("status")).toContainText(/reply within 24 hours/i);

  await expect(
    page.getByRole("contentinfo").getByText(/built with next\.js/i),
  ).toBeVisible();
});

test("projects page filters, sorts, paginates via URL", async ({ page }) => {
  await page.goto("/projects");
  await expect(
    page.getByRole("heading", { level: 1, name: /everything i.ve built so far/i }),
  ).toBeVisible();
  await expect(page.getByText(/showing 8 of 12 projects/i)).toBeVisible();

  await page.goto("/projects?type=Internal%20tool");
  await expect(page.getByText(/showing 3 of 3 projects/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /restaurant pos/i })).toBeVisible();

  await page.goto("/projects?sort=alpha");
  const firstCardName = page.locator('a[href^="/projects/"] h3').first();
  await expect(firstCardName).toContainText(/cafe loyalty/i);

  await page.goto("/projects?page=2");
  await expect(page.getByText(/showing 4 of 12 projects/i)).toBeVisible();
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

  await page.getByRole("link", { name: /all projects/i }).click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("unknown project slug returns 404", async ({ page }) => {
  const res = await page.goto("/projects/zzznomatch");
  expect(res?.status()).toBe(404);
});

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
