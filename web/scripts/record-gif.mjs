// Record animations from the embed pages as looping GIFs, and the social media card as PNGs.
//
// usage: node scripts/record-gif.mjs [base url]   (default http://localhost:3000)
// Run it against a production server (npm run build && npm start) so the dev
// overlay doesn't show up. Needs Google Chrome and ffmpeg on the PATH.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PUBLIC = path.join(import.meta.dirname, "..", "public");
const LOCALES = ["en", "ja"];
// Bump the version when a GIF changes: Discord caches images by URL
const GIFS = [
  { anim: "join-phone", key: "jph", period: 7200, width: 640, height: 400, out: (l) => `assets/discord/${l}/join-phone-v1.gif` },
  { anim: "join-pc", key: "jpc", period: 7200, width: 640, height: 400, out: (l) => `assets/discord/${l}/join-pc-v1.gif` },
];

// One round = the beats' period, then 500ms fading out and 750ms fading back in
async function recordLoop(browser, url, key, loopMs, width, height, dir) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const frames = [];
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, data });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "png", maxWidth: width, maxHeight: height, everyNthFrame: 1 });

  // The loop restarts when only "fading" is left on the root
  await page.evaluate((k) => {
    window.__resets = [];
    const el = document.querySelector(".rpa." + k);
    new MutationObserver(() => {
      if (el.className.trim() === `rpa ${k} fading`) window.__resets.push(Date.now() / 1000);
    }).observe(el, { attributes: true, attributeFilter: ["class"] });
  }, key);
  await page.waitForFunction(() => window.__resets.length > 0, null, { timeout: 30000 });
  // Start after the fade-in, so the first frame (the one shown as a still) has content
  const start = (await page.evaluate(() => window.__resets[0])) + 1.2;
  const loop = loopMs / 1000;
  await page.waitForTimeout(loopMs + 2000);
  await cdp.send("Page.stopScreencast");
  await context.close();

  // Frames arrive only when something changes, so each one is held until the next
  const end = start + loop;
  const before = frames.filter((f) => f.t <= start).pop();
  const inside = frames.filter((f) => f.t > start && f.t < end);
  const picked = [before ?? inside[0], ...inside];
  const lines = [];
  picked.forEach((f, i) => {
    const name = `f${String(i).padStart(4, "0")}.png`;
    fs.writeFileSync(path.join(dir, name), Buffer.from(f.data, "base64"));
    const from = i === 0 ? start : f.t;
    const to = i + 1 < picked.length ? picked[i + 1].t : end;
    lines.push(`file '${name}'`, `duration ${Math.max(0.001, to - from).toFixed(4)}`);
  });
  lines.push(`file 'f${String(picked.length - 1).padStart(4, "0")}.png'`);
  fs.writeFileSync(path.join(dir, "list.txt"), lines.join("\n") + "\n");
  return picked.length;
}

function toGif(dir, out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(dir, "list.txt"),
    "-vf", "fps=20,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle",
    "-loop", "0", out,
  ]);
}

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--window-size=1200,630"] });
try {
  for (const gif of GIFS) {
    for (const locale of LOCALES) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${gif.anim}-`));
      const count = await recordLoop(browser, `${BASE}/${locale}/embed/${gif.anim}`, gif.key, gif.period + 1250, gif.width, gif.height, dir);
      const out = path.join(PUBLIC, gif.out(locale));
      toGif(dir, out);
      fs.rmSync(dir, { recursive: true });
      console.log(`${gif.out(locale)}: ${count} frames, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
    }
  }

  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const locale of LOCALES) {
    await page.goto(`${BASE}/${locale}/embed/og-card`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(PUBLIC, `assets/branding/og-image-${locale}.png`);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log(`assets/branding/og-image-${locale}.png`);
  }
} finally {
  await browser.close();
}
