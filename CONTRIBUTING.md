# Contributing to ChromaKit

Thank you for your interest in contributing to ChromaKit! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/chromakit.git
   cd chromakit
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Project Structure

```
chromakit/
├── client/src/lib/color-picker/  # Library source code (ships to npm)
│   ├── components/               # React components
│   │   └── *.test.tsx            # Component tests (colocated)
│   ├── conversions/              # Color space conversions (barrel: conversions/index.ts)
│   ├── conversions.test.ts       # Unit tests (colocated)
│   ├── hooks.ts / hooks.test.ts  # React hooks + tests
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts / utils.test.ts  # Helpers + tests
│   └── index.ts                  # Public API
├── client/src/pages/             # Demo/docs website (Astro routes)
├── client/src/components/        # Demo/docs components
├── client/src/site-data/         # Reference data imported by docs pages
├── e2e/                          # Playwright accessibility tests
└── vitest.config.ts              # Test configuration
```

### Making Changes

1. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the appropriate files
   - Library code goes in `client/src/lib/color-picker/`
   - Demo/website code goes in `client/src/pages/` and `client/src/components/`

3. **Run tests** to ensure everything works:

   ```bash
   npm run test:ci
   ```

   Note: `npm test` is Vitest watch mode — it hangs automation. Always use
   `npm run test:ci`.

4. **Build the library** to check for errors:

   ```bash
   npm run build
   ```

5. **Test your changes** in the demo site:
   ```bash
   npm run dev
   ```

### Code Style

Run these before submitting a PR:

```bash
npm run verify      # lint (zero warnings) + type-check + astro check
npm run test:ci     # tests + coverage thresholds (NOT npm test — watch mode)
npm run build       # library bundle + type declarations
npm run size        # size-limit budgets
npm run format      # prettier (format:check runs in CI)
```

### Testing

- Write tests for new features as colocated `*.test.ts`/`*.test.tsx` files near the source file
- Ensure all tests pass before submitting a PR
- Run tests with:
  ```bash
  npm run test:ci
  ```
- Check coverage with:
  ```bash
  npm run test:coverage
  ```

## Submitting a Pull Request

1. **Push your changes** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub with:
   - A clear title describing the change
   - A description of what was changed and why
   - Screenshots (if applicable)
   - Reference to any related issues

3. **Respond to feedback** from maintainers
   - Make requested changes
   - Push updates to the same branch

## Reporting Issues

- Use the [GitHub issue tracker](https://github.com/garrettsiegel/chromakit/issues)
- Search existing issues before creating a new one
- Include:
  - Clear description of the issue
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser/environment details
  - Code examples (if applicable)

## Feature Requests

We welcome feature requests! Please:

- Check existing issues/PRs first
- Clearly describe the feature and use case
- Explain why it would benefit the library

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Questions?

Feel free to reach out to [@garrettsiegel](https://github.com/garrettsiegel).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
