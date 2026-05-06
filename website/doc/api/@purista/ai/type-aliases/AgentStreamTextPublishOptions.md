[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamTextPublishOptions

# Type Alias: AgentStreamTextPublishOptions

> **AgentStreamTextPublishOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:200](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L200)

## Properties

### reasoningAsArtifacts?

> `optional` **reasoningAsArtifacts**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:208](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L208)

Emit reasoning as artifacts while streaming text (default: true).

***

### summary?

> `optional` **summary**: `string`

Defined in: [packages/ai/src/runtime/context.ts:206](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L206)

Optional summary attached to the final message frame.

***

### taskChunkKind?

> `optional` **taskChunkKind**: `string`

Defined in: [packages/ai/src/runtime/context.ts:204](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L204)

Override task chunk kind used for emitted text chunks.

***

### taskId?

> `optional` **taskId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:202](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L202)

Optional task id for automatic `purista-ai:task-chunk:<taskId>` publication.
