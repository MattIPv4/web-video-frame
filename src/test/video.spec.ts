import { test, expect, Locator } from "@playwright/test";
import { frame as generate } from "../util/generate";

test.beforeEach(async ({ page }) => {
  await page.goto("/?src=200x640x480x25.mp4");
});

const width = 640;
const height = 480;
const rate = 25;

const imageDataToObj = (values: number[]) => values.reduce((arr, value, idx) => {
  const key = ([ 'r', 'g', 'b', 'a' ])[idx % 4];
  if (idx % 4 === 0) arr.push({ r: 0, g: 0, b: 0, a: 0 });
  arr[arr.length - 1][key] = value;
  return arr;
}, [] as { r: number, g: number, b: number, a: number }[]);

const objToRGB = (obj: { r: number; g: number; b: number }) => `rgb(${obj.r}, ${obj.g}, ${obj.b})`;

const compare = (actual: { r: number; g: number; b: number }, expected: { r: number; g: number; b: number }) => {
  const threshold = 5;
  return (
    Math.abs(actual.r - expected.r) < threshold &&
    Math.abs(actual.g - expected.g) < threshold &&
    Math.abs(actual.b - expected.b) < threshold
  );
};

const evaluate = async (page: any, frame: number) => {
  const actual = await page.evaluate(() => (window as any).test.frame()).then(imageDataToObj);
  const expected = generate(frame, width, height);

  await expect(actual.length).toBe(expected.length);
  console.log(frame, objToRGB(actual[width * 5 + 5]), objToRGB(expected[width * 5 + 5]));
  await expect(compare(actual[width * 5 + 5], expected[width * 5 + 5])).toBe(true);
};

test.setTimeout(120_000);
test("requestVideoFrameCallback mediaTime", async ({ page }) => {
  await page.goto("/?src=200x640x480x25.mp4");


  const video = await page.locator("video");
  await expect(video).toBeVisible();

  for (const _ of Array.from({ length: 2 })) {
    await video.evaluate(node => (node as HTMLVideoElement).play());
    await page.waitForTimeout(1000);
    await video.evaluate(node => (node as HTMLVideoElement).pause());

    const metadata = await page.evaluate(() => (window as any).test.metadata());
    await evaluate(page, Math.round(metadata.mediaTime * rate));
  }
});

test.setTimeout(120_000);
test("HTMLVideoElement currentTime", async ({ page }) => {
  await page.goto("/?src=200x640x480x25.mp4");

  const video = await page.locator("video");
  await expect(video).toBeVisible();
  
  for (const _ of Array.from({ length: 2 })) {
    await video.evaluate(node => (node as HTMLVideoElement).play());
    await page.waitForTimeout(1000);
    await video.evaluate(node => (node as HTMLVideoElement).pause());

    const currentTime = await video.evaluate(node => (node as HTMLVideoElement).currentTime);
    await evaluate(page, Math.round(currentTime * rate));
  }
});

test("HTMLVideoElement currentTime & slowed", async ({ page, browserName }) => {
  await page.goto("/?src=1250x640x480x25x10.mp4");

  const video = await page.locator("video");
  await expect(video).toBeVisible();
  
  for (let i = 0; i < 30; i++) {
    await video.evaluate(node => (node as HTMLVideoElement).play());
    await page.waitForTimeout(500);
    await video.evaluate(node => (node as HTMLVideoElement).pause());
    await page.waitForTimeout(500);


    const currentTime = await video.evaluate(node => (node as HTMLVideoElement).currentTime);
    const currentFrame = Math.floor(currentTime * rate);
    const scaledFrame = Math.floor(currentFrame / 10) + 1;
    console.log({ currentTime, currentFrame, scaledFrame });
    await page.screenshot({ path: `tmp/${browserName}/${i}-${scaledFrame}.png` });
    // await evaluate(page, scaledFrame);
  }
});
