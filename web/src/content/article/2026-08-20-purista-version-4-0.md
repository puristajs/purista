---
title: "PURISTA 4.0: clearer systems, safer automation"
description: "PURISTA 4.0 adds isolated scheduling, machine-readable architecture checks, inherited observability, typed metrics, and explicit data lifecycles."
date: 2026-08-20
order: 20260820
image: /graphic/purista_4_0_cover.webp
---

PURISTA 4.0 is a release about making distributed applications easier to build,
operate, and change safely. It removes repeated wiring, puts time-based work in
its own deployable runtime, and gives both developers and coding agents a
reliable view of the architecture before they change it.

## What ships in 4.0

- **A standalone scheduler runtime** for cron, interval, and one-shot event
  triggers.
- **Static architecture inspection and diagnostics** through `purista inspect`,
  `purista validate`, and `purista doctor`.
- **RFC 9457 Problem Details** for generated Hono HTTP endpoints, with matching
  OpenAPI schemas and safe error redaction.
- **Service-owned observability defaults** that compatible adapters inherit
  before startup, without repeated configuration.
- **Typed application metrics** in service and attached-agent handlers, plus an
  optional OpenTelemetry bootstrap in newly generated projects.
- **Explicit StateStore retention** for service state and agent data.
- **Project-local AI guidance** and generated API knowledge so assistants can
  follow real framework patterns instead of inventing them.

## Schedule a trigger, not a copy of your application

A schedule is declared by the service that owns the business capability, but it
runs in a separate, minimal Scheduler Runtime deployment. The scheduler only
publishes a normal event. It never starts business services, invokes handlers,
runs agents, or executes queue work.

```ts
const monthlyBilling = billingServiceBuilder
  .getScheduleBuilder('monthlyBillingCycle', 'Request monthly billing')
  .emitEvent('billing.monthlyCycleDue', {
    expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
    schedulerGroup: 'billing',
  })

billingServiceBuilder.addScheduleDefinition(monthlyBilling)
```

Run the `billing` scheduler group wherever it belongs operationally. It emits
the event; a subscription or event-to-queue binding then decides how the work
runs. Each event includes a stable `occurrenceId`, so the consumer can make the
business effect idempotent. For replicated scheduler hosts, use a provider with
distributed occurrence claims, such as `@purista/redis-scheduler-provider`.

Read the [scheduling guide](/handbook/6-integrations/enterprise-interoperability/scheduling/) for deployment, provider, and recovery details.

## Let tools see the architecture before they edit it

PURISTA now exports a JSON-safe static architecture view of services, commands,
subscriptions, streams, queues, workers, schedules, event-to-queue bindings,
and agents. It contains definitions and diagnostics—not functions, credentials,
prompts, provider instances, or live infrastructure claims.

```bash
purista inspect --definitions purista.definitions.json --format json
purista validate --definitions purista.definitions.json --strict --format json
purista doctor --definitions purista.definitions.json --format json
```

Use `inspect` to understand what exists, `validate` to enforce static
cross-reference rules, and `doctor` to check the generated project files. This
is particularly useful in CI and for AI-assisted work: a tool can establish the
real topology before proposing a change. It does not replace health checks for
your live bridge, store, scheduler provider, or model provider.

## Return errors clients can rely on

Generated Hono endpoints now use the standard HTTP Problem Details shape. A
failed request receives `application/problem+json` by default, with a stable
type, title, status, detail, safe trace identifier, and validation errors where
appropriate. Clients that explicitly prefer Markdown can receive the same safe
problem as `text/markdown`.

The generated OpenAPI document declares the same error representation, so a
client generator does not need to guess a second error envelope. PURISTA
redacts unsafe internal details from server failures by default. This applies
at the HTTP boundary only: internal EventBridge error envelopes stay unchanged
to preserve message-transport compatibility.

## Configure observability once

Service runtime configuration remains flat. Supply logging, tracing, and metrics
when you create the service; supported Core adapters inherit only values that
they have not explicitly configured. An explicit adapter configuration always
wins, and PURISTA never replaces telemetry on a running component.

```ts
const eventBridge = new AmqpBridge()

const service = await ordersV1Service.getInstance(eventBridge, {
  logger,
  spanProcessor,
  metrics: { meter },
})

await eventBridge.start()
await service.start()
```

Existing applications that configure telemetry directly on a bridge continue to
work. The new cascade simply removes the need to repeat the same values across
unconfigured compatible adapters. See [OpenTelemetry](/handbook/4-open-telemetry/) for the full setup.

## Record application metrics with types, not strings

Declare application metrics on the service or agent builder, then record them
through typed `context.metrics`. That makes metric names, instrument use, and
allowed attributes discoverable in the editor and unavailable outside their
declared scope.

```ts
const orders = ordersServiceBuilder.defineMetric('app.orders.created', {
  kind: 'counter',
  unit: '{order}',
  description: 'Orders accepted by the service',
})

orders.getCommandBuilder('createOrder', 'Create an order')
  .setCommandFunction(async context => {
    context.metrics['app.orders.created'].add(1)
  })
```

New projects can opt into a minimal OpenTelemetry Metrics bootstrap with
`purista init --telemetry otel`. PURISTA stays SDK- and exporter-neutral: your
application still owns the MeterProvider, readers, exporters, collector, and
Prometheus exposure.

## Give state a deliberate lifetime

State retention is now a first-class StateStore policy. Set it for one write,
as a service default, or on a dedicated store. A finite lifetime requires a
backend with atomic expiry; PURISTA does not promise best-effort deletion.

The same policy covers attached-agent data. `history.maxTurns` and
`history.maxBytes` bound retained conversation history, while `idleTtlMs`
expires inactive agent state. Read the [StateStore retention guide](/handbook/2-building-business-logic/stores/state-stores/#retention) before selecting a policy and backend.

## Make agents safer to operate

Attached-agent history, run summaries, and lifecycle records now use the owning
service StateStore by default. Give agents a dedicated store only when they
need a distinct security or retention boundary. Trusted `tenantId` and
`principalId` values are also included in the conversation namespace, preventing
an accidentally shared history across tenants or principals.

Workflow-backed agents must declare the local agents and model aliases they may
delegate to. Custom agent streams are now limited to runtime-owned model and
tool lifecycle chunks; use `safe` visibility for normal clients, `full` only
for trusted diagnostics, and a separate application stream for custom UI frames.

## AI guidance that stays with the project

The CLI now initializes local PURISTA guidance for Codex, Claude, and similar
tools. The project links the framework skill from its installed dependency and
includes implementation guidance, architecture patterns, CLI flows, tests, and
generated API lookup material. Dependency upgrades therefore update the
project-local knowledge instead of leaving an old prompt file behind.

For an existing project, follow [Install the PURISTA AI skill](/handbook/install-ai-skill/).

## Migrate with evidence, not a prompt-sized guess

Version 4 also ships a dedicated `purista-migration` skill. It is deliberately
separate from the normal framework skill: an existing application upgrade needs
a recorded baseline, compatible package versions, a migration ledger, static
diagnostics, deployment order, and a rollback trigger—not a new-feature
workflow.

Install it beside the normal skill for an existing project:

```bash
npx skills add puristajs/purista --skill purista-migration
```

The skill starts from the application’s `package.json`, lockfile, local CLI,
definitions, runtime wiring, and deployment manifests. It never assumes a
framework checkout or a global CLI. It then routes the v4 changes to the right
boundary: Core import paths, a separate event-only scheduler host, inherited
observability before startup, RFC 9457 consumers, and state or agent data
lifecycles. The result is a migration record another engineer or agent can
verify instead of a pile of untracked edits.

## Upgrade checklist

1. Capture the lockfile, local scripts, definitions, and current checks before
   changing the application; use the migration skill to maintain the ledger and
   rollback trigger.
2. Export definitions and run `purista validate --strict` before changing the
   application.
3. Deploy schedules as a separate Scheduler Runtime and make downstream effects
   idempotent with `occurrenceId`.
4. Consolidate repeated telemetry into flat `getInstance(...)` options where a
   compatible adapter is still unconfigured; direct adapter configuration needs
   no migration.
5. Update HTTP clients that parse legacy Hono error bodies to consume RFC 9457
   Problem Details instead.
6. Review retention, encryption, access control, and expiry behavior for every
   persisted agent conversation.
7. Add explicit delegation allowlists to Harness workflows and move custom agent
   UI frames to an application stream or channel.

The detailed handbook pages linked above contain the operational constraints and
working examples for each feature.
