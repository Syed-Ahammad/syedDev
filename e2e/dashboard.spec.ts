import { test, expect } from "@playwright/test";

// User dashboard — middleware-protected; runs with the seeded demo user's session.
// Covers the shell/nav, the profile dropdown, the overview stats, the quote form,
// and the profile editor. (Bookmarks and endorsements have their own spec files.)

const userState = "playwright/.auth/user.json";

test.describe("user dashboard (authenticated)", () => {
  test.use({ storageState: userState });

  test("dashboard shell renders sidebar with 5 items and marks Overview active", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { level: 1, name: /welcome back, demo user/i }),
    ).toBeVisible();

    const desktopSidebar = page.getByRole("complementary", { name: "Dashboard" });
    const sectionsNav = desktopSidebar.getByRole("navigation", {
      name: /dashboard sections$/i,
    });
    const links = sectionsNav.getByRole("link");
    await expect(links).toHaveCount(5);

    const expected = [
      "Overview",
      "Bookmarks",
      "Endorsements",
      "Quote requests",
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

    await expect(page.getByLabel(/signed in as/i)).toContainText(/demo user/i);
    await expect(page.getByLabel(/signed in as/i)).toContainText(
      /demo@syed\.dev/i,
    );
  });

  test("profile dropdown opens, lists items, and closes on Escape", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const trigger = page.getByRole("button", {
      name: /signed in as demo user/i,
    });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = page.getByRole("menu", { name: /profile menu/i });
    await expect(
      menu.getByRole("menuitem", { name: /view profile/i }),
    ).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { name: /visit public site/i }),
    ).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { name: /sign out/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("dashboard overview shows at-a-glance stats and recent bookmarks", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { level: 1, name: /welcome back, demo/i }),
    ).toBeVisible();

    const glance = page.getByRole("region", { name: /at a glance/i });
    await expect(glance.getByRole("link", { name: /bookmarks/i })).toBeVisible();
    await expect(glance.getByRole("link", { name: /endorsements/i })).toBeVisible();
    await expect(glance.getByRole("link", { name: /open quotes/i })).toBeVisible();

    const recent = page.getByRole("region", { name: /recent bookmarks/i });
    await expect(
      recent.getByRole("link", { name: /^hotel inventory$/i }),
    ).toBeVisible();
  });

  test("quotes form validates then accepts a submission", async ({ page }) => {
    await page.goto("/dashboard/quotes");

    await expect(
      page.getByRole("heading", { level: 1, name: /briefs and where they stand/i }),
    ).toBeVisible();

    const form = page.locator("form").filter({ hasText: /send a new brief/i });
    await form.getByRole("button", { name: /send brief/i }).click();
    await expect(form.getByRole("status")).toContainText(/highlighted fields/i);

    await form.getByLabel(/^title$/i).fill("Bakery storefront");
    await form
      .getByLabel(/^project type$/i)
      .selectOption("Landing page or storefront");
    await form.getByLabel(/^budget$/i).selectOption("AED 5k – 10k");
    await form.getByLabel(/^timeline$/i).selectOption("3–4 weeks");
    await form
      .getByLabel(/^brief$/i)
      .fill("Small bakery in JLT. Need pickup orders with WhatsApp confirmation.");
    await form.getByRole("button", { name: /send brief/i }).click();
    await expect(form.getByRole("status")).toContainText(/sent/i);
  });

  test("profile editor validates and saves", async ({ page }) => {
    await page.goto("/dashboard/profile");

    await expect(
      page.getByRole("heading", { level: 1, name: /your account/i }),
    ).toBeVisible();

    const form = page.locator("form").filter({ hasText: /save changes/i });
    await form.getByLabel(/^avatar$/i).fill("not-a-url");
    await form.getByRole("button", { name: /save changes/i }).click();
    await expect(form.getByRole("status")).toContainText(/highlighted fields/i);

    await form.getByLabel(/^avatar$/i).fill("https://example.com/me.png");
    await form.getByRole("button", { name: /save changes/i }).click();
    await expect(form.getByRole("status")).toContainText(/profile saved/i);
  });
});
