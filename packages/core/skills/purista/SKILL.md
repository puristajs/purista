---
name: purista
description: Canonical PURISTA framework skill for architecture, builder-based implementation, package selection, CLI scaffolding, runtime wiring, testing, and optional AI agents.
topics: [architecture, implementation, builders, packages, cli, agents, runtime]
phases: [architecture, implementation, review]
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
- Use the project-local PURISTA CLI whenever it can generate the target artifact; refine generated code instead of hand-writing the skeleton.
- For a new app, start with `npm create purista@latest` or the package-manager/runtime equivalent, then use the generated local CLI scripts such as `npm run add:service -- ...`, `pnpm run add:service -- ...`, `yarn add:service ...`, or `bun run add:service -- ...`.
- For deterministic agentic setup, use the local or freshly created CLI with explicit `purista init ... --non-interactive --defaults` flags, then continue through the generated package scripts so the project-owned `@purista/cli` version is used.
- Generated PURISTA apps are ESM-only. Do not offer, document, or scaffold CommonJS variants.
- Keep schemas explicit on every boundary. Prefer consumer-local schemas over one oversized shared schema.
- Keep external systems behind resources or runtime bindings.
- Treat tenant isolation, authorization, auditability, and data minimization as architecture requirements, not handler details.
- Do not leak secrets, PII, prompts, completions, tokens, raw payloads, headers, or attachments into logs, metrics, traces, events, generated examples, or model calls unless an explicit product policy allows the exact field.
- Declare handler capabilities before use. Commands, streams, subscriptions, queue workers, and agents should access other components through typed context surfaces produced by `.canInvoke(...)`, `.canConsumeStream(...)`, `.canEnqueue(...)`, `.canEmit(...)`, and agent-specific declarations where available.
- Keep EventBridge and QueueBridge separate. Event transports do not become queues.
- Agents are native `@purista/core` builder/runtime primitives backed by `@purista/harness`; provider packages remain app-level dependencies.
- Durable agent workspace replay is a harness-owned adapter contract consumed through PURISTA runtime wiring; PURISTA declares requirements and validates capabilities but does not own product retention, encryption, quota, or cleanup policy values.
- Use Hono as the active HTTP server package. Do not revive legacy HTTP server guidance.
- For exported TypeScript APIs, add IDE-friendly TSDoc/JSDoc with concise examples for non-obvious public helpers.
- Metrics use the OpenTelemetry Metrics API. Core stays SDK/exporter-neutral; applications own MeterProvider, readers, exporters, collectors, and Prometheus exposure.
- Declare custom application metrics with `ServiceBuilder.defineMetric(...)` or `AgentQueueBuilder.defineMetric(...)`, record them through typed `context.metrics`, and keep names under `app.*`.
- Schedules are contracts, not a PURISTA production scheduler runtime. Kubernetes CronJob export is manifest generation for an explicit trigger container/script.
- Do not create or reference `@purista/contracts`; contract/export helpers for this release live in `@purista/core`.
- Redis and NATS queue bridges support strict idempotency. Duplicate strict enqueue returns the original queue job id. The default queue bridge remains advisory for local development/tests.

## Primitive Decisions
- service: owns a versioned business capability, invariants, resources, and contracts
- command: direct request/response business action
- subscription: bounded reaction to emitted events or facts
- stream: incremental output or SSE/aggregate delivery
- queue: durable background work contract
- queue worker: execution logic for queue work
- agent: optional model-driven loop, harness agent/workflow, or custom run function attached to a service
- schedule: external time-trigger contract targeting an event, queue, or short command

## Architecture Compass
Use PURISTA as a message-driven architecture toolkit, not as a route or package generator. The core idea is:
- model business capabilities as services
- model interactions as typed messages
- keep business logic infrastructure-agnostic
- make runtime distribution a bootstrap choice
- make reliability explicit through queues, idempotency, retries, health, and observability

Choose primitives by intent:
- "A caller needs a result now" -> command
- "Something happened and others may react" -> event plus subscription
- "Work may be slow, retried, replayed, delayed, or dead-lettered" -> queue plus queue worker
- "A caller needs progress or incremental output" -> stream
- "A model reasons, uses tools, or coordinates a conversation" -> agent attached to the owning service
- "Time starts the work" -> schedule contract targeting event, queue, or short command
- "External system or SDK is needed" -> resource/runtime binding, never a direct handler import

Production architecture guidance:
- start monolithic with explicit service boundaries; split deployment only when team, scaling, or failure-domain pressure justifies it
- keep services stateless and persist truth in stores/resources owned by the capability
- design all retryable side effects as idempotent; exactly-once is a handler/property design, not a broker promise
- carry `tenantId`, `principalId`, `traceId`, and `correlationId` through boundaries; enforce tenant/principal preconditions with guards before handler logic; do not use transport ids as AI conversation ids
- expose HTTP as a projection of command/stream/agent definitions, not as the source architecture
- use default bridges for local/test and production bridges/stores for stated guarantees; fail startup in strict mode when guarantees cannot be met
- minimize data at each contract boundary; events and agent prompts should contain the least sensitive shape that still satisfies the use case

## Current AI Decision
AI agent integration lives in `@purista/core`. Agents attach to services and expand into normal PURISTA queue, worker, command, and stream definitions. Core depends only on provider-neutral `@purista/harness`; model providers remain explicit application dependencies. Agents do not use a PURISTA AI protocol or Vercel AI SDK adapter.

PURISTA records agent wrapper metrics only. `@purista/harness` owns GenAI semantic-convention metrics, model metrics, token metrics, and tool metrics.

Harness governance policy is optional. Generated apps and ordinary agents must
not be forced to configure policy. Use it only when an attached agent needs
central tool-call policy, approval, audit, or interoperability with external
policy packs; PURISTA service guards and tenant-scoped resources remain the
authorization boundary.

Durable workspace replay for agents is opt-in. Builders declare it with
workspace policy, runtime wiring supplies `ai.runtime` and `ai.workspaceStore`, and
startup fails when required capabilities are missing unless
`setWorkspacePolicy({ mode: 'durable', required: false })` explicitly allows a
non-durable run restart.

## Verification Cues
- The design can name one owner for each capability and source of truth.
- Every handler dependency is reachable through resources, stores, context, or declared runtime bindings.
- Queue workers declare every service, stream, queue, event, and same-service agent dependency before using `context.service`, `context.stream`, `context.queue`, `context.emit`, or `context.agent`.
- Runtime wiring names required bridges, stores, providers, telemetry, queue bridges, and HTTP servers.
- Durable agent replay designs name required harness runtime/workspace stores, required capabilities, `required` fallback behavior, cleanup owner, and product-owned retention/encryption/quota policy.
- Metrics wiring names the app-owned OpenTelemetry provider/exporters and keeps Prometheus outside core.
- Handler code uses declared custom metrics through typed `context.metrics`, not raw metric names or a raw recorder.
- Logs, metrics, traces, events, queues, streams, and AI prompts are reviewed for secret/PII leakage before production use.
- Generated code follows current CLI templates unless there is a deliberate reason to go lower-level.
- Project setup and scaffolding follow the handbook quickstart shape: `src/service` and `src/agents` are CLI-managed roots, and services, commands, streams, queues, workers, and agents are added through generated local CLI scripts such as `add:service`, `add:command`, `add:queue-worker`, and `add:agent`.
- Package dependencies do not introduce optional AI or transport coupling into core packages.

## Read If Needed
- `references/00-architecture-compass.md`
- `references/01-architecture-model.md`
- `references/02-implementation-workflow.md`
- `references/03-component-builders.md`
- `references/04-package-map.md`
- `references/05-ai-harness-runtime.md`
- `references/06-runtime-transports-and-bridges.md`
- `references/07-testing-observability-and-deployment.md`
- `references/08-cli-starter-and-scaffolding.md`
- `references/09-implementation-planning.md`
- `references/10-security-privacy-and-governance.md`
- `references/11-evaluation-scenarios.md`
