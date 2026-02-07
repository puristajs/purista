---
title: Version 2.2
description: PURISTA 2.2 – Schema and type-system hardening, runtime stability, and release pipeline improvements.
date: 2026-02-07
order: 20260207
image: /graphic/purista_2_2_cover.png
---
<PostDetail>

PURISTA 2.2 is a stabilization release focused on one core goal: **better correctness through stronger schema and type handling**.

## Highlights

- Migrated schema foundations to **StandardSchema** and aligned validation flow across the framework
- Completed migration to **Zod v4** and switched schema generation to native **`z.toJSONSchema`**
- Reduced accidental `any` usage and tightened inference in builders, mocks, bridges, and tests
- Updated CLI generation defaults to emit safer **`unknown` payload schemas**
- Improved event bridge/store reliability and unsubscribe lifecycle behavior
- Added deterministic release automation with both publish and dry-run CI workflows

## Schema and Type-System Changes

The largest set of changes in this branch is around schema/type infrastructure.

### Standardized schema model

The framework moved from the previous custom/schema adapter approach to a **StandardSchema-oriented** model, reducing special-case behavior and making schema transformations more predictable.

### Native Zod schema export

Custom schema-export internals were replaced with **native `z.toJSONSchema`**.  
This simplifies maintenance and aligns generated OpenAPI-related structures with official Zod behavior.

### Better type safety by default

Across core, CLI, and examples, types were tightened to avoid silent `any` regressions:

- stricter builder and invoke typing
- safer transform/validation helper typing
- generated command and subscription schema defaults now prefer `unknown` where payload shape is intentionally open
- improved type hints and JSDoc on public schema/transform helpers for better IDE autocomplete

## Reliability and Runtime Behavior

In parallel with type-system work, this release includes production-focused fixes:

- improved event bridge command/subscription wiring and error normalization
- better unsubscribe/unregister semantics in MQTT and NATS bridges
- typed error handling improvements in stores and adapters
- HTTP bridge and request/response handling fixes to avoid edge-case regressions

## Examples and Documentation

Examples and handbook chapters were updated to reflect current implementation patterns, with special attention to:

- services, commands, and subscriptions
- typed resource injection into command/subscription context
- event bridge and webserver setup
- CLI usage and generated artifacts

## Release Engineering

Release automation has been reworked to be deterministic and CI-friendly.

The release sequence is now explicit:

1. run tests
2. run build
3. bump root + workspace versions
4. update package `src/version.ts`
5. rebuild
6. regenerate changelog and docs (including API docs)
7. publish and create release artifacts (or use dry-run workflow)

This significantly reduces release drift and makes preflight verification possible before publishing.

## Thank You

Thanks to everyone who reported issues, tested edge cases, and pushed for stricter typing in real projects.  
This feedback directly shaped the schema/type improvements delivered in 2.2.

</PostDetail>
