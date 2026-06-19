import { test, expect } from "@playwright/test";

// Bookmarks — runs with the seeded demo user's session. Covers the dashboard list
// of saved projects and the public project page's bookmark toggle round-trip.

const userState = "playwright/.auth/user.json";

test.describe("bookmarks (authenticated)", () => {
  test.use({ storageState: userState });

  test("dashboard bookmarks lists saved projects", async ({ page }) => {
    await page.goto("/dashboard/bookmarks");

    await expect(
      page.getByRole("heading", { level: 1, name: /projects you.ve saved/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /^groceri$/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /remove restaurant pos bookmark/i }),
    ).toBeVisible();
  });

  test("public project page toggles a bookmark", async ({ page }) => {
    // Wait for the initial GET so the button reflects the real saved state before we read it.
    await page.goto("/projects/dirham");
    await page.waitForResponse(
      (r) =>
        r.url().includes("/api/user/bookmarks") && r.request().method() === "GET",
    );

    const button = page.getByRole("button", { name: /bookmark/i });
    await expect(button).toBeEnabled();
    const before = await button.getAttribute("aria-pressed");

    // The click fires a POST (save) or DELETE (remove); wait for it before asserting.
    await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/user/bookmarks")),
      button.click(),
    ]);

    await expect(button).toHaveAttribute(
      "aria-pressed",
      before === "true" ? "false" : "true",
    );
  });
});
