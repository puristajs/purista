[**PURISTA API**](../../../../README.md)

***

[PURISTA API](../../../../packages.md) / [@purista/ai](../../README.md) / [testing](../README.md) / CreateAgentContextMockInput

# Type Alias: CreateAgentContextMockInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentContextMockInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [testing/index.ts:13](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L13)

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

> `optional` **identity?**: `Partial`\<[`AgentRunIdentity`](../../type-aliases/AgentRunIdentity.md)\>

Defined in: [testing/index.ts:23](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L23)

***

### logger?

> `optional` **logger?**: [`Logger`](../../../core/classes/Logger.md)

Defined in: [testing/index.ts:24](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L24)

***

### models?

> `optional` **models?**: [`AgentHandlerContext`](../../type-aliases/AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>\[`"harness"`\]\[`"models"`\]

Defined in: [testing/index.ts:22](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L22)

***

### parameter?

> `optional` **parameter?**: `Parameter`

Defined in: [testing/index.ts:20](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L20)

***

### payload?

> `optional` **payload?**: `Payload`

Defined in: [testing/index.ts:19](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L19)

***

### resources?

> `optional` **resources?**: `Resources`

Defined in: [testing/index.ts:21](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L21)
