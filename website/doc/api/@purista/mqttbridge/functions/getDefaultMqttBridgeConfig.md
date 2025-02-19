[**@purista/mqttbridge v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / getDefaultMqttBridgeConfig

# Function: getDefaultMqttBridgeConfig()

> **getDefaultMqttBridgeConfig**(): `object`

Defined in: [mqttbridge/src/getDefaultMqttBridgeConfig.impl.ts:5](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/getDefaultMqttBridgeConfig.impl.ts#L5)

## Returns

`object`

### allowRetries?

> `optional` **allowRetries**: `boolean`

allow retry of the initial connect

### defaultMessageExpiryInterval

> **defaultMessageExpiryInterval**: `number`

the message expiry interval in seconds

#### Default

```ts

```

### defaultSessionExpiryInterval

> **defaultSessionExpiryInterval**: `number`

#### Default

```ts
0
```

### emptyTopicPartString

> **emptyTopicPartString**: `string`

The string which should be used in topics for parts, which are undefined

#### Default

```ts
__none__
```

### qosCommand

> **qosCommand**: `QoS`

QOS for command, command responses and command response subscriptions messages

#### Default

```ts
1
```

### qoSSubscription

> **qoSSubscription**: `QoS`

QOS for all subscriptions

#### Default

```ts
1
```

### shareTopicName

> **shareTopicName**: `string`

the name of the shared topic (similar to pubsub name)

#### Default

```ts
sharedpurista
```

### shareTopicPrefix

> **shareTopicPrefix**: `string`

the prefix to be used to dynamically create topic names for shared subscriptions

#### Default

```ts
$share
```

### topicPrefix

> **topicPrefix**: `string`

the prefix for topic to prevent name collisions

#### Default

```ts
purista
```
