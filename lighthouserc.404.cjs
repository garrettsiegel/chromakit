const externalOrigin = globalThis.process?.env.LHCI_BASE_URL;
const origin = externalOrigin || 'http://127.0.0.1:4321';

module.exports = {
  ci: {
    collect: {
      url: [`${origin}/__lighthouse-404-check`],
      numberOfRuns: 3,
      settings: {
        throttlingMethod: 'devtools',
        ignoreStatusCode: true,
        // Chrome reports an intentional 404 main document as a console network
        // error. Playwright separately asserts the real status and noindex meta.
        skipAudits: ['errors-in-console'],
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
        'categories:seo': 'off',
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/not-found' },
  },
};
