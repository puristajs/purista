[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / puristaAiPlanStatusArtifactSchema

# Variable: puristaAiPlanStatusArtifactSchema

> `const` **puristaAiPlanStatusArtifactSchema**: `ZodObject`\<\{ `activeTaskId`: `ZodOptional`\<`ZodString`\>; `finalMessage`: `ZodOptional`\<`ZodString`\>; `phase`: `ZodString`; `runId`: `ZodString`; `status`: `ZodEnum`\<\{ `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `idle`: `"idle"`; `planning`: `"planning"`; `queued`: `"queued"`; `recovering`: `"recovering"`; `retrying`: `"retrying"`; `running`: `"running"`; `summarizing`: `"summarizing"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; `title`: `ZodString`; `type`: `ZodLiteral`\<`"purista-ai-plan-status"`\>; \}, `$strip`\>

Defined in: packages/ai/src/protocol/taskArtifacts.ts:136
