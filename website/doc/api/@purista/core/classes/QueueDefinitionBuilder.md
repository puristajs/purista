[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueDefinitionBuilder

# Class: QueueDefinitionBuilder

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L9)

## Constructors

### Constructor

> **new QueueDefinitionBuilder**(`queueName`, `queueDescription`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L26)

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

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L36)

#### Parameters

##### schema

[`Schema`](../type-aliases/Schema.md)

#### Returns

`QueueDefinitionBuilder`

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L31)

#### Parameters

##### schema

[`Schema`](../type-aliases/Schema.md)

#### Returns

`QueueDefinitionBuilder`

***

### addWorkerDefinition()

> **addWorkerDefinition**(...`workers`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L82)

#### Parameters

##### workers

...[`QueueWorkerDefinition`](../type-aliases/QueueWorkerDefinition.md)[]

#### Returns

`QueueDefinitionBuilder`

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`QueueDefinition`](../type-aliases/QueueDefinition.md)\>

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L87)

#### Returns

`Promise`\<[`QueueDefinition`](../type-aliases/QueueDefinition.md)\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L69)

#### Returns

`QueueDefinitionBuilder`

***

### setBeforeEnqueueTransform()

> **setBeforeEnqueueTransform**(`transform`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L49)

#### Parameters

##### transform

[`QueueTransformHook`](../type-aliases/QueueTransformHook.md)

#### Returns

`QueueDefinitionBuilder`

***

### setBeforeExecuteTransform()

> **setBeforeExecuteTransform**(`transform`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L54)

#### Parameters

##### transform

[`QueueTransformHook`](../type-aliases/QueueTransformHook.md)

#### Returns

`QueueDefinitionBuilder`

***

### setDeadLetterOptions()

> **setDeadLetterOptions**(`options`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L59)

#### Parameters

##### options

###### emitEvent?

`boolean`

###### eventName?

`string`

###### queueName?

`string`

#### Returns

`QueueDefinitionBuilder`

***

### setLifecycleConfig()

> **setLifecycleConfig**(`config`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L41)

#### Parameters

##### config

`Partial`\<[`QueueLifecycleConfig`](../type-aliases/QueueLifecycleConfig.md)\>

#### Returns

`QueueDefinitionBuilder`

***

### setQueueBridgeConfig()

> **setQueueBridgeConfig**(`config`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:74](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L74)

#### Parameters

##### config

`Partial`\<[`DefinitionQueueBridgeConfig`](../type-aliases/DefinitionQueueBridgeConfig.md)\>

#### Returns

`QueueDefinitionBuilder`

***

### setTags()

> **setTags**(`tags`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L64)

#### Parameters

##### tags

`string`[]

#### Returns

`QueueDefinitionBuilder`
