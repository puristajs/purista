[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunctionContextEnhancements

# Type Alias: CommandFunctionContextEnhancements\<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes\>

> **CommandFunctionContextEnhancements**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\> = `object`

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

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`EmptyObject`](EmptyObject.md)

## Properties

### emit

> **emit**: [`EmitCustomMessageFunction`](EmitCustomMessageFunction.md)\<`EmitList`\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L36)

emit a custom message

***

### invokeAgent

> **invokeAgent**: `AgentInvokes`

Defined in: [core/types/commandType/CommandFunctionContext.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L64)

Invokes an agent and returns the result.

***

### message

> **message**: `Readonly`\<[`Command`](Command.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L34)

the original message

***

### queue

> **queue**: [`QueueContext`](QueueContext.md)\<`QueueInvokes`\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L56)

typed queue enqueue helpers

***

### resources

> **resources**: `Resources`

Defined in: [core/types/commandType/CommandFunctionContext.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L60)

Provides resources defined in service builder and set via config during service creation

***

### service

> **service**: `Invokes`

Defined in: [core/types/commandType/CommandFunctionContext.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L52)

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

Defined in: [core/types/commandType/CommandFunctionContext.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L54)

consumes stream responses from other service stream endpoints
