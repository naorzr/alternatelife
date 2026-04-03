import { expect, type Locator, type Page } from "@playwright/test";

export const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

export const STEAM_RESULTS_PATH = `/results?hours=1842&games=4&source=steam&topGames=${encodeURIComponent(
  JSON.stringify([
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
  ])
)}`;

export async function gotoWithViewport(
  page: Page,
  path: string,
  viewport: (typeof VIEWPORTS)[number]
) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

export async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
}

export async function expectNoVerticalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    clientHeight: document.documentElement.clientHeight,
    scrollHeight: document.documentElement.scrollHeight,
  }));

  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight);
}

export async function expectFullyVisible(locator: Locator, page: Page) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  if (!box || !viewport) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
}

export async function expectTextNotClipped(locator: Locator, sampleCount = 3) {
  const count = await locator.count();

  for (let i = 0; i < Math.min(sampleCount, count); i += 1) {
    const sample = locator.nth(i);
    await expect(sample).toBeVisible();

    const metrics = await sample.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        scrollHeight: element.scrollHeight,
        scrollWidth: element.scrollWidth,
        textOverflow: style.textOverflow,
      };
    });

    expect(metrics.textOverflow).not.toBe("ellipsis");
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 2);
    expect(metrics.overflowX).not.toBe("hidden");
    expect(metrics.overflowY).not.toBe("hidden");
  }
}

export async function goToReveal(page: Page) {
  await expect(page.getByTestId("show-me-button")).toBeVisible();
  await expect(page.getByTestId("show-me-button")).toBeEnabled();
  await page.getByTestId("show-me-button").click();
  await expect(page.getByTestId("results-reveal")).toBeVisible();
}

export async function goToAllocator(page: Page) {
  await goToReveal(page);
  await page.getByTestId("build-your-own-button").click();
  await expect(page.getByTestId("results-allocator")).toBeVisible();
}
