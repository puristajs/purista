---
title: Version 2.2.0
description: PURISTA 2.2.0 - major schema/type-system hardening, runtime stability fixes, updated examples, and improved release workflows.
date: 2026-02-07
order: 20260207
image: /graphic/purista_2_2_cover.png
---
<PostDetail>

PURISTA 2.2.0 is a stabilization release focused on one core goal: **higher correctness through stronger schema and type handling**, without sacrificing developer ergonomics.

## Release Highlights

- Migrated schema foundations to **StandardSchema** and aligned validation behavior across core paths
- Completed migration to **Zod v4** and switched export generation to native **`z.toJSONSchema`**
- Removed many unsafe casts and reduced accidental `any` usage across core, CLI, adapters, and tests
- Updated CLI generation defaults to emit safer **`unknown` payload schemas** where payloads are intentionally open
- Fixed multiple reliability issues in bridges and stores (unregister semantics, error handling, edge-case response behavior)
- Updated examples and handbook sections so docs and code snippets match the current implementation
- Improved release automation with both publish and dry-run workflows

## Schema and Type-System

The largest set of changes in this branch is around schema/type infrastructure.

### Standardized schema model

The framework moved from custom schema adapter behavior to a **StandardSchema-oriented** model.  
This removes special-case drift and makes schema transformations more predictable across packages.

### Native Zod schema export

Custom schema-export internals were replaced with **native `z.toJSONSchema`**.  
This simplifies maintenance and aligns generated OpenAPI structures with official Zod behavior.

### Better type safety by default

Across core, CLI, and examples, types were tightened to avoid silent `any` regressions:

- stricter builder, command invoke, and bridge client typing
- safer transform/validation helper typing and error-path typing
- command/subscription schema defaults now prefer `unknown` instead of `any` for intentionally open payload shapes
- improved JSDoc and API hints for better IDE autocomplete and safer refactoring
- stronger protection for service definition arrays and generated CLI artifacts

## Runtime Reliability

In parallel with type-system work, this release includes production-focused runtime fixes:

- event bridge command/subscription wiring and error normalization improvements
- reliable unsubscribe/unregister handling in MQTT and NATS bridges
- stricter typed error handling in store adapters (AWS, Azure, GCloud, Infisical, Dapr and others)
- HTTP bridge request/response handling fixes for required query params and null/no-content cases
- consistent handling of canonical `generateEventBridgeClient` naming while keeping compatibility aliases documented as deprecated

## Examples and Documentation

Examples and handbook chapters were updated to reflect current implementation patterns, with special attention to:

- services, commands, and subscriptions
- resource injection into command/subscription context
- event bridge and webserver setup
- CLI usage, generated artifacts, and definition list typing
- migration from deprecated webserver package usage toward `@purista/hono-http-server`

## Release Engineering and CI

Release automation is now more deterministic and CI-friendly.

The release sequence is now explicit:

1. run tests
2. run build
3. bump root + workspace versions
4. update package `src/version.ts`
5. rebuild
6. regenerate changelog and docs (including API docs)
7. publish and create release artifacts (or use the dry-run workflow)

This reduces release drift and enables safer preflight verification before publishing.

## Final Notes

If you are already on PURISTA 2.1.x, this release is designed to be a pragmatic upgrade path with better type safety and more predictable runtime behavior.

The strongest recommendation for teams upgrading: regenerate and re-check service artifacts with the CLI so generated types and definition lists match the new defaults.

</PostDetail>
