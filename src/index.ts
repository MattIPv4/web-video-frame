import { mkdir } from "node:fs/promises";

import { video, frame, html } from "./util/generate";

await mkdir("tmp", { recursive: true });
await video(200, 640, 480, "tmp/200.mp4");
await html("tmp/index.html");

const data = frame(50, 640, 480);
console.log(data);
