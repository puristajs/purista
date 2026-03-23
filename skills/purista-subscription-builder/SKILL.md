---
name: purista-subscription-builder
description: React to events with idempotent PURISTA subscriptions and explicit dependency boundaries.
topics: [subscriptions, events, integration]
phases: [implementation]
---

# PURISTA Subscription Builder

## When to use this skill
Use this skill when a service needs to react to domain or integration events.

## What this component/package is for
Subscriptions consume events from the EventBridge and trigger local business behavior without turning every event into a synchronous API call.

## Hard rules
- Keep subscription handlers idempotent.
- Treat events as immutable facts.
- Validate incoming event payloads.
- Avoid hidden retry side effects.

## Decision rules
- Use subscriptions for reactive, eventually consistent workflows.
- Prefer commands when the caller needs a direct outcome instead of fire-and-forget.

## Recommended file/folder structure
```text
src/service/<service-name>/v1/subscription/<event-name>/
  <eventName>SubscriptionBuilder.ts
  schema.ts
  handler.ts
```

## Common implementation patterns
- Normalize external events before mapping them to local domain behavior.
- Emit new local events when the service establishes a new fact.
- Pair subscriptions with stores or deduplication keys when replays are possible.

## Common mistakes / anti-patterns
- Assuming exactly-once delivery.
- Performing large durable workflows directly in the subscription handler.
- Turning subscriptions into RPC replacements.

## How this connects to other PURISTA concepts
Subscriptions rely on EventBridge semantics and often hand work to commands, queues, or workers.

## Read if needed
- `website/doc/handbook/2_building_business-logic/service/index.md`
- `specs/15-async-queues/00-requirements.md`
- `specs/20-agents/10-platform-architecture.md`
