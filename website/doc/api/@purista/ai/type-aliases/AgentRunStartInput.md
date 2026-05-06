[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunStartInput

# Type Alias: AgentRunStartInput

> **AgentRunStartInput** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:327](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L327)

## Properties

### lock?

> `optional` **lock**: `boolean` \| [`AgentRunLockInput`](AgentRunLockInput.md)

Defined in: [packages/ai/src/runtime/runState.ts:334](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L334)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/runtime/runState.ts:332](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L332)

***

### owner?

> `optional` **owner**: [`AgentRunOwner`](AgentRunOwner.md)

Defined in: [packages/ai/src/runtime/runState.ts:335](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L335)

***

### phase?

> `optional` **phase**: `string`

Defined in: [packages/ai/src/runtime/runState.ts:330](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L330)

***

### recovery?

> `optional` **recovery**: [`AgentRunRecovery`](AgentRunRecovery.md)

Defined in: [packages/ai/src/runtime/runState.ts:337](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L337)

***

### retention?

> `optional` **retention**: [`AgentRunRetention`](AgentRunRetention.md)

Defined in: [packages/ai/src/runtime/runState.ts:336](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L336)

***

### runId?

> `optional` **runId**: `string`

Defined in: [packages/ai/src/runtime/runState.ts:328](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L328)

***

### scope?

> `optional` **scope**: `Record`\<`string`, `string`\>

Defined in: [packages/ai/src/runtime/runState.ts:333](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L333)

***

### status?

> `optional` **status**: `Exclude`\<[`AgentRunStatus`](AgentRunStatus.md), `"completed"` \| `"failed"` \| `"cancelled"`\>

Defined in: [packages/ai/src/runtime/runState.ts:331](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L331)

***

### title

> **title**: `string`

Defined in: [packages/ai/src/runtime/runState.ts:329](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L329)
