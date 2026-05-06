[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvokeBinding

# Type Alias: AgentInvokeBinding\<PayloadSchema, ParameterSchema, OutputSchema\>

> **AgentInvokeBinding**\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`\> = `object`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:14

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

## Properties

### call()

> **call**: (`payload`, `parameter?`) => `object`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:25

Invoke a child agent.

`parameter` is optional so callers do not need to pass `undefined`
when the target defines no input parameter schema.

#### Parameters

##### payload

[`InferIn`](../../core/type-aliases/InferIn.md)\<`PayloadSchema`\>

##### parameter?

[`InferIn`](../../core/type-aliases/InferIn.md)\<`ParameterSchema`\>

#### Returns

`object`

##### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncIterator`\<`unknown`\>

###### Returns

`AsyncIterator`\<`unknown`\>

##### final()

> **final**(): `Promise`\<[`AgentInvocationFinalResult`](AgentInvocationFinalResult.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`OutputSchema`\>\>\>

###### Returns

`Promise`\<[`AgentInvocationFinalResult`](AgentInvocationFinalResult.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`OutputSchema`\>\>\>

***

### outputSchema?

> `optional` **outputSchema**: `OutputSchema`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:34

***

### parameterSchema?

> `optional` **parameterSchema**: `ParameterSchema`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:33

***

### payloadSchema?

> `optional` **payloadSchema**: `PayloadSchema`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:32
