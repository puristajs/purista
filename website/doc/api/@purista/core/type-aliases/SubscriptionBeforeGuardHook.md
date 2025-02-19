[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionBeforeGuardHook

# Type Alias: SubscriptionBeforeGuardHook()\<S, FunctionPayloadType, FunctionParamsType, Resources, Invokes, EmitList\>

> **SubscriptionBeforeGuardHook**\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `EmitList`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/subscription/SubscriptionBeforeGuardHook.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionBeforeGuardHook.ts#L14)

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md) = [`Service`](../classes/Service.md)

• **FunctionPayloadType** = `unknown`

• **FunctionParamsType** = `unknown`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<`Resources`, `Invokes`, `EmitList`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`void`\>
