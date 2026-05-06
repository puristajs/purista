[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentQueueBuilderTypes

# Type Alias: AgentQueueBuilderTypes\<PayloadSchema, ParameterSchema, OutputSchema, Resources, Models, ToolInvokes, AgentInvokes, EmitPayloads\>

> **AgentQueueBuilderTypes**\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`, `Resources`, `Models`, `ToolInvokes`, `AgentInvokes`, `EmitPayloads`\> = `object`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:37

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ToolInvokes

`ToolInvokes` *extends* `Record`\<`string`, `Record`\<`string`, `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>\>\> = `Record`\<`string`, `Record`\<`string`, `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>\>\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Properties

### AgentInvokes

> **AgentInvokes**: `AgentInvokes`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:56

***

### EmitPayloads

> **EmitPayloads**: `EmitPayloads`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:57

***

### Models

> **Models**: `Models`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:54

***

### OutputSchema

> **OutputSchema**: `OutputSchema`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:52

***

### ParameterSchema

> **ParameterSchema**: `ParameterSchema`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:51

***

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:50

***

### Resources

> **Resources**: `Resources`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:53

***

### ToolInvokes

> **ToolInvokes**: `ToolInvokes`

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:55
