import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test.describe("prefers-reduced-motion", () => {
  test("hero content is fully visible without waiting on animation", async ({ page }) => {
    await page.goto("/");
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toBeVisible();
    await expect(headline).toHaveCSS("opacity", "1");
  });

  test("every section on the homepage is fully visible, with nothing left invisible", async ({ page }) => {
    await page.goto("/");
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll<HTMLElement>(".fade")].filter((el) => getComputedStyle(el).opacity === "0").length,
    );
    expect(hidden).toBe(0);
  });

  test("the journey map is present and interactive, with the full keyboard-accessible list of countries", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("journey-map")?.scrollIntoView({ block: "center" }));
    await expect(page.getByRole("heading", { name: "India", level: 3 })).toBeVisible();
    const countryList = page.getByText(/All \d+ countries/);
    await countryList.scrollIntoViewIfNeeded();
    await countryList.click();
    await expect(page.getByRole("button", { name: /23\. Slovakia/ })).toBeVisible();
  });
});
