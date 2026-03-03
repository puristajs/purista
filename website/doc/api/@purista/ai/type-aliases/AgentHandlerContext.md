[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [ai/src/runtime/context.ts:292](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L292)

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

### knowledge

> **knowledge**: `KnowledgeHelpers`

Defined in: [ai/src/runtime/context.ts:303](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L303)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [ai/src/runtime/context.ts:298](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L298)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/runtime/context.ts:309](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L309)

***

### message

> **message**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\[`"message"`\]

Defined in: [ai/src/runtime/context.ts:301](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L301)

***

### models

> **models**: `Models`

Defined in: [ai/src/runtime/context.ts:307](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L307)

***

### parameter

> **parameter**: `Parameter`

Defined in: [ai/src/runtime/context.ts:300](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L300)

***

### payload

> **payload**: `Payload`

Defined in: [ai/src/runtime/context.ts:299](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L299)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [ai/src/runtime/context.ts:304](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L304)

***

### resources

> **resources**: `Resources`

Defined in: [ai/src/runtime/context.ts:306](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L306)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)

Defined in: [ai/src/runtime/context.ts:308](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L308)

***

### session

> **session**: [`SessionHelpers`](SessionHelpers.md)

Defined in: [ai/src/runtime/context.ts:302](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L302)

***

### tools

> **tools**: `ToolInvoker`

Defined in: [ai/src/runtime/context.ts:305](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L305)
