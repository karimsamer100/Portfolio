// Captures each project chapter at several progress points.
// Usage: node scripts/viewer-shots.mjs <url> <outDir> [width height]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [url = 'http://localhost:4173/', out = 'screenshots/viewer', w = '1440', h = '900'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url);
await page.waitForTimeout(2600);
await page.evaluate(() => document.getElementById('work').scrollIntoView());
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/index.png` });
const rows = await page.locator('.row').count();
for (let k = 0; k < rows; k++) {
  await page.locator('.row').nth(k).click();
  await page.waitForTimeout(1000);
  for (const f of [0.15, 0.45, 0.8]) {
    await page.evaluate((f) => {
      const v = document.getElementById('viewer');
      const scene = [...v.querySelectorAll('.proj-scene, [id$="scene"]')].find((el) => el.getClientRects().length);
      v.scrollTop = (scene.offsetHeight - innerHeight) * f;
    }, f);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/p${k}-${f}.png` });
  }
  await page.evaluate(() => { const v = document.getElementById('viewer'); v.scrollTop = v.scrollHeight; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/p${k}-end.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
}
console.log(JSON.stringify({ url, rows, errors, focus: await page.evaluate(() => document.activeElement?.className) }));
await browser.close();
