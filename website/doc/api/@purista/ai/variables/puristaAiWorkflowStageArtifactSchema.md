[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / puristaAiWorkflowStageArtifactSchema

# Variable: puristaAiWorkflowStageArtifactSchema

> `const` **puristaAiWorkflowStageArtifactSchema**: `ZodObject`\<\{ `finalMessage`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `runId`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\{ `completed`: `"completed"`; `failed`: `"failed"`; `running`: `"running"`; \}\>; `summary`: `ZodOptional`\<`ZodString`\>; `type`: `ZodLiteral`\<`"purista-ai-workflow-stage"`\>; `updatedAt`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: packages/ai/src/protocol/taskArtifacts.ts:151
