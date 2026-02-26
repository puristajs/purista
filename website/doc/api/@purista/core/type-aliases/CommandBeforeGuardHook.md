[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandBeforeGuardHook

# Type Alias: CommandBeforeGuardHook()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, Resources, Invokes, StreamInvokes, EmitList\>

> **CommandBeforeGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`\> = (`this`, `context`, `payload`, `parameter`) => `Promise`\<`void`\>

Defined in: [core/types/commandType/CommandBeforeGuardHook.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandBeforeGuardHook.ts#L16)

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md) = [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

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

## Parameters

### this

`S`

### context

[`CommandFunctionContext`](CommandFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`void`\>
