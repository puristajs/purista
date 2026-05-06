[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionHandlerResult

# Type Alias: SubscriptionHandlerResult

> **SubscriptionHandlerResult** = \{ `status`: `"ack"`; \} \| \{ `delayMs?`: `number`; `reason?`: `string`; `status`: `"retry"`; \} \| \{ `reason?`: `string`; `status`: `"deadLetter"`; \} \| \{ `reason?`: `string`; `status`: `"drop"`; \} \| \{ `reason?`: `string`; `status`: `"stop-consumer"`; \}

Defined in: [core/types/subscription/SubscriptionHandlerResult.ts:1](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionHandlerResult.ts#L1)
