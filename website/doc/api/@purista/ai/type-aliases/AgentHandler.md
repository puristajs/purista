[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandler

# Type Alias: AgentHandler()\<Payload, Parameter, Resources, Models, KnowledgeAliases, AgentInvokes\>

> **AgentHandler**\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\> = (`context`, `payload`, `parameter`) => `Promise`\<[`AgentHandlerResult`](AgentHandlerResult.md)\> \| [`AgentHandlerResult`](AgentHandlerResult.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:123](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L123)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `never`

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Parameters

### context

[`AgentHandlerContext`](AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\>

### payload

`Payload`

### parameter

`Parameter`

## Returns

`Promise`\<[`AgentHandlerResult`](AgentHandlerResult.md)\> \| [`AgentHandlerResult`](AgentHandlerResult.md)
