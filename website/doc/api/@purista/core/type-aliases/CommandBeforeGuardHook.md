[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandBeforeGuardHook

# Type Alias: CommandBeforeGuardHook()\<S, MessagePayloadType, MessageParamsType, FunctionPayloadType, FunctionParamsType, Resources, Invokes, EmitList\>

> **CommandBeforeGuardHook**\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `EmitList`\>: (`this`, `context`, `payload`, `parameter`) => `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/commandType/CommandBeforeGuardHook.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandBeforeGuardHook.ts#L13)

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md) = [`Service`](../classes/Service.md)

• **MessagePayloadType** = `unknown`

• **MessageParamsType** = `unknown`

• **FunctionPayloadType** = `unknown`

• **FunctionParamsType** = `unknown`

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

`Promise`\<`void`\>
