# Security Policy

## Reporting Security Issues

ChromaKit takes security seriously. If you discover a security vulnerability, please report it responsibly.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report via GitHub Security Advisories:
https://github.com/garrettsiegel/chromakit/security/advisories/new

## Security Measures

### Input Validation

ChromaKit validates all color inputs to prevent:
- **XSS Attacks**: All color values are validated against strict format patterns before rendering
- **CSS Injection**: Color strings are sanitized and validated before being used in CSS
- **Invalid Data**: Malformed color values are rejected and will not be processed

### Color Parsing Security

All hex values are validated with regex patterns before parsing.
Numeric values are clamped to safe ranges (0-255 for RGB, 0-1 for alpha).

### Safe CSS Output

All color values are:
1. Validated against expected formats
2. Clamped to safe numeric ranges
3. Sanitized before being used in CSS strings

### No Unsafe Code

ChromaKit does not use:
- eval()
- Function() constructor
- dangerouslySetInnerHTML
- Dynamic script injection

### Zero Production Dependencies

- No third-party code in your bundle
- Reduces supply chain attack surface
- Regular security audits via npm audit
- Automated dependency updates via Dependabot

## Supported Versions

| Version | Supported |
|---------|----------|
| 0.1.x   | ✅ Yes   |
| < 0.1   | ❌ No    |

## Best Practices for Consumers

### Server-Side Rendering (SSR)

When using with SSR frameworks like Next.js, use dynamic imports to avoid window/document access issues.

### Content Security Policy (CSP)

ChromaKit is CSP-compatible. No inline styles are required. The library uses:
- CSS classes for styling
- CSS custom properties for theming
- No inline style attributes with unsafe values

### Sanitizing User-Generated Colors

If accepting color values from untrusted sources, validate them with parseColor() before use.

## Contact

For security-related questions:
- GitHub: [@garrettsiegel](https://github.com/garrettsiegel)
- Project: [github.com/garrettsiegel/chromakit](https://github.com/garrettsiegel/chromakit)
