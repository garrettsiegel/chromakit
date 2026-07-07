import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite builds ONLY the published npm library (dist/chromakit.*). The demo/docs
// site is built by Astro (see astro.config.mjs); `npm run build:site`.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      // KEEP OUT OF dist/ SO THE BUNDLE-ANALYSIS REPORT IS NEVER PUBLISHED
      filename: '.stats/bundle.html',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'client/src/lib/color-picker/index.ts'),
      name: 'ChromaKit',
      formats: ['es', 'umd'],
      fileName: (format) => `chromakit.${format === 'es' ? 'es' : 'umd'}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'chromakit.css';
          }
          return assetInfo.name || 'asset';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client', 'src'),
    },
  },
});
