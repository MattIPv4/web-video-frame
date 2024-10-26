import { mkdir } from "node:fs/promises";

import { video, html, frames } from "./util/generate";

await mkdir("tmp/original", { recursive: true });
await video(200, 640, 480, 25, "tmp/200x640x480x25.mp4");
await frames("tmp/200x640x480x25.mp4", 25, "tmp/original");
await video(600, 640, 480, 25, "tmp/600x640x480x25x3.mp4", 3);
await video(1000, 640, 480, 25, "tmp/1000x640x480x25x5.mp4", 5);
await video(2000, 640, 480, 25, "tmp/2000x640x480x25x10.mp4", 10);
await html("tmp/index.html");
