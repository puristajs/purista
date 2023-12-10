---
order: 70
title: NATS
shortTitle: NATS
description: NATS
tag:
  - event bridge
  - EventBridge
  - NATS
image: https://purista.dev/graphic/nats_event_bridge_header.png
---

![NATS event bridge](/graphic/nats_event_bridge_header.png)

## General

The [NATS message broker](https://nats.io/) is a fast and scalable message broker.

PURISTA provides the `@purista/natsbridge`

::: tip Pros

- allows scaling
- fault tollerant
- can be used with NATS State store (`@purista/nats-state-store`)
- can be used with NATS Config store (`@purista/nats-config-store`)
:::

::: caution Cons

- needs managing of an NATS broker
- no persistance of messages available
- hard to handle dead letters
:::

## Config

The NATS event bridge uses the unified configuration schema as all event bridges.  

::: info API documentation

- [General event bridge config](../../api/modules/purista_core.html#eventbridgeconfig)
- [NATS bridge config](../../api/modules/purista_natsbridge.html#natsbridgeconfig)
:::

## Example

```typescript
import { NatsBridge } from '@purista/natsbridge'

const eventBridge = new NatsBridge()
await eventBridge.start()

```

## Topic names

The NATS protocol relays on topics for message publishing/subscribe.

PURISTA is using the following schema for topics:

```typescript
const topicPrefix = config.topicPrefix
const empty = config.emptyTopicPartString

const path join(
  this.config.topicPrefix,
  convertToSnakeCase(message.messageType),
  convertToSnakeCase(message.principalId || empty),
  convertToSnakeCase(message.tenantId || empty),
  convertToSnakeCase(message.sender.instanceId || empty),
  convertToSnakeCase(message.sender.serviceName),
  convertToSnakeCase(message.sender.serviceVersion),
  convertToSnakeCase(message.sender.serviceTarget),
  convertToSnakeCase(message.eventName || empty),
  convertToSnakeCase((message as Command).receiver?.instanceId || empty),
  convertToSnakeCase((message as Command).receiver?.serviceName || empty),
  convertToSnakeCase((message as Command).receiver?.serviceVersion || empty),
  convertToSnakeCase((message as Command).receiver?.serviceTarget || empty),
)
```

This allows to have subscriptions for very specific messages.  
The NATS event bridge does not use the available request-response pattern of NATS to be able to use the unified topic schema.  
Otherwise, there would be the need to duplicate command response to be available for subscriptions.

## Hints

::: warning Ensure settings across instances
Remember to ensure, prefixes, and so on are the same on every event bridge instance.  
Otherwise, you might get some unexpected behaviors.
:::

::: tip OpenTelemetry
PURISTA is using the NATS header feature to add the OpenTelemetry information to each message, as recommended:  
[https://w3c.github.io/trace-context-mqtt/](https://w3c.github.io/trace-context-mqtt/).
:::

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
