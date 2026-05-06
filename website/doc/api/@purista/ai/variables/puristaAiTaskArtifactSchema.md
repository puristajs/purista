[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / puristaAiTaskArtifactSchema

# Variable: puristaAiTaskArtifactSchema

> `const` **puristaAiTaskArtifactSchema**: `ZodObject`\<\{ `approval`: `ZodOptional`\<`ZodUnknown`\>; `completedAt`: `ZodOptional`\<`ZodString`\>; `delegate`: `ZodOptional`\<`ZodString`\>; `dependsOn`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `detail`: `ZodOptional`\<`ZodString`\>; `executor`: `ZodOptional`\<`ZodUnknown`\>; `handoff`: `ZodOptional`\<`ZodUnknown`\>; `input`: `ZodOptional`\<`ZodUnknown`\>; `instruction`: `ZodOptional`\<`ZodString`\>; `kind`: `ZodOptional`\<`ZodEnum`\<\{ `agent`: `"agent"`; `approval`: `"approval"`; `checkpoint`: `"checkpoint"`; `custom`: `"custom"`; `model`: `"model"`; `reasoning`: `"reasoning"`; `tool`: `"tool"`; \}\>\>; `order`: `ZodNumber`; `output`: `ZodOptional`\<`ZodUnknown`\>; `retryPolicy`: `ZodOptional`\<`ZodUnknown`\>; `runId`: `ZodString`; `startedAt`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `blocked`: `"blocked"`; `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `pending`: `"pending"`; `running`: `"running"`; `waiting-approval`: `"waiting-approval"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; `taskId`: `ZodString`; `timeoutMs`: `ZodOptional`\<`ZodNumber`\>; `title`: `ZodString`; `type`: `ZodLiteral`\<`"purista-ai-task"`\>; `updatedAt`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: packages/ai/src/protocol/taskArtifacts.ts:93
