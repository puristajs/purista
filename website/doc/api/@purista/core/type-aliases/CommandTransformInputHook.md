[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandTransformInputHook

# Type Alias: CommandTransformInputHook()\<S, MessagePayloadType, MessageParamsType, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, Resources\>

> **CommandTransformInputHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<\{ `parameter`: `FunctionParamsType`; `payload`: `FunctionPayloadType`; \}\>

Defined in: [packages/core/src/core/types/commandType/CommandTransformInputHook.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandTransformInputHook.ts#L13)

The command transform gets the raw message payload and parameter input, which is validated against the transform input schemas.
The command transform function is called before guard hooks and before the actual command function.

It should throw HandledError or return an object with the transformed payload and parameter.
The type of returned payload and parameter must match the command function input for payload and parameter

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)

• **MessagePayloadType**

• **MessageParamsType**

• **TransformInputPayload**

• **TransformInputParams**

• **FunctionPayloadType**

• **FunctionParamsType**

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`CommandTransformFunctionContext`](CommandTransformFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`\>

### payload

`Readonly`\<`TransformInputPayload`\>

### parameter

`Readonly`\<`TransformInputParams`\>

## Returns

`Promise`\<\{ `parameter`: `FunctionParamsType`; `payload`: `FunctionPayloadType`; \}\>
