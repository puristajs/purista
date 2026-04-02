---
name: purista
description: Canonical PURISTA framework skill for turning business requirements into service architecture, builder-based implementation, agent/runtime wiring, and implementation plans.
topics: [architecture, builders, agents, runtime, implementation]
phases: [spec, architecture, implementation]
---

# PURISTA

## When to use this skill
Use this as the default shared framework skill whenever an agent needs to understand how PURISTA applications are designed, wired, implemented, tested, or planned.

## What this skill is for
This is the single canonical framework-memory skill for PURISTA. It teaches the full path from business brief to service architecture to builder-based implementation and runtime wiring.

## Core PURISTA mental model
PURISTA is builder-driven. The system is designed in four explicit layers:
- definition: builders declare services, contracts, resources, queues, streams, workers, and agents
- implementation: handlers contain domain behavior behind those declared boundaries
- configuration: schemas, resources, stores, bridges, and runtime policies are attached explicitly
- instantiation: `getInstance(...)` turns the declared graph into running services or agents

Keep this distinction visible. Do not collapse builder definitions, runtime bindings, and prompt behavior into one vague layer.

Safe defaults matter. Prefer the path that gives a new user predictable production behavior with minimal broker knowledge, and only expose transport-specific complexity when the chosen adapter truly requires it.

## Hard rules
- Start from business capabilities and ownership boundaries, not routes or package names.
- Model deterministic truth explicitly. Prompts, projections, and readiness summaries are weaker than canonical truth.
- Put external systems behind resources or declared runtime bindings.
- Keep schemas explicit for commands, events, queues, streams, and agent inputs/outputs.
- Do not share one large Zod schema across multiple services or consumers.
- Let each consumer define its own schema again for the boundary it actually reads.
- Keep required fields mandatory, but mark extra producer-only fields optional or omit them entirely from the consumer schema.
- Prefer consumer-local schemas that only select the fields the consumer really uses; Zod will strip the rest and keep payloads smaller.
- Treat transports, bridges, stores, sandbox, and providers as runtime wiring, not service definition.
- Keep runtime guarantees capability-driven and truthful. If an adapter cannot honor a requested guarantee in strict mode, startup should fail instead of silently degrading.

## Decision rules
- Use commands for direct business actions.
- Use subscriptions for reacting to facts or events.
- Use streams for incremental delivery.
- Use queues and queue workers for durable background execution.
- Use agents when the flow is model-driven, conversational, or tool-loop oriented.
- Use services when a capability owns invariants, state, or integrations.

## Adapter rules
- Event bridges and queue bridges stay separate abstractions. Do not bend push-style event transports into queue semantics.
- Prefer queue-backed execution for durable retries, leases, dead-letter handling, and operator replay workflows.
- Only add new queue adapters when the provider fits pull + lease + ack semantics cleanly.
- Hono-based HTTP server surfaces are the active HTTP runtime. Do not model new work around the removed legacy `@purista/httpserver` package.

## Definition pattern
Keep service and agent boundaries versioned and explicit.

```ts
const service = new ServiceBuilder(serviceInfo)
  .setConfigSchema(configSchema)
  .defineResource('repository', repositoryResource)

const createOrder = service
  .getCommandBuilder('createOrder', '1')
  .setInputSchema(createOrderInput)
  .setCommandFunction(async context => {
    await context.resources.repository.create(context.input)
  })

service.addCommandDefinition(createOrder.getDefinition())
```

## Configuration pattern
Attach service-owned configuration and runtime dependencies explicitly.

```ts
const orderService = new ServiceBuilder(serviceInfo)
  .setConfigSchema(orderConfigSchema)
  .defineResource('repository', orderRepositoryResource)
```

## Instantiation / runtime wiring
Definitions are not running instances. Runtime infrastructure is supplied at `getInstance(...)`.

```ts
const orderServiceInstance = orderService.getInstance(eventBridge, {
  config: resolvedConfig,
  resources: { repository },
  logger,
  queueBridge,
})
```

## Verification cues
- The design can explain which service owns each business capability.
- Every handler dependency is reachable through resources, stores, context, or declared runtime bindings.
- The runtime wiring can name all required bridges, stores, providers, and resources.
- Agents do not own canonical truth unless a deterministic service or coordinator applies it.
- Queue and subscription guarantees are explicit, documented, and validated against the selected adapter capabilities.

## Common mistakes / anti-patterns
- Designing routes or prompts before deciding service ownership.
- Hiding infrastructure clients directly inside handlers.
- Letting agent output outrank deterministic workspace state.
- Mixing workflow state into conversation history instead of run-state or persisted truth.
- Treating the framework as “magic runtime” rather than declared builders plus runtime inputs.
- Keeping dead configuration knobs or undocumented best-effort fallbacks after the architecture has changed.

## How to navigate this skill
- Start with core concepts if the model is unfamiliar with PURISTA.
- Move to spec/architecture guidance when requirements are still being shaped.
- Move to builder/runtime guidance when writing code or reviewing service boundaries.
- Move to testing, deployment, and scaffolding only when the architecture is already clear.

## Read if needed
- `references/01-core-mental-model.md`
- `references/02-spec-to-architecture.md`
- `references/03-service-builders-and-contracts.md`
- `references/04-resources-stores-and-runtime-wiring.md`
- `references/05-agents-skills-and-ai-runtime.md`
- `references/06-queues-streams-subscriptions-and-bridges.md`
- `references/07-http-sandbox-mcp-and-external-bindings.md`
- `references/08-testing-observability-and-deployment.md`
- `references/09-cli-starter-and-scaffolding.md`
- `references/10-implementation-planning.md`
- `website/doc/handbook/index.md`
- `website/doc/handbook/2_building_business-logic/builders.md`
