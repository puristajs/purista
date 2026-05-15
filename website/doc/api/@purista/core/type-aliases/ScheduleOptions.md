[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ScheduleOptions

# Type Alias: ScheduleOptions

> **ScheduleOptions** = `object`

Defined in: [core/types/schedule/ScheduleDefinition.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L47)

## Properties

### concurrencyPolicy?

> `optional` **concurrencyPolicy?**: [`ScheduleConcurrencyPolicy`](ScheduleConcurrencyPolicy.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L50)

***

### enabledByDefault?

> `optional` **enabledByDefault?**: `boolean`

Defined in: [core/types/schedule/ScheduleDefinition.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L55)

***

### expression

> **expression**: [`ScheduleExpression`](ScheduleExpression.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L48)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L54)

***

### jitterWindowMs?

> `optional` **jitterWindowMs?**: `number`

Defined in: [core/types/schedule/ScheduleDefinition.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L53)

***

### maxCatchUpCount?

> `optional` **maxCatchUpCount?**: `number`

Defined in: [core/types/schedule/ScheduleDefinition.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L52)

***

### missedRunPolicy?

> `optional` **missedRunPolicy?**: [`ScheduleMissedRunPolicy`](ScheduleMissedRunPolicy.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L51)

***

### parameterSchema?

> `optional` **parameterSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L58)

***

### payloadSchema?

> `optional` **payloadSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L57)

***

### providerHints?

> `optional` **providerHints?**: `Record`\<`string`, `unknown`\>

Defined in: [core/types/schedule/ScheduleDefinition.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L56)

***

### timezone?

> `optional` **timezone?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L49)
