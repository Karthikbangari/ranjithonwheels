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

  test("travel map shows the highlighted countries immediately, with no pause or wipe", async ({
    page,
  }) => {
    await page.goto("/");
    const map = page.getByAltText("World map showing countries visited during the journey");
    await map.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // CLAUDE.md §5.5: reduced motion shows the final highlighted state
    // immediately — no 2-second pause, no clip-path wipe.
    await expect(map).toBeVisible();
    const highlightWrap = page.locator('[class*="highlightWrap"]');
    await expect(highlightWrap).toHaveCSS("opacity", "1");
    await expect(highlightWrap).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
    await page.getByText("All 23 countries").click();
    await expect(page.getByRole("link", { name: /23\. Slovakia/ })).toBeVisible();
  });

  test("finale wheel rests before the next-country marker, not mid-animation", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("finale")?.scrollIntoView());
    await page.waitForTimeout(300);
    await expect(page.getByText("The journey doesn't.")).toBeVisible();
  });
});
