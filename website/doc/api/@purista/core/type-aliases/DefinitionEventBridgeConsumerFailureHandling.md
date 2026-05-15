[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefinitionEventBridgeConsumerFailureHandling

# Type Alias: DefinitionEventBridgeConsumerFailureHandling

> **DefinitionEventBridgeConsumerFailureHandling** = `object`

Defined in: [core/types/DefinitionEventBridgeConsumerFailureHandling.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConsumerFailureHandling.ts#L11)

Advisory failure handling for broker-backed consumers such as subscriptions.

The selected event bridge must validate this request against its capabilities.
In `strict` mode the bridge must fail startup if it cannot honor the requested
semantics. In `best-effort` mode the bridge may degrade behavior but must log
the degradation explicitly.

## Properties

### deadLetterTarget?

> `optional` **deadLetterTarget?**: `string`

Defined in: [core/types/DefinitionEventBridgeConsumerFailureHandling.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConsumerFailureHandling.ts#L38)

Logical dead-letter target to use when the retry budget is exhausted.

The meaning depends on the adapter:
- NATS: subject
- AMQP: queue / routing target via broker configuration
- other adapters: documented transport-specific equivalent

***

### maxAttempts?

> `optional` **maxAttempts?**: `number`

Defined in: [core/types/DefinitionEventBridgeConsumerFailureHandling.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConsumerFailureHandling.ts#L23)

Maximum number of delivery attempts including the initial delivery.

If omitted, the adapter default applies.

***

### mode?

> `optional` **mode?**: [`DefinitionEventBridgeConsumerFailureMode`](DefinitionEventBridgeConsumerFailureMode.md)

Defined in: [core/types/DefinitionEventBridgeConsumerFailureHandling.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConsumerFailureHandling.ts#L17)

Controls whether unsupported semantics fail startup or degrade explicitly.

#### Default

```ts
strict
```

***

### retryDelayMs?

> `optional` **retryDelayMs?**: `number`

Defined in: [core/types/DefinitionEventBridgeConsumerFailureHandling.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConsumerFailureHandling.ts#L29)

Delay in milliseconds before a failed message is redelivered.

Adapters that cannot schedule delayed redelivery may ignore this value.
