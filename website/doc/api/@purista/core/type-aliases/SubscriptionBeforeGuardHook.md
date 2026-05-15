[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionBeforeGuardHook

# Type Alias: SubscriptionBeforeGuardHook\<S, FunctionPayloadType, FunctionParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes\>

> **SubscriptionBeforeGuardHook**\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\> = (`this`, `context`, `payload`, `parameter`) => `Promise`\<`void`\>

Defined in: [core/types/subscription/SubscriptionBeforeGuardHook.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionBeforeGuardHook.ts#L16)

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md) = [`ServiceClass`](../interfaces/ServiceClass.md)

### FunctionPayloadType

`FunctionPayloadType` = `unknown`

### FunctionParamsType

`FunctionParamsType` = `unknown`

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

## Parameters

### this

`S`

### context

[`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<`Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`void`\>
