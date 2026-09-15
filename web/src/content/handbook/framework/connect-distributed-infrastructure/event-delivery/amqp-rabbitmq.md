---
title: Deliver events through AMQP and RabbitMQ
description: Enable the AMQP EventBridge with broker-backed queues, acknowledgements, and application-owned payload protection.
order: 712
---

```bash title="Install @purista/amqpbridge"
npm install @purista/amqpbridge
```

Provision an AMQP broker with headers-exchange support and a TLS/authenticated connection. Then create and start the bridge before services:

```ts title="src/index.ts"
import { AmqpBridge } from '@purista/amqpbridge'

const eventBridge = new AmqpBridge({
  url: process.env.AMQP_URL,
  exchangeName: 'purista',
})
await eventBridge.start()
```

Durable command/subscription consumers rely on durable queues and manual acknowledgements. Configure a dead-letter exchange where operations need repair/replay. The default payload encrypter is pass-through: protect sensitive data with transport TLS and an application-provided encrypter or avoid placing it in messages. Verify broker connection, exchange/queue provisioning, a consumed event, and a consumer failure before production.

## Configure the broker contract

| Option | Default | Effect and decision |
| --- | --- | --- |
| `url` | `amqp://localhost` | Broker URL or amqplib connection options. Use TLS/authentication and do not place credentials in source. |
| `exchangeName` / `namePrefix` | `purista` / `purista` | Headers-exchange and generated queue namespace; treat either change as a coordinated topology migration. |
| `exchangeOptions` / `socketOptions` | unset | Pass broker assertion/socket settings only when owned by your platform contract. |
| `prefetch` | `10` | Maximum unacknowledged messages per manual-ack consumer channel; lower it to protect slow or memory-heavy handlers. |
| `deadLetterExchangeName` / `deadLetterRoutingKey` | unset | Required topology details for repair/replay; provision and test them before relying on dead-letter outcomes. |
| `encoder` | JSON encoder | Add a content-type encoder only for a verified interoperability need. |
| `encrypter` | pass-through | Add an application-owned encrypter for sensitive payloads; TLS alone does not encrypt broker storage. |

AMQP currently does not advertise PURISTA stream support. Service startup rejects
a registered stream on this bridge; separate durable work and retrieval from a
live stream design.

Next: [chapter overview](/handbook/framework/connect-distributed-infrastructure/event-delivery/).
