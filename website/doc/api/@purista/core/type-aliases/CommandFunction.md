[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunction

# Type Alias: CommandFunction()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, FunctionOutputType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes\>

> **CommandFunction**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\> = (`this`, `context`, `payload`, `parameter`) => `Promise`\<`FunctionOutputType`\>

Defined in: [core/types/commandType/CommandFunction.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunction.ts#L14)

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

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

## Parameters

### this

`S`

### context

[`CommandFunctionContext`](CommandFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`FunctionOutputType`\>
