---
name: purista-schema-contracts
description: Teach untrained models how PURISTA schemas define command, event, stream, queue, and agent contracts and how those schemas connect builder definitions to runtime safety.
topics: [schemas, contracts, validation]
phases: [spec, architecture, implementation]
---

# PURISTA Schema Contracts

## When to use this skill
Use this skill whenever the task involves payloads, events, API shapes, tool inputs, or queue messages.

## What this component/package is for
Schemas are the source of truth for validation, typed inference, generated docs, tool inputs, queue payloads, and durable compatibility.

## Core PURISTA concept
Contracts are part of definition, not an implementation afterthought. Builders attach schemas so the runtime can validate inputs and outputs consistently.

## Builder lifecycle
1. Define payload, parameter, output, chunk, or final schemas near the contract boundary.
2. Attach them to the relevant builder with methods such as `addPayloadSchema(...)`, `addParameterSchema(...)`, `addOutputSchema(...)`, `addChunkSchema(...)`, or `addFinalSchema(...)`.
3. Implement handlers against those typed contracts.
4. Reuse the same schemas when wiring transports, tools, or downstream invokes.

## Hard rules
- Define schemas close to the contract boundary.
- Validate every external payload.
- Treat incompatible schema changes as versioning concerns.
- Keep contracts transport-neutral when possible.

## Decision rules
- Promote a schema to a shared module only if it is genuinely shared across boundaries.
- Prefer explicit normalization over “accept anything and coerce later”.
- Keep queue, stream, command, and event contracts separate unless they are truly identical.

## Definition pattern
- Keep schema files adjacent to the builder that consumes them.
- Name schemas by service version and operation so reuse is explicit.

## Implementation pattern
- Handler code should assume schemas already describe the allowed shape.
- Use schemas again for invokes or emitted outputs so child flows stay aligned.
- Keep schema decisions visible in code reviews; they are part of the public contract.

## Configuration pattern
- Schema definitions are static contract metadata, not runtime config.
- Runtime config may influence behavior, but not the structural meaning of a public contract unless a new version is created.

## Instantiation / runtime wiring
- Attached schemas travel with builder definitions into the running instance.
- HTTP exposure, tools, queues, and agent surfaces rely on those definitions instead of bespoke runtime validation logic.

## Verification cues
- Every public input and output path has an attached schema.
- The same schema names appear in builder definition code and any exposed transport surfaces.
- Contract reuse is intentional and traceable.
- Versioning changes are visible when schema changes are incompatible.

## Common mistakes / anti-patterns
- Accepting untyped payloads and validating “later”.
- Hiding output shape decisions inside handler code.
- Reusing one schema for multiple boundaries that actually have different semantics.
- Teaching only handler behavior without showing which builder methods receive the schemas.

## How this connects to other PURISTA concepts
Schemas power commands, subscriptions, streams, queues, workers, HTTP exposure, tool bindings, and generated scaffolding.

## Related skills
- `purista-command-builder` for request/response contracts
- `purista-subscription-builder` for event payload contracts
- `purista-stream-builder` for chunk and final schemas
- `purista-queue-builder` for durable payload definitions
- `purista-http-runtime` for transport exposure over the same contracts

## Read if needed
- `website/doc/handbook/2_building_business-logic/schemas.md`
- `examples/client-builder/src/service/pingPong/v1/command/ping/schema.ts`
- `examples/ai-basic/src/service/support/v1/stream/runSupportAgentStream/schema.ts`
- `packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts`
- `packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts`
