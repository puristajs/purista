---
title: MQTT Event Bridge
description: Use the MQTT event bridge of PURISTA
order: 301030
---

![AMQP event bridge](/graphic/mqtt_event_bridge_header.png)

# MQTT Event Bridge

MQTT with the popular [mosquitto broker](https://mosquitto.org) is one of the most mature and widely used messaging protocols.

The MQTT protocol version 5 has some interesting additions, like shared subscriptions, session ttl, message ttl and response fields. This reduces the gap between available broker features and our needs.

PURISTA provides the `@purista/mqttbridge`

::: tip Pros

- allows scaling
- fault tollerant
- MQTT is a mature protocol and widely used (IoT/edge)
:::

::: warning Cons

- needs managing of an MQTT broker
- only MQTT 5 is supported
- hard to handle dead letters
:::

## Configuration

The MQTT event bridge uses the unified configuration schema as all event bridges.

::: info API documentation

- [General event bridge config](../../../api/modules/purista_core.html#eventbridgeconfig)
- [MQTT bridge config](../../../api/modules/purista_mqttbridge.html#mqttbridgeconfig)
:::

## Usage example

```typescript
import { MqttBridge } from '@purista/mqttbridge'

const eventBridge = new MqttBridge()
await eventBridge.start()

```

## Topic names

The MQTT protocol relays on topics for message publishing/subscribe.

PURISTA is using the following schema for topics:

```typescript
const topicPrefix = config.topicPrefix
const empty = config.emptyTopicPartString

const path join(
  topicPrefix,
  convertToSnakeCase(message.messageType),
  convertToSnakeCase(message.principalId || empty),
  convertToSnakeCase(message.tenantId || empty),
  convertToSnakeCase(message.sender.instanceId),
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
The MQTT 5 topic alias feature is used for mapping a message to the correlating subscription.

### Shared subscriptions

Subscriptions are per default MQTT 5 shared subscriptions.
Shared subscriptions in MQTT are simple to use. It only requires prefixing the topic with `$share` and a shared subscription name (pubsub name).

::: caution Be aware
The shared subscription name (pubsub name) must differ from the topic prefix. Otherwise shared subscriptions are not working (at least in mosquitto).
`$share/purista/purista/...` does not work, while `$share/purista_group/purista/...` is working
:::

To align these settings, the configuration provides `shareTopicPrefix` which defaults to `$share` and should work on most of the brokers.
If the broker might require some different prefix, you can align it here.
The `shareTopicName` can be used to set a custom name for your shared subscriptions to prevent name collisions or to use a broker, which is a multi-tenant broker. It defaults to `sharedpurista`.

## Message timeouts, QOS, and subscriptions

The configuration for the `MqttEventBridge` differentiates between command & command responses and subscriptions.

Commands and command responses are basically short-living messages, which are only needed for the time a command is requested, executed and the result is returned.
The timeout handling of invocations will be triggered, if commands can't be handled within the given time.
Because of this, we can set command requests and responses to lower QOS and set a low MQTT message expiry time.
This will reduce resource consumption and prevent the broker from storing unnecessary data for a long time.

You can use the MQTT event bridge config options `qosCommand` and `defaultCommandTimeout` to align it to your needs.

On the other hand, subscriptions will need to receive every subscribed message at least once, and they can run at any time.
To prevent timing issues, a few things will automatically happen.

If a command request has the `eventName` field set as an event name, the command request will be published with the `defaultMessageExpiryInterval` message expiry time.  Otherwise, the `defaultCommandTimeout` is used, which is most likely a much smaller value.
Also, the QOS level is set to the higher value of `qosCommand` or `qoSSubscription`. The value of `qoSSubscription` will most likely be the same or a higher value than `qosCommand`.
This will ensure subscriptions are getting the command request message - if an event name is set.
Command responses will have the same behavior.

## Hints

::: warning Ensure settings across instances
Remember to ensure, that QOS, prefixes, and so on are the same on every event bridge instance.
Otherwise, you might get some unexpected behaviors.
:::

::: tip OpenTelemetry
PURISTA is using the MQTT 5 user properties feature to add the OpenTelemetry information to each message, as recommended:
[https://w3c.github.io/trace-context-mqtt/](https://w3c.github.io/trace-context-mqtt/).
:::

## Brokers and tools

- [Eclipse Mosquitto™](https://mosquitto.org/)
- [NanoMQ](https://www.emqx.com/en/products/nanomq) and a MQTT UI [MQTTX](https://www.emqx.com/en/products/mqttx)
- [HiveMQ](https://www.hivemq.com/)
- [VerneMQ](https://vernemq.com/)
- [ActiveMQ](https://activemq.apache.org/)
