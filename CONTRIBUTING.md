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
├── client/src/lib/color-picker/  # Library source code
│   ├── components/               # React components
│   ├── conversions.ts           # Color space conversions
│   ├── hooks.ts                 # React hooks
│   ├── types.ts                 # TypeScript types
│   └── index.ts                 # Public API
├── client/src/pages/            # Demo website
├── client/src/components/       # Demo components
└── tests/                       # Test files
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
   npm test
   ```

4. **Build the library** to check for errors:

   ```bash
   npm run build
   ```

5. **Test your changes** in the demo site:
   ```bash
   npm run dev
   ```

### Code Style

- **TypeScript**: All code must be written in TypeScript with proper types
- **ESLint**: Follow the existing code style
- **Formatting**: Use consistent formatting (2-space indentation)
- **Naming**: Use descriptive variable and function names

### Testing

- Write tests for new features in the `tests/` directory
- Ensure all tests pass before submitting a PR
- Run tests with:
  ```bash
  npm test
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

Feel free to open a [discussion](https://github.com/garrettsiegel/chromakit/discussions) or reach out to [@garrettsiegel](https://github.com/garrettsiegel).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
