import { expect, test } from "@playwright/test";
import {
  STEAM_RESULTS_PATH,
  VIEWPORTS,
  expectFullyVisible,
  expectNoHorizontalOverflow,
  expectNoVerticalOverflow,
  expectTextNotClipped,
  goToAllocator,
  goToReveal,
  gotoWithViewport,
} from "./utils/layout";

const MANUAL_RESULTS_PATH = "/results?hours=1260&source=manual";

test.describe("viewport-safe layouts", () => {
  for (const viewport of VIEWPORTS) {
    test(`home fits ${viewport.name}`, async ({ page }) => {
      await gotoWithViewport(page, "/", viewport);

      await expect(page.getByTestId("home-screen")).toBeVisible();
      await expectNoHorizontalOverflow(page);
      if (viewport.name === "desktop") {
        await expectNoVerticalOverflow(page);
      }
      await expectFullyVisible(page.getByTestId("steam-submit"), page);
      await expectFullyVisible(page.getByTestId("manual-submit"), page);
    });

    test(`manual breakdown fits ${viewport.name}`, async ({ page }) => {
      await gotoWithViewport(page, MANUAL_RESULTS_PATH, viewport);

      await expect(page.getByTestId("results-breakdown")).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectFullyVisible(page.getByTestId("show-me-button"), page);
    });

    test(`reveal fits ${viewport.name}`, async ({ page }) => {
      await gotoWithViewport(page, MANUAL_RESULTS_PATH, viewport);
      await goToReveal(page);

      await expectNoHorizontalOverflow(page);
      await expectFullyVisible(page.getByTestId("build-your-own-button"), page);
      await expectTextNotClipped(page.getByTestId("reveal-skill-title"), 4);
    });

    test(`allocator fits ${viewport.name}`, async ({ page }) => {
      await gotoWithViewport(page, MANUAL_RESULTS_PATH, viewport);
      await goToAllocator(page);

      await expectNoHorizontalOverflow(page);
      await expectFullyVisible(page.getByTestId("allocator-back-button"), page);
      await expectFullyVisible(page.getByTestId("skill-tree-bar"), page);
      await expectTextNotClipped(page.getByTestId("allocator-skill-title"), 4);

      await expect(page.getByTestId("stat-tab-str")).toBeVisible();
      await expect(page.getByTestId("stat-tab-end")).toBeVisible();
    });

    test(`mocked steam breakdown fits ${viewport.name}`, async ({ page }) => {
      await gotoWithViewport(page, STEAM_RESULTS_PATH, viewport);

      await expect(page.getByTestId("results-breakdown")).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expect(page.getByTestId("game-breakdown-row")).toHaveCount(4);
      await expectTextNotClipped(page.getByTestId("game-title"), 4);
      await expect(page.getByText("STEAM PROFILE")).toBeVisible();
    });
  }
});
