[**PURISTA API**](../../../../README.md)

***

[PURISTA API](../../../../packages.md) / [@purista/ai](../../README.md) / [testing](../README.md) / CreateAgentContextMockInput

# Type Alias: CreateAgentContextMockInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentContextMockInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: ai/src/testing/index.ts:13

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](../../type-aliases/AgentModelBinding.md)\> = `Record`\<`string`, `never`\>

## Properties

### identity?

> `optional` **identity**: `Partial`\<[`AgentRunIdentity`](../../type-aliases/AgentRunIdentity.md)\>

Defined in: ai/src/testing/index.ts:23

***

### logger?

> `optional` **logger**: [`Logger`](../../../core/classes/Logger.md)

Defined in: ai/src/testing/index.ts:24

***

### models?

> `optional` **models**: [`AgentHandlerContext`](../../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>\[`"harness"`\]\[`"models"`\]

Defined in: ai/src/testing/index.ts:22

***

### parameter?

> `optional` **parameter**: `Parameter`

Defined in: ai/src/testing/index.ts:20

***

### payload?

> `optional` **payload**: `Payload`

Defined in: ai/src/testing/index.ts:19

***

### resources?

> `optional` **resources**: `Resources`

Defined in: ai/src/testing/index.ts:21
