import { test, expect } from "@playwright/test";

// Theme toggle — next-themes runs in class mode on <html> with `dark` as the
// default. A fresh context has no stored preference, so the site loads dark; the
// navbar toggle flips to light and that choice survives a reload.

test("toggling the theme switches to light and persists across reload", async ({
  page,
}) => {
  await page.goto("/");

  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  // Label reads "Switch to light mode" while dark is active.
  const toggle = page.getByRole("button", { name: /switch to light mode/i });
  await toggle.click();

  await expect(html).not.toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: /switch to dark mode/i }),
  ).toBeVisible();

  // The preference is stored, so a reload comes back in light mode.
  await page.reload();
  await expect(html).not.toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: /switch to dark mode/i }),
  ).toBeVisible();
});
