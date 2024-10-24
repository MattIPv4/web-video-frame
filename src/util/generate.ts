import { exec as execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { dir, setGracefulCleanup } from "tmp-promise";
import { build } from "tsup";

setGracefulCleanup();

const mod = (a: number, b: number) => ((a % b) + b) % b;

const exec = (command: string) =>
    new Promise((resolve, reject) => {
      execSync(command, (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr });
        else resolve({ stdout, stderr });
      });
    });

export const video = async (frames: number, width: number, height: number, output: string, rate: number = 25) => {
    const command = [
        `"${ffmpeg.path}"`,
        "-f",
        "lavfi",
        "-i",
        `nullsrc=size=${width}x${height}:rate=${rate}:duration=${frames / rate}`,
        "-vf",
        "\"geq=" +
            "r='mod(floor(X*10/W)*10 + floor(Y*10/H)*15 + N*40, 256)':" +
            "g='mod(floor(X*10/W)*20 + floor(Y*10/H)*25 + N*45, 256)':" +
            "b='mod(floor(X*10/W)*30 + floor(Y*10/H)*35 + N*50, 256)'\"",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        output,
        "-y",
    ].join(" ");
    await exec(command).catch(({ error, stdout, stderr }) => {
        console.error("ffmpeg command failed:", command);
        console.error("stdout:", stdout);
        console.error("stderr:", stderr);
        throw error;
    });
};

export const frame = (frame: number, width: number, height: number) => {
  const pixels: { r: number; g: number; b: number }[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = mod(
        Math.floor((x * 10) / width) * 10 + Math.floor((y * 10) / height) * 15 + frame * 40,
        256
      );
      const g = mod(
        Math.floor((x * 10) / width) * 20 + Math.floor((y * 10) / height) * 25 + frame * 45,
        256
      );
      const b = mod(
        Math.floor((x * 10) / width) * 30 + Math.floor((y * 10) / height) * 35 + frame * 50,
        256
      );

      pixels.push({ r, g, b });
    }
  }

  return pixels;
};

export const html = async (output: string) => {
  const { path } = await dir({ unsafeCleanup: true });
  await build({
      entryPoints: [fileURLToPath(new URL("./player.ts", import.meta.url))],
      format: ["cjs"],
      minify: true,
      outDir: path,
  });
  const js = await readFile(`${path}/player.cjs`, "utf-8");
  await writeFile(output, `<html><body><script>${js}</script></body></html>`);
};
