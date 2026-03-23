---
name: purista-subscription-builder
description: Teach untrained models how to define PURISTA subscriptions from a service builder, attach schemas, implement handlers, and wire them through EventBridge-backed service instances.
topics: [subscriptions, events, integration]
phases: [implementation]
---

# PURISTA Subscription Builder

## When to use this skill
Use this skill when a service needs to react to domain or integration events.

## What this component/package is for
Subscriptions consume events from the EventBridge and trigger local business behavior without turning every event into a synchronous API call.

## Core PURISTA concept
A subscription is a builder-defined reactive contract owned by a service. It subscribes to events, validates payloads, implements handler behavior, and only runs inside a service instance wired to EventBridge.

## Builder lifecycle
1. Start from the owning service builder.
2. Create the builder with `getSubscriptionBuilder(...)`.
3. Point it at the triggering event with `subscribeToEvent(...)`.
4. Attach schemas with `addPayloadSchema(...)` and `addOutputSchema(...)` when needed.
5. Implement behavior with `setSubscriptionFunction(...)`.
6. Call `getDefinition()`.
7. Register the definition with `addSubscriptionDefinition(...)`.
8. Create the running service with `getInstance(...)`.

## Hard rules
- Keep subscription handlers idempotent.
- Treat events as immutable facts.
- Validate incoming event payloads.
- Avoid hidden retry side effects.

## Decision rules
- Use subscriptions for reactive, eventually consistent workflows.
- Prefer commands when the caller needs a direct outcome instead of fire-and-forget.
- Hand off durable or long-running work to queues instead of doing everything inline in the subscription.

## Definition pattern
```text
src/service/<service-name>/v1/subscription/<subscription-name>/
  <subscriptionName>SubscriptionBuilder.ts
  schema.ts
  handler.ts
```

## Implementation pattern
- Normalize external events before mapping them to local behavior.
- Emit new facts explicitly when the subscription establishes a new state.
- Use resources, stores, and service invokes through typed context.

## Configuration pattern
- Subscription handlers inherit service config, resources, stores, and invokes from the owning service.
- EventBridge configuration is a runtime concern, not something the subscription builder should invent implicitly.

## Instantiation / runtime wiring
- Subscriptions only become active when the assembled service is instantiated with EventBridge.
- The owning service must register the subscription definition before `getInstance(...)`.
- Runtime wiring is responsible for the EventBridge and any resources the handler uses.

## Verification cues
- The subscription is derived from the service builder, not created in isolation.
- The triggering event is explicit.
- `getDefinition()` is re-added to the service with `addSubscriptionDefinition(...)`.
- The design can explain which running service instance consumes the event.

## Common mistakes / anti-patterns
- Assuming exactly-once delivery.
- Performing large durable workflows directly in the subscription handler.
- Turning subscriptions into RPC replacements.
- Describing only event handling logic without the service assembly and runtime wiring.

## How this connects to other PURISTA concepts
Subscriptions rely on EventBridge semantics and often hand work to commands, queues, stores, or workers.

## Related skills
- `purista-service-builder` for the owning service lifecycle
- `purista-schema-contracts` for event payload contracts
- `purista-event-bridges` for runtime transport semantics
- `purista-queue-builder` for handing off durable work
- `purista-stores` for replay-safe or deduplicated processing

## Read if needed
- `packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts`
- `examples/fullexample/src/service/email/v1/subscription/sendWelcomeEmail/sendWelcomeEmailSubscriptionBuilder.ts`
- `examples/fullexample/src/service/email/v1/emailV1Service.ts`
- `website/doc/handbook/2_building_business-logic/service/index.md`
- `specs/20-agents/10-platform-architecture.md`
