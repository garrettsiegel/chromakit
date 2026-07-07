import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
) as { version: string };

export default defineConfig(({ mode }) => {
  // Library build mode
  if (mode === 'lib' || process.env.BUILD_MODE === 'lib') {
    return {
      plugins: [
        react(),
        tailwindcss(),
        visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
      ],
      build: {
        lib: {
          entry: path.resolve(
            __dirname,
            'client/src/lib/color-picker/index.ts'
          ),
          name: 'ChromaKit',
          formats: ['es', 'umd'],
          fileName: (format) =>
            `chromakit.${format === 'es' ? 'es' : 'umd'}.js`,
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
    };
  }

  // Development/demo mode
  return {
    plugins: [react(), tailwindcss()],
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client', 'src'),
      },
    },
    root: path.resolve(__dirname, 'client'),
    build: {
      outDir: path.resolve(__dirname, 'dist/public'),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ['**/.*'],
      },
    },
  };
});
