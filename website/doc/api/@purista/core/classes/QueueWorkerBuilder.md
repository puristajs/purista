[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueWorkerBuilder

# Class: QueueWorkerBuilder

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L10)

## Constructors

### Constructor

> **new QueueWorkerBuilder**(`queueName`, `workerName`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L18)

#### Parameters

##### queueName

`string`

##### workerName

`string`

#### Returns

`QueueWorkerBuilder`

## Methods

### getDefinition()

> **getDefinition**(): `Promise`\<[`QueueWorkerDefinition`](../type-aliases/QueueWorkerDefinition.md)\>

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L59)

#### Returns

`Promise`\<[`QueueWorkerDefinition`](../type-aliases/QueueWorkerDefinition.md)\>

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`hooks`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L51)

#### Parameters

##### hooks

`Record`\<`string`, [`QueueWorkerAfterGuardHook`](../type-aliases/QueueWorkerAfterGuardHook.md)\>

#### Returns

`QueueWorkerBuilder`

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`hooks`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L43)

#### Parameters

##### hooks

`Record`\<`string`, [`QueueWorkerBeforeGuardHook`](../type-aliases/QueueWorkerBeforeGuardHook.md)\>

#### Returns

`QueueWorkerBuilder`

***

### setHandler()

> **setHandler**(`handler`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L38)

#### Parameters

##### handler

[`QueueWorkerHandler`](../type-aliases/QueueWorkerHandler.md)

#### Returns

`QueueWorkerBuilder`

***

### setIntervalMs()

> **setIntervalMs**(`intervalMs`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L28)

#### Parameters

##### intervalMs

`number`

#### Returns

`QueueWorkerBuilder`

***

### setMaxParallelHandlers()

> **setMaxParallelHandlers**(`count`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L33)

#### Parameters

##### count

`number`

#### Returns

`QueueWorkerBuilder`

***

### setMode()

> **setMode**(`mode`): `QueueWorkerBuilder`

Defined in: [QueueWorkerBuilder/QueueWorkerBuilder.impl.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts#L23)

#### Parameters

##### mode

[`QueueWorkerMode`](../type-aliases/QueueWorkerMode.md)

#### Returns

`QueueWorkerBuilder`
