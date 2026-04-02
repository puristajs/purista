[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProtocolContext

# Type Alias: ProtocolContext\<Payload, Parameter, Resources, AgentInvokes, EmitList\>

> **ProtocolContext**\<`Payload`, `Parameter`, `Resources`, `AgentInvokes`, `EmitList`\> = [`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `EmitList`, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\> \| [`StreamFunctionContext`](../../core/type-aliases/StreamFunctionContext.md)\<`Payload`, `Parameter`, `Resources`, [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `EmitList`, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md), `AgentInvokes`\>

Defined in: [packages/ai/src/runtime/context.ts:288](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/runtime/context.ts#L288)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\> = `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>
