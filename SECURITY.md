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

## Supported Versions

The latest published 0.x minor receives fixes.

## Best Practices for Consumers

### Server-Side Rendering (SSR)

When using with SSR frameworks like Next.js, use dynamic imports to avoid window/document access issues.

### Content Security Policy (CSP)

Live colors and thumb positions are written as inline `style` attributes (gradients,
swatch backgrounds, slider/area thumb offsets). Client-side updates go through the CSSOM
and are not blocked by `style-src`. If you server-render the picker under a strict
`style-src` without `'unsafe-inline'`, either allow it or render the picker client-only
(`next/dynamic` with `ssr: false`).

### Sanitizing User-Generated Colors

If accepting color values from untrusted sources, validate them with parseColor() before use.

## Contact

For security-related questions:

- GitHub: [@garrettsiegel](https://github.com/garrettsiegel)
- Project: [github.com/garrettsiegel/chromakit](https://github.com/garrettsiegel/chromakit)
