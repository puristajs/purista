[**@purista/natsbridge v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/natsbridge](../README.md) / getDefaultNatsBridgeConfig

# Function: getDefaultNatsBridgeConfig()

> **getDefaultNatsBridgeConfig**(): `object`

Defined in: [natsbridge/src/getDefaultNatsBridgeConfig.ts:4](https://github.com/puristajs/purista/blob/master/packages/natsbridge/src/getDefaultNatsBridgeConfig.ts#L4)

## Returns

`object`

### commandResponsePublishTwice

> **commandResponsePublishTwice**: `"always"` \| `"eventOnly"` \| `"eventAndError"` \| `"never"`

Indicates if a command response should be published a second time.
If the command response gets published, it will be published to the regular topic pattern.

If set to `never`, subscription might not get messages they are expecting because of the timing.

If set to `always`, every command response is published.
Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached.
This might result in a high resource consumption of the broker.

If set to `eventOnly`, only success responses which have a event name set, are published twice.
There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time.

#### Default

```ts
eventOnly
```

### defaultMessageExpiryInterval

> **defaultMessageExpiryInterval**: `number`

the message expiry interval in seconds

#### Default

```ts
30 days in seconds
```

### emptyTopicPartString

> **emptyTopicPartString**: `string`

The string which should be used in topics for parts, which are undefined

#### Default

```ts
__none__
```

### maxMessages

> **maxMessages**: `number`

maximum messages to run in parallel per subscription
10 means, each subscription can handle 10 calls at the same time

#### Default

```ts
10
```

### topicPrefix

> **topicPrefix**: `string`

the prefix for topic to prevent name collisions

#### Default

```ts
purista
```
