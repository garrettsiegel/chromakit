import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = process.cwd();
const publicDir = path.join(root, 'client', 'public');
const brandDir = path.join(publicDir, 'brand');

const cardTemplate = pathToFileURL(
  path.join(root, 'scripts', 'brand-card.html')
).href;

// THE CARD SHOWS THE REAL PICKER FROM THE LIBRARY BUILD (RUN npm run build FIRST)
async function renderPicker() {
  const { ColorPicker } = await import(
    pathToFileURL(path.join(root, 'dist', 'chromakit.es.js')).href
  );
  return renderToStaticMarkup(
    createElement(ColorPicker, {
      defaultValue: '#FF6B6B',
      enableHistory: false,
      showEyeDropper: false,
    })
  );
}

// RENDERED IN CHROMIUM SO THE WORDMARK USES THE SELF-HOSTED GEIST FONT
async function makeCards(cards) {
  const pickerHtml = await renderPicker();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const { width, height, output } of cards) {
      await page.setViewportSize({ width, height });
      await page.goto(cardTemplate);
      await page.$eval(
        '.picker',
        (el, html) => {
          el.innerHTML = html;
        },
        pickerHtml
      );
      await page.evaluate('document.fonts.ready');
      await page.$eval('.picker', (el) => {
        const picker = el.firstElementChild;
        const room = el.parentElement.clientHeight;
        picker.style.zoom = String(room / picker.offsetHeight);
      });
      await page.screenshot({ path: output });
    }
  } finally {
    await browser.close();
  }
}

// Raster icons are all rendered from the one favicon.svg source.
async function makeIcons() {
  const icon = await readFile(path.join(publicDir, 'favicon.svg'));
  const sizes = [
    ['favicon-32.png', 32],
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ];
  await Promise.all(
    sizes.map(([name, size]) =>
      sharp(icon, { density: 72 * Math.ceil(size / 128) * 2 })
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(path.join(publicDir, name))
    )
  );
}

await Promise.all([
  makeIcons(),
  makeCards([
    {
      width: 1200,
      height: 630,
      output: path.join(publicDir, 'og-image.png'),
    },
    {
      width: 1600,
      height: 900,
      output: path.join(brandDir, 'readme-hero.png'),
    },
  ]),
]);
