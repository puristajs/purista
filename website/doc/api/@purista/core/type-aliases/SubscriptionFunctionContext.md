[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunctionContext

# Type Alias: SubscriptionFunctionContext\<Resources, Invokes, EmitList\>

> **SubscriptionFunctionContext**\<`Resources`, `Invokes`, `EmitList`\>: [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md) & [`SubscriptionFunctionContextEnhancements`](SubscriptionFunctionContextEnhancements.md)\<`Resources`, `Invokes`, `EmitList`\>\>

Defined in: [packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L54)

The subscription function context which will be passed into subscription function.

## Type Parameters

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)
