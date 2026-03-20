[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptions

# Type Alias: AgentInvocationOptions

> **AgentInvocationOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:603](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L603)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/context.ts:604](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L604)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/context.ts:605](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L605)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:609](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L609)

***

### emitInvocationToolEvents?

> `optional` **emitInvocationToolEvents**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:620](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L620)

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:625](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L625)

Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
Defaults to `true`.

***

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: `boolean` \| \{ `artifacts?`: `boolean`; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}

Defined in: [packages/ai/src/runtime/context.ts:611](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L611)

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:607](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L607)

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:606](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L606)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:610](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L610)

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/context.ts:626](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L626)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/context.ts:608](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/runtime/context.ts#L608)
