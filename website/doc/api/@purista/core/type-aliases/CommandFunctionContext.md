[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandFunctionContext

# Type Alias: CommandFunctionContext\<MessagePayloadType, MessageParamsType, Resources, Invokes, EmitList\>

> **CommandFunctionContext**\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `EmitList`\> = [`Prettify`](Prettify.md)\<[`ContextBase`](ContextBase.md) & [`CommandFunctionContextEnhancements`](CommandFunctionContextEnhancements.md)\<`MessagePayloadType`, `MessageParamsType`, `Resources`, `Invokes`, `EmitList`\>\>

Defined in: [core/types/commandType/CommandFunctionContext.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L57)

The command function context which will be passed into command function.

## Type Parameters

### MessagePayloadType

`MessagePayloadType` = `unknown`

### MessageParamsType

`MessageParamsType` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md) = [`EmptyObject`](EmptyObject.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\> = [`EmptyObject`](EmptyObject.md)
