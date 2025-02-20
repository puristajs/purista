[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionTransformInputHook

# Type Alias: SubscriptionTransformInputHook()\<S, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType\>

> **SubscriptionTransformInputHook**\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<\{ `parameter`: `Readonly`\<`FunctionParamsType`\>; `payload`: `Readonly`\<`FunctionPayloadType`\>; \}\>

Defined in: [packages/core/src/core/types/subscription/SubscriptionTransformInputHook.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionTransformInputHook.ts#L7)

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)

• **TransformInputPayload**

• **TransformInputParams**

• **FunctionPayloadType**

• **FunctionParamsType**

## Parameters

### this

`S`

### context

[`SubscriptionTransformFunctionContext`](SubscriptionTransformFunctionContext.md)

### payload

`Readonly`\<`TransformInputPayload`\>

### parameter

`Readonly`\<`TransformInputParams`\>

## Returns

`Promise`\<\{ `parameter`: `Readonly`\<`FunctionParamsType`\>; `payload`: `Readonly`\<`FunctionPayloadType`\>; \}\>
