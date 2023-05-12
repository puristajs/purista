---
order: 40
title: MQTT event bridge
shortTitle: MQTT
description: MQTT event bridge
tag:
  - event bridge
  - MQTT
  - mosquitto
image: https://purista.dev/graphic/mqtt_event_bridge_header.png
cover: https://purista.dev/graphic/mqtt_event_bridge_header.png
---

![AMQP event bridge](/graphic/mqtt_event_bridge_header.png)

## General

MQTT with the popular [mosquitto broker](https://mosquitto.org) is one of the most mature and widely used messaging protocols.  

The MQTT protocol version 5 has some interesting additions, like shared subscriptions, session ttl, message ttl and response fields. This reduces the gap between available broker features and our needs.

PURISTA provides the `@purista/mqttbridge`

::: tip Pros

- allows scaling
- fault tollerant
- MQTT is a mature protocol and widely used (IoT/edge)
:::

::: danger Cons

- needs managing of an MQTT broker
- only MQTT 5 is supported
- command responses are emitted as 2 messages
:::

## Config

The MQTT event bridge uses the unified configuration schema as all event bridges.  

::: info API documentation

- [General event bridge config](../../api/modules/purista_core.html#eventbridgeconfig)
- [MQTT bridge config](../../api/modules/purista_mqttbridge.html#mqttbridgeconfig)
:::

## Example

```typescript
import { MqttBridge } from '@purista/mqttbridge'

const eventBridge = new MqttBridge()
await eventBridge.start()

```

## Topic names

The MQTT protocol relays on topics for message publish/subscribe.

PURISTA is using the following schema for topics:

## Message timeouts, QOS and subscriptions

Handling of messages which