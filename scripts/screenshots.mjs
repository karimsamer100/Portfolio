// Captures viewport frames at fixed scroll points for visual review.
// Usage: node scripts/screenshots.mjs <url> <outDir> [width height]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [url = 'http://localhost:4173/', out = 'screenshots', w = '1440', h = '900'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const shots = [
  ['hero', 0], ['hero', 0.25], ['hero', 0.7], ['about', 0.5], ['work', 0],
  ['experience', 0.15], ['experience', 0.6], ['learning', 0], ['contact', 0],
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url);
await page.waitForTimeout(2600);
let i = 0;
for (const [id, f] of shots) {
  const found = await page.evaluate(([id, f]) => {
    const el = document.getElementById(id);
    if (!el) return false;
    window.scrollTo(0, el.offsetTop + Math.max(0, el.offsetHeight - innerHeight) * f);
    return true;
  }, [id, f]);
  if (!found) continue;
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${out}/${String(i++).padStart(2, '0')}-${id}-${f}.png` });
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
console.log(JSON.stringify({ url, frames: i, overflow, errors }));
await browser.close();
