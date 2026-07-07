import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.chromakit.site',
  // The site source and static assets live under client/, alongside the
  // published library (client/src/lib/color-picker). Only client/src/pages/**
  // becomes routes; everything else is just importable modules.
  srcDir: './client/src',
  publicDir: './client/public',
  // Keep site output in dist/public. build:lib wipes all of dist/ (emptyOutDir),
  // which is what keeps site files out of the npm tarball (files: ["dist"]).
  outDir: './dist/public',
  integrations: [react(), sitemap()],
  redirects: {
    '/docs': '/docs/getting-started',
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client', 'src'),
      },
    },
  },
});
