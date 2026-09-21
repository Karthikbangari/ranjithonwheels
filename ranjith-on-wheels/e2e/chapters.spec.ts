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
      // No verified manuscript: a wordless atmospheric interlude stands in.
      if (!(slug in optional)) expected.push("interlude");
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
    // The blue road turns red with the scroll, and the counter with it — so it
    // only reaches its total once the visitor has ridden the whole map.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(gateway.locator("[data-count]")).toHaveText("48,000", { timeout: 12000 });
    // Very dark charcoal — layered, not pure black and not flat navy.
    const bg = await gateway.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bg).toMatch(/rgb\(14, 20, 29\)/);
    expect(bg).not.toMatch(/rgb\(0, 0, 0\)/);
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

test.describe("chapter details (decision #21)", () => {
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
    // The tag is never the word "challenge".
    expect(await page.locator("#chapter-environment").innerText()).not.toMatch(/challenge/i);
  });

  test("a film frame with no photograph is a deliberate stand-in: outline, location, coordinates, memory number", async ({ page }) => {
    await page.goto("/journey/vietnam");
    const frame = page.locator("#chapter-memory [data-frame]").first();
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
    // No large disclaimer paragraph any more.
    await expect(arrival.getByText(/not the cycling track/i)).toHaveCount(0);
    for (const dd of await arrival.locator("dl dd").allInnerTexts()) expect(dd.trim()).not.toBe("");
  });

  test("the journey rail always says where we came from, where we are, and where we go next", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/journey/cambodia");
    const rail = page.getByRole("navigation", { name: "Journey progress" });
    await expect(rail).toBeVisible();
    await expect(rail.getByRole("link", { name: /Vietnam/ })).toHaveAttribute("href", "/journey/vietnam");
    await expect(rail.getByRole("link", { name: /Thailand/ })).toHaveAttribute("href", "/journey/thailand");
    await expect(rail.getByText(/04 \/ 23 · Cambodia/)).toBeVisible();
    expect(await rail.locator("i").count()).toBe(23);
    expect(await rail.locator('i[data-state="done"]').count()).toBe(3);
    expect(await rail.locator('i[data-state="here"]').count()).toBe(1);
    expect(await rail.locator('i[data-state="ahead"]').count()).toBe(19);
    await page.goto("/journey/india");
    await expect(page.getByRole("navigation", { name: "Journey progress" }).getByText("The road begins")).toBeVisible();
    await page.goto("/journey/slovakia");
    await expect(page.getByRole("navigation", { name: "Journey progress" }).getByText("The road goes on")).toBeVisible();
  });

  test("the hand-off plays as one continuous move: veil in the next country's colours, then its hero, with the veil gone", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/journey/cambodia");
    await page.locator("#chapter-transition").scrollIntoViewIfNeeded();
    await page.getByRole("link", { name: /Enter Thailand/ }).click();
    const veil = page.locator("#chapter-veil");
    await expect(veil).toBeAttached({ timeout: 3000 });
    await expect(veil.locator("[data-v-name]")).toHaveText("Thailand");
    await expect(veil.locator("[data-v-line] span").first()).toHaveText("Chapter 05 of 23");
    await expect(page).toHaveURL(/\/journey\/thailand$/, { timeout: 8000 });
    await expect(page.getByRole("heading", { name: "Thailand", level: 1 })).toBeVisible();
    await expect(page.locator("#chapter-veil")).toHaveCount(0, { timeout: 8000 });
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

  test("pending chapters show a wordless interlude, not developer text", async ({ page }) => {
    await page.goto("/journey/thailand");
    const interlude = page.locator("#chapter-interlude");
    await expect(interlude).toBeAttached();
    expect(await interlude.locator("p").allInnerTexts()).toHaveLength(1);
    await expect(page.locator("[data-chapter]")).toHaveAttribute("data-content-status", "pending");
    await page.goto("/journey/india");
    await expect(page.locator("[data-chapter]")).toHaveAttribute("data-content-status", "verified");
    await expect(page.locator("#chapter-interlude")).toHaveCount(0);
  });

  test("no country invents a date", async ({ page }) => {
    for (const slug of ["india", "japan", "slovakia"]) {
      await page.goto(`/journey/${slug}`);
      expect(await page.locator("#chapter-arrival dt").allInnerTexts(), slug).not.toContain("Date");
    }
  });
});
