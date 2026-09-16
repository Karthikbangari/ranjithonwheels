import { test, expect } from "@playwright/test";

test.describe("support page", () => {
  test("shows a disabled coming-soon state, not a live checkout", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByText(/coming soon/i).first()).toBeVisible();
    const disabledButtons = page.getByRole("button", { name: "Coming soon" });
    await expect(disabledButtons.first()).toBeDisabled();
  });

  test("never claims a payment succeeded", async ({ page }) => {
    await page.goto("/support/success");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/payment (was )?successful/i);
    expect(body).toMatch(/does not verify or record payments/i);
  });

  test("cancel page confirms no charge was made", async ({ page }) => {
    await page.goto("/support/cancel");
    await expect(page.getByText(/no charge was made/i)).toBeVisible();
  });

  test("FAQ accordion opens on click", async ({ page }) => {
    await page.goto("/support");
    const firstQuestion = page.locator("summary").first();
    await firstQuestion.click();
    const firstItem = page.locator("details").first();
    await expect(firstItem).toHaveAttribute("open", "");
  });
});
