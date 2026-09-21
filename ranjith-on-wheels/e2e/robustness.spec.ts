import { test, expect, type Page } from "@playwright/test";

// Every scroll-driven counter and timeline must be right wherever the visitor
// arrives and however they got there (CLAUDE.md §0 decision #21): nothing may
// stay stuck at its initial value. The extremes are what can be asserted
// without knowing the exact easing: past the end it must read the final value,
// before the start it must read the initial one.

const ROAD = "#chapter-road [data-count]";

async function roadBounds(page: Page) {
  return page.evaluate(() => {
    const el = document.getElementById("chapter-road")!;
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, vh: window.innerHeight };
  });
}

// Whatever the scroll position, the odometer must agree with it.
async function expectRoadConsistent(page: Page, label: string) {
  await page.waitForTimeout(1800);
  const { top, bottom, vh } = await roadBounds(page);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  const text = (await page.locator(ROAD).textContent())?.trim();
  if (y > bottom + vh * 0.2) expect(text, `${label}: scrollY ${y} is past the road`).toBe("15,000");
  else if (y < top - vh * 1.5) expect(text, `${label}: scrollY ${y} is before the road`).toBe("0");
  else {
    const value = Number(text?.replace(/,/g, ""));
    expect(value, `${label}: mid-road value`).toBeGreaterThanOrEqual(0);
    expect(value, `${label}: mid-road value`).toBeLessThanOrEqual(15000);
  }
}

const toEnd = (page: Page) =>
  page.evaluate(() => {
    const el = document.getElementById("chapter-transition")!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  });

test.describe("scroll-driven state is never stuck", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("opening directly on a country route, at any depth, via an anchor", async ({ page }) => {
    for (const anchor of ["chapter-departure", "chapter-transition", "chapter-signature"]) {
      await page.goto(`/journey/india#${anchor}`);
      await expectRoadConsistent(page, `india#${anchor}`);
    }
    await page.goto("/journey/india");
    await expectRoadConsistent(page, "india top");
    await expect(page.locator(ROAD)).toHaveText("0");
  });

  test("the ferry clock and the arrival coordinates land on their final values from any arrival", async ({ page }) => {
    await page.goto("/journey/indonesia#chapter-departure");
    await page.waitForTimeout(2000);
    await expect(page.locator("#chapter-signature [data-hours]")).toHaveText("32 of 32 hours");
    await page.goto("/journey/vietnam#chapter-departure");
    await page.waitForTimeout(2000);
    await expect(page.locator("#chapter-arrival [data-coords]")).toHaveText("14.06° N · 108.28° E");
  });

  test("a hard reload halfway down the page", async ({ page }) => {
    await page.goto("/journey/india");
    const { top, vh } = await roadBounds(page);
    await page.evaluate((y) => window.scrollTo(0, y), top + vh * 0.9);
    await page.waitForTimeout(1600);
    const before = Number((await page.locator(ROAD).textContent())?.replace(/,/g, ""));
    expect(before).toBeGreaterThan(0);
    await page.reload();
    await page.waitForTimeout(2600);
    const y = await page.evaluate(() => window.scrollY);
    const after = Number((await page.locator(ROAD).textContent())?.replace(/,/g, ""));
    // The browser restores the scroll position; the odometer must follow it,
    // not sit at 0 beside a road already half ridden.
    if (y > top) expect(after).toBeGreaterThan(0);
    await toEnd(page);
    await expectRoadConsistent(page, "after reload, at the end");
  });

  test("browser back / forward, full and client-side", async ({ page }) => {
    await page.goto("/journey/india");
    await toEnd(page);
    await expectRoadConsistent(page, "india end");
    // Full navigation away and back.
    await page.goto("/journey/vietnam");
    await page.goBack();
    await expect(page).toHaveURL(/\/journey\/india$/);
    await expectRoadConsistent(page, "back after full navigation");
    // Client-side navigation through the journey rail, then back and forward.
    // (The rail steps aside at the very bottom of a page, so go up a little first.)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("navigation", { name: "Journey progress" }).getByRole("link", { name: /Sri Lanka/ }).click();
    await expect(page).toHaveURL(/\/journey\/sri-lanka$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/journey\/india$/);
    await expectRoadConsistent(page, "back after client navigation");
    await page.goForward();
    await expect(page).toHaveURL(/\/journey\/sri-lanka$/);
    await page.goBack();
    await toEnd(page);
    await expectRoadConsistent(page, "back, then to the end");
  });

  test("resize and orientation change rebuild the pinned ride without losing its place", async ({ page }) => {
    await page.goto("/journey/india");
    await toEnd(page);
    await expectRoadConsistent(page, "desktop end");
    // Portrait phone: pinned → unpinned.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1200);
    await toEnd(page);
    await expectRoadConsistent(page, "phone end");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expectRoadConsistent(page, "phone top");
    // Landscape phone, then back to desktop: unpinned → pinned.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(1200);
    await toEnd(page);
    await expectRoadConsistent(page, "landscape end");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1200);
    await toEnd(page);
    await expectRoadConsistent(page, "desktop again, end");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expectRoadConsistent(page, "desktop again, top");
  });

  test("very fast scrolling — flinging up and down — settles on the right value", async ({ page }) => {
    await page.goto("/journey/india");
    const { top, vh } = await roadBounds(page);
    const stops = [0, 5000, 300, top + vh * 0.5, 6000, top - 400, top + vh * 2, 0, top + vh * 1.1, 7000];
    for (const y of stops) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expectRoadConsistent(page, "after a fling to the bottom");
    await expect(page.locator(ROAD)).toHaveText("15,000");
    for (const y of [4000, 0, 3000, 0]) await page.evaluate((v) => window.scrollTo(0, v), y);
    await expectRoadConsistent(page, "after a fling to the top");
    await expect(page.locator(ROAD)).toHaveText("0");
  });

  test("the gateway counter and route follow the scroll — reload, anchor, fling", async ({ page }) => {
    await page.goto("/journey#chapter-gateway");
    await page.waitForTimeout(1500);
    const mid = Number((await page.locator("#chapter-gateway [data-count]").textContent())?.replace(/,/g, ""));
    expect(mid).toBeGreaterThanOrEqual(0);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1800);
    await expect(page.locator("#chapter-gateway [data-count]")).toHaveText("48,000");
    await page.reload();
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1800);
    await expect(page.locator("#chapter-gateway [data-count]")).toHaveText("48,000");
    for (const y of [0, 9000, 0, 9000]) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1800);
    // At the top of the page the gateway is only partly on screen, so only a
    // little of the road has turned red — progressive, not stuck at the total.
    const top = Number((await page.locator("#chapter-gateway [data-count]").textContent())?.replace(/,/g, ""));
    expect(top).toBeLessThan(8000);
  });

  test("every reveal ends visible: nothing is left half-hidden by a fast scroll or an anchor jump", async ({ page }) => {
    await page.goto("/journey/taiwan#chapter-transition");
    await page.waitForTimeout(800);
    for (const y of [0, 9000, 0, 9000]) await page.evaluate((v) => window.scrollTo(0, v), y);
    // Walk the whole page so every trigger has been passed.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 500) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(2500);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-chapter] [data-reveal], [data-chapter] [data-frame], [data-chapter] [data-moment]")]
        .filter((el) => getComputedStyle(el).opacity !== "1" && el.closest("[data-fade]") === null)
        .map((el) => el.textContent?.slice(0, 30)),
    );
    expect(hidden).toEqual([]);
  });
});

test.describe("motion cleans up after itself", () => {
  test("moving between chapters — by hand-off, rail and back — never accumulates ScrollTriggers", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const triggers = () => page.evaluate(() => window.__rowMotion?.triggers() ?? -1);
    await page.goto("/journey/india");
    await page.waitForTimeout(1500);
    const baseline = await triggers();
    expect(baseline).toBeGreaterThan(0);
    const rail = page.getByRole("navigation", { name: "Journey progress" });
    for (const [name, slug] of [
      ["Sri Lanka", "sri-lanka"],
      ["Vietnam", "vietnam"],
    ]) {
      // Client-side navigation via the rail's Next link, twice in a row.
      await rail.getByRole("link", { name: new RegExp(name) }).click();
      await expect(page).toHaveURL(new RegExp(`/journey/${slug}$`));
      await page.waitForTimeout(1500);
      // Sri Lanka and Vietnam have fewer motion sections than India (no pinned
      // road): the count must be in the same ballpark, not baseline + previous.
      expect(await triggers(), `after arriving in ${slug}`).toBeLessThanOrEqual(baseline + 2);
    }
    await page.goBack();
    await page.goBack();
    await page.waitForTimeout(1500);
    expect(await triggers(), "back on India").toBeLessThanOrEqual(baseline + 2);
    expect(await triggers(), "back on India").toBeGreaterThanOrEqual(baseline - 2);
  });
});
