[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ScheduleDefinitionBuilder

# Class: ScheduleDefinitionBuilder

Defined in: [ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts#L3)

## Constructors

### Constructor

> **new ScheduleDefinitionBuilder**(`name`, `description`): `ScheduleDefinitionBuilder`

Defined in: [ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts#L4)

#### Parameters

##### name

`string`

##### description

`string`

#### Returns

`ScheduleDefinitionBuilder`

## Methods

### emitEvent()

> **emitEvent**(`eventName`, `options`): [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)

Defined in: [ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts#L21)

Mark this schedule as emitting a PURISTA custom event.

#### Parameters

##### eventName

`string`

##### options

[`ScheduleOptions`](../type-aliases/ScheduleOptions.md)

#### Returns

[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)

#### Example

```ts
service
  .getScheduleBuilder('monthlyBillingCycle', 'Monthly billing trigger')
  .emitEvent('billing.monthlyCycleDue', {
    expression: { kind: 'cron', value: '0 2 1 * *' },
  })
```

***

### enqueueQueue()

> **enqueueQueue**(`queueName`, `options`): [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)

Defined in: [ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts#L28)

Mark this schedule as enqueueing one durable queue job.

#### Parameters

##### queueName

`string`

##### options

[`ScheduleOptions`](../type-aliases/ScheduleOptions.md)

#### Returns

[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)

***

### invokeCommand()

> **invokeCommand**(`commandName`, `options`): [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)

Defined in: [ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.ts#L35)

Mark this schedule as invoking short, idempotent command trigger logic.

#### Parameters

##### commandName

`string`

##### options

[`ScheduleOptions`](../type-aliases/ScheduleOptions.md)

#### Returns

[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)
