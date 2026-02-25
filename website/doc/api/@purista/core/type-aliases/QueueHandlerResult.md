[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueHandlerResult

# Type Alias: QueueHandlerResult

> **QueueHandlerResult** = \{ `headers?`: `Record`\<`string`, `string`\>; `output?`: `unknown`; `status`: `"success"`; \} \| \{ `delayMs?`: `number`; `reason?`: `string`; `status`: `"retry"`; \} \| \{ `delayMs?`: `number`; `fatal?`: `boolean`; `reason`: `string`; `status`: `"fail"`; \}

Defined in: [core/types/queue/QueueHandlerResult.ts:1](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueHandlerResult.ts#L1)
