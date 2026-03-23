[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / enqueueRunCommandBuilder

# Variable: enqueueRunCommandBuilder

> `const` **enqueueRunCommandBuilder**: [`CommandDefinitionBuilder`](../../core/classes/CommandDefinitionBuilder.md)\<[`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>\>, [`CommandDefinitionBuilderTypes`](../../core/type-aliases/CommandDefinitionBuilderTypes.md)\<`ZodObject`\<\{ `context`: `ZodOptional`\<`ZodString`\>; `manifestName`: `ZodString`; `manifestVersion`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `prompt`: `ZodString`; `sessionId`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>, [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md) & `Record`\<`"aiWorkloads"`, (`payload`, `parameter`, `options?`) => `Promise`\<[`QueueEnqueueResult`](../../core/type-aliases/QueueEnqueueResult.md)\>\>\>\>

Defined in: [packages/ai/src/platform/runtime/AIOrchestratorService/commands/enqueueRun.ts:21](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/platform/runtime/AIOrchestratorService/commands/enqueueRun.ts#L21)
