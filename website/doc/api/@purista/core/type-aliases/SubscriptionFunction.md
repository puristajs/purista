[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionFunction

# Type Alias: SubscriptionFunction()\<ServiceClassType, FunctionPayloadType, FunctionParamsType, FunctionOutputType, Resources, Invokes, EmitList\>

> **SubscriptionFunction**\<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<`FunctionOutputType`\>

Defined in: [packages/core/src/core/types/subscription/SubscriptionFunction.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunction.ts#L11)

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

## Type Parameters

• **ServiceClassType** *extends* [`Service`](../classes/Service.md)

• **FunctionPayloadType** = `unknown`

• **FunctionParamsType** = `unknown`

• **FunctionOutputType** = `unknown`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`ServiceClassType`

### context

[`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<`Resources`, `Invokes`, `EmitList`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`FunctionOutputType`\>
