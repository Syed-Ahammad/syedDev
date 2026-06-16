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
  const emailField = page.getByLabel(/email address/i);
  const subscribe = page.getByRole("button", { name: /subscribe/i });
  await emailField.fill("nope");
  await subscribe.click();
  await expect(page.getByRole("status")).toContainText(/valid email/i);
  await emailField.fill("hello@example.com");
  await subscribe.click();
  await expect(page.getByRole("status")).toContainText(/worth reading/i);
});
