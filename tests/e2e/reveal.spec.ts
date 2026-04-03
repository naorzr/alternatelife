import { expect, test } from "@playwright/test";
import { goToReveal, gotoWithViewport, VIEWPORTS } from "./utils/layout";

const MANUAL_RESULTS_PATH = "/results?hours=1260&source=manual";

test.describe("reveal screen", () => {
  test("displays skill groups and content", async ({ page }) => {
    await gotoWithViewport(page, MANUAL_RESULTS_PATH, VIEWPORTS[0]);
    await goToReveal(page);

    // Header shows hours
    await expect(page.getByText("WITH 1,260 HOURS")).toBeVisible();

    // At least one skill group rendered
    const groups = page.getByTestId("reveal-skill-group");
    await expect(groups.first()).toBeVisible();
    expect(await groups.count()).toBeGreaterThan(0);

    // Skill titles have text
    const titles = page.getByTestId("reveal-skill-title");
    await expect(titles.first()).toBeVisible();
    const firstTitle = await titles.first().textContent();
    expect(firstTitle?.trim().length).toBeGreaterThan(0);
  });

  test("share button and focus skill panel exist", async ({ page }) => {
    await gotoWithViewport(page, MANUAL_RESULTS_PATH, VIEWPORTS[0]);
    await goToReveal(page);

    await expect(page.getByText("SHARE ON X")).toBeVisible();
    await expect(page.getByText("IF YOU FOCUSED ON ONE THING")).toBeVisible();
  });
});
