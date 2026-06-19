import { test, expect } from "@playwright/test";

// Endorsements — runs with the seeded demo user's session. Exercises the dashboard
// endorsement form's client validation and a successful (or idempotent) submission.

const userState = "playwright/.auth/user.json";

test.describe("endorsements (authenticated)", () => {
  test.use({ storageState: userState });

  test("endorsement form validates then accepts a submission", async ({ page }) => {
    await page.goto("/dashboard/endorsements");

    await expect(
      page.getByRole("heading", { level: 1, name: /endorse what you.ve actually used/i }),
    ).toBeVisible();

    const form = page.locator("form").filter({ hasText: /endorse a project/i });
    await form.getByRole("button", { name: /submit endorsement/i }).click();
    await expect(form.getByRole("status")).toContainText(/highlighted fields/i);

    // Project and skill are DB-backed <select>s (project values are Mongo ids, so
    // target by visible label).
    await form.getByLabel(/^project$/i).selectOption({ label: "Dirham" });
    await form.getByLabel(/^skill$/i).selectOption("Next.js");
    await form
      .getByLabel(/your endorsement/i)
      .fill("Filed VAT in under ten minutes — best fintech UX I've used this year.");
    await form.getByRole("button", { name: /submit endorsement/i }).click();
    // 201 on a fresh seed; 409 if this skill was already endorsed on a prior run.
    await expect(form.getByRole("status")).toContainText(
      /queued for review|already endorsed/i,
    );
  });
});
