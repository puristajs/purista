[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandTransformOutputHook

# Type Alias: CommandTransformOutputHook()\<S, MessagePayloadType, MessageParamsType, FinalFunctionOutputType, FunctionParamsType, TransformOutputHookOutput, Resources\>

> **CommandTransformOutputHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`, `Resources`\> = (`this`, `context`, `input`, `params`) => `Promise`\<`TransformOutputHookOutput`\>

Defined in: [core/types/commandType/CommandTransformOutputHook.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandTransformOutputHook.ts#L15)

This transform hook is executed after function output validation and AfterGuardHooks.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType`

### MessageParamsType

`MessageParamsType`

### FinalFunctionOutputType

`FinalFunctionOutputType`

### FunctionParamsType

`FunctionParamsType`

### TransformOutputHookOutput

`TransformOutputHookOutput`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`CommandTransformFunctionContext`](CommandTransformFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`\>

the Context

### input

`Readonly`\<`FinalFunctionOutputType`\>

The output result output of command function

### params

`Readonly`\<`FunctionParamsType`\>

The parameter input given to command function

## Returns

`Promise`\<`TransformOutputHookOutput`\>

The transformed message payload
