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
- hard to handle dead letters
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

The MQTT protocol relays on topics for message publishing/subscribe.

PURISTA is using the following schema for topics:

```typescript
const topicPrefix = config.topicPrefix
const empty = config.emptyTopicPartString

const path join(
  topicPrefix,
  convertToSnakeCase(message.messageType),
  convertToSnakeCase(message.instanceId),
  convertToSnakeCase(message.principalId || empty),
  convertToSnakeCase(message.sender.serviceName),
  convertToSnakeCase(message.sender.serviceVersion),
  convertToSnakeCase(message.sender.serviceTarget),
  convertToSnakeCase(message.eventName || empty),
  convertToSnakeCase((message as Command).receiver?.serviceName || empty),
  convertToSnakeCase((message as Command).receiver?.serviceVersion || empty),
  convertToSnakeCase((message as Command).receiver?.serviceTarget || empty),
)
```

This allows to have subscriptions for very specific messages.  
The MQTT 5 topic alias feature is used for mapping a message to the correlating subscription.  

For command responses, a specific topic pattern is used.  
The response topic for a command is provided via the MQTT 5 response topic field.

```typescript
const responseTopic = join(config.topicPrefix, 'response', convertToSnakeCase(commandResponseReceiverInstanceId))
```

### Shared subscriptions

Subscriptions are per default MQTT 5 shared subscriptions.  
Shared subscriptions in MQTT are simple to use. It only requires prefixing the topic with `$share` and a shared subscription name (pubsub name).

To align these settings, the configuration provides `shareTopicPrefix` which defaults to `$share` and should work on most of the brokers.  
If the broker might require some different prefix, you can align it here.  
The `shareTopicName` can be used to set a custom name for your shared subscriptions to prevent name collisions or to use a broker, which is a multi-tenant broker.

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

Command responses are published with the command settings from the event bridge command configuration.  
This means, the `qosCommand` and `defaultCommandTimeout` values are used, and the response can be returned as fast as possible.  
The command response message is published to a topic, which is not used by subscriptions.  
To be able to subscribe to command responses, the MQTT event bridge can automatically publish the command response to the regular topic pattern.  
These messages will use the `qoSSubscription` and `defaultMessageExpiryInterval` settings.  
The MQTT event bridge configuration contains a setting `commandResponsePublishTwice` which can be set to `always`, `eventOnly`, `eventAndError`, or `never`.  
It defaults to `eventOnly`.  

- `always` (not recommended) means, that every response is published a second time to the regular topic pattern. This might result in high resource consumption, as the broker will store messages which most likely will never be consumed by someone, at least for the time of setting `defaultMessageExpiryInterval`.

- `eventOnly` (default) means, that only response messages with `eventName` set to an event name, are published a second time. It is most likely, that these messages are consumed by someone, as they are flagged as events.

- `eventAndError` means, the same as `eventOnly`. In addition, error responses are also published a second time. This might be helpful, especially during development and debugging or for use cases where you like to track errors via MQTT messages.

- `never` (not recommended) disables publishing the command responses a second time. This means, that you will not be able to subscribe to command responses correctly. This is only useful if you don't have any subscriptions

::: warning Ensure settings across instances
Remember to ensure, that QOS, prefixes, and so on are the same on every event bridge instance.  
Otherwise, you might get some unexpected behaviour.
:::

::: tip OpenTelemetry
PURISTA is using the MQTT 5 user properties feature to add the OpenTelemetry information to each message, as recommended:  
[https://w3c.github.io/trace-context-mqtt/](https://w3c.github.io/trace-context-mqtt/)
:::
