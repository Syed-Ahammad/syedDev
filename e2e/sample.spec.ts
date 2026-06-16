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
