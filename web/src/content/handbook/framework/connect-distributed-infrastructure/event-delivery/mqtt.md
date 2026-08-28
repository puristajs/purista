---
title: Deliver events through MQTT
description: Enable MQTT 5 transport for IoT-oriented pub/sub while owning retry and recovery outside the bridge.
order: 714
---

```bash title="Install @purista/mqttbridge"
npm install @purista/mqttbridge
```

The MQTT bridge requires an MQTT 5-capable broker and uses JSON payloads plus MQTT user properties for PURISTA and OpenTelemetry metadata.

```ts title="src/index.ts"
import { MqttBridge } from '@purista/mqttbridge'

const eventBridge = new MqttBridge({
  protocolVersion: 5,
  host: process.env.MQTT_HOST,
  topicPrefix: 'incident',
})
await eventBridge.start()
```

QoS improves transport delivery but does not provide the bridge's broker-managed retry, DLQ, or durable consumer guarantees. Use a separate durable queue/workflow design when those are requirements. Provision TLS/client credentials and test reconnect, retained/session behavior, and duplicate handling before production.

## Tune the MQTT client only with an operational reason

`MqttBridge` requires MQTT 5 and merges its defaults with MQTT.js client
options. The bridge derives `clientId` from `instanceId` when one is not supplied.

| Option | Default | Decision |
| --- | --- | --- |
| `topicPrefix` | `purista` | Scope topics per application/environment. |
| `shareTopicPrefix` / `shareTopicName` | `$share` / `sharedpurista` | Shared-subscription group naming; change only with a coordinated consumer rollout. |
| `qosCommand` / `qoSSubscription` | `1` / `1` | Transport at-least-once delivery still requires idempotent handlers. |
| `defaultSessionExpiryInterval` / `defaultMessageExpiryInterval` | 30 days / 30 days | Broker-side session/message retention budget, not a PURISTA retry policy. |
| `clean`, `resubscribe`, `allowRetries` | `true`, `true`, `true` | Local-friendly reconnect behavior; set an explicit persistent session policy for production. |
| `keepalive`, `reconnectPeriod`, `connectTimeout` | 10 seconds, 1,000 ms, 30,000 ms | Tune only from observed network/broker behavior. |

MQTT currently has no PURISTA stream capability. A service containing a stream
cannot register against this bridge; use a queue-backed result flow for
distributed work that would otherwise stream.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/event-delivery/).
