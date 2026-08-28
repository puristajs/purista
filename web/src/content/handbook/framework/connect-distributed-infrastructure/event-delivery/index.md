---
title: Event delivery
description: Choose an EventBridge for commands, events, subscriptions, and streams across the required runtime boundary.
order: 710
---

An EventBridge carries command invocation, command responses, custom events, subscriptions, and stream traffic. The selected bridge determines which durability, retry, ordering, and failure guarantees are actually available.

| Bridge | Availability | Choose when | Important limit |
| --- | --- | --- | --- |
| Default | Included in core | Local development/tests, including incremental streams | Single process; no distributed durability |
| AMQP | `@purista/amqpbridge` + broker | RabbitMQ/AMQP operations with durable commands/subscriptions | No PURISTA stream support; protect payloads because the default encrypter is pass-through |
| NATS | `@purista/natsbridge` + NATS | JetStream-backed durable subscriptions | No PURISTA stream support; require JetStream/strict mode for durable guarantees |
| MQTT | `@purista/mqttbridge` + MQTT 5 broker | IoT/pub-sub integration | No PURISTA stream support or broker-managed retry/DLQ durable-consumer guarantees |
| Dapr | `@purista/dapr-sdk` + sidecar | Platform-managed pub/sub and invocation | No PURISTA stream support; sidecar/components are required |
| Custom | Application-owned adapter | A provider with a complete verified PURISTA transport implementation | You own routing, recovery, capabilities, and operational support |

Start and health-check the bridge before creating services. Test a real round trip, consumer failure, and recovery behavior against the selected adapter—not only against the core mock.

## Decide stream support before designing a public stream

At present, only `DefaultEventBridge` advertises PURISTA incremental stream and
aggregate-final support. AMQP, NATS, MQTT, and the Dapr EventBridge advertise
`supportsStreams: false`; registering a service that contains a stream fails at
startup with a capability error. An HTTP server does not remove that constraint:
it can project only a stream that its service EventBridge can register. For a
distributed deployment, use a queue plus a persisted result/updates until a
selected EventBridge explicitly supports streams.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/).

When a supported adapter does not fit, see [Build a custom EventBridge](/handbook/framework/connect-distributed-infrastructure/event-delivery/custom-event-bridge/). Do not start a custom adapter solely to rename or lightly wrap a supported one.
