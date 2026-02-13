[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionAfterGuardHook

# Type Alias: SubscriptionAfterGuardHook()\<ServiceClassType, FunctionResultType, FunctionPayloadOutputType, FunctionParameterType, Resources, Invokes, EmitList\>

> **SubscriptionAfterGuardHook**\<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadOutputType`, `FunctionParameterType`, `Resources`, `Invokes`, `EmitList`\> = (`this`, `context`, `result`, `payload`, `parameter`) => `Promise`\<`void`\>

Defined in: [core/types/subscription/SubscriptionAfterGuardHook.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionAfterGuardHook.ts#L13)

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

## Type Parameters

### ServiceClassType

`ServiceClassType` = [`ServiceClass`](../interfaces/ServiceClass.md)

### FunctionResultType

`FunctionResultType` = `unknown`

### FunctionPayloadOutputType

`FunctionPayloadOutputType` = `unknown`

### FunctionParameterType

`FunctionParameterType` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`ServiceClassType`

### context

[`SubscriptionFunctionContext`](SubscriptionFunctionContext.md)\<`Resources`, `Invokes`, `EmitList`\>

### result

`Readonly`\<`FunctionResultType`\>

### payload

`Readonly`\<`FunctionPayloadOutputType`\>

### parameter

`Readonly`\<`FunctionParameterType`\>

## Returns

`Promise`\<`void`\>
