[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueDefinitionBuilder

# Class: QueueDefinitionBuilder

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L12)

## Constructors

### Constructor

> **new QueueDefinitionBuilder**(`queueName`, `queueDescription`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L30)

#### Parameters

##### queueName

`string`

##### queueDescription

`string`

#### Returns

`QueueDefinitionBuilder`

## Methods

### addParameterSchema()

> **addParameterSchema**(`schema`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L40)

#### Parameters

##### schema

[`Schema`](../type-aliases/Schema.md)

#### Returns

`QueueDefinitionBuilder`

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L35)

#### Parameters

##### schema

[`Schema`](../type-aliases/Schema.md)

#### Returns

`QueueDefinitionBuilder`

***

### addWorkerDefinition()

> **addWorkerDefinition**(...`workers`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:178](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L178)

#### Parameters

##### workers

...[`QueueWorkerDefinition`](../type-aliases/QueueWorkerDefinition.md)[]

#### Returns

`QueueDefinitionBuilder`

***

### emitResultAsEvent()

> **emitResultAsEvent**(`successEventName`, `options?`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:113](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L113)

Convenience helper for emitting successful worker output as a PURISTA event.

#### Parameters

##### successEventName

`string`

##### options?

`Omit`\<[`QueueResultPolicy`](../type-aliases/QueueResultPolicy.md), `"mode"` \| `"successEventName"`\>

#### Returns

`QueueDefinitionBuilder`

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`QueueDefinition`](../type-aliases/QueueDefinition.md)\>

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L183)

#### Returns

`Promise`\<[`QueueDefinition`](../type-aliases/QueueDefinition.md)\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:165](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L165)

#### Returns

`QueueDefinitionBuilder`

***

### markSchedulable()

> **markSchedulable**(`options`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:124](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L124)

Mark this queue as a direct schedule target.

#### Parameters

##### options

[`ScheduleOptions`](../type-aliases/ScheduleOptions.md) & `object`

#### Returns

`QueueDefinitionBuilder`

***

### setBeforeEnqueueTransform()

> **setBeforeEnqueueTransform**(`transform`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:145](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L145)

#### Parameters

##### transform

[`QueueTransformHook`](../type-aliases/QueueTransformHook.md)

#### Returns

`QueueDefinitionBuilder`

***

### setBeforeExecuteTransform()

> **setBeforeExecuteTransform**(`transform`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:150](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L150)

#### Parameters

##### transform

[`QueueTransformHook`](../type-aliases/QueueTransformHook.md)

#### Returns

`QueueDefinitionBuilder`

***

### setDeadLetterOptions()

> **setDeadLetterOptions**(`options`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:155](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L155)

#### Parameters

##### options

###### queueName?

`string`

#### Returns

`QueueDefinitionBuilder`

***

### setExecutionProfile()

> **setExecutionProfile**(`profile`, `options`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L63)

Apply the built-in long-running queue execution profile.

#### Parameters

##### profile

`"longRunning"`

##### options

###### maxRuntimeMs

`number`

###### strict?

`boolean`

#### Returns

`QueueDefinitionBuilder`

#### Example

```ts
queue.setExecutionProfile('longRunning', {
  maxRuntimeMs: 6 * 60 * 60_000,
})
```

***

### setLifecycleConfig()

> **setLifecycleConfig**(`config`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L45)

#### Parameters

##### config

`Partial`\<[`QueueLifecycleConfig`](../type-aliases/QueueLifecycleConfig.md)\>

#### Returns

`QueueDefinitionBuilder`

***

### setQueueBridgeConfig()

> **setQueueBridgeConfig**(`config`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:170](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L170)

#### Parameters

##### config

`Partial`\<[`DefinitionQueueBridgeConfig`](../type-aliases/DefinitionQueueBridgeConfig.md)\>

#### Returns

`QueueDefinitionBuilder`

***

### setResultPolicy()

> **setResultPolicy**(`policy`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L101)

Persist or emit queue worker completion metadata.

#### Parameters

##### policy

[`QueueResultPolicy`](../type-aliases/QueueResultPolicy.md)

#### Returns

`QueueDefinitionBuilder`

#### Example

```ts
queue.setResultPolicy({
  mode: 'event',
  successEventName: 'billing.monthlyClosing.completed',
})
```

***

### setTags()

> **setTags**(`tags`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:160](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L160)

#### Parameters

##### tags

`string`[]

#### Returns

`QueueDefinitionBuilder`
