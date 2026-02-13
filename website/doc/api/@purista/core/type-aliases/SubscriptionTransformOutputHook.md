[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionTransformOutputHook

# Type Alias: SubscriptionTransformOutputHook()\<S, FinalFunctionOutputType, FunctionParamsType, TransformOutputHookOutput\>

> **SubscriptionTransformOutputHook**\<`S`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`\> = (`this`, `context`, `payload`, `parameter`) => `Promise`\<`TransformOutputHookOutput`\>

Defined in: [core/types/subscription/SubscriptionTransformOutputHook.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionTransformOutputHook.ts#L9)

This transform hook is executed after function output validation and AfterGuardHooks.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### FinalFunctionOutputType

`FinalFunctionOutputType`

### FunctionParamsType

`FunctionParamsType`

### TransformOutputHookOutput

`TransformOutputHookOutput`

## Parameters

### this

`S`

### context

[`SubscriptionTransformFunctionContext`](SubscriptionTransformFunctionContext.md)

### payload

`Readonly`\<`FinalFunctionOutputType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`TransformOutputHookOutput`\>
