import { expect, test } from "@playwright/test";
import { goToAllocator, gotoWithViewport, VIEWPORTS } from "./utils/layout";

const MANUAL_RESULTS_PATH = "/results?hours=1260&source=manual";

test.describe("allocator functionality", () => {
  test("toggling a skill updates budget and count", async ({ page }) => {
    await gotoWithViewport(page, MANUAL_RESULTS_PATH, VIEWPORTS[0]);
    await goToAllocator(page);

    const remainingBefore = await page
      .getByTestId("remaining-hours")
      .textContent();
    expect(remainingBefore).toBe("1,260");
    await expect(page.getByTestId("unlocked-count")).toHaveText("0");

    // Click first affordable skill
    const firstSkill = page.getByTestId("allocator-skill-button").first();
    await firstSkill.click();

    await expect(page.getByTestId("unlocked-count")).toHaveText("1");
    const remainingAfter = await page
      .getByTestId("remaining-hours")
      .textContent();
    expect(remainingAfter).not.toBe("1,260");

    // Deselect it
    await firstSkill.click();
    await expect(page.getByTestId("unlocked-count")).toHaveText("0");
    await expect(page.getByTestId("remaining-hours")).toHaveText("1,260");
  });

  test("level-up button adds a skill", async ({ page }) => {
    await gotoWithViewport(page, MANUAL_RESULTS_PATH, VIEWPORTS[0]);
    await goToAllocator(page);

    await expect(page.getByTestId("allocator-level-up")).toBeEnabled();
    await page.getByTestId("allocator-level-up").click();

    await expect(page.getByTestId("unlocked-count")).toHaveText("1");
    const remaining = await page
      .getByTestId("remaining-hours")
      .textContent();
    expect(remaining).not.toBe("1,260");
  });

  test("error state for zero hours", async ({ page }) => {
    await gotoWithViewport(
      page,
      "/results?hours=0&source=manual",
      VIEWPORTS[0]
    );

    await expect(page.getByText("NO HOURS TO SPEND")).toBeVisible();
    await expect(page.getByText("GO BACK")).toBeVisible();

    await page.getByText("GO BACK").click();
    await expect(page).toHaveURL("/");
  });
});
