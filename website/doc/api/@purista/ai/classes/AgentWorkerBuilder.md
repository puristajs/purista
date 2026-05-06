[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentWorkerBuilder

# Class: AgentWorkerBuilder

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:16

## Extends

- [`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md)

## Constructors

### Constructor

> **new AgentWorkerBuilder**(`queueName`, `workerName`): `AgentWorkerBuilder`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:13

#### Parameters

##### queueName

`string`

##### workerName

`string`

#### Returns

`AgentWorkerBuilder`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`constructor`](../../core/classes/QueueWorkerBuilder.md#constructor)

## Methods

### getAfterGuardHook()

> **getAfterGuardHook**(`name`): [`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:27

Return a previously registered after-guard hook by name.

#### Parameters

##### name

`string` | `number` | `symbol`

#### Returns

[`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`getAfterGuardHook`](../../core/classes/QueueWorkerBuilder.md#getafterguardhook)

***

### getAgentContext()

> **getAgentContext**(): [`AgentWorkerContext`](../type-aliases/AgentWorkerContext.md) \| `undefined`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:24

#### Returns

[`AgentWorkerContext`](../type-aliases/AgentWorkerContext.md) \| `undefined`

***

### getAgentDefinition()

> **getAgentDefinition**(): `Promise`\<[`QueueWorkerDefinition`](../../core/type-aliases/QueueWorkerDefinition.md)\>

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:28

#### Returns

`Promise`\<[`QueueWorkerDefinition`](../../core/type-aliases/QueueWorkerDefinition.md)\>

***

### getBeforeGuardHook()

> **getBeforeGuardHook**(`name`): [`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:22

Return a previously registered before-guard hook by name.

#### Parameters

##### name

`string` | `number` | `symbol`

#### Returns

[`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`getBeforeGuardHook`](../../core/classes/QueueWorkerBuilder.md#getbeforeguardhook)

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`QueueWorkerDefinition`](../../core/type-aliases/QueueWorkerDefinition.md)\>

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:28

#### Returns

`Promise`\<[`QueueWorkerDefinition`](../../core/type-aliases/QueueWorkerDefinition.md)\>

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`getDefinition`](../../core/classes/QueueWorkerBuilder.md#getdefinition)

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`hooks`): `this`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:23

#### Parameters

##### hooks

`Record`\<`string`, [`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)\>

#### Returns

`this`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`setAfterGuardHooks`](../../core/classes/QueueWorkerBuilder.md#setafterguardhooks)

***

### setAgentContext()

> **setAgentContext**(`context`): `this`

Defined in: packages/ai/src/builder/AgentWorkerBuilder.ts:19

#### Parameters

##### context

[`AgentWorkerContext`](../type-aliases/AgentWorkerContext.md)

#### Returns

`this`

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`hooks`): `this`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:18

#### Parameters

##### hooks

`Record`\<`string`, [`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)\>

#### Returns

`this`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`setBeforeGuardHooks`](../../core/classes/QueueWorkerBuilder.md#setbeforeguardhooks)

***

### setHandler()

> **setHandler**(`handler`): `this`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:17

#### Parameters

##### handler

[`QueueWorkerHandler`](../../core/type-aliases/QueueWorkerHandler.md)

#### Returns

`this`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`setHandler`](../../core/classes/QueueWorkerBuilder.md#sethandler)

***

### setIntervalMs()

> **setIntervalMs**(`intervalMs`): `this`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:15

#### Parameters

##### intervalMs

`number`

#### Returns

`this`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`setIntervalMs`](../../core/classes/QueueWorkerBuilder.md#setintervalms)

***

### setMaxParallelHandlers()

> **setMaxParallelHandlers**(`count`): `this`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:16

#### Parameters

##### count

`number`

#### Returns

`this`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`setMaxParallelHandlers`](../../core/classes/QueueWorkerBuilder.md#setmaxparallelhandlers)

***

### setMode()

> **setMode**(`mode`): `this`

Defined in: packages/core/dist/esm/QueueWorkerBuilder/QueueWorkerBuilder.impl.d.ts:14

#### Parameters

##### mode

[`QueueWorkerMode`](../../core/type-aliases/QueueWorkerMode.md)

#### Returns

`this`

#### Inherited from

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md).[`setMode`](../../core/classes/QueueWorkerBuilder.md#setmode)
