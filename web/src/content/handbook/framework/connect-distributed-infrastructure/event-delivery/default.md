---
title: Use the default EventBridge
description: Use the included in-process bridge for local development and deterministic service tests.
order: 711
---

`DefaultEventBridge` is included in `@purista/core`. It requires no package, network, or broker and is the safe starting point for a single-process project.

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()
```

Start services after `start()`. `isReady()` becomes true after start and
`isHealthy()` reports the in-process transport state; neither proves any
external system because this adapter has none.

## Know exactly what the local bridge proves

| Capability | Default EventBridge behavior |
| --- | --- |
| Commands | In-memory request/response with local pending-invocation cancellation; no broker confirmation or restart durability |
| Events/subscriptions | Process-local fan-out; no durable subscription, manual acknowledgement, retry, delayed retry, pause/resume, or dead letter |
| Streams | Incremental frames, consumer cancellation, aggregate final, and graceful drain in the same process |
| Late results | Late command responses and stream frames are ignored with a warning after timeout |
| Shutdown | Tracks in-flight work and supports graceful drain, but process termination loses all registrations and messages |

It does not distribute messages between processes or provide broker-backed
recovery. Replace it before a deployment requires independent service
instances, durable subscribers, or external interoperability.

## Configure only local transport concerns

```ts title="src/eventbridge.ts"
import { DefaultEventBridge } from '@purista/core'

export const eventBridge = new DefaultEventBridge({
  logger,
  defaultCommandTimeout: 5_000,
  logWarnOnMessagesWithoutReceiver: true,
})
```

| Option | Default | Use |
| --- | --- | --- |
| `defaultCommandTimeout` | `30_000` ms | Bound invocations that do not set a more specific timeout. A late response is ignored and warned. |
| `logWarnOnMessagesWithoutReceiver` | `true` | Keep enabled while finding missing local subscriptions; disable only when intentionally unconsumed events would create known noise. |
| `logger` / `logLevel` | Framework logger/default | Share the application's structured logger or select its fallback level. |
| `spanProcessor` / `metrics` | Unset | Connect process-local tracing and metrics at the composition root. |
| `instanceId` | Generated | Set a stable diagnostic ID only when the local deployment requires it. |

Its stream support does not make the same definition production-ready on a
different bridge: AMQP, NATS, MQTT, and Dapr currently reject PURISTA streams.
Run command, event, cancellation, timeout, and drain tests here, then verify the
selected real adapter separately before relying on its delivery guarantees.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/event-delivery/).
