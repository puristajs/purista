[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunStartInput

# Type Alias: AgentRunStartInput

> **AgentRunStartInput** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:185](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L185)

## Properties

### extraScope?

> `optional` **extraScope**: `Record`\<`string`, `string`\>

Defined in: [packages/ai/src/runtime/runState.ts:191](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L191)

***

### lock?

> `optional` **lock**: `boolean` \| [`AgentRunLockInput`](AgentRunLockInput.md)

Defined in: [packages/ai/src/runtime/runState.ts:192](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L192)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/runtime/runState.ts:190](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L190)

***

### owner?

> `optional` **owner**: [`AgentRunOwner`](AgentRunOwner.md)

Defined in: [packages/ai/src/runtime/runState.ts:193](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L193)

***

### phase?

> `optional` **phase**: `string`

Defined in: [packages/ai/src/runtime/runState.ts:188](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L188)

***

### recovery?

> `optional` **recovery**: [`AgentRunRecovery`](AgentRunRecovery.md)

Defined in: [packages/ai/src/runtime/runState.ts:195](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L195)

***

### retention?

> `optional` **retention**: [`AgentRunRetention`](AgentRunRetention.md)

Defined in: [packages/ai/src/runtime/runState.ts:194](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L194)

***

### runId?

> `optional` **runId**: `string`

Defined in: [packages/ai/src/runtime/runState.ts:186](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L186)

***

### status?

> `optional` **status**: `Exclude`\<[`AgentRunStatus`](AgentRunStatus.md), `"completed"` \| `"failed"` \| `"cancelled"`\>

Defined in: [packages/ai/src/runtime/runState.ts:189](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L189)

***

### title

> **title**: `string`

Defined in: [packages/ai/src/runtime/runState.ts:187](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/runState.ts#L187)
