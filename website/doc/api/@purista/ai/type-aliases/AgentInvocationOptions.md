[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptions

# Type Alias: AgentInvocationOptions

> **AgentInvocationOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:793](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L793)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/context.ts:794](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L794)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/context.ts:795](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L795)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:799](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L799)

***

### emitInvocationToolEvents?

> `optional` **emitInvocationToolEvents**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:810](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L810)

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:815](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L815)

Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
Defaults to `true`.

***

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: `boolean` \| \{ `artifacts?`: `boolean`; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}

Defined in: [packages/ai/src/runtime/context.ts:801](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L801)

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:797](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L797)

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:796](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L796)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:800](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L800)

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/context.ts:816](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L816)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/context.ts:798](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/runtime/context.ts#L798)
