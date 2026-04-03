import { expect, test } from "@playwright/test";

test("steam success shows mocked breakdown", async ({ page }) => {
  await page.route("**/api/steam?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        totalHours: 1842,
        gameCount: 4,
        topGames: [
          {
            appid: 10,
            name: "Counter-Strike 2 and every warmup map you forgot to leave running overnight",
            hours: 812,
          },
          {
            appid: 20,
            name: "Sid Meier's Civilization VI with one more turn syndrome on a giant map",
            hours: 446,
          },
          {
            appid: 30,
            name: "Baldur's Gate 3 co-op campaign with every side quest and inventory debate",
            hours: 351,
          },
          {
            appid: 40,
            name: "Football Manager spreadsheet simulator but the save must continue forever",
            hours: 233,
          },
        ],
      }),
    });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByTestId("steam-profile-input").fill("example-profile");
  await page.getByTestId("steam-submit").click();

  await expect(page).toHaveURL(/\/results\?/);
  await expect(page).toHaveURL(/source=steam/);
  await expect(page.getByTestId("results-breakdown")).toBeVisible();
  await expect(page.getByTestId("game-breakdown-row")).toHaveCount(4);
  await expect(
    page.getByText("Counter-Strike 2 and every warmup map", { exact: false })
  ).toBeVisible();
});

test("steam failure stays inline on home", async ({ page }) => {
  await page.route("**/api/steam?*", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Profile is private or has no public game data",
      }),
    });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByTestId("steam-profile-input").fill("private-profile");
  await page.getByTestId("steam-submit").click();

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("steam-error")).toContainText(
    "Profile is private or has no public game data"
  );
  await expect(page.getByTestId("home-screen")).toBeVisible();
});
