[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [ai/src/runtime/context.ts:379](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L379)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Properties

### conversation

> **conversation**: [`ConversationHelpers`](ConversationHelpers.md)

Defined in: [ai/src/runtime/context.ts:389](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L389)

***

### knowledge

> **knowledge**: `KnowledgeHelpers`

Defined in: [ai/src/runtime/context.ts:391](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L391)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [ai/src/runtime/context.ts:385](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L385)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/runtime/context.ts:397](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L397)

***

### message

> **message**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\[`"message"`\]

Defined in: [ai/src/runtime/context.ts:388](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L388)

***

### models

> **models**: `Models`

Defined in: [ai/src/runtime/context.ts:395](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L395)

***

### parameter

> **parameter**: `Parameter`

Defined in: [ai/src/runtime/context.ts:387](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L387)

***

### payload

> **payload**: `Payload`

Defined in: [ai/src/runtime/context.ts:386](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L386)

***

### resources

> **resources**: `Resources`

Defined in: [ai/src/runtime/context.ts:394](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L394)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)

Defined in: [ai/src/runtime/context.ts:396](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L396)

***

### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

Defined in: [ai/src/runtime/context.ts:390](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L390)

***

### stream

> **stream**: [`AgentStreamEmitter`](AgentStreamEmitter.md)

Defined in: [ai/src/runtime/context.ts:392](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L392)

***

### tools

> **tools**: `ToolInvoker`

Defined in: [ai/src/runtime/context.ts:393](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/context.ts#L393)
