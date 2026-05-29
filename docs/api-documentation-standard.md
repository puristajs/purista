# PURISTA API Documentation Standard

Public TypeScript APIs must be documented for IDE hovers and generated TypeDoc pages.

## Public API Scope

A public API is any declaration reachable from a package root export and visible in `web/src/generated/purista-api.json`.
This includes classes, constructors, public methods, functions, interfaces, type aliases, enums, enum members, constants, public properties, mocks, and testing helpers.

## Comment Requirements

Every public declaration must have a short summary that explains its purpose in one sentence.
Add more detail when the API has runtime effects, lifecycle requirements, reliability guarantees, security implications, or common misuse.

Use `@example` for non-obvious APIs, especially builders, runtime wiring, bridge setup, stores, queues, streams, agents, mocks, and testing helpers.
Examples must compile conceptually against implemented APIs, avoid real credentials, and avoid secrets, PII, prompt text, completions, tokens, raw headers, or raw attachments.

## Domain Guidance

- Builders: document fluent call order, defaults, generated definitions, runtime effects, and production caveats.
- Event bridges and queue bridges: document required infrastructure, delivery guarantees, retry/DLQ/idempotency behavior, startup validation, and lifecycle.
- Stores: document cache behavior, key naming, credential configuration, lifecycle, and secret-handling expectations.
- HTTP APIs: document commands, streams, agents, problem details, and Hono-first runtime wiring.
- Metrics and telemetry: document app-owned provider/exporter responsibilities and safe attribute practices.
- Enums: document the enum and every enum value with intent and selection guidance.
- Helpers and mocks: document when to use them and what assumptions they make.

## Audit

Run:

```sh
npm run build:api-docs
npm run audit:api-docs
```

Use `npm run audit:api-docs -- --package=@purista/core` to inspect one package.
Use `--fail-on-missing-summary` for CI-style enforcement once a package reaches full coverage.
