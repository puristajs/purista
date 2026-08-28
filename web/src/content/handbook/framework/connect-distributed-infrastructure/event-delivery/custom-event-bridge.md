---
title: Build a custom EventBridge
description: Implement a transport adapter only when the supported bridges do not meet the deployment boundary, and report its real behavior through capabilities.
order: 717
---

Build a custom `EventBridge` when a required transport is not covered by the
included, AMQP, NATS, MQTT, or Dapr adapters. This is infrastructure work, not
a service extension: the adapter owns transport connection, addressing,
registration, request/reply correlation, consumer recovery, and shutdown.

Start from `EventBridgeBaseClass`. It gives the adapter a logger, tracing,
framework metrics, in-flight tracking, a default 30-second command timeout,
and a conservative capability matrix. It does **not** implement broker routing
or make unsupported guarantees true.

```ts title="src/infrastructure/bridge/AcmeEventBridge.ts"
import {
  EventBridgeBaseClass,
  EventBridgeCommandTransport,
  EventBridgeResponseConfirmationLevel,
  type EventBridgeConfig,
} from '@purista/core'

type AcmeBridgeOptions = {
  connection: { endpoint: string }
}

export abstract class AcmeEventBridgeBase extends EventBridgeBaseClass<AcmeBridgeOptions> {
  constructor(config: EventBridgeConfig<AcmeBridgeOptions>) {
    super('AcmeEventBridge', config)

    this.capabilities = {
      ...this.capabilities,
      durableCommands: true,
      durableSubscriptions: true,
      manualAckSupported: true,
      commandHandling: {
        transport: EventBridgeCommandTransport.RequestReply,
        pendingInvocationCancellation: true,
        responseConfirmation: EventBridgeResponseConfirmationLevel.BrokerConfirm,
        strictMode: true,
      },
    }
  }

}
```

This abstract base configures only the shared observability and capability
contract. A concrete subclass must implement the complete `EventBridge`
interface before it can be passed to a service. A partly implemented bridge can
acknowledge a command, lose a response, or claim durable delivery without a
recoverable consumer; it is not a production bridge. Use the generated
[Framework API reference](/handbook/api/) as the typed method surface while
implementing it.

## Implement the complete transport boundary

| Contract family | Required methods | Adapter responsibility |
| --- | --- | --- |
| Lifecycle and health | `start`, `isReady`, `isHealthy`, `destroy` | Connect before accepting work, expose a meaningful health signal, stop consumers and release provider resources. |
| Command routing | `invoke`, `registerCommand`, `unregisterCommand` | Publish a correlated request, enforce the invocation TTL, route one success/error response, and handle a late response as advertised. |
| Streams | `openStream`, `registerStream`, `unregisterStream` | Implement only when incremental frames, final delivery, cancellation, draining, and late frames can all follow the declared stream capabilities. |
| Events and subscriptions | `emitMessage`, `registerSubscription`, `unregisterSubscription` | Serialize the full message envelope, recover registrations after reconnect, and preserve the declared acknowledgement and failure model. |
| Operator controls | `getInFlightExecutionCount`, `getInFlightExecutionCounts`, `getPausedSubscriptionConsumers`, `resumeSubscriptionConsumer` | Report the runtime state truthfully; do not return empty state when the adapter can pause or strand a consumer. |

`registerCommand` receives the target address, handler callback, definition
metadata, and definition-level bridge configuration. `registerStream` receives
the equivalent stream address, callback, metadata, and configuration.
`registerSubscription` receives the complete subscription definition and its
callback. Preserve those values: they carry the service contract and the
requested delivery policy, rather than being optional broker decoration.

## Capabilities are a promise to service startup

PURISTA uses `capabilities` to reject definitions that require guarantees your
adapter cannot meet. Begin with the base class's conservative defaults and
override only behavior backed by the provider and your implementation.

| Do report `true` only when | Do not infer it from |
| --- | --- |
| `durableCommands` or `durableSubscriptions`: accepted work survives the relevant restart/reconnect boundary | A broker name or a queue that exists only for a response |
| `manualAckSupported`: the subscription callback's acknowledgement decision changes provider delivery | A local `try`/`catch` after the provider has already acked |
| `supportsStreams` and stream sub-capabilities: frames, final result, cancellation, timeout, and drain paths operate end to end | A transport that can publish a series of messages but has no stream session/cancellation contract |
| `consumerFailureHandling.*`: the selected retry, delay, DLQ, pause, or fatal action actually changes delivery | Logging a failure or retrying the callback in memory |
| `strictMode`: unsupported definition policies make startup fail | A best-effort fallback that silently weakens a definition |

`exactly-once` is not an EventBridge capability. Even a durable command or
subscription can be delivered more than once around a crash. Keep the
business side effect idempotent in the service/worker.

## Wire and verify the adapter

After the concrete adapter implements `EventBridge`, construct and start it at
the composition root before constructing each service that receives it. A
separate process constructs and starts its own bridge instance before starting
its services. Do not use the abstract base as a runtime bridge.

Use a real provider test environment for the adapter, not only an in-memory
mock. Verify a command round trip and timeout, reconnect and registration
recovery, a subscription failure for each advertised recovery mode, shutdown
drain, and every capability set to `true`. Also test the negative path: a
service that requires an unsupported stream or consumer-failure feature must
fail at startup in strict mode.

Do not place credentials, raw messages, prompts, or tenant identifiers in
bridge logs, traces, metrics, or dead-letter reasons. Keep provider-specific
configuration, least-privilege identity, and broker monitoring with the
adapter package or deployment guide.

Next: return to [Event delivery](/handbook/framework/connect-distributed-infrastructure/event-delivery/) or choose a supported [EventBridge adapter](/handbook/framework/reference/adapter-compatibility/).
