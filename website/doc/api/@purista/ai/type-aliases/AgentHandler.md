[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentHandler

# Type Alias: AgentHandler()\<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads\>

> **AgentHandler**\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`\> = (`context`, `payload`, `parameter`) => `Promise`\<[`AgentHandlerResult`](AgentHandlerResult.md)\> \| [`AgentHandlerResult`](AgentHandlerResult.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:166](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/builder/AgentBuilder.ts#L166)

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

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Parameters

### context

[`AgentHandlerContext`](AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`, `EmitPayloads`\>

### payload

`Payload`

### parameter

`Parameter`

## Returns

`Promise`\<[`AgentHandlerResult`](AgentHandlerResult.md)\> \| [`AgentHandlerResult`](AgentHandlerResult.md)
