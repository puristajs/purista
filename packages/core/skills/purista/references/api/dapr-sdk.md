# @purista/dapr-sdk API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/dapr-sdk`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [DaprEventBridge](#dapreventbridge)
- [DaprConfigStore](#daprconfigstore)
- [DaprSecretStore](#daprsecretstore)
- [DaprStateStore](#daprstatestore)

## DaprEventBridge

**class.** Event bridge that connects PURISTA services to the local Dapr sidecar. Source: `dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:45`.

**Verified example**

```typescript
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'

const eventBridge = new DaprEventBridge({
   serve,
 })

// start the services first ...

await eventBridge.start()
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
- `registerSubscription(subscription, cb)` — Registers a PURISTA subscription and exposes it to Dapr Pub/Sub discovery.
- `resumeSubscriptionConsumer(_registrationKey)` — Resumes a paused subscription consumer by registration key.
- `runInFlight(fn, kind?)`
- `start()` — Registers Dapr discovery routes and starts the HTTP event bridge.
- `startActiveSpan(name, opts, context, fn)` — Start a child span for opentelemetry tracking
- `unregisterCommand(address)` — Placeholder for transport-specific command unregistration.
- `unregisterStream(_address)` — Unregister a service stream
- `unregisterSubscription(address)` — Placeholder for transport-specific subscription unregistration.
- `waitForInFlightDrain(timeoutMs?)`
- `wrapInSpan(name, opts, fn, context?)` — Start span for opentelemetry tracking on same level.

## DaprConfigStore

**class.** Config store adapter backed by Dapr configuration components. Source: `dapr-sdk/src/DaprConfigStore/DaprConfigStore.impl.ts:28`.

**Verified example**

```ts
const configStore = new DaprConfigStore({
  configStoreName: 'application-config',
  clientConfig: { daprHost: 'http://127.0.0.1', daprPort: '3500' },
})
const { featureEnabled } = await configStore.getConfig('featureEnabled')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getConfig(...configNames)` — Returns the values for given config properties.
- `getConfigImpl(...configNames)` — Reads one or more configuration values from the configured Dapr component.
- `removeConfig(configName)` — Removes the config item given by config name.
- `removeConfigImpl(_configName)` — Dapr configuration removal is not implemented by this adapter.
- `setConfig(configName, configValue)` — Sets a config value.
- `setConfigImpl(_configName, _configValue)` — Dapr configuration mutation is not implemented by this adapter.

## DaprSecretStore

**class.** Secret store adapter backed by a Dapr secret component. Source: `dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:27`.

**Verified example**

```ts
const secretStore = new DaprSecretStore({
  secretStoreName: 'application-secrets',
  clientConfig: { daprHost: 'http://127.0.0.1', daprPort: '3500' },
})
const { databasePassword } = await secretStore.getSecret('databasePassword')
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getSecret(...secretNames)` — Get one or more secrets by name.
- `removeSecret(secretName)` — Remove one secret by name.
- `setSecret(secretName, secretValue)` — Store or replace one secret value.

## DaprStateStore

**class.** State store adapter backed by a Dapr state component. Source: `dapr-sdk/src/DaprStateStore/DaprStateStore.impl.ts:29`.

**Verified example**

```ts
const stateStore = new DaprStateStore({
  stateStoreName: 'application-state',
  supportsTtl: true,
  clientConfig: { daprHost: 'http://127.0.0.1', daprPort: '3500' },
})
await stateStore.setState('invoice-42', { status: 'open' })
```

**Public callable patterns**

- `destroy()` — Shutdown hook for store adapters.
- `getState(...stateNames)` — Get one or more state values by name.
- `removeState(stateName)` — Remove one state value by name.
- `setState(stateName, stateValue, options?)` — Store or replace one state value.

