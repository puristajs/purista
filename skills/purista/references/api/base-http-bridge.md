# @purista/base-http-bridge API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/base-http-bridge`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [HttpEventBridge](#httpeventbridge)

## HttpEventBridge

**class.** Generic HTTP-based event bridge for runtimes that deliver PURISTA messages over HTTP. Source: `base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:85`.

**Verified example**

```ts
// Usually use a concrete adapter such as `DaprEventBridge`. Adapter authors
// provide an HttpEventBridgeClient that translates PURISTA traffic for their platform.
const bridge = new HttpEventBridge(
  { name: 'platform-bridge', serve, serverPort: 8080 },
  platformClient,
)
await bridge.start()
```

**Public callable patterns**

- `destroy()` — Shut down event bridge as gracefully as possible
- `emitMessage(message)` — Publishes an event message through the configured HTTP client.
- `getInFlightExecutionCount()` — Number of currently running handlers across all work kinds.
- `getInFlightExecutionCounts()` — Number of currently running handlers grouped by work kind.
- `getPausedSubscriptionConsumers()` — Returns paused subscription consumer states keyed by adapter registration key.
- `getTracer()` — Returns open telemetry tracer of this service
- `invoke(input, ttl?)` — Invokes a PURISTA command over HTTP and returns the command payload.
- `isHealthy()` — Reports whether the bridge is started and its sidecar/platform client is reachable.
- `isReady()` — Reports whether the bridge can accept new HTTP requests.
- `openStream(_input, _ttl?)` — Open a stream invocation.
- `registerCommand(address, cb, metadata, eventBridgeConfig)` — Registers the internal command endpoint, plus an optional REST projection.
- `registerStream(_address, _cb, _metadata, _eventBridgeConfig)` — Register a service stream handler for a service target.
- `registerSubscription(subscription, cb)` — Registers a subscription endpoint before the HTTP server starts.
- `resumeSubscriptionConsumer(_registrationKey)` — Resumes a paused subscription consumer by registration key.
- `runInFlight(fn, kind?)`
- `start()` — Starts the Hono server and registers common middleware and the `/healthz` route.
- `startActiveSpan(name, opts, context, fn)` — Start a child span for opentelemetry tracking
- `unregisterCommand(address)` — Placeholder for transport-specific command unregistration.
- `unregisterStream(_address)` — Unregister a service stream
- `unregisterSubscription(address)` — Placeholder for transport-specific subscription unregistration.
- `waitForInFlightDrain(timeoutMs?)`
- `wrapInSpan(name, opts, fn, context?)` — Start span for opentelemetry tracking on same level.

