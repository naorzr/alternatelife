import { expect, test } from "@playwright/test";
import {
  goToAllocator,
  goToReveal,
  gotoWithViewport,
  VIEWPORTS,
} from "./utils/layout";

const MANUAL_RESULTS_PATH = "/results?hours=1260&source=manual";

test.describe("screen navigation", () => {
  test("back from reveal returns to breakdown", async ({ page }) => {
    await gotoWithViewport(page, MANUAL_RESULTS_PATH, VIEWPORTS[0]);
    await goToReveal(page);

    await page.getByTestId("reveal-back-button").click();
    await expect(page.getByTestId("results-breakdown")).toBeVisible();
  });

  test("back from allocator returns to reveal", async ({ page }) => {
    await gotoWithViewport(page, MANUAL_RESULTS_PATH, VIEWPORTS[0]);
    await goToAllocator(page);

    await page.getByTestId("allocator-back-button").click();
    await expect(page.getByTestId("results-reveal")).toBeVisible();
  });
});
