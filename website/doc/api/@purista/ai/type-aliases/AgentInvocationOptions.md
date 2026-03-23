[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptions

# Type Alias: AgentInvocationOptions

> **AgentInvocationOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:629](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L629)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/context.ts:630](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L630)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/context.ts:631](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L631)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:635](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L635)

***

### emitInvocationToolEvents?

> `optional` **emitInvocationToolEvents**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:646](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L646)

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:651](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L651)

Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
Defaults to `true`.

***

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: `boolean` \| \{ `artifacts?`: `boolean`; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}

Defined in: [packages/ai/src/runtime/context.ts:637](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L637)

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:633](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L633)

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:632](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L632)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:636](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L636)

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/context.ts:652](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L652)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/context.ts:634](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/context.ts#L634)
