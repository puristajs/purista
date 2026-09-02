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
- definition: Framework builders declare services, commands, subscriptions, streams, queues, workers, resources, and schemas; native Harness definitions declare AI behavior
- implementation: handlers contain domain behavior behind declared boundaries
- runtime wiring: `getInstance(...)` supplies bridges, stores, resources, loggers, telemetry, providers, queues, and HTTP surfaces

Do not blur these layers. Most mistakes come from designing routes, prompts, or infrastructure before service ownership and contracts are clear.

## AI integration

Native `@purista/harness` modules own AI definitions. PURISTA Core owns the
typed `ServiceBuilder.mountHarness(...)` composition boundary, trusted host
context, business guards, runtime binding, and address-first invocation.
Harness never imports Core.

Each PURISTA service mounts at most one composed Harness definition and starts
one native runtime. Add capabilities with `defineHarnessModule(...).use(...)`;
never create a Harness or call `mountHarness(...)` once per agent.

Every agent/workflow invocation crosses EventBridge, including same-service and
same-process calls. Each target has one final output schema; callers choose
`run` or portable `stream`, while definitions declare `none`, `text-delta`, or
`object-snapshot` updates. Mounting does not generate commands, streams, queues,
workers, or routes. Use a separate AI SDK UI Message Stream v1 adapter for
browser clients and keep the internal stream provider-neutral.

## Hard Rules
- Start from business capabilities and ownership boundaries, not package names or routes.
- Use the project-local PURISTA CLI whenever it can generate the target artifact; refine generated code instead of hand-writing the skeleton.
- For a new app, start with `npm create purista@latest` or the package-manager/runtime equivalent, then use the generated local CLI scripts such as `npm run add:service -- ...`, `pnpm run add:service -- ...`, `yarn add:service ...`, or `bun run add:service -- ...`.
- For deterministic agentic setup, use the local or freshly created CLI with explicit `purista init ... --non-interactive --defaults` flags, then continue through the generated package scripts so the project-owned `@purista/cli` version is used.
- Generated PURISTA apps are ESM-only. Do not offer, document, or scaffold CommonJS variants.
- Keep schemas explicit on every boundary. Prefer consumer-local schemas over one oversized shared schema.
- Keep external systems behind resources or runtime bindings.
- Use PURISTA stores for supported state/config/secret access instead of rebuilding them as application maps. Keep transactional databases behind resources; generic KV is not a transaction, query engine, or TTL contract. Read `references/12-state-and-ownership.md` for persistence and local authentication.
- Treat tenant isolation, authorization, auditability, and data minimization as architecture requirements, not handler details.
- Do not leak secrets, PII, prompts, completions, tokens, raw payloads, headers, or attachments into logs, metrics, traces, events, generated examples, or model calls unless an explicit product policy allows the exact field.
- Declare handler capabilities before use. Commands, streams, subscriptions, queue workers, and agents should access other components through typed context surfaces produced by `.canInvoke(...)`, `.canConsumeStream(...)`, `.canEnqueue(...)`, `.canEmit(...)`, and agent-specific declarations where available.
- Keep EventBridge and QueueBridge separate. Event transports do not become queues.
- Agents and workflows are native `@purista/harness` definitions mounted by `@purista/core`; provider packages remain app-level dependencies.
- Standalone Harness composition uses additive singular/plural registries; prefer `.tool(id, definition)` for inline native tools, invoke with `.run/.stream`, release idle sessions with `release`, and reserve `destroy` for deletion.
- Declare provider-neutral model requirements in `defineHarness()` and bind concrete providers/model identifiers under `ai.models[alias]` when the service is instantiated.
- Durable agent workspace replay is a harness-owned adapter contract consumed through PURISTA runtime wiring; PURISTA declares requirements and validates capabilities but does not own product retention, encryption, quota, or cleanup policy values.
- Use Hono as the active HTTP server package. Do not revive legacy HTTP server guidance.
- For exported TypeScript APIs, add IDE-friendly TSDoc/JSDoc with concise examples for non-obvious public helpers.
- Metrics use the OpenTelemetry Metrics API. Core stays SDK/exporter-neutral; applications own MeterProvider, readers, exporters, collectors, and Prometheus exposure.
- Declare custom application metrics with `ServiceBuilder.defineMetric(...)`, record them through typed `context.metrics`, and keep names under `app.*`.
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
- mounted Harness target: optional native agent or workflow published at a service address
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
- "A model reasons, uses tools, or coordinates a conversation" -> native Harness target mounted by the owning service
- "Time starts the work" -> schedule contract targeting event, queue, or short command
- "External system or SDK is needed" -> resource/runtime binding, never a direct handler import

Production architecture guidance:
- start monolithic with explicit service boundaries; split deployment only when team, scaling, or failure-domain pressure justifies it
- keep services stateless and persist truth in stores/resources owned by the capability
- design all retryable side effects as idempotent; exactly-once is a handler/property design, not a broker promise
- carry trusted `tenantId`, `principalId`, `traceId`, and `correlationId` through boundaries; authentication establishes identity, while business guards authorize the requested action/object and current state; do not use transport ids as AI conversation ids
- expose HTTP as a projection of command or stream definitions; mounted Harness targets stay internal addresses
- use default bridges for local/test and production bridges/stores for stated guarantees; fail startup in strict mode when guarantees cannot be met
- minimize data at each contract boundary; events and agent prompts should contain the least sensitive shape that still satisfies the use case

## Current AI Decision
AI definitions live in `@purista/harness`. Core mounts selected targets and
provides address-first EventBridge clients. A mount creates no implicit command,
stream, queue, worker, or HTTP endpoint. Model providers remain explicit
application dependencies. Browser chat uses the optional
`@purista/harness-ai-sdk-ui/v1` adapter; PURISTA does not define a client
protocol.

PURISTA records agent wrapper metrics only. `@purista/harness` owns GenAI semantic-convention metrics, model metrics, token metrics, and tool metrics.

Harness governance policy is optional. Use it only when a definition needs
central tool-call policy, approval, audit, or external policy packs; PURISTA
mount guards and tenant-scoped resources remain the business authorization
boundary.

Durable workspace replay is opt-in and declared by Harness. Runtime wiring
supplies `ai.storage` and `ai.workspace`, and startup fails when required
capabilities are missing. PURISTA's top-level `stateStore` remains the general
Framework KV component and must not be adapted into Harness storage.

## Verification Cues
- The design can name one owner for each capability and source of truth.
- Every handler dependency is reachable through resources, stores, context, or declared runtime bindings.
- Handlers declare every service, stream, queue, event, agent, and workflow address before using typed context clients.
- Runtime wiring names required bridges, stores, providers, telemetry, queue bridges, and HTTP servers.
- Durable agent replay designs name Harness storage/workspace adapters, required capabilities, stable run-id input, cleanup owner, and product-owned retention/encryption/quota policy.
- Metrics wiring names the app-owned OpenTelemetry provider/exporters and keeps Prometheus outside core.
- Handler code uses declared custom metrics through typed `context.metrics`, not raw metric names or a raw recorder.
- Tests demonstrate PURISTA builder/context helpers, resource/store mocks, and runtime wiring separately. HTTP-only tests do not teach Framework testing; see `references/07-testing-observability-and-deployment.md`.
- Logs, metrics, traces, events, queues, streams, and AI prompts are reviewed for secret/PII leakage before production use.
- Generated code follows current CLI templates unless there is a deliberate reason to go lower-level.
- Project setup and scaffolding follow the handbook quickstart shape: Framework artifacts live under `src/service`, while native AI modules live under `src/harness/<service>`. Services, commands, streams, queues, workers, and agents are added through generated local CLI scripts such as `add:service`, `add:command`, `add:queue-worker`, and `add:agent`.
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
- `references/12-state-and-ownership.md`
