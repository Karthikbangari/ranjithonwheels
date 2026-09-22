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
  indonesia: ["road", "environment", "discovery", "signature"],
  china: ["discovery", "signature"],
  japan: ["discovery", "memory", "signature"],
  taiwan: ["road", "environment", "signature"],
  mongolia: ["discovery", "signature"],
};
const OPTIONAL_IDS = ["road", "environment", "discovery", "memory", "signature"];

test.describe("the 23 chapters", () => {
  for (const { slug, name } of countries) {
    test(`${name}: complete chapter in order, with nothing placeholder`, async ({ page }) => {
      await page.goto(`/journey/${slug}`);
      await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();

      const ids = await page.evaluate(() =>
        [...document.querySelectorAll("[data-chapter] section[id^='chapter-']")].map((el) => el.id.replace("chapter-", "")),
      );
      const expected = ["intro", "arrival"];
      if (slug === "south-korea") expected.push("notes");
      // Order matches the owner's page sequence (Pages 5–13). A country with
      // no data for a page simply has no section for it — nothing invented.
      for (const id of OPTIONAL_IDS) if ((optional[slug] ?? []).includes(id)) expected.push(id);
      expected.push("departure", "transition");
      expect(ids).toEqual(expected);

      const text = await page.locator("main, body").first().innerText();
      expect(text).not.toMatch(/pending|placeholder|TODO|coming soon/i);
    });
  }

  test("a country with a real photograph shows it; one without shows its own terrain map instead", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.locator("#chapter-intro img")).toHaveCount(1);
    await page.goto("/journey/cambodia");
    await expect(page.locator("#chapter-intro img")).toHaveCount(1);

    // Singapore has no photograph on disk yet: the image 404s and the
    // client-side fallback swaps to the country's own terrain outline.
    await page.goto("/journey/singapore");
    await expect(page.locator("#chapter-intro svg")).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#chapter-intro img")).toHaveCount(0);
  });

  test("the road into Indonesia is the sourced sea crossing; the road into Vietnam is not", async ({ page }) => {
    await page.goto("/journey/indonesia");
    await expect(page.locator("#chapter-arrival svg text", { hasText: "SEA CROSSING" })).toBeVisible();
    await expect(page.locator("#chapter-arrival").getByText("The 32-hour ferry from Singapore")).toBeVisible();
    await page.goto("/journey/vietnam");
    await expect(page.locator("#chapter-arrival svg text", { hasText: "SEA CROSSING" })).toHaveCount(0);
  });

  test("India begins the road; Slovakia's road leaves unfinished", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.locator("#chapter-arrival").getByText("Where the road begins")).toBeVisible();
    await page.goto("/journey/slovakia");
    await expect(page.getByRole("heading", { name: /The road isn.t finished/ })).toBeVisible();
    const dash = await page.locator("#chapter-departure svg path").last().getAttribute("stroke-dasharray");
    expect(dash).toBeTruthy();
  });

  test("a country with no story manuscript keeps its teaser as the opening line, and invents nothing else", async ({ page }) => {
    await page.goto("/journey/sri-lanka");
    await expect(page.locator("#chapter-intro").getByText("The elephant escape.")).toBeVisible();
    await expect(page.locator("#chapter-road, #chapter-memory, #chapter-discovery")).toHaveCount(0);
  });

  test("the hand-off into the next chapter is a plain link", async ({ page }) => {
    await page.goto("/journey/vietnam");
    await page.getByRole("link", { name: /Enter Cambodia/ }).click();
    await expect(page).toHaveURL(/\/journey\/cambodia$/);
    await expect(page.getByRole("heading", { name: "Cambodia", level: 1 })).toBeVisible();
  });

  test("old /stories/[slug] links redirect to the chapter", async ({ page }) => {
    await page.goto("/stories/taiwan");
    await expect(page).toHaveURL(/\/journey\/taiwan$/);
    await expect(page.getByRole("heading", { name: "Taiwan", level: 1 })).toBeVisible();
  });

  test("/stories links each of the ten stories to its chapter", async ({ page }) => {
    await page.goto("/stories");
    await expect(page.getByRole("link", { name: "Open the chapter" })).toHaveCount(10);
    await expect(page.locator('a[href="/journey/india"]', { hasText: "Open the chapter" })).toHaveCount(1);
  });

  test("the road page shows the distance and the places along it", async ({ page }) => {
    await page.goto("/journey/india");
    await expect(page.locator("#chapter-road [class*=odometer]").getByText("15,000")).toBeVisible();
    await expect(page.locator("#chapter-road [class*=step]").first()).toBeVisible();
  });
});

test.describe("the chapter gateway (Page 4)", () => {
  test("is a plain white map with a marker link for every chapter, and the route already ridden", async ({ page }) => {
    await page.goto("/journey");
    const gateway = page.locator("#chapter-gateway");
    await expect(gateway.locator("a[data-dot]")).toHaveCount(23);
    await expect(gateway.getByText("48,000")).toBeVisible();
    const bg = await gateway.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(255, 255, 255)");
  });

  test("on a phone the map opens centred on the journey, not the Atlantic", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/journey");
    const scrolled = await page.locator("#chapter-gateway [class*=mapScroll]").evaluate((el) => el.scrollLeft);
    expect(scrolled).toBeGreaterThan(50);
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

test.describe("chapter details", () => {
  test("the environment page describes the setting and never an event", async ({ page }) => {
    await page.goto("/journey/indonesia");
    const indonesia = page.locator("#chapter-environment");
    await expect(indonesia.getByText("Regional terrain")).toBeVisible();
    await page.goto("/journey/taiwan");
    const taiwan = page.locator("#chapter-environment");
    await expect(taiwan.getByText("Natural environment")).toBeVisible();
    for (const section of [indonesia, taiwan]) {
      const text = await section.innerText().catch(() => "");
      expect(text).not.toMatch(/danger|encounter|erupt|survived|escaped|felt the|struck/i);
    }
    expect(await page.locator("#chapter-environment").innerText()).not.toMatch(/challenge/i);
  });

  test("a film frame with no photograph is a deliberate stand-in: outline, location, coordinates, memory number", async ({ page }) => {
    await page.goto("/journey/vietnam");
    const frame = page.locator("#chapter-memory [class*=frame]").first();
    await expect(frame.locator("svg path").first()).toBeAttached();
    await expect(frame.getByText("Vietnam", { exact: true })).toBeVisible();
    await expect(frame.getByText("14.06° N · 108.28° E")).toBeVisible();
    await expect(frame.getByText("Memory 01")).toBeVisible();
    expect(await frame.locator("img").count()).toBe(0);
  });

  test("every signature page says its illustration is a visual interpretation", async ({ page }) => {
    for (const slug of ["india", "vietnam", "cambodia", "malaysia", "singapore", "indonesia", "china", "japan", "taiwan", "mongolia"]) {
      await page.goto(`/journey/${slug}`);
      await expect(page.locator("#chapter-signature").getByText("Visual interpretation"), slug).toBeVisible();
      await expect(page.locator("#chapter-signature").getByText(/^Photograph/), slug).toHaveCount(0);
    }
  });

  test("arrival metadata is location and coordinates — no date, no empty slot, and only a subtle indicative-route tag", async ({ page }) => {
    await page.goto("/journey/cambodia");
    const arrival = page.locator("#chapter-arrival");
    const labels = await arrival.locator("dl dt").allTextContents();
    expect(labels).toEqual(["Location", "Coordinates", "From", "Chapter"]);
    expect(labels).not.toContain("Date");
    await expect(arrival.getByText("Indicative route")).toHaveCount(1);
    for (const dd of await arrival.locator("dl dd").allInnerTexts()) expect(dd.trim()).not.toBe("");
  });

  test("Instagram and YouTube stay hidden until real URLs are supplied — never a guessed profile", async ({ page }) => {
    for (const path of ["/", "/contact", "/journey/india", "/about"]) {
      await page.goto(path);
      expect(await page.locator('a[href*="instagram" i], a[href*="youtube" i], a[href*="youtu.be" i]').count(), path).toBe(0);
    }
  });

  test("Bhagira is shown nowhere until verified details exist", async ({ page }) => {
    for (const slug of ["india", "sri-lanka", "thailand", "vietnam", "australia", "slovakia"]) {
      await page.goto(`/journey/${slug}`);
      await expect(page.locator("#chapter-bhagira"), slug).toHaveCount(0);
      expect(await page.locator("body").innerText(), slug).not.toMatch(/bhagira/i);
    }
  });

  test("no country invents a date", async ({ page }) => {
    for (const slug of ["india", "japan", "slovakia"]) {
      await page.goto(`/journey/${slug}`);
      expect(await page.locator("#chapter-arrival dt").allInnerTexts(), slug).not.toContain("Date");
    }
  });
});

test.describe("chapters — prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every page shows complete, with nothing left invisible", async ({ page }) => {
    for (const slug of ["india", "indonesia", "taiwan", "sri-lanka", "slovakia"]) {
      await page.goto(`/journey/${slug}`);
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-chapter] *")].filter((el) => getComputedStyle(el).opacity === "0").length,
      );
      expect(hidden, slug).toBe(0);
    }
  });
});
