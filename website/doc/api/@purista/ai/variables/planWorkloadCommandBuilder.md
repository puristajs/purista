[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / planWorkloadCommandBuilder

# Variable: planWorkloadCommandBuilder

> `const` **planWorkloadCommandBuilder**: [`CommandDefinitionBuilder`](../../core/classes/CommandDefinitionBuilder.md)\<[`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>\>, [`CommandDefinitionBuilderTypes`](../../core/type-aliases/CommandDefinitionBuilderTypes.md)\<`ZodObject`\<\{ `manifest`: `ZodObject`\<\{ `agentName`: `ZodString`; `agentVersion`: `ZodOptional`\<`ZodString`\>; `allowedTools`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `commandName`: `ZodString`; `description`: `ZodOptional`\<...\>; `serviceName`: `ZodString`; `version`: `ZodString`; \}, `$strip`\>\>\>; `description`: `ZodOptional`\<`ZodString`\>; `eventBridge`: `ZodDefault`\<`ZodString`\>; `modelResource`: `ZodObject`\<\{ `resourceName`: `ZodString`; `variant`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; \}, `$strip`\>; \}, `$strip`\>, [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\>

Defined in: [packages/ai/src/platform/runtime/AIOrchestratorService/commands/planWorkload.ts:41](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/platform/runtime/AIOrchestratorService/commands/planWorkload.ts#L41)
