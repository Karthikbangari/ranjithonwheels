import { test, expect } from "@playwright/test";

test.describe("journey archive and country pages", () => {
  test("archive lists all 23 countries and search narrows results", async ({ page }) => {
    await page.goto("/journey");
    await expect(page.locator('a[href^="/journey/"]')).toHaveCount(23);

    await page.getByRole("searchbox").fill("korea");
    await expect(page.locator('a[href^="/journey/"]')).toHaveCount(1);
    await expect(page.getByText("South Korea")).toBeVisible();
  });

  test("chapter filter narrows to that chapter's countries", async ({ page }) => {
    await page.goto("/journey");
    await page.getByRole("button", { name: "India", exact: true }).click();
    await expect(page.locator('a[href^="/journey/"]')).toHaveCount(1);
  });

  test("country page shows content and links to the next country", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.getByRole("heading", { name: "India", level: 1 })).toBeVisible();
    await page.getByRole("link", { name: /Sri Lanka/ }).click();
    await expect(page).toHaveURL(/\/journey\/sri-lanka$/);
  });

  test("last country's next link returns home, first country's previous returns to archive", async ({
    page,
  }) => {
    await page.goto("/journey/india");
    await expect(page.getByRole("link", { name: /The full journey/ })).toBeVisible();

    await page.goto("/journey/slovakia");
    await expect(page.getByRole("link", { name: /The homepage/ })).toBeVisible();
  });

  test("unknown country slug returns a 404", async ({ page }) => {
    const response = await page.goto("/journey/not-a-real-country");
    expect(response?.status()).toBe(404);
  });
});
