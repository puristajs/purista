[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ScheduleDefinition

# Type Alias: ScheduleDefinition

> **ScheduleDefinition** = `object`

Defined in: [core/types/schedule/ScheduleDefinition.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L27)

Provider-neutral schedule metadata exported from PURISTA definitions.

PURISTA does not run production schedules. This contract lets external
schedulers emit an event, enqueue a queue job, or call a short command.

## Example

```ts
service
  .getScheduleBuilder('monthlyBillingCycle', 'Monthly billing trigger')
  .emitEvent('billing.monthlyCycleDue', {
    expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
  })
```

## Properties

### concurrencyPolicy

> **concurrencyPolicy**: [`ScheduleConcurrencyPolicy`](ScheduleConcurrencyPolicy.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L38)

***

### description?

> `optional` **description?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L29)

***

### enabledByDefault

> **enabledByDefault**: `boolean`

Defined in: [core/types/schedule/ScheduleDefinition.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L43)

***

### expression

> **expression**: [`ScheduleExpression`](ScheduleExpression.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L36)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L42)

***

### jitterWindowMs?

> `optional` **jitterWindowMs?**: `number`

Defined in: [core/types/schedule/ScheduleDefinition.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L41)

***

### maxCatchUpCount?

> `optional` **maxCatchUpCount?**: `number`

Defined in: [core/types/schedule/ScheduleDefinition.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L40)

***

### missedRunPolicy

> **missedRunPolicy**: [`ScheduleMissedRunPolicy`](ScheduleMissedRunPolicy.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L39)

***

### name

> **name**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L28)

***

### parameterSchema?

> `optional` **parameterSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L35)

***

### payloadSchema?

> `optional` **payloadSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L34)

***

### providerHints?

> `optional` **providerHints?**: `Record`\<`string`, `unknown`\>

Defined in: [core/types/schedule/ScheduleDefinition.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L44)

***

### targetKind

> **targetKind**: [`ScheduleTargetKind`](ScheduleTargetKind.md)

Defined in: [core/types/schedule/ScheduleDefinition.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L30)

***

### targetName

> **targetName**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L33)

***

### targetServiceName?

> `optional` **targetServiceName?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L31)

***

### targetServiceVersion?

> `optional` **targetServiceVersion?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L32)

***

### timezone?

> `optional` **timezone?**: `string`

Defined in: [core/types/schedule/ScheduleDefinition.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/schedule/ScheduleDefinition.ts#L37)
