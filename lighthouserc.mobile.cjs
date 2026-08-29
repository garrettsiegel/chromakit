const routes = [
  '/',
  '/docs/getting-started',
  '/docs/color-picker',
  '/docs/components',
  '/docs/hooks',
  '/docs/utilities',
  '/docs/theming',
  '/docs/troubleshooting',
];
const externalOrigin = globalThis.process?.env.LHCI_BASE_URL;
const origin = externalOrigin || 'http://127.0.0.1:4321';

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => `${origin}${route}`),
      numberOfRuns: 3,
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
        'categories:performance': [
          'error',
          { minScore: 1, aggregationMethod: 'median' },
        ],
        'categories:accessibility': [
          'error',
          { minScore: 1, aggregationMethod: 'pessimistic' },
        ],
        'categories:best-practices': [
          'error',
          { minScore: 1, aggregationMethod: 'pessimistic' },
        ],
        'categories:seo': [
          'error',
          { minScore: 1, aggregationMethod: 'pessimistic' },
        ],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
};
