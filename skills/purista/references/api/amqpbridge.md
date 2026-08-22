# @purista/amqpbridge API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/amqpbridge`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [AmqpBridge](#amqpbridge)

## AmqpBridge

**class.** EventBridge implementation for AMQP brokers such as RabbitMQ. Source: `amqpbridge/src/AmqpBridge.impl.ts:115`.

**Verified example**

```typescript
import { AmqpBridge } from '@purista/amqpbridge'

// create and init our eventbridge
const config = {
   url: 'amqp://localhost'
}

const eventBridge = new AmqpBridge(config)
await eventBridge.start()

```

**Public callable patterns**

- `destroy()` — Gracefully stops all consumers, waits for in-flight subscription handlers, closes AMQP resources and rejects unresolved pending invocations.
- `emitMessage(message, contentType, contentEncoding)` — Emits a message via AMQP headers exchange.
- `getInFlightExecutionCount()` — Number of currently running handlers across all work kinds.
- `getInFlightExecutionCounts()` — Number of currently running handlers grouped by work kind.
- `getPausedSubscriptionConsumers()` — Returns paused subscription consumer states keyed by adapter registration key.
- `getTracer()` — Returns open telemetry tracer of this service
- `invoke(input, commandTimeout)` — Invokes a remote command and waits for a matching command response.
- `isHealthy()` — Indicates if the bridge connection and channels are currently healthy.
- `isReady()` — Indicates if the bridge finished startup and is ready to process traffic.
- `openStream(_input, _ttl?)` — Open a stream invocation.
- `registerCommand(address, cb, metadata, eventBridgeConfig)` — Register a service function and ensure that there is a queue for all incoming command requests.
- `registerStream(_address, _cb, _metadata, _eventBridgeConfig)` — Register a service stream handler for a service target.
- `registerSubscription(subscription, cb)` — Registers a subscription consumer and returns its stable subscription key.
- `resumeSubscriptionConsumer(registrationKey)` — Resumes a subscription consumer paused by a `stop-consumer` control signal.
- `runInFlight(fn, kind?)`
- `start()` — Connects to the AMQP broker and declares the exchange and reply queue.
- `startActiveSpan(name, opts, context, fn)` — Start a child span for opentelemetry tracking
- `unregisterCommand(address)` — Unregisters a command consumer and closes the dedicated command channel.
- `unregisterStream(_address)` — Unregister a service stream
- `unregisterSubscription(address)` — Unregisters a subscription consumer and closes its channel.
- `waitForInFlightDrain(timeoutMs?)`
- `wrapInSpan(name, opts, fn, context?)` — Start span for opentelemetry tracking on same level.

