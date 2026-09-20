import { test, expect } from "@playwright/test";

const countries: Array<{ slug: string; name: string }> = [
  { slug: "india", name: "India" },
  { slug: "sri-lanka", name: "Sri Lanka" },
  { slug: "vietnam", name: "Vietnam" },
  { slug: "cambodia", name: "Cambodia" },
  { slug: "thailand", name: "Thailand" },
  { slug: "malaysia", name: "Malaysia" },
  { slug: "singapore", name: "Singapore" },
  { slug: "indonesia", name: "Indonesia" },
  { slug: "china", name: "China" },
  { slug: "japan", name: "Japan" },
  { slug: "south-korea", name: "South Korea" },
  { slug: "taiwan", name: "Taiwan" },
  { slug: "mongolia", name: "Mongolia" },
  { slug: "australia", name: "Australia" },
  { slug: "france", name: "France" },
  { slug: "switzerland", name: "Switzerland" },
  { slug: "germany", name: "Germany" },
  { slug: "austria", name: "Austria" },
  { slug: "italy", name: "Italy" },
  { slug: "slovenia", name: "Slovenia" },
  { slug: "croatia", name: "Croatia" },
  { slug: "hungary", name: "Hungary" },
  { slug: "slovakia", name: "Slovakia" },
];

// Which optional pages each chapter has data for — the same coverage
// chapters.test.ts pins in the content layer. Everything not listed has only
// the always-present pages (intro, arrival, leaving, transition).
const optional: Record<string, string[]> = {
  india: ["road", "discovery", "signature"],
  vietnam: ["discovery", "memory", "signature"],
  cambodia: ["discovery", "memory", "signature"],
  malaysia: ["road", "memory", "signature"],
  singapore: ["road", "discovery", "signature"],
  indonesia: ["road", "challenge", "discovery", "signature"],
  china: ["discovery", "signature"],
  japan: ["discovery", "memory", "signature"],
  taiwan: ["road", "challenge", "signature"],
  mongolia: ["discovery", "signature"],
};
const OPTIONAL_IDS = ["road", "challenge", "discovery", "memory", "signature"];

test.describe("the 23 cinematic chapters", () => {
  for (const { slug, name } of countries) {
    test(`${name}: complete chapter in order, with nothing placeholder`, async ({ page }) => {
      await page.goto(`/journey/${slug}`);
      await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();

      const ids = await page.evaluate(() =>
        [...document.querySelectorAll("[data-chapter] section[id^='chapter-']")].map((el) => el.id.replace("chapter-", "")),
      );
      const expected = ["intro", "arrival"];
      if (slug === "south-korea") expected.push("notes");
      // Order matches the owner's page sequence (Pages 5–13).
      for (const id of OPTIONAL_IDS) if ((optional[slug] ?? []).includes(id)) expected.push(id);
      expected.push("departure", "transition");
      expect(ids).toEqual(expected);

      const text = await page.locator("main, body").first().innerText();
      expect(text).not.toMatch(/pending|placeholder|TODO|coming soon/i);
    });
  }

  test("only countries with real photographs use one as the hero; the rest use their terrain map", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.locator("#chapter-intro img")).toHaveCount(1);

    await page.goto("/journey/cambodia");
    await expect(page.locator("#chapter-intro img")).toHaveCount(0);
    await expect(page.locator("#chapter-intro [data-outline]").first()).toBeAttached();
    await expect(page.locator("#chapter-intro [data-layer]").first()).toBeAttached();
  });

  test("Singapore, which has no outline at map resolution, gets its precise night-city treatment", async ({ page }) => {
    await page.goto("/journey/singapore");
    // Range rings around the anchor instead of a country outline.
    expect(await page.locator("#chapter-intro circle[data-outline]").count()).toBeGreaterThanOrEqual(5);
  });

  test("the road into Indonesia is the sourced sea crossing; the road into Vietnam is not", async ({ page }) => {
    await page.goto("/journey/indonesia");
    // The dashed-line label on the map, and the sourced wording in the metadata.
    await expect(page.locator("#chapter-arrival svg text", { hasText: "SEA CROSSING" })).toBeVisible();
    await expect(page.locator("#chapter-arrival").getByText("The 32-hour ferry from Singapore")).toBeVisible();
    await page.goto("/journey/vietnam");
    await expect(page.locator("#chapter-arrival svg text", { hasText: "SEA CROSSING" })).toHaveCount(0);
    await expect(page.locator("#chapter-arrival [data-dashed]")).toHaveCount(0);
  });

  test("India begins the road; Slovakia's road leaves as a dashed, unfinished line", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.locator("#chapter-arrival").getByText("Where the road begins")).toBeVisible();
    await page.goto("/journey/slovakia");
    await expect(page.getByRole("heading", { name: /The road isn.t finished/ })).toBeVisible();
    await expect(page.locator("#chapter-departure [data-out]")).toHaveAttribute("stroke-dasharray", /.+/);
  });

  test("countries with no story manuscript keep their teaser as the opening line and invent nothing else", async ({ page }) => {
    await page.goto("/journey/sri-lanka");
    await expect(page.locator("#chapter-intro").getByText("The elephant escape.")).toBeVisible();
    await expect(page.locator("[data-step], [data-frame], [data-word]")).toHaveCount(0);
  });

  test("the hand-off into the next chapter lands on its hero and clears the veil", async ({ page }) => {
    await page.goto("/journey/vietnam");
    await page.getByRole("link", { name: /Enter Cambodia/ }).click();
    await expect(page).toHaveURL(/\/journey\/cambodia$/);
    await expect(page.getByRole("heading", { name: "Cambodia", level: 1 })).toBeVisible();
    await expect(page.locator("#chapter-veil")).toHaveCount(0, { timeout: 8000 });
  });

  test("old /stories/[slug] links land on the chapter", async ({ page }) => {
    await page.goto("/stories/taiwan");
    await expect(page).toHaveURL(/\/journey\/taiwan$/);
    await expect(page.getByRole("heading", { name: "Taiwan", level: 1 })).toBeVisible();
  });

  test("/stories links each of the ten stories to its chapter", async ({ page }) => {
    await page.goto("/stories");
    await expect(page.getByRole("link", { name: "Read the story" })).toHaveCount(10);
    await expect(page.locator('a[href="/journey/india"]', { hasText: "Read the story" })).toHaveCount(1);
  });

  test("the road page climbs an odometer as the page scrolls", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/journey/india");
    await page.evaluate(() => {
      const road = document.getElementById("chapter-road")!;
      window.scrollTo(0, road.getBoundingClientRect().top + window.scrollY + window.innerHeight * 3);
    });
    await expect(page.locator("#chapter-road [data-count]")).toHaveText("15,000", { timeout: 8000 });
  });
});

test.describe("the chapter gateway (Page 4)", () => {
  test("is a full-screen dark map with a marker link for every chapter, and climbs to 48,000 km", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/journey");
    const gateway = page.locator("#chapter-gateway");
    await expect(gateway.locator("a[data-dot]")).toHaveCount(23);
    await gateway.scrollIntoViewIfNeeded();
    await expect(gateway.locator("[data-count]")).toHaveText("48,000", { timeout: 12000 });
    const bg = await gateway.evaluate((el) => getComputedStyle(el).backgroundColor + getComputedStyle(el).backgroundImage);
    expect(bg).toMatch(/rgb\(7, 28, 59\)/);
  });

  test("every marker is keyboard-reachable and opens its chapter", async ({ page }) => {
    await page.goto("/journey");
    const marker = page.locator('#chapter-gateway a[data-slug="japan"]');
    await marker.focus();
    await expect(marker).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/journey\/japan$/);
  });
});

test.describe("chapters — prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every page shows complete: nothing hidden, counters final, route drawn", async ({ page }) => {
    for (const slug of ["india", "indonesia", "taiwan", "vietnam", "singapore", "slovakia"]) {
      await page.goto(`/journey/${slug}`);
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement | SVGElement>("[data-chapter] *")].filter((el) => {
          const style = el.getAttribute("style") ?? "";
          return /opacity:\s*0[;\s]/.test(style) || style.includes("stroke-dashoffset") || /translateY?\(/.test(style);
        }).length,
      );
      expect(hidden, slug).toBe(0);
    }
    await page.goto("/journey/india");
    await expect(page.locator("#chapter-road [data-count]")).toHaveText("15,000");
    await page.goto("/journey/indonesia");
    await expect(page.locator("#chapter-signature [data-hours]")).toHaveText("32 of 32 hours");
  });

  test("the gateway shows the finished road: 48,000 km already, no pin, no wait", async ({ page }) => {
    await page.goto("/journey");
    await expect(page.locator("#chapter-gateway [data-count]")).toHaveText("48,000");
    const dash = await page.locator("#chapter-gateway [data-ride]").first().evaluate((el) => (el as SVGElement).style.strokeDasharray);
    expect(dash).toBe("");
  });

  test("the hand-off is a plain link", async ({ page }) => {
    await page.goto("/journey/vietnam");
    await page.getByRole("link", { name: /Enter Cambodia/ }).click();
    await expect(page).toHaveURL(/\/journey\/cambodia$/);
    await expect(page.locator("#chapter-veil")).toHaveCount(0);
  });
});
