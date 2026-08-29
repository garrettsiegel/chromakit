import { readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'client', 'public');
const brandDir = path.join(publicDir, 'brand');

const palette = {
  paper: '#f6f3e9',
  olive: '#202516',
  ink: '#12140e',
  chartreuse: '#ddfe3f',
  periwinkle: '#b7c0ff',
  magenta: '#ff68c8',
};

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
}

async function makeCard({ width, height, output }) {
  const border = Math.round(width * 0.0067);
  const oliveWidth = Math.round(width * 0.62);
  const artWidth = width - oliveWidth;
  const padding = Math.round(width * 0.05);
  const markSize = Math.round(width * 0.067);
  const screenshotWidth = Math.round(width * 0.55);
  const screenshotHeight = Math.round(height * 0.39);
  const screenshotX = width - screenshotWidth - Math.round(width * 0.035);
  const screenshotY = height - screenshotHeight - Math.round(height * 0.05);

  const [mark, art, screenshot] = await Promise.all([
    readFile(path.join(publicDir, 'chromakit-mark.svg')),
    sharp(path.join(brandDir, 'color-study-960.webp'))
      .resize(artWidth, height, { fit: 'cover' })
      .toBuffer(),
    sharp(path.join(brandDir, 'workbench-screenshot.png'))
      .resize(screenshotWidth, screenshotHeight, {
        fit: 'cover',
        position: 'top',
      })
      .toBuffer(),
  ]);

  const titleSize = Math.round(width * 0.074);
  const lockupSize = Math.round(width * 0.022);
  const labelSize = Math.round(width * 0.0105);
  const bodySize = Math.round(width * 0.015);
  const titleY = Math.round(height * 0.39);
  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .display { font-family: Arial, Helvetica, sans-serif; font-weight: 800; letter-spacing: -0.055em; }
        .body { font-family: Arial, Helvetica, sans-serif; }
        .mono { font-family: ui-monospace, Menlo, monospace; font-weight: 700; letter-spacing: 0.12em; }
      </style>
      <rect width="${oliveWidth}" height="${height}" fill="${palette.olive}"/>
      <rect x="${border / 2}" y="${border / 2}" width="${width - border}" height="${height - border}" fill="none" stroke="${palette.ink}" stroke-width="${border}"/>
      <text x="${padding + markSize + Math.round(width * 0.014)}" y="${padding + markSize * 0.68}" class="display" font-size="${lockupSize}" fill="${palette.paper}">ChromaKit</text>
      <text x="${padding}" y="${Math.round(height * 0.28)}" class="mono" font-size="${labelSize}" fill="${palette.chartreuse}">REACT COLOR TOOLKIT</text>
      <text x="${padding}" y="${titleY}" class="display" font-size="${titleSize}" fill="${palette.paper}">
        <tspan x="${padding}" dy="0">Color has</tspan>
        <tspan x="${padding}" dy="0.88em">structure.</tspan>
      </text>
      <text x="${padding}" y="${Math.round(height * 0.7)}" class="body" font-size="${bodySize}" fill="${palette.paper}">
        <tspan x="${padding}" dy="0">Pick, convert, and theme modern color spaces</tspan>
        <tspan x="${padding}" dy="1.35em">with one controlled React value.</tspan>
      </text>
      <text x="${padding}" y="${height - padding}" class="mono" font-size="${labelSize}" fill="${palette.periwinkle}">${escapeXml('OKLCH · OKLAB · HSL · HSV · RGB · HEX')}</text>
      <circle cx="${Math.round(width * 0.65)}" cy="${Math.round(height * 0.14)}" r="${Math.round(width * 0.04)}" fill="${palette.chartreuse}" stroke="${palette.ink}" stroke-width="${border / 2}"/>
      <path d="M ${Math.round(width * 0.65)} ${Math.round(height * 0.14)} l ${Math.round(width * 0.04)} ${-Math.round(width * 0.018)}" stroke="${palette.ink}" stroke-width="${border / 2}"/>
      <rect x="${screenshotX + Math.round(width * 0.012)}" y="${screenshotY + Math.round(width * 0.012)}" width="${screenshotWidth}" height="${screenshotHeight}" fill="${palette.magenta}"/>
    </svg>
  `);

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: palette.paper,
    },
  })
    .composite([
      { input: art, left: oliveWidth, top: 0 },
      { input: overlay, left: 0, top: 0 },
      {
        input: await sharp(mark).resize(markSize, markSize).toBuffer(),
        left: padding,
        top: padding,
      },
      { input: screenshot, left: screenshotX, top: screenshotY },
    ])
    .png({ compressionLevel: 9 })
    .toFile(output);
}

await Promise.all([
  makeCard({
    width: 1200,
    height: 630,
    output: path.join(publicDir, 'og-image.png'),
  }),
  makeCard({
    width: 1600,
    height: 900,
    output: path.join(brandDir, 'readme-hero.png'),
  }),
]);
