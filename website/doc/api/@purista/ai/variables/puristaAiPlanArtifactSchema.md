[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / puristaAiPlanArtifactSchema

# Variable: puristaAiPlanArtifactSchema

> `const` **puristaAiPlanArtifactSchema**: `ZodObject`\<\{ `phase`: `ZodString`; `runId`: `ZodString`; `status`: `ZodEnum`\<\{ `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `idle`: `"idle"`; `planning`: `"planning"`; `queued`: `"queued"`; `recovering`: `"recovering"`; `retrying`: `"retrying"`; `running`: `"running"`; `summarizing`: `"summarizing"`; \}\>; `tasks`: `ZodArray`\<`ZodObject`\<\{ `approval`: `ZodOptional`\<`ZodUnknown`\>; `completedAt`: `ZodOptional`\<`ZodString`\>; `delegate`: `ZodOptional`\<`ZodString`\>; `dependsOn`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `detail`: `ZodOptional`\<`ZodString`\>; `executor`: `ZodOptional`\<`ZodUnknown`\>; `handoff`: `ZodOptional`\<`ZodUnknown`\>; `id`: `ZodString`; `input`: `ZodOptional`\<`ZodUnknown`\>; `instruction`: `ZodOptional`\<`ZodString`\>; `kind`: `ZodOptional`\<`ZodEnum`\<\{ `agent`: `"agent"`; `approval`: `"approval"`; `checkpoint`: `"checkpoint"`; `custom`: `"custom"`; `model`: `"model"`; `reasoning`: `"reasoning"`; `tool`: `"tool"`; \}\>\>; `order`: `ZodNumber`; `output`: `ZodOptional`\<`ZodUnknown`\>; `retryPolicy`: `ZodOptional`\<`ZodUnknown`\>; `startedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `blocked`: `"blocked"`; `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `pending`: `"pending"`; `running`: `"running"`; `waiting-approval`: `"waiting-approval"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; `timeoutMs`: `ZodOptional`\<`ZodNumber`\>; `title`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; `title`: `ZodString`; `type`: `ZodLiteral`\<`"purista-ai-plan"`\>; \}, `$strip`\>

Defined in: packages/ai/src/protocol/taskArtifacts.ts:80
