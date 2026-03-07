[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunctionContext

# Type Alias: SubscriptionFunctionContext\<Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes\>

> **SubscriptionFunctionContext**\<`Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\> = [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md) & [`SubscriptionFunctionContextEnhancements`](SubscriptionFunctionContextEnhancements.md)\<`Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>\>

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:68](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L68)

The subscription function context which will be passed into subscription function.

## Type Parameters

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md) = [`EmptyObject`](EmptyObject.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = [`EmptyObject`](EmptyObject.md)

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`EmptyObject`](EmptyObject.md)
