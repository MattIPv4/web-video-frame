import { mkdir } from "node:fs/promises";

import { video, html, frames } from "./util/generate";

await mkdir("tmp/original", { recursive: true });
await video(200, 640, 480, 25, "tmp/200x640x480x25.mp4");
await frames("tmp/200x640x480x25.mp4", 25, "tmp/original");
await video(1250, 640, 480, 25, "tmp/1250x640x480x25x10.mp4", 10);
await html("tmp/index.html");
