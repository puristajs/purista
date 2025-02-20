[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionTransformOutputHook

# Type Alias: SubscriptionTransformOutputHook()\<S, FinalFunctionOutputType, FunctionParamsType, TransformOutputHookOutput\>

> **SubscriptionTransformOutputHook**\<`S`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<`TransformOutputHookOutput`\>

Defined in: [packages/core/src/core/types/subscription/SubscriptionTransformOutputHook.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionTransformOutputHook.ts#L9)

This transform hook is executed after function output validation and AfterGuardHooks.

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)

• **FinalFunctionOutputType**

• **FunctionParamsType**

• **TransformOutputHookOutput**

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
