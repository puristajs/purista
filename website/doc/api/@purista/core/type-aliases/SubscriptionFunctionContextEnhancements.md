[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunctionContextEnhancements

# Type Alias: SubscriptionFunctionContextEnhancements\<Resources, Invokes, StreamInvokes, EmitList, QueueInvokes\>

> **SubscriptionFunctionContextEnhancements**\<`Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\> = `object`

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L22)

It provides the original command message.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

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

## Properties

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L32)

emit a custom message

***

### message

> **message**: `Readonly`\<[`EBMessage`](EBMessage.md)\>

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L30)

the original message

***

### queue

> **queue**: [`QueueContext`](QueueContext.md)\<`QueueInvokes`\>

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L51)

***

### resources

> **resources**: `Resources`

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L55)

Provides resources defined in service builder and set via config during service creation

***

### service

> **service**: `Invokes`

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L48)

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

#### Example

```typescript
// define your invocation in subscription builder
.canInvoke<{ response: string }>('ServiceA', '1', 'test', payloadSchema, parameterSchema)
.setCommandFunction(async function (context, payload, _parameter) {
   const inputPayload = { my: 'input' }
   const inputParameter = { search: 'for_me' }
   const result = await context.service.ServiceA[1].test(inputPayload,inputParameter)
})
```

***

### stream

> **stream**: `StreamInvokes`

Defined in: [core/types/subscription/SubscriptionFunctionContext.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L50)

consumes stream responses from other service stream endpoints
