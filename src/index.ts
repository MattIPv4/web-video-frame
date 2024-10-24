import { mkdir } from "node:fs/promises";

import { video, html } from "./util/generate";

await mkdir("tmp", { recursive: true });
await video(200, 640, 480, 25, "tmp/200x640x480x25.mp4");
await html("tmp/index.html");
