[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventToQueueBindingDefinition

# Type Alias: EventToQueueBindingDefinition

> **EventToQueueBindingDefinition** = `object`

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L12)

## Properties

### eventName

> **eventName**: `string`

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L13)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: [`EventToQueueIdempotencyStrategy`](EventToQueueIdempotencyStrategy.md)

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L16)

***

### idempotencyMode

> **idempotencyMode**: [`EventToQueueIdempotencyMode`](EventToQueueIdempotencyMode.md)

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L15)

***

### mapParameter?

> `optional` **mapParameter?**: (`event`) => `unknown`

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L18)

#### Parameters

##### event

`any`

#### Returns

`unknown`

***

### mapPayload?

> `optional` **mapPayload?**: (`event`) => `unknown`

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L17)

#### Parameters

##### event

`any`

#### Returns

`unknown`

***

### onEnqueueFailure?

> `optional` **onEnqueueFailure?**: [`QueueRetryRequest`](QueueRetryRequest.md) \| \{ `reason`: `string`; `status`: `"fail"`; \}

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L19)

***

### queueName

> **queueName**: `string`

Defined in: [core/types/queue/EventToQueueBindingDefinition.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/EventToQueueBindingDefinition.ts#L14)
