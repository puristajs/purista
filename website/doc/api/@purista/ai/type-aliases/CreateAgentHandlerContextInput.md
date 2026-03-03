[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentHandlerContextInput

# Type Alias: CreateAgentHandlerContextInput\<Payload, Parameter, Resources, Models\>

> **CreateAgentHandlerContextInput**\<`Payload`, `Parameter`, `Resources`, `Models`\> = `object`

Defined in: [ai/src/runtime/context.ts:312](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L312)

## Type Parameters

### Payload

`Payload`

### Parameter

`Parameter`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

## Properties

### knowledgeAdapters

> **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md) \| `undefined`\>

Defined in: [ai/src/runtime/context.ts:322](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L322)

***

### manifest

> **manifest**: [`AgentManifest`](AgentManifest.md)

Defined in: [ai/src/runtime/context.ts:326](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L326)

***

### models

> **models**: `Models`

Defined in: [ai/src/runtime/context.ts:325](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L325)

***

### parameter

> **parameter**: `Parameter`

Defined in: [ai/src/runtime/context.ts:320](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L320)

***

### payload

> **payload**: `Payload`

Defined in: [ai/src/runtime/context.ts:319](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L319)

***

### protocol

> **protocol**: [`ProtocolEmitter`](ProtocolEmitter.md)

Defined in: [ai/src/runtime/context.ts:323](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L323)

***

### resources

> **resources**: `Resources`

Defined in: [ai/src/runtime/context.ts:324](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L324)

***

### serviceContext

> **serviceContext**: [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\<`Payload`, `Parameter`\>

Defined in: [ai/src/runtime/context.ts:318](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L318)

***

### sessionStore

> **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: [ai/src/runtime/context.ts:321](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/runtime/context.ts#L321)
