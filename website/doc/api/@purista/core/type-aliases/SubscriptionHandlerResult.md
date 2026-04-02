[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionHandlerResult

# Type Alias: SubscriptionHandlerResult

> **SubscriptionHandlerResult** = \{ `status`: `"ack"`; \} \| \{ `delayMs?`: `number`; `reason?`: `string`; `status`: `"retry"`; \} \| \{ `reason?`: `string`; `status`: `"deadLetter"`; \}

Defined in: core/types/subscription/SubscriptionHandlerResult.ts:1
