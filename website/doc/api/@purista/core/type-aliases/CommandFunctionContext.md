[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunctionContext

# Type Alias: CommandFunctionContext\<MessagePayloadType, MessageParamsType, Resources, Invokes, EmitList\>

> **CommandFunctionContext**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `EmitList`\>: [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md) & [`CommandFunctionContextEnhancements`](CommandFunctionContextEnhancements.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `EmitList`\>\>

Defined in: [packages/core/src/core/types/commandType/CommandFunctionContext.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L55)

The command function context which will be passed into command function.

## Type Parameters

• **MessagePayloadType** = `unknown`

• **MessageParamsType** = `unknown`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = [`EmptyObject`](EmptyObject.md)
