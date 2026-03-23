---
name: purista-event-bridges
description: Teach untrained models how builder-defined services use EventBridge for commands, subscriptions, and tracing-aware service integration at runtime.
topics: [event-bridge, messaging, tracing]
phases: [architecture, implementation]
---

# PURISTA Event Bridges

## When to use this skill
Use this skill when integrating services, commands, subscriptions, or custom event flows.

## What this component/package is for
EventBridge is PURISTA’s runtime transport for commands, events, and tracing-aware service integration.

## Core PURISTA concept
EventBridge is runtime wiring for builder-defined services. Command and subscription definitions describe what can happen; EventBridge is how running service instances exchange those messages.

## Builder lifecycle
1. Define commands and subscriptions on services.
2. Assemble the service definitions.
3. Instantiate services with a concrete EventBridge.
4. Let running service instances invoke commands or consume events through that bridge.

## Hard rules
- Keep EventBridge wiring infrastructure-level, not business-level.
- Preserve message metadata for tracing, tenancy, and principal propagation.
- Treat unconsumed messages as a design signal, not harmless noise.

## Decision rules
- Use direct EventBridge invocation for service-to-service interaction.
- Use queues when the execution must be durable or throttled.
- Keep event consumption in subscriptions rather than hidden custom listeners.

## Definition pattern
- Commands and subscriptions are defined on service builders.
- EventBridge itself is not a builder artifact; it is runtime infrastructure.

## Implementation pattern
- Use command and subscription handlers as the business boundary around EventBridge messages.
- Keep transport-specific logic out of service handlers when possible.

## Configuration pattern
- EventBridge selection and configuration are runtime concerns.
- Builder definitions should remain transport-neutral aside from their command/subscription contracts.

## Instantiation / runtime wiring
- Every service instance needs EventBridge at `getInstance(...)`.
- Without EventBridge, builder definitions exist but the service cannot run as an integrated unit.

## Verification cues
- Services can point to the EventBridge instance they run on.
- Command and subscription contracts line up with actual EventBridge message flows.
- Durable paths still use queues where needed instead of stretching EventBridge semantics too far.

## Common mistakes / anti-patterns
- Mixing EventBridge setup into domain logic.
- Treating dropped or unmatched messages as harmless.
- Using raw infrastructure listeners instead of subscription definitions.
- Teaching only message flow without the service builder and `getInstance(...)` runtime wiring.

## How this connects to other PURISTA concepts
EventBridge powers command invocation, subscription delivery, tracing propagation, HTTP exposure, and agent/service interoperability.

## Read if needed
- `packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts`
- `packages/core/test/integration.test.ts`
- `specs/15-async-queues/40-builder-integration.md`
- `specs/20-agents/10-platform-architecture.md`
- `website/doc/handbook/2_building_business-logic/service/index.md`
