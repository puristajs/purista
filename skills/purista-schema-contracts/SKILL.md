---
name: purista-schema-contracts
description: Keep PURISTA message and API contracts schema-first, versioned, and reusable across services, queues, and agents.
topics: [schemas, contracts, validation]
phases: [spec, architecture, implementation]
---

# PURISTA Schema Contracts

## When to use this skill
Use this skill whenever the task involves payloads, events, API shapes, tool inputs, or queue messages.

## What this component/package is for
Schemas are the source of truth for validation, typed inference, generated docs, AI tool inputs, and durable message compatibility.

## Hard rules
- Define schemas close to the contract boundary.
- Validate every external payload.
- Treat incompatible schema changes as versioning concerns.
- Keep contracts transport-neutral when possible.

## Decision rules
- Promote a schema to a shared module only if it is genuinely shared across boundaries.
- Prefer explicit normalization over “accept anything and coerce later”.

## Recommended file/folder structure
```text
src/schema/
src/service/<service-name>/v1/.../schema.ts
```

## Common implementation patterns
- Use schemas both for runtime validation and TypeScript inference.
- Share input contracts between external runtime bindings and commands where the meaning is the same.
- Keep event payloads narrow and domain-specific.

## Common mistakes / anti-patterns
- Reusing one giant schema for unrelated boundaries.
- Hiding validation in application code without a declared contract.
- Treating frontend form models as canonical backend domain contracts.

## How this connects to other PURISTA concepts
Schemas power command builders, subscriptions, streams, queues, HTTP exposure, and AI external bindings.

## Read if needed
- `website/doc/handbook/2_building_business-logic/schemas.md`
- `specs/26-voyage-refinement/10-contract-catalog.md`
- `specs/28-voyage-interfaces/10-core-domain-schemas.md`
