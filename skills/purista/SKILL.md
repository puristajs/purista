---
name: purista
description: Guides architecture, CLI-first implementation, runtime wiring, testing, and review of PURISTA applications. Use when designing, creating, changing, or evaluating a PURISTA service-based backend.
---

# PURISTA

## When To Use
Use this as the default shared skill whenever an agent designs, implements, reviews, tests, or plans a PURISTA application.
For an existing application upgrade or legacy-to-current framework transition,
route primary work to `purista-migration`.

## Operating Model

PURISTA is builder-driven and runtime-explicit. Keep these layers separate:

- architecture: capability ownership, invariants, source of truth, and sync/async boundaries;
- definition: builders declare contracts, schemas, capabilities, and transport-independent behavior;
- implementation: handlers contain domain behavior only;
- runtime wiring: `getInstance(...)` receives bridges, stores, resources, telemetry, providers, queues, and HTTP projection.

Start from ownership and contracts—not routes, prompts, or infrastructure. Stop and ask one focused question when ownership, a required delivery guarantee, or a security policy is materially unknown; do not invent it.

## Non-Negotiable Rules

- For a new app, run `npm create purista@latest` or `purista init <target> --non-interactive --defaults --no-install`, then use its project-local `add:*` scripts. Existing apps: read `package.json`, optional `purista.json`, and local scripts before changing code.
- Generated applications are ESM-only. Keep schemas explicit and consumer-local; put external systems behind resources or runtime bindings.
- Use typed handler capabilities (`.canInvoke(...)`, `.canEnqueue(...)`, `.canEmit(...)`, and equivalents) before accessing other components. Keep EventBridge and QueueBridge separate.
- Import application APIs from `@purista/core`; tests from `/testing`; clients from `/client`; adapter-author APIs only from `/adapter`.
- Hono is the HTTP projection. Applications own OpenTelemetry SDK/exporter setup; Core remains SDK-neutral. Never put secrets, personal data, prompts, completions, tokens, raw payloads, headers, or attachments into telemetry or examples without explicit policy.
- A schedule declares and emits an event only. `SchedulerRuntime` runs as a separate minimal host; it never boots business services or handlers. Use Redis distributed claims plus strict mode for replicated scheduler hosts.
- This installed skill never requires framework source paths, internal specifications, or unpublished APIs.

## Primitive Decisions
- service: owns a versioned business capability, invariants, resources, and contracts
- command: direct request/response business action
- subscription: bounded reaction to emitted events or facts
- stream: incremental output or SSE/aggregate delivery
- queue: durable background work contract
- queue worker: execution logic for queue work
- agent: optional model-driven loop, harness agent/workflow, or custom run function attached to a service
- schedule: service-owned time declaration; the Core Scheduler Runtime emits an event, then normal consumers own business work

## Primitive Choice

Use PURISTA as a message-driven architecture toolkit. Choose by intent:
- "A caller needs a result now" -> command
- "Something happened and others may react" -> event plus subscription
- "Work may be slow, retried, replayed, delayed, or dead-lettered" -> queue plus queue worker
- "A caller needs progress or incremental output" -> stream
- "A model reasons, uses tools, or coordinates a conversation" -> agent attached to the owning service
- "Time starts the work" -> schedule event declaration; a separate scheduler host emits it and subscriptions/queues/agents react
- "External system or SDK is needed" -> resource/runtime binding, never a direct handler import

Start monolithic with explicit service boundaries; split only for team, scale, or failure-domain pressure. Make retries idempotent—exactly-once is a business-property design, not a broker promise. Propagate tenant, principal, trace, and correlation identity; guard authorization before handler logic. Use strict capability validation whenever the stated guarantee requires it.

## Completion Check

Before handoff, verify a single owner/source of truth per capability, declared handler dependencies, explicit runtime bindings, required reliability behavior, and no sensitive-data leakage. Run the generated application’s build/test and its available definition export, inspect, strict validate, and doctor scripts.

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
