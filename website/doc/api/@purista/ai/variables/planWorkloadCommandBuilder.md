[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / planWorkloadCommandBuilder

# Variable: planWorkloadCommandBuilder

> `const` **planWorkloadCommandBuilder**: [`CommandDefinitionBuilder`](../../core/classes/CommandDefinitionBuilder.md)\<[`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>\>, [`CommandDefinitionBuilderTypes`](../../core/type-aliases/CommandDefinitionBuilderTypes.md)\<`ZodObject`\<\{ `manifest`: `ZodObject`\<\{ `allowedTools`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `commandName`: `ZodString`; `description`: `ZodOptional`\<...\>; `serviceName`: `ZodString`; `version`: `ZodString`; \}, `$strip`\>\>\>; `concurrency`: `ZodOptional`\<`ZodObject`\<\{ `maxParallel`: `ZodNumber`; `poolId`: `ZodString`; \}, `$strip`\>\>; `description`: `ZodOptional`\<`ZodString`\>; `modelResource`: `ZodObject`\<\{ `name`: `ZodString`; `provider`: `ZodOptional`\<`ZodString`\>; `variant`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `name`: `ZodString`; `runtime`: `ZodDefault`\<`ZodEnum`\<\{ `async`: `"async"`; `scheduled`: `"scheduled"`; `streaming`: `"streaming"`; `sync`: `"sync"`; \}\>\>; `version`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; \}, `$strip`\>, [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>\>\>

Defined in: runtime/services/AIOrchestratorService/commands/planWorkload.ts:53
