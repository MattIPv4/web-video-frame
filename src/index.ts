import { mkdir } from "node:fs/promises";

import { video, frame } from "./util/generate";

await mkdir("tmp", { recursive: true });
await video(200, 640, 480, "tmp/200.mp4");

const data = frame(50, 640, 480);
console.log(data);
