[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamObjectPublishOptions

# Type Alias: AgentStreamObjectPublishOptions

> **AgentStreamObjectPublishOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:160](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L160)

## Properties

### artifactIdPrefix?

> `optional` **artifactIdPrefix**: `string`

Defined in: [packages/ai/src/runtime/context.ts:162](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L162)

Prefix for section artifact ids (default: `<sectionName>`).

***

### emitSectionsAsArtifacts?

> `optional` **emitSectionsAsArtifacts**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:168](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L168)

Emit section artifacts on the protocol lane (default: true).

***

### renderSectionDelta()?

> `optional` **renderSectionDelta**: (`input`) => `string` \| `undefined`

Defined in: [packages/ai/src/runtime/context.ts:164](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L164)

Optional projection from section content to assistant text deltas.

#### Parameters

##### input

###### content

`unknown`

###### section

`string`

#### Returns

`string` \| `undefined`

***

### statusAsReasoning?

> `optional` **statusAsReasoning**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:166](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L166)

Emit provider status updates as reasoning artifacts (default: true).

***

### taskChunkKind?

> `optional` **taskChunkKind**: `string`

Defined in: [packages/ai/src/runtime/context.ts:172](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L172)

Override task chunk kind used for emitted task-chunk artifacts.

***

### taskId?

> `optional` **taskId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:170](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L170)

Optional task id for automatic `purista-ai:task-chunk:<taskId>` publication.
