import { test, expect } from "@playwright/test";

test.describe("journey archive and country pages", () => {
  test("archive lists all 24 countries and search narrows results", async ({ page }) => {
    await page.goto("/journey");
    // The archive's own cards — the gateway map above it has 24 marker links of its own.
    const archiveLinks = page.locator('a[href^="/journey/"]:not([data-dot])');
    await expect(archiveLinks).toHaveCount(24);

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

  test("first chapter has no previous country, last chapter hands off to Support then Follow", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.getByRole("link", { name: "All chapters" })).toBeVisible();
    await expect(page.getByRole("link", { name: /^← / })).toHaveCount(0);

    // Slovakia now leads on to Czech Republic, the latest country.
    await page.goto("/journey/slovakia");
    await expect(page.getByRole("link", { name: /Enter Czech Republic/ })).toBeVisible();

    // Czech Republic is the last chapter reached so far — its "Next" leads to
    // Support (QR + UPI shown directly there) rather than straight to Follow.
    await page.goto("/journey/czech-republic");
    const nextLink = page.locator("#chapter-transition").getByRole("link", { name: /Support the next kilometre/ });
    await expect(nextLink).toHaveAttribute("href", "/support");
    await expect(page.getByRole("link", { name: /Enter / })).toHaveCount(0);

    // Support is the second-to-last stop; it hands off to the Follow finale.
    await nextLink.click();
    await expect(page).toHaveURL(/\/support$/);
    const finalCta = page.locator("#support-final-cta");
    await expect(finalCta.getByRole("link", { name: "Follow the journey" })).toHaveAttribute("href", "/#finale");
    await expect(finalCta.getByRole("link", { name: /Back to Czech Republic/ })).toHaveAttribute(
      "href",
      "/journey/czech-republic",
    );
  });

  test("unknown country slug returns a 404", async ({ page }) => {
    const response = await page.goto("/journey/not-a-real-country");
    expect(response?.status()).toBe(404);
  });
});
