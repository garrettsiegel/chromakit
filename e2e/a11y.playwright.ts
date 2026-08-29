import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const INDEXABLE_ROUTES = [
  '/',
  '/docs/getting-started',
  '/docs/color-picker',
  '/docs/components',
  '/docs/hooks',
  '/docs/utilities',
  '/docs/theming',
  '/docs/troubleshooting',
];

const THEMES = ['light', 'dark'] as const;

async function setTheme(page: Page, theme: (typeof THEMES)[number]) {
  await page.addInitScript((nextTheme) => {
    window.localStorage.setItem('theme', nextTheme);
  }, theme);
}

for (const route of INDEXABLE_ROUTES) {
  for (const theme of THEMES) {
    test(`${route} has no axe violations in ${theme} mode`, async ({
      page,
    }) => {
      const browserErrors: string[] = [];
      page.on('pageerror', (error) => browserErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(message.text());
      });
      await setTheme(page, theme);
      await page.goto(route, { waitUntil: 'networkidle' });

      const results = await new AxeBuilder({ page })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa',
          'best-practice',
        ])
        .analyze();

      expect(results.violations).toEqual([]);
      expect(browserErrors).toEqual([]);
    });
  }
}

test('404 returns the correct status and stays out of search', async ({
  page,
}) => {
  const response = await page.goto('/__accessibility-404-check', {
    waitUntil: 'networkidle',
  });

  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow'
  );
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('picker exposes independent keyboard axes', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard interaction is covered by the desktop project');
  await page.goto('/', { waitUntil: 'networkidle' });
  const workbench = page.locator(
    'astro-island[component-export="DemoPlayground"]'
  );
  await workbench.scrollIntoViewIfNeeded();
  await expect(workbench).not.toHaveAttribute('ssr', '');
  const saturation = page.getByRole('slider', { name: 'Saturation' }).first();
  const brightness = page.getByRole('slider', { name: 'Brightness' }).first();

  await saturation.focus();
  const saturationBefore = Number(
    await saturation.getAttribute('aria-valuenow')
  );
  await saturation.press('Home');
  await expect
    .poll(async () => Number(await saturation.getAttribute('aria-valuenow')))
    .toBeLessThan(saturationBefore);

  await brightness.focus();
  const brightnessBefore = Number(
    await brightness.getAttribute('aria-valuenow')
  );
  await brightness.press('Home');
  await expect
    .poll(async () => Number(await brightness.getAttribute('aria-valuenow')))
    .toBeLessThan(brightnessBefore);
});

test('workbench preserves alpha in controlled state', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Keyboard interaction is covered by the desktop project');
  await page.goto('/', { waitUntil: 'networkidle' });
  const workbench = page.locator(
    'astro-island[component-export="DemoPlayground"]'
  );
  await workbench.scrollIntoViewIfNeeded();
  await expect(workbench).not.toHaveAttribute('ssr', '');

  const alpha = page
    .getByRole('slider', { name: 'Alpha (transparency)' })
    .first();
  await alpha.focus();
  await alpha.press('Home');

  await expect(alpha).toHaveAttribute('aria-valuenow', '0');
  await expect(
    page.locator('.workbench-ledger dl > div:last-child dd')
  ).toHaveText('0%');
});

test('homepage and docs reflow without horizontal overflow', async ({
  page,
}) => {
  for (const width of [320, 375, 414, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/docs/getting-started']) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const dimensions = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(dimensions.page, `${route} at ${width}px`).toBeLessThanOrEqual(
        dimensions.viewport
      );
      expect(dimensions.body, `${route} body at ${width}px`).toBeLessThanOrEqual(
        dimensions.viewport
      );
    }
  }
});

test('accessibility media preferences keep the homepage usable', async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: 'reduce',
    forcedColors: 'active',
    contrast: 'more',
  });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content:
      '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-block-end: 2em !important; }',
  });

  const preferences = await page.evaluate(() => ({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    forcedColors: window.matchMedia('(forced-colors: active)').matches,
    contrast: window.matchMedia('(prefers-contrast: more)').matches,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));

  expect(preferences.reducedMotion).toBe(true);
  expect(preferences.forcedColors).toBe(true);
  expect(preferences.contrast).toBe(true);
  expect(preferences.documentWidth).toBeLessThanOrEqual(preferences.viewport);
  expect(preferences.bodyWidth).toBeLessThanOrEqual(preferences.viewport);

  const alpha = page
    .getByRole('slider', { name: 'Alpha (transparency)' })
    .first();
  await alpha.focus();
  await expect(alpha).toBeFocused();
  await expect(alpha).toHaveCSS('outline-style', 'solid');
  await expect(alpha).toHaveCSS('outline-width', '3px');
});
