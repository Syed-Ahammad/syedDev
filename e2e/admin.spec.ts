import { test, expect } from "@playwright/test";

// Admin area — middleware-protected; runs with the seeded admin's session.
// Covers the shell/nav and each section's landing view + a representative action.

const adminState = "playwright/.auth/admin.json";

test.describe("admin area (authenticated)", () => {
  test.use({ storageState: adminState });

  test("admin shell renders sidebar with 8 items and marks Overview active", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { level: 1, name: /site at a glance/i }),
    ).toBeVisible();

    const desktopSidebar = page.getByRole("complementary", { name: "Admin" });
    const sectionsNav = desktopSidebar.getByRole("navigation", {
      name: /admin sections$/i,
    });
    const links = sectionsNav.getByRole("link");
    await expect(links).toHaveCount(8);

    const expected = [
      "Overview",
      "Projects",
      "Leads",
      "Blog",
      "Endorsements",
      "Users",
      "Analytics",
      "Profile",
    ];
    for (const label of expected) {
      await expect(
        sectionsNav.getByRole("link", { name: new RegExp(label, "i") }),
      ).toBeVisible();
    }

    await expect(sectionsNav.locator("[aria-current='page']")).toHaveText(
      /overview/i,
    );

    await expect(page.getByLabel(/signed in as/i)).toContainText(/syed/i);
    await expect(page.getByLabel(/signed in as/i)).toContainText(
      /admin@syed\.dev/i,
    );
  });

  test("admin projects page lists projects and exposes a new-project form", async ({
    page,
  }) => {
    await page.goto("/admin/projects");

    await expect(
      page.getByRole("heading", { level: 1, name: /project catalog/i }),
    ).toBeVisible();
    await expect(page.getByText(/dirham/i).first()).toBeVisible();

    const newBtn = page.getByRole("button", { name: /\+ new project/i });
    await newBtn.click();
    await expect(
      page.getByRole("heading", { level: 3, name: /^new project$/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /save project/i }).click();
    await expect(
      page.getByRole("status").filter({ hasText: /highlighted fields/i }),
    ).toBeVisible();
  });

  test("admin leads page filters by status", async ({ page }) => {
    await page.goto("/admin/leads");

    await expect(
      page.getByRole("heading", { level: 1, name: /incoming briefs/i }),
    ).toBeVisible();
    await expect(page.getByText(/showing 8 leads/i)).toBeVisible();

    await page.goto("/admin/leads?status=new");
    await expect(page.getByText(/showing 2 leads marked "new"/i)).toBeVisible();
  });

  test("admin blog page lists posts and exposes a new-post form", async ({
    page,
  }) => {
    await page.goto("/admin/blog");

    await expect(
      page.getByRole("heading", { level: 1, name: /post manager/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/shipping a portfolio in next\.js/i),
    ).toBeVisible();

    await page.getByRole("button", { name: /\+ new post/i }).click();
    await expect(
      page.getByRole("heading", { level: 3, name: /^new post$/i }),
    ).toBeVisible();
  });

  test("admin endorsements queue approves a pending item", async ({ page }) => {
    await page.goto("/admin/endorsements");

    await expect(
      page.getByRole("heading", { level: 1, name: /moderation queue/i }),
    ).toBeVisible();

    const pendingTab = page.getByRole("tab", { name: /pending/i });
    await expect(pendingTab).toHaveAttribute("aria-selected", "true");

    const firstApprove = page.getByRole("button", { name: /^approve$/i }).first();
    await firstApprove.click();

    await page.getByRole("tab", { name: /^approved/i }).click();
    await expect(page.getByText(/rashed al-mansoori/i)).toBeVisible();
  });

  test("admin users page lists users with role badges", async ({ page }) => {
    await page.goto("/admin/users");

    await expect(
      page.getByRole("heading", { level: 1, name: /user directory/i }),
    ).toBeVisible();
    const table = page.getByRole("table");
    await expect(table.getByText(/admin@syed\.dev/i)).toBeVisible();
    await expect(table.getByText(/suspicious account/i)).toBeVisible();
  });

  test("admin analytics page renders three chart panels", async ({ page }) => {
    await page.goto("/admin/analytics");

    await expect(
      page.getByRole("heading", { level: 1, name: /the numbers behind the site/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /new accounts/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /where briefs come from/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /per project/i }),
    ).toBeVisible();
  });
});
