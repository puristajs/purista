---
name: purista
description: Canonical PURISTA framework skill for architecture, builder-based implementation, package selection, CLI scaffolding, runtime wiring, testing, and optional AI agents.
topics: [architecture, implementation, builders, packages, cli, agents, runtime]
phases: [spec, architecture, implementation, review]
---

# PURISTA

## When To Use
Use this as the default shared framework skill whenever an agent designs, implements, reviews, tests, or plans a PURISTA application or package change.

## Operating Model
PURISTA is builder-driven and runtime-explicit. Keep four layers separate:
- architecture: business capabilities, ownership, invariants, sync/async boundaries
- definition: builders declare services, commands, subscriptions, streams, queues, workers, agents, resources, and schemas
- implementation: handlers contain domain behavior behind declared boundaries
- runtime wiring: `getInstance(...)` supplies bridges, stores, resources, loggers, telemetry, providers, queues, and HTTP surfaces

Do not blur these layers. Most mistakes come from designing routes, prompts, or infrastructure before service ownership and contracts are clear.

## Hard Rules
- Start from business capabilities and ownership boundaries, not package names or routes.
- Use the PURISTA CLI whenever it can generate the target artifact; refine generated code instead of hand-writing the skeleton.
- Keep schemas explicit on every boundary. Prefer consumer-local schemas over one oversized shared schema.
- Keep external systems behind resources or runtime bindings.
- Keep EventBridge and QueueBridge separate. Event transports do not become queues.
- Keep `@purista/ai` optional. Core, Hono, starter, and create-purista must not require `@purista/ai` or `@purista/harness`.
- Use Hono as the active HTTP server package. Do not revive legacy HTTP server guidance.
- For exported TypeScript APIs, add IDE-friendly TSDoc/JSDoc with concise examples for non-obvious public helpers.

## Primitive Decisions
- service: owns a versioned business capability, invariants, resources, and contracts
- command: direct request/response business action
- subscription: bounded reaction to emitted events or facts
- stream: incremental output or SSE/aggregate delivery
- queue: durable background work contract
- queue worker: execution logic for queue work
- agent: optional model-driven loop, harness agent/workflow, or custom run function attached to a service

## Current AI Decision
`@purista/ai` is a clean harness-backed optional package. Agents attach to services and expand into normal PURISTA queue, worker, command, and stream definitions. They do not use a PURISTA AI protocol or Vercel AI SDK adapter. HTTP streaming emits provider-style SSE events with OpenAPI-described chunks.

## Verification Cues
- The design can name one owner for each capability and source of truth.
- Every handler dependency is reachable through resources, stores, context, or declared runtime bindings.
- Runtime wiring names required bridges, stores, providers, telemetry, queue bridges, and HTTP servers.
- Generated code follows current CLI templates unless there is a deliberate reason to go lower-level.
- Package dependencies do not introduce optional AI or transport coupling into core packages.

## Read If Needed
- `references/01-architecture-model.md`
- `references/02-implementation-workflow.md`
- `references/03-component-builders.md`
- `references/04-package-map.md`
- `references/05-ai-harness-runtime.md`
- `references/06-runtime-transports-and-bridges.md`
- `references/07-testing-observability-and-deployment.md`
- `references/08-cli-starter-and-scaffolding.md`
- `references/09-implementation-planning.md`
