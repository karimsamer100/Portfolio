import { expect, test } from '@playwright/test';

test.describe('portfolio', () => {
  test('loads without errors or horizontal overflow', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Karim');
    await page.waitForTimeout(2300);
    for (const id of ['about', 'work', 'experience', 'learning', 'contact']) {
      await page.evaluate((id) => document.getElementById(id)!.scrollIntoView(), id);
      await page.waitForTimeout(150);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test('outbound links are filled and never expose a phone number', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('a[data-link]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(hrefs.every((h) => h.startsWith('https://'))).toBe(true);
    await expect(page.locator('#mail')).toHaveText('karimsamer100@gmail.com');
    expect(await page.content()).not.toMatch(/\+20|557\s?7218/);
  });

  test('project rows open chapters and Escape restores focus', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2300);
    const rows = page.locator('.row');
    await expect(rows).toHaveCount(3);
    await rows.nth(1).focus();
    await page.keyboard.press('Enter');
    const viewer = page.locator('#viewer');
    await expect(viewer).toBeVisible();
    await expect(viewer).toHaveAttribute('aria-label', 'Customer Support RAG');
    await expect(page.locator('#vClose')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(viewer).toBeHidden();
    await expect(rows.nth(1)).toBeFocused();
  });

  test('chapter scenes animate with scroll inside the viewer', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2300);
    await page.locator('.row').first().click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      const v = document.getElementById('viewer')!;
      const s = v.querySelector<HTMLElement>('.proj:not([hidden]) .proj-scene')!;
      v.scrollTop = s.offsetHeight - innerHeight;
    });
    await page.waitForTimeout(300);
    await expect(page.locator('.proj:not([hidden]) .big').first()).toContainText('1,000');
  });
});

test.describe('reduced motion', () => {
  test('everything is readable without animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/rm/);
    await expect(page.locator('.stop.off')).toHaveCount(0);
    await expect(page.locator('.stop')).toHaveCount(8);
    const opacities = await page.locator('#statement span').evaluateAll((s) => s.map((e) => getComputedStyle(e).opacity));
    expect(opacities.every((o) => o === '1')).toBe(true);
  });
});
