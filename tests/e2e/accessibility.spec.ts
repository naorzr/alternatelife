import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { STEAM_RESULTS_PATH, goToReveal } from "./utils/layout";

const MANUAL_RESULTS_PATH = "/results?hours=1260&source=manual";

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .exclude("nextjs-portal")
    .analyze();

  const severe = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? "")
  );

  expect(severe).toEqual([]);
}

test("home and results flows avoid serious accessibility violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expectNoSeriousViolations(page);

  await page.goto(MANUAL_RESULTS_PATH);
  await page.waitForLoadState("networkidle");
  await expectNoSeriousViolations(page);

  await goToReveal(page);
  await expectNoSeriousViolations(page);

  await page.getByTestId("build-your-own-button").dispatchEvent("click");
  await expect(page.getByTestId("results-allocator")).toBeVisible();
  await expectNoSeriousViolations(page);

  await page.goto(STEAM_RESULTS_PATH);
  await page.waitForLoadState("networkidle");
  await expectNoSeriousViolations(page);
});
