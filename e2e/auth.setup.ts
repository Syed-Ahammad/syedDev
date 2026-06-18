import { test as setup } from "@playwright/test";

// Authenticates the two seeded demo accounts once and saves each session so the
// authenticated specs can reuse it via `test.use({ storageState })`. Requires the
// DB to be seeded (`npm run seed`) so the demo credentials authenticate.

const userFile = "playwright/.auth/user.json";
const adminFile = "playwright/.auth/admin.json";

setup("authenticate as demo user", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /demo user/i }).click();
  await page.waitForURL(/\/dashboard/);
  await page.context().storageState({ path: userFile });
});

setup("authenticate as demo admin", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /demo admin/i }).click();
  await page.waitForURL(/\/admin/);
  await page.context().storageState({ path: adminFile });
});
