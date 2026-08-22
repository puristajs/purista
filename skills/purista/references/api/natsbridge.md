# @purista/natsbridge API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/natsbridge`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [NatsBridge](#natsbridge)

## NatsBridge

**class.** EventBridge implementation for NATS core messaging with optional JetStream. Source: `natsbridge/src/NatsBridge.ts:127`.

**Verified example**

```typescript
import { NatsBridge } from '@purista/natsbridge'

const eventBridge = new NatsBridge({
  servers: 'nats://localhost:4222',
  durableSubscriptionMode: 'strict',
})

await eventBridge.start()
```

**Public callable patterns**

- `destroy()` — Waits for in-flight handlers, drains subscriptions, and closes the NATS connection.
- `emitMessage(message, contentType, contentEncoding)` — Publishes a PURISTA message as a NATS JSON payload.
- `getInFlightExecutionCount()` — Number of currently running handlers across all work kinds.
- `getInFlightExecutionCounts()` — Number of currently running handlers grouped by work kind.
- `getPausedSubscriptionConsumers()` — Returns currently paused subscription consumers keyed by registration key.
- `getTracer()` — Returns open telemetry tracer of this service
- `invoke(input, commandTimeout)` — Invokes a command with NATS request/reply and waits for the response.
- `isHealthy()` — Indicates whether the NATS connection is open and not draining.
- `isReady()` — Indicates whether the NATS connection is open and not draining.
- `openStream(_input, _ttl?)` — Open a stream invocation.
- `registerCommand(address, cb, metadata, eventBridgeConfig)` — Registers a command handler.
- `registerStream(_address, _cb, _metadata, _eventBridgeConfig)` — Register a service stream handler for a service target.
- `registerSubscription(subscription, cb)` — Registers a subscription handler.
- `resumeSubscriptionConsumer(registrationKey)` — Resumes a subscription consumer paused by a `stop-consumer` control signal.
- `runInFlight(fn, kind?)`
- `start()` — Connects to NATS and initializes JetStream clients when available.
- `startActiveSpan(name, opts, context, fn)` — Start a child span for opentelemetry tracking
- `unregisterCommand(address)` — Unregisters and drains/destroys a command handler subscription.
- `unregisterStream(_address)` — Unregister a service stream
- `unregisterSubscription(address)` — Unregisters and drains/destroys a subscription handler.
- `waitForInFlightDrain(timeoutMs?)`
- `wrapInSpan(name, opts, fn, context?)` — Start span for opentelemetry tracking on same level.

