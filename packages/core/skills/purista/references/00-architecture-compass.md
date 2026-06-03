# Architecture Compass

Use this reference when designing a PURISTA system before implementation. It condenses the handbook mental model into practical architecture decisions for production systems.

Source handbook pages:
- `purista/web/src/content/handbook-cards/mental-model/philosophy.mdx`
- `purista/web/src/content/handbook-cards/mental-model/separation-of-concerns.mdx`
- `purista/web/src/content/handbook-cards/mental-model/architecture.mdx`
- `purista/web/src/content/handbook-cards/mental-model/data-control.mdx`
- `purista/web/src/content/handbook-cards/mental-model/distribution.mdx`
- `purista/web/src/content/handbook-cards/mental-model/deployment-flexibility.mdx`
- `purista/web/src/content/handbook-cards/mental-model/resilience-patterns.mdx`

## Contents
- [Core Idea](#core-idea)
- [Component Map](#component-map)
- [Decision Rules](#decision-rules)
- [Building Complex Systems](#building-complex-systems)
- [Reliability Rules](#reliability-rules)
- [Data And Security Rules](#data-and-security-rules)
- [Deployment Rules](#deployment-rules)
- [Architecture Review Checklist](#architecture-review-checklist)

## Core Idea
PURISTA is message-driven. Every meaningful interaction is a typed message across an explicit service boundary.

The architecture separates:
- business logic: services, commands, subscriptions, streams, queues, workers, agents, schemas, guards, and resources
- routing and runtime coordination: EventBridge and QueueBridge
- infrastructure adapters: AMQP, NATS, MQTT, Redis, Dapr, Hono, stores, telemetry SDK/exporters, and model providers

Business logic should not know whether it runs in one process, several containers, serverless functions, edge devices, AMQP, NATS, Redis, or local memory. Bootstrap code chooses adapters and supplies runtime dependencies.

## Component Map
| Component | Intention | Use When | Relationship |
| --- | --- | --- | --- |
| Service | Versioned business capability and ownership boundary. | A domain area owns invariants, state, resources, or contracts. | Contains commands, subscriptions, streams, queues, workers, schedules, agents, resources, config, metrics. |
| Command | Active request/response operation. | A caller needs a validated result, error, or explicit event after success. | May emit an event, call allowed commands, enqueue work, expose HTTP. |
| Event | Business fact. | Something happened and zero or more consumers may react. | Produced by command success or explicit emit; consumed by subscriptions or event-to-queue bindings. |
| Subscription | Passive bounded reaction. | Work should happen because an event/fact occurred and producer must not wait. | Must be idempotent; use queues for heavy retryable work. |
| Stream | Incremental delivery contract. | Clients need progress, chunks, long-running output, or SSE. | Can expose as SSE or aggregate JSON through Hono. |
| Queue | Durable work contract. | Work needs leases, retries, delay, dead-lettering, idempotency, or operator replay. | Queue worker owns execution; QueueBridge owns delivery mechanics. |
| Queue worker | Execution logic for queued work. | A queue item must be processed with bounded retry and lifecycle policy. | Uses resources and typed context; returns explicit outcomes. |
| Agent | Model-driven service capability. | Work involves model reasoning, tool use, conversation, synthesis, or harness workflows. | Attaches to a service and expands into queue, worker, command, and stream definitions. |
| Schedule | External time-trigger contract. | Time should initiate a business event, queue job, or short command. | PURISTA declares the contract; Kubernetes CronJob or another scheduler owns the clock. |
| Resource | External dependency behind a service-owned interface. | A handler needs DB, API, SDK, repository, or domain adapter access. | Supplied at `getInstance(...)`, not imported directly into handlers. |
| Store | Config, secret, or state access abstraction. | Runtime values, secrets, or state must be externalized. | Supplied through runtime wiring and scoped by tenant/security rules where needed. |
| EventBridge | Command/event routing abstraction. | Services exchange messages. | Swappable distribution boundary: local, AMQP, NATS, MQTT, Dapr. |
| QueueBridge | Queue delivery abstraction. | Durable background work is needed. | Separate from EventBridge; Redis/NATS support strict idempotency. |
| HTTP server | External API projection. | Commands, streams, or agents must be callable over HTTP/OpenAPI. | Hono exposes declared contracts; routes do not define architecture. |
| Observability | Trace, metrics, logs, health, diagnostics. | Production operations and debugging. | Message boundaries provide natural spans, metrics, health, and in-flight diagnostics. |

## Decision Rules
Start with these questions:
1. What business capability owns the behavior?
2. What is the source of truth and who may mutate it?
3. Does the caller need an immediate result?
4. Is the work slow, retryable, replayable, or externally fragile?
5. Does the output need progress or incremental delivery?
6. Is the work deterministic, model-driven, or a hybrid?
7. What identity, tenant, trace, and correlation data must cross the boundary?
8. Which runtime guarantees are required, and can the chosen adapter honor them?
9. Which fields are confidential, PII, tenant-scoped, regulated, or unsafe for model/provider exposure?

Then choose:
- command for direct operations
- event plus subscription for decoupled reactions
- queue plus worker for durable background execution
- stream for incremental output
- agent for model-driven reasoning inside an owning service
- schedule for time-trigger intent
- resource/store/runtime binding for infrastructure dependencies

Do not choose:
- an HTTP route before choosing service ownership and message contract
- a subscription for long-running retry-heavy processing
- an agent when deterministic service logic owns the truth
- a queue when the caller only needs a short direct result
- direct SDK imports in handlers when a resource should own that dependency

## Building Complex Systems
For enterprise-grade systems, compose small primitives:

### User-Facing Request With Side Effects
1. Hono HTTP endpoint exposes a command.
2. Command validates payload/parameter, checks guards, writes canonical state through resources.
3. Command emits a business event on success.
4. Subscriptions react independently.
5. Heavy reactions enqueue durable work.
6. Workers process with idempotency, retries, and dead-letter behavior.

### Long-Running Business Process
1. Command accepts a request and enqueues a job.
2. Queue worker owns execution and progress events.
3. Stream exposes progress if a client needs live updates.
4. State store or domain resource persists job/run truth.
5. Operator replay uses queue/job lifecycle surfaces.

### Model-Assisted Workflow
1. Deterministic service owns state and invariants.
2. Agent attached to that service classifies, proposes, summarizes, or coordinates.
3. Agent tools are allowlisted commands or child agents.
4. Agent output is validated and applied by deterministic commands/resources.
5. Long-running agents use queue response contracts with separate `jobId` and `runId`.

### Cross-Service Business Flow
1. Each service owns one capability and its state.
2. Commands perform direct interactions when the caller needs a result.
3. Events publish facts for downstream reactions.
4. Consumers define narrow local schemas for the fields they need.
5. Queues isolate slow or fragile external effects.

## Reliability Rules
- Design handlers for at-least-once delivery unless a stricter guarantee is explicitly proven.
- Treat exactly-once as idempotent handler design plus deduplication, not as a broker promise.
- Use strict capability validation where unsupported adapter guarantees must fail startup.
- Keep retry budgets bounded and route exhausted work to dead-letter handling.
- Use event-to-queue idempotency for duplicate-safe scheduled or reactive handoff.
- Keep command and stream timeouts explicit; late responses after terminal timeout are ignored.
- Verify graceful shutdown with in-flight diagnostics and service health.

## Data And Security Rules
- Carry `tenantId` and `principalId` through every sensitive command, event, queue, stream, and agent boundary.
- Check tenant/principal preconditions with `setBeforeGuardHooks(...)` before handler logic.
- Keep secrets in secret stores or deployment secret injection; never place secret values in config stores, source code, generated examples, logs, metrics, traces, events, queues, or model prompts.
- Scope repositories, store keys, queue idempotency keys, and cache keys by tenant where data is shared across tenants.
- Minimize contracts: events, queues, streams, logs, traces, metrics, and prompts should carry identifiers or redacted summaries instead of full records whenever possible.
- Redact PII, secrets, provider prompts, completions, attachments, tokens, headers, and raw payloads according to the product privacy policy.
- Treat AI agents as data processors: allowlist tools, sanitize context before model calls, sandbox untrusted file/code access, and validate output before it mutates canonical truth.

## Deployment Rules
- Start monolithic when product boundaries are still changing.
- Keep service boundaries explicit even in a monolith.
- Split to microservices when teams, scaling, deploy cadence, or failure domains demand it.
- Use serverless for bursty short-lived external entrypoints when cold starts and execution limits are acceptable.
- Use edge/single-process deployments for constrained or local-latency workloads.
- Deployment changes should modify bootstrap wiring, not service handlers.

## Architecture Review Checklist
- One service owns each capability and invariant.
- Every external dependency is a resource, store, bridge, provider, or runtime binding.
- Every boundary has explicit payload, parameter, output, chunk, or final schemas.
- Consumers define local schemas that select what they need.
- HTTP exposure is a projection of command, stream, or agent contracts.
- Queue-backed work has retry, timeout, idempotency, and dead-letter policy.
- Agent output does not mutate canonical truth without deterministic validation.
- Runtime wiring names EventBridge, QueueBridge, stores, resources, telemetry, model providers, and HTTP server.
- Observability covers traces, logs, custom metrics, health, paused consumers/workers, and in-flight diagnostics.
- Security review covers tenant isolation, guard placement, secret storage, least-privilege resources, AI/model data exposure, redaction, audit logs, and sensitive telemetry attributes.
- The design can move from monolith to distributed deployment by changing bootstrap wiring.
