---
name: react-typescript
description: Use when creating or editing React/TypeScript code in this project (.ts/.tsx files). Enforces lean React + TypeScript standards backed by ESLint hard rules and hooks — no `any`, no React default/namespace imports, no static inline styles, files ≤300 lines — plus the verify-before-finish contract.
---

# React + TypeScript Standards

Instructions guide; ESLint enforces. Most rules below are hard ESLint errors (`eslint.config.js`) — a PostToolUse hook auto-lints every file you edit, and a Stop hook runs `npm run verify`. If lint fails, fix the code, not the rule.

## The Contract

- Run `npm run verify` (lint + type-check) before finishing. Fix all failures.
- **Never add `eslint-disable` comments** — the `eslint-comments/no-use` rule makes them errors. If a rule genuinely blocks you, stop and ask; a human adds exceptions to the config's `allow` list deliberately.
- Prefer the smallest safe change. Do not refactor unrelated code.
- Follow existing nearby file patterns.

## Component Template

```tsx
export const NewComponent = () => {
  return <div></div>;
};
```

## Core Principles

- Write lean, readable code that is easy to understand quickly.
- Keep logic straightforward; avoid clever abstractions.
- Keep functions focused on one task.
- Use descriptive names for files, functions, and variables.

## TypeScript Rules (ESLint-enforced)

- No `any` (`@typescript-eslint/no-explicit-any`).
- No non-null assertions `!` (`no-non-null-assertion`) — guard instead.
- Type-only imports use `import type` (`consistent-type-imports`, autofixable).
- No enums — use const objects or union types (`no-restricted-syntax`).

## React Rules

- No React default or namespace imports (`import React` / `import * as React`) — use the automatic JSX runtime and named imports (`forwardRef`, `type HTMLAttributes`, …). ESLint-enforced.
- **No static inline styles** — constant values belong in CSS classes (`chromakit.css` for the library, `index.css`/Tailwind for the demo). *Exception:* runtime-computed values (live colors, thumb positions) may use `style` — this is a color picker; dynamic color must reach the DOM. This exception is why there is no ESLint rule for `style`; it is enforced by review, so keep every `style` prop dynamic-only.
- No nested `function` declarations — use arrow consts or extract.
- No deep relative imports (`../../…`) — use the `@/` alias. ESLint-enforced.

## Size Limits (ESLint-enforced, tests exempt)

- Files ≤ 300 lines, functions ≤ 200 lines (JSX-heavy layout components get headroom; logic functions should stay far below this). When a file approaches the limit, split it the way the codebase already does: extract data (`preset-data.ts`), subcomponents (`PickerLayout.tsx`), or modules (`conversions/`).

## Comments

- Keep comments minimal.
- If needed for complex logic, write concise ALL CAPS comments.
