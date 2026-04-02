[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueMessage

# Type Alias: QueueMessage\<Payload, Params\>

> **QueueMessage**\<`Payload`, `Params`\> = `object`

Defined in: [core/types/queue/QueueMessage.ts:1](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L1)

## Type Parameters

### Payload

`Payload` = `unknown`

### Params

`Params` = `unknown`

## Properties

### attempt

> **attempt**: `number`

Defined in: [core/types/queue/QueueMessage.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L10)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [core/types/queue/QueueMessage.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L16)

***

### createdAt

> **createdAt**: `number`

Defined in: [core/types/queue/QueueMessage.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L7)

***

### headers

> **headers**: `Record`\<`string`, `string`\>

Defined in: [core/types/queue/QueueMessage.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L6)

***

### id

> **id**: `string`

Defined in: [core/types/queue/QueueMessage.ts:2](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L2)

***

### idempotencyKey?

> `optional` **idempotencyKey**: `string`

Defined in: [core/types/queue/QueueMessage.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L17)

***

### leaseExpiresAt

> **leaseExpiresAt**: `number`

Defined in: [core/types/queue/QueueMessage.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L12)

***

### leaseTtlMs

> **leaseTtlMs**: `number`

Defined in: [core/types/queue/QueueMessage.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L13)

***

### maxAttempts

> **maxAttempts**: `number`

Defined in: [core/types/queue/QueueMessage.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L11)

***

### parameter?

> `optional` **parameter**: `Params`

Defined in: [core/types/queue/QueueMessage.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L5)

***

### parentSpanId?

> `optional` **parentSpanId**: `string`

Defined in: [core/types/queue/QueueMessage.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L15)

***

### payload

> **payload**: `Payload`

Defined in: [core/types/queue/QueueMessage.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L4)

***

### priority?

> `optional` **priority**: `number`

Defined in: [core/types/queue/QueueMessage.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L9)

***

### queueName

> **queueName**: `string`

Defined in: [core/types/queue/QueueMessage.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L3)

***

### scheduledAt?

> `optional` **scheduledAt**: `number`

Defined in: [core/types/queue/QueueMessage.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L8)

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [core/types/queue/QueueMessage.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueMessage.ts#L14)
