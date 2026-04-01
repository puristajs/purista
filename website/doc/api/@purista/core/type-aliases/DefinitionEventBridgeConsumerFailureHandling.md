[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefinitionEventBridgeConsumerFailureHandling

# Type Alias: DefinitionEventBridgeConsumerFailureHandling

> **DefinitionEventBridgeConsumerFailureHandling** = `object`

Defined in: core/types/DefinitionEventBridgeConsumerFailureHandling.ts:8

Advisory failure handling for broker-backed consumers such as subscriptions.

Event bridge implementations may honor all, some, or none of these fields
depending on their transport capabilities. Use bridge capabilities and
transport-specific documentation to understand the effective behavior.

## Properties

### deadLetterTarget?

> `optional` **deadLetterTarget**: `string`

Defined in: core/types/DefinitionEventBridgeConsumerFailureHandling.ts:30

Logical dead-letter target to use when the retry budget is exhausted.

The meaning depends on the adapter:
- NATS: subject
- AMQP: queue / routing target via broker configuration
- other adapters: documented transport-specific equivalent

***

### maxAttempts?

> `optional` **maxAttempts**: `number`

Defined in: core/types/DefinitionEventBridgeConsumerFailureHandling.ts:15

Maximum number of delivery attempts including the initial delivery.

If omitted, the adapter default applies. If the adapter has no default,
the broker may retry indefinitely.

***

### retryDelayMs?

> `optional` **retryDelayMs**: `number`

Defined in: core/types/DefinitionEventBridgeConsumerFailureHandling.ts:21

Delay in milliseconds before a failed message is redelivered.

Adapters that cannot schedule delayed redelivery may ignore this value.
