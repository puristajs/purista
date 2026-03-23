[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandler

# Type Alias: AgentHandler()\<Payload, Parameter, Resources, Models, AgentInvokes\>

> **AgentHandler**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\> = (`context`, `payload`, `parameter`) => `Promise`\<[`AgentHandlerResult`](AgentHandlerResult.md)\> \| [`AgentHandlerResult`](AgentHandlerResult.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:122](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L122)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Parameters

### context

[`AgentHandlerContext`](AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>

### payload

`Payload`

### parameter

`Parameter`

## Returns

`Promise`\<[`AgentHandlerResult`](AgentHandlerResult.md)\> \| [`AgentHandlerResult`](AgentHandlerResult.md)
