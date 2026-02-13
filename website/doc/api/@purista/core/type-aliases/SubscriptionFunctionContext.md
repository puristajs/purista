[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunctionContext

# Type Alias: SubscriptionFunctionContext\<Resources, Invokes, EmitList\>

> **SubscriptionFunctionContext**\<`Resources`, `Invokes`, `EmitList`\> = [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md) & [`SubscriptionFunctionContextEnhancements`](SubscriptionFunctionContextEnhancements.md)\<`Resources`, `Invokes`, `EmitList`\>\>

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L54)

The subscription function context which will be passed into subscription function.

## Type Parameters

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = [`EmptyObject`](EmptyObject.md)
