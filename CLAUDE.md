# CLAUDE.md

See [AGENTS.md](./AGENTS.md) for the full handbook — what this package is, stack, layout, commands, conventions, gotchas, and the Notable Decisions & Lessons log.

`chromakit-react` is a zero-dependency React color picker library (published to NPM) plus a demo site. It is **npm-managed** and its own git repo — use `npm`, not pnpm.

## Code Quality Rules

- Run `npm run verify` (lint + type-check) before finishing. Fix all failures.
- **Never add `eslint-disable` comments** — they are ESLint errors (`eslint-comments/no-use`) and CI greps for them. If a rule blocks you, stop and ask.
- Prefer the smallest safe change. Do not refactor unrelated code.
- Follow existing nearby file patterns. The `react-typescript` skill (`.claude/skills/react-typescript/`) has the full standards; hooks in `.claude/settings.json` auto-lint every edit and run `npm run verify` on stop.

## Before Finishing a Task

- `npm ci` first if `node_modules/` is missing (this package is not in the monorepo pnpm workspace).
- `npm run verify` — lint (zero warnings) + type-check.
- `npm run test:ci` (NOT `npm run test`, which is watch mode) — all tests + coverage thresholds must pass.
- `npm run build` (library bundle + type declarations). For site changes also run `npm run build:site`.

## Key Rules

- **Zero runtime dependencies.** Never add anything to `dependencies` in `package.json`.
- **Only `client/src/lib/color-picker/` ships to NPM.** Demo-site changes (`components/`, `pages/`, …) never affect the package.
- **Never publish** — version bumps and `npm publish` are the owner's call.
- Keep the public export surface (`client/src/lib/color-picker/index.ts`) honest — no props/types that do nothing.
