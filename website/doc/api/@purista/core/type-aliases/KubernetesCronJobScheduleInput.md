[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / KubernetesCronJobScheduleInput

# Type Alias: KubernetesCronJobScheduleInput

> **KubernetesCronJobScheduleInput** = `object`

Defined in: [helper/enterpriseInterop.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L44)

## Properties

### concurrencyPolicy?

> `optional` **concurrencyPolicy?**: [`ScheduleDefinition`](ScheduleDefinition.md)\[`"concurrencyPolicy"`\]

Defined in: [helper/enterpriseInterop.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L55)

***

### description?

> `optional` **description?**: `string`

Defined in: [helper/enterpriseInterop.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L46)

***

### enabledByDefault?

> `optional` **enabledByDefault?**: `boolean`

Defined in: [helper/enterpriseInterop.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L60)

***

### expression

> **expression**: [`ScheduleDefinition`](ScheduleDefinition.md)\[`"expression"`\]

Defined in: [helper/enterpriseInterop.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L53)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [helper/enterpriseInterop.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L59)

***

### jitterWindowMs?

> `optional` **jitterWindowMs?**: `number`

Defined in: [helper/enterpriseInterop.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L58)

***

### maxCatchUpCount?

> `optional` **maxCatchUpCount?**: `number`

Defined in: [helper/enterpriseInterop.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L57)

***

### missedRunPolicy?

> `optional` **missedRunPolicy?**: [`ScheduleDefinition`](ScheduleDefinition.md)\[`"missedRunPolicy"`\]

Defined in: [helper/enterpriseInterop.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L56)

***

### name

> **name**: `string`

Defined in: [helper/enterpriseInterop.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L45)

***

### parameterSchema?

> `optional` **parameterSchema?**: `SchemaObject`

Defined in: [helper/enterpriseInterop.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L52)

***

### payloadSchema?

> `optional` **payloadSchema?**: `SchemaObject`

Defined in: [helper/enterpriseInterop.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L51)

***

### providerHints?

> `optional` **providerHints?**: `Record`\<`string`, `unknown`\>

Defined in: [helper/enterpriseInterop.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L61)

***

### targetKind

> **targetKind**: `string`

Defined in: [helper/enterpriseInterop.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L47)

***

### targetName

> **targetName**: `string`

Defined in: [helper/enterpriseInterop.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L50)

***

### targetServiceName?

> `optional` **targetServiceName?**: `string`

Defined in: [helper/enterpriseInterop.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L48)

***

### targetServiceVersion?

> `optional` **targetServiceVersion?**: `string`

Defined in: [helper/enterpriseInterop.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L49)

***

### timezone?

> `optional` **timezone?**: `string`

Defined in: [helper/enterpriseInterop.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L54)
