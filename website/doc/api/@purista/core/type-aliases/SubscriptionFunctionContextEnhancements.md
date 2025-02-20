[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunctionContextEnhancements

# Type Alias: SubscriptionFunctionContextEnhancements\<Resources, Invokes, EmitList\>

> **SubscriptionFunctionContextEnhancements**\<`Resources`, `Invokes`, `EmitList`\>: `object`

Defined in: [packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L18)

It provides the original command message.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

## Type Parameters

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)

## Type declaration

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

emit a custom message

### message

> **message**: `Readonly`\<[`EBMessage`](EBMessage.md)\>

the original message

### resources

> **resources**: `Resources`

Provides resources defined in service builder and set via config during service creation

### service

> **service**: `Invokes`

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
