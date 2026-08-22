# @purista/mqttbridge API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/mqttbridge`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [MqttBridge](#mqttbridge)

## MqttBridge

**class.** EventBridge implementation for MQTT 5 brokers. Source: `mqttbridge/src/MqttEventBridge.ts:79`.

**Verified example**

```typescript
import { MqttBridge } from '@purista/mqttbridge'

// create and init our eventbridge
const eventBridge = new MqttBridge()
await eventBridge.start()
```

**Public callable patterns**

- `destroy()` — Rejects pending invocations, waits for in-flight handlers, and closes the MQTT client.
- `emitMessage(message, contentType, contentEncoding)` — Publishes a PURISTA event/message as a JSON MQTT payload.
- `getInFlightExecutionCount()` — Number of currently running handlers across all work kinds.
- `getInFlightExecutionCounts()` — Number of currently running handlers grouped by work kind.
- `getPausedSubscriptionConsumers()` — Returns paused subscription consumer states keyed by adapter registration key.
- `getTracer()` — Returns open telemetry tracer of this service
- `invoke(input, commandTimeout)` — Invokes a command over MQTT and waits for a correlated response message.
- `isHealthy()` — Indicates whether the MQTT client is connected.
- `isReady()` — Indicates whether the MQTT client is connected.
- `openStream(_input, _ttl?)` — Open a stream invocation.
- `registerCommand(address, cb, metadata, eventBridgeConfig)` — Registers a command handler on the shared MQTT command topic.
- `registerStream(_address, _cb, _metadata, _eventBridgeConfig)` — Register a service stream handler for a service target.
- `registerSubscription(subscription, cb)` — Registers a subscription handler on a topic derived from the subscription filter.
- `resumeSubscriptionConsumer(_registrationKey)` — Resumes a paused subscription consumer by registration key.
- `runInFlight(fn, kind?)`
- `start()` — Connects to the MQTT broker and subscribes to this instance's command response topic.
- `startActiveSpan(name, opts, context, fn)` — Start a child span for opentelemetry tracking
- `unregisterCommand(address)` — Unsubscribes a command handler topic and removes it from the local router.
- `unregisterStream(_address)` — Unregister a service stream
- `unregisterSubscription(address)` — Unsubscribes and removes a registered subscription handler.
- `waitForInFlightDrain(timeoutMs?)`
- `wrapInSpan(name, opts, fn, context?)` — Start span for opentelemetry tracking on same level.

