---
name: purista
description: Canonical PURISTA framework skill for architecture, builder-based implementation, package selection, CLI scaffolding, runtime wiring, testing, and optional AI agents. Use when designing, implementing, reviewing, or planning a PURISTA application or package change.
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
- For a new app, run `npm create purista@latest` or `purista init <target> --non-interactive --defaults --no-install`; then use generated project-local `add:*` scripts for every supported artifact and refine only their intended extension points.
- Before and after an existing-app change, read `purista.json`, run `export:definitions`, `purista inspect`, strict `purista validate`, and `purista doctor`; these are static preflight checks, not infrastructure health guarantees.
- Generated PURISTA apps are ESM-only. Do not offer, document, or scaffold CommonJS variants.
- Keep schemas explicit on every boundary. Prefer consumer-local schemas over one oversized shared schema.
- Keep external systems behind resources or runtime bindings.
- Treat tenant isolation, authorization, auditability, and data minimization as architecture requirements, not handler details.
- State retention is an explicit StateStore policy: use a write override for one
  value, `stateRetention` for one service, or a StateStore `retention` default
  for a dedicated store. Finite retention requires atomic expiry; never
  describe an unsupported backend as best-effort expiry.
- Do not leak secrets, PII, prompts, completions, tokens, raw payloads, headers, or attachments into logs, metrics, traces, events, generated examples, or model calls unless an explicit product policy allows the exact field.
- Declare handler capabilities before use. Commands, streams, subscriptions, queue workers, and agents should access other components through typed context surfaces produced by `.canInvoke(...)`, `.canConsumeStream(...)`, `.canEnqueue(...)`, `.canEmit(...)`, and agent-specific declarations where available.
- Keep EventBridge and QueueBridge separate. Event transports do not become queues.
- Agents are native `@purista/core` builder/runtime primitives backed by `@purista/harness`; provider packages remain app-level dependencies.
- Use Hono as the active HTTP server package. Do not revive legacy HTTP server guidance.
- For exported TypeScript APIs, add IDE-friendly TSDoc/JSDoc with concise examples for non-obvious public helpers.
- Metrics use the OpenTelemetry Metrics API. Core stays SDK/exporter-neutral; applications own MeterProvider, readers, exporters, collectors, and Prometheus exposure.
- Declare custom application metrics with `ServiceBuilder.defineMetric(...)` or `AgentQueueBuilder.defineMetric(...)`, record them through typed `context.metrics`, and keep names under `app.*`.
- Core owns the trigger-only `SchedulerRuntime` and `SchedulerBuilder`. Run it as a separate minimal host that publishes ordinary events; it must not boot business services or execute handlers. `DefaultSchedulerProvider` is local/test only. For replicated hosts use `@purista/redis-scheduler-provider`, a production EventBridge, `setStrict()`, and `setRequireDistributedClaims()`; providers own only durable claims/completion state, not Core schedule evaluation. Kubernetes CronJob export remains manifest generation for an explicit trigger container/script.
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
- schedule: service-owned time declaration; the Core Scheduler Runtime emits an event, then normal consumers own business work

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
- "Time starts the work" -> schedule event declaration, then a separate scheduler host emits the event and subscriptions/queues/agents react
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

Durable workspace replay is opt-in: builders declare policy, runtime wiring supplies `ai.runtime` and `ai.workspaceStore`, and startup fails for missing required capabilities unless an explicit non-durable fallback is accepted.

## Verification Cues
- The design can name one owner for each capability and source of truth.
- Each handler dependency is declared and supplied through a typed context/runtime binding.
- Runtime wiring names bridges, stores, providers, telemetry, queues, and HTTP servers; code declares custom metrics through typed `context.metrics`.
- Durable agent replay names required runtime/workspace capabilities, fallback behavior, cleanup owner, and product-owned retention/encryption/quota policy.
- Review telemetry, messages, and prompts for sensitive-data leakage; generated code follows current CLI templates.

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
- `references/generated-api-index.md` — generated, manifest-complete lookup for every public PURISTA package and its primary APIs; never use it as a substitute for architecture references

For a recorded model answer, use `npm run evaluate:skill-response -- --response <response.json>` against the deterministic rubric in `evaluations/scenarios.json`.
