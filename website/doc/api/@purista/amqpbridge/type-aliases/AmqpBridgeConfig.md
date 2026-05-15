[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / AmqpBridgeConfig

# Type Alias: AmqpBridgeConfig

> **AmqpBridgeConfig** = `object`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:11](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L11)

AmqpBridge bridge config

## See

[amqplib documentation](https://amqp-node.github.io/amqplib/)

## Properties

### deadLetterExchangeName?

> `optional` **deadLetterExchangeName?**: `string`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:21](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L21)

optional dead letter exchange name used for durable command/subscription queues

***

### deadLetterRoutingKey?

> `optional` **deadLetterRoutingKey?**: `string`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:23](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L23)

optional dead letter routing key used for durable command/subscription queues

***

### encoder?

> `optional` **encoder?**: [`Encoder`](Encoder.md)

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:29](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L29)

the encoder(s) to be used for AMQP messages

#### Default

```ts
jsonEncoder
```

***

### encrypter?

> `optional` **encrypter?**: [`Encrypter`](Encrypter.md)

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:31](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L31)

the encrypter(s) to be used for AMQP messages

#### Default

```ts
plain
```

***

### exchangeName?

> `optional` **exchangeName?**: `string`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:13](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L13)

the AMQP exchage name to be used

#### Default

```ts
purista
```

***

### exchangeOptions?

> `optional` **exchangeOptions?**: `Options.AssertExchange`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:17](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L17)

the AMQP exchange options

***

### namePrefix?

> `optional` **namePrefix?**: `string`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:15](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L15)

the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request

#### Default

```ts
purista
```

***

### prefetch?

> `optional` **prefetch?**: `number`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:19](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L19)

max unacked messages per consumer channel

***

### socketOptions?

> `optional` **socketOptions?**: `unknown`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:27](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L27)

socket options

***

### url?

> `optional` **url?**: `string` \| `Options.Connect`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:25](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L25)

the AMQP broker url

#### Default

```ts
amqp://localhost
```
