import { expect, test } from "@playwright/test";

test("manual entry reaches breakdown, reveal, and allocator", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByTestId("manual-hours-input").fill("1260");
  await page.getByTestId("manual-submit").click();

  await expect(page).toHaveURL(/\/results\?hours=1260&source=manual/);
  await expect(page.getByTestId("results-breakdown")).toBeVisible();

  await page.getByTestId("show-me-button").click();
  await expect(page.getByTestId("results-reveal")).toBeVisible();

  await page.getByTestId("build-your-own-button").click();
  await expect(page.getByTestId("results-allocator")).toBeVisible();

  const remainingBefore = await page.getByTestId("remaining-hours").textContent();

  await page.getByTestId("allocator-random").click();
  await expect(page.getByTestId("unlocked-count")).not.toHaveText("0");
  await expect(page.getByTestId("remaining-hours")).not.toHaveText(
    remainingBefore ?? ""
  );

  await page.getByTestId("allocator-reset").click();
  await expect(page.getByTestId("unlocked-count")).toHaveText("0");
  await expect(page.getByTestId("remaining-hours")).toHaveText("1,260");

  await page.getByTestId("stat-tab-int").click();
  await expect(page.getByRole("heading", { name: "INTELLIGENCE" })).toBeVisible();
});
