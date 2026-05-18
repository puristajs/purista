[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunctionContextEnhancements

# Type Alias: CommandFunctionContextEnhancements\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes\>

> **CommandFunctionContextEnhancements**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\> = `object`

Defined in: [core/types/commandType/CommandFunctionContext.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L23)

It provides the original command message with types for payload and parameter.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

## Type Parameters

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

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

## Properties

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L35)

emit a custom message

***

### message

> **message**: `Readonly`\<[`Command`](Command.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L33)

the original message

***

### queue

> **queue**: [`QueueContext`](QueueContext.md)\<`QueueInvokes`\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L55)

typed queue enqueue helpers

***

### resources

> **resources**: `Resources`

Defined in: [core/types/commandType/CommandFunctionContext.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L59)

Provides resources defined in service builder and set via config during service creation

***

### service

> **service**: `Invokes`

Defined in: [core/types/commandType/CommandFunctionContext.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L51)

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

#### Example

```typescript
// define your invocation in command builder
.canInvoke('ServiceA', '1', 'test', responseOutputSchema, payloadSchema, parameterSchema)
.setCommandFunction(async function (context, payload, _parameter) {
   const inputPayload = { my: 'input' }
   const inputParameter = { search: 'for_me' }
   const result = await context.service.ServiceA[1].test(inputPayload,inputParameter)
})
```

***

### stream

> **stream**: `StreamInvokes`

Defined in: [core/types/commandType/CommandFunctionContext.ts:53](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L53)

consumes stream responses from other service stream endpoints
