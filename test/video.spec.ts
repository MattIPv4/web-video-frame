import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/?src=200.mp4");
});

test("has video element", async ({ page }) => {
  const video = await page.locator("video");
  await expect(video).toBeVisible();

  await video.evaluate(node => (node as HTMLVideoElement).play());
  await page.waitForTimeout(500);
  await expect(video).toBeVisible();
});
