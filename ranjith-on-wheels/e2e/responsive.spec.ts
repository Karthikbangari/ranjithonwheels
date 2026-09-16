import { test, expect } from "@playwright/test";

const breakpoints = [320, 375, 768, 1024, 1440, 1920];
const pages = ["/", "/journey", "/journey/sri-lanka", "/about", "/book", "/contact", "/support"];

for (const width of breakpoints) {
  test.describe(`at ${width}px`, () => {
    for (const path of pages) {
      test(`${path || "home"} has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await page.waitForTimeout(300);

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
      });
    }
  });
}
