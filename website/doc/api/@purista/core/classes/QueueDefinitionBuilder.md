[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueDefinitionBuilder

# Class: QueueDefinitionBuilder

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L9)

## Constructors

### Constructor

> **new QueueDefinitionBuilder**(`queueName`, `queueDescription`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L24)

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

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L34)

#### Parameters

##### schema

[`Schema`](../type-aliases/Schema.md)

#### Returns

`QueueDefinitionBuilder`

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L29)

#### Parameters

##### schema

[`Schema`](../type-aliases/Schema.md)

#### Returns

`QueueDefinitionBuilder`

***

### addWorkerDefinition()

> **addWorkerDefinition**(...`workers`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L80)

#### Parameters

##### workers

...[`QueueWorkerDefinition`](../type-aliases/QueueWorkerDefinition.md)[]

#### Returns

`QueueDefinitionBuilder`

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`QueueDefinition`](../type-aliases/QueueDefinition.md)\>

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L85)

#### Returns

`Promise`\<[`QueueDefinition`](../type-aliases/QueueDefinition.md)\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:67](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L67)

#### Returns

`QueueDefinitionBuilder`

***

### setBeforeEnqueueTransform()

> **setBeforeEnqueueTransform**(`transform`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L47)

#### Parameters

##### transform

[`QueueTransformHook`](../type-aliases/QueueTransformHook.md)

#### Returns

`QueueDefinitionBuilder`

***

### setBeforeExecuteTransform()

> **setBeforeExecuteTransform**(`transform`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L52)

#### Parameters

##### transform

[`QueueTransformHook`](../type-aliases/QueueTransformHook.md)

#### Returns

`QueueDefinitionBuilder`

***

### setDeadLetterOptions()

> **setDeadLetterOptions**(`options`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L57)

#### Parameters

##### options

###### queueName?

`string`

#### Returns

`QueueDefinitionBuilder`

***

### setLifecycleConfig()

> **setLifecycleConfig**(`config`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L39)

#### Parameters

##### config

`Partial`\<[`QueueLifecycleConfig`](../type-aliases/QueueLifecycleConfig.md)\>

#### Returns

`QueueDefinitionBuilder`

***

### setQueueBridgeConfig()

> **setQueueBridgeConfig**(`config`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:72](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L72)

#### Parameters

##### config

`Partial`\<[`DefinitionQueueBridgeConfig`](../type-aliases/DefinitionQueueBridgeConfig.md)\>

#### Returns

`QueueDefinitionBuilder`

***

### setTags()

> **setTags**(`tags`): `QueueDefinitionBuilder`

Defined in: [QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts#L62)

#### Parameters

##### tags

`string`[]

#### Returns

`QueueDefinitionBuilder`
