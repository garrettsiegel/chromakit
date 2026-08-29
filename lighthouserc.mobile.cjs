const routes = [
  '/',
  '/docs/getting-started',
  '/docs/color-picker',
];
const externalOrigin = globalThis.process?.env.LHCI_BASE_URL;
const origin = externalOrigin || 'http://127.0.0.1:4321';

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => `${origin}${route}`),
      numberOfRuns: 1,
      settings: {
        throttlingMethod: 'devtools',
        chromeFlags: '--headless=new --no-sandbox',
      },
      ...(externalOrigin
        ? {}
        : {
            startServerCommand:
              'ASTRO_PREVIEW_BACKGROUND=0 npm run preview -- --host 127.0.0.1 --port 4321',
            startServerReadyPattern: 'Local',
            startServerReadyTimeout: 60000,
          }),
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
};
