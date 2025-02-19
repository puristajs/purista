[**@purista/amqpbridge v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/amqpbridge](../README.md) / AmqpBridgeConfig

# Type Alias: AmqpBridgeConfig

> **AmqpBridgeConfig**: `object`

Defined in: [amqpbridge/src/types/AmqpBridgeConfig.ts:11](https://github.com/puristajs/purista/blob/master/packages/amqpbridge/src/types/AmqpBridgeConfig.ts#L11)

AmqpBridge bridge config

## Type declaration

### encoder?

> `optional` **encoder**: [`Encoder`](Encoder.md)

the encoder(s) to be used for AMQP messages

#### Default

```ts
jsonEncoder
```

### encrypter?

> `optional` **encrypter**: [`Encrypter`](Encrypter.md)

the encrypter(s) to be used for AMQP messages

#### Default

```ts
plain
```

### exchangeName?

> `optional` **exchangeName**: `string`

the AMQP exchage name to be used

#### Default

```ts
purista
```

### exchangeOptions?

> `optional` **exchangeOptions**: `Options.AssertExchange`

the AMQP exchange options

### namePrefix?

> `optional` **namePrefix**: `string`

the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request

#### Default

```ts
purista
```

### socketOptions?

> `optional` **socketOptions**: `any`

socket options

### url?

> `optional` **url**: `string` \| `Options.Connect`

the AMQP broker url

#### Default

```ts
amqp://localhost
```

## See

[amqplib documentation](https://amqp-node.github.io/amqplib/)
