import { test, expect } from "@playwright/test";

test.describe("journey archive and country pages", () => {
  test("archive lists all 23 countries and search narrows results", async ({ page }) => {
    await page.goto("/journey");
    // The archive's own cards — the gateway map above it has 23 marker links of its own.
    const archiveLinks = page.locator('a[href^="/journey/"]:not([data-dot])');
    await expect(archiveLinks).toHaveCount(23);

    await page.getByRole("searchbox").fill("korea");
    await expect(archiveLinks).toHaveCount(1);
    await expect(archiveLinks.getByText("South Korea")).toBeVisible();
  });

  test("chapter filter narrows to that chapter's countries", async ({ page }) => {
    await page.goto("/journey");
    await page.getByRole("button", { name: "India", exact: true }).click();
    await expect(page.locator('a[href^="/journey/"]:not([data-dot])')).toHaveCount(1);
  });

  test("country page shows content and links to the next country", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.getByRole("heading", { name: "India", level: 1 })).toBeVisible();
    await page.getByRole("link", { name: /Enter Sri Lanka/ }).click();
    await expect(page).toHaveURL(/\/journey\/sri-lanka$/);
    await expect(page.getByRole("heading", { name: "Sri Lanka", level: 1 })).toBeVisible();
  });

  test("first chapter has no previous country, last chapter hands off to Follow", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.getByRole("link", { name: "All chapters" })).toBeVisible();
    await expect(page.getByRole("link", { name: /^← / })).toHaveCount(0);

    await page.goto("/journey/slovakia");
    await expect(page.locator("#chapter-transition").getByRole("link", { name: "Follow the journey" })).toHaveAttribute(
      "href",
      "/#finale",
    );
    await expect(page.getByRole("link", { name: /Enter / })).toHaveCount(0);
  });

  test("unknown country slug returns a 404", async ({ page }) => {
    const response = await page.goto("/journey/not-a-real-country");
    expect(response?.status()).toBe(404);
  });
});
