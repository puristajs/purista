[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunction

# Type Alias: CommandFunction()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, FunctionOutputType, Resources, Invokes, EmitList\>

> **CommandFunction**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<`FunctionOutputType`\>

Defined in: [packages/core/src/core/types/commandType/CommandFunction.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunction.ts#L12)

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

## Type Parameters

• **S** *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

• **MessagePayloadType** = `unknown`

• **MessageParamsType** = `unknown`

• **FunctionPayloadType** = `unknown`

• **FunctionParamsType** = `unknown`

• **FunctionOutputType** = `unknown`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`CommandFunctionContext`](CommandFunctionContext.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `EmitList`\>

### payload

`Readonly`\<`FunctionPayloadType`\>

### parameter

`Readonly`\<`FunctionParamsType`\>

## Returns

`Promise`\<`FunctionOutputType`\>
