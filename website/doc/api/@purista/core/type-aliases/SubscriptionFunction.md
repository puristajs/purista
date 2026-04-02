[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunction

# Type Alias: SubscriptionFunction()\<ServiceClassType, FunctionPayloadType, FunctionParamsType, FunctionOutputType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes\>

> **SubscriptionFunction**\<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\> = (`this`, `context`, `payload`, `parameter`) => `Promise`\<`FunctionOutputType` \| [`SubscriptionHandlerResult`](SubscriptionHandlerResult.md)\>

Defined in: [core/types/subscription/SubscriptionFunction.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunction.ts#L15)

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

## Type Parameters

### ServiceClassType

`ServiceClassType` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### FunctionPayloadType

`FunctionPayloadType` = `unknown`

### FunctionParamsType

`FunctionParamsType` = `unknown`

### FunctionOutputType

`FunctionOutputType` = `unknown`

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

## Parameters

### this

`ServiceClassType`

### context

[`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<`Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`FunctionOutputType` \| [`SubscriptionHandlerResult`](SubscriptionHandlerResult.md)\>
