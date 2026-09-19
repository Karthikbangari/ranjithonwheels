import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test.describe("prefers-reduced-motion", () => {
  test("hero content is fully visible without waiting on animation", async ({ page }) => {
    await page.goto("/");
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toBeVisible();
    await expect(headline).toHaveCSS("opacity", "1");
  });

  test("book cover has no tilt transform on pointer move", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("book")?.scrollIntoView({ block: "center" }));

    const cover = page
      .locator('#book [class*="cover"]:not([class*="Image"]):not([class*="Gradient"]):not([class*="Title"])')
      .first();
    const box = await cover.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.1, { steps: 5 });
      await page.waitForTimeout(300);
      const transform = await cover.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
    }
  });

  test("journey map shows the complete route immediately, with no glide or reveal delay", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("journey-map")?.scrollIntoView());
    await page.waitForTimeout(500);
    // CLAUDE.md §0 decision #18 / CLAUDE.md §5.5: reduced motion shows the
    // finished journey immediately — every reachable country already
    // filled red, panel already on the last country, no reveal delay.
    const map = page.locator('svg[aria-label*="currently on Slovakia"]');
    await expect(map).toBeVisible();
    await expect(page.getByRole("heading", { name: "Slovakia", level: 3 })).toBeVisible();
    await expect(page.getByText("Country 23 of 23")).toBeVisible();
    await page.getByText(/All \d+ countries/).click();
    await expect(page.getByRole("button", { name: /23\. Slovakia/ })).toBeVisible();
  });

  test("finale wheel rests before the next-country marker, not mid-animation", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("finale")?.scrollIntoView());
    await page.waitForTimeout(300);
    await expect(page.getByText("The journey doesn't.")).toBeVisible();
  });
});
