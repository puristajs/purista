# Repository Guidelines

## Project Structure & Module Organization
PURISTA is a TypeScript monorepo using npm workspaces and is a framework for building distributed systems.
- `packages/`: Core framework modules and bridges (each package has its own `src/` and tests).
- `examples/`: End-to-end sample services and integrations (e.g., `examples/fullexample/`).
- `website/`: Documentation site and handbook sources.
- `docs/`: Generated or supporting documentation artifacts.
- `test/`: Root-level tests and fixtures.
- `dist/`: Build output (generated).

## Build, Test, and Development Commands
Run these from the repo root:
- `npm install`: Install workspace dependencies.
- `npm start`: Run the full example app (`examples/fullexample`).
- `npm run build`: Build all workspaces and run formatting/lint fixes.
- `npm run dev -w website`: Start the docs site locally.
- `npm test`: Run the default Vitest test suite.
- `npm run test:unit`: Type-check (`tsc --noEmit`) and run unit tests via `vitest.config.unit.ts`.
- `npm run lint`: Run Biome checks.
- `npm run lint:fix`: Apply Biome auto-fixes.

## Coding Style & Naming Conventions
Formatting and linting are enforced by Biome (`biome.json`).
- Indentation: tabs, width 2.
- Quotes: single quotes; semicolons as needed.
- Max line width: 120.
- Avoid `console` (error) except for CLI package (`packages/cli`).
Engineering guidelines:
- Keep modules small, isolated, and focused on a single responsibility.
- Prefer composition over inheritance; avoid tight coupling between packages.
- Reduce complexity and avoid code duplication by extracting shared utilities.
Best practices are expected throughout the codebase, especially for correctness, security, and maintainability.
Type system requirements:
- Preserve TypeScript type safety and inference; avoid `any` and unsafe casts.
- Keep schema-driven and generated types intact so auto-types continue to work correctly.
Naming patterns:
- Tests: `*.test.ts`, integration tests: `*.integration.test.ts`.
- Packages and directories use kebab-case (e.g., `aws-config-store`).

## Testing Guidelines
Testing uses Vitest, with tests colocated in `src/` or under `test/`.
- Unit tests: `npm run test:unit`.
- Full suite: `npm test`.
- Integration tests are explicitly named `*.integration.test.ts`.
There are no explicit coverage thresholds in config; prioritize meaningful coverage for new behavior.

## Commit & Pull Request Guidelines
Git history shows a conventional prefix pattern: `feat:`, `fix:`, `chore:`, `doc:`, and `breaking change:` with short, imperative summaries.
- Example: `fix(service-builder): check definitionsResolved`.
For new features or changes beyond bug fixes, create an issue first (per `CONTRIBUTING.md`).
PRs should include:
- A clear description of changes and rationale.
- Links to related issues when applicable.
- The contribution confirmation statement included in the PR template.

## Security & Conduct
Security issues should follow `SECURITY.md`.
All contributors are expected to follow the Code of Conduct in `CODE_OF_CONDUCT.md`.

## AI Context Files
- Start with repository-level context in `llms.txt`.
- Public published files are under `website/doc/public/llms/`.
- For sandbox implementation work, also load `website/doc/public/llms/sandbox.txt`.
- Canonical framework skills are available under `skills/` and should be loaded selectively.
- Prefer the shared layered catalog there over app-local copies.
