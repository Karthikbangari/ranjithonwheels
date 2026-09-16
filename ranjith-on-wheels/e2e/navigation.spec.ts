import { test, expect } from "@playwright/test";

test.describe("primary navigation", () => {
  test("homepage loads with header, hero and footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("desktop nav links reach every primary route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    for (const [label, path] of [
      ["Journey", "/journey"],
      ["Book", "/book"],
      ["Support", "/support"],
      ["About", "/about"],
    ] as const) {
      await page.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await page.goBack();
    }
  });

  test("mobile menu opens, traps focus on Escape, and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await toggle.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
  });

  test("/donate redirects permanently to /support", async ({ page }) => {
    const response = await page.goto("/donate");
    expect(response?.request().redirectedFrom()).toBeTruthy();
    await expect(page).toHaveURL(/\/support$/);
  });

  test("skip link moves focus to main content", async ({ page }, testInfo) => {
    // Physical Tab-key navigation isn't a real interaction on a touchscreen
    // phone (no hardware keyboard); the iPhone 13 WebKit profile also
    // doesn't reliably deliver synthetic Tab focus in this emulation mode.
    testInfo.skip(testInfo.project.name === "mobile-safari");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeVisible();
  });
});
