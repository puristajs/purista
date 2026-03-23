[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptions

# Type Alias: AgentInvocationOptions

> **AgentInvocationOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:621](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L621)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/context.ts:622](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L622)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/context.ts:623](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L623)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:627](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L627)

***

### emitInvocationToolEvents?

> `optional` **emitInvocationToolEvents**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:638](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L638)

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:643](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L643)

Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
Defaults to `true`.

***

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: `boolean` \| \{ `artifacts?`: `boolean`; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}

Defined in: [packages/ai/src/runtime/context.ts:629](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L629)

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:625](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L625)

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:624](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L624)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:628](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L628)

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/context.ts:644](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L644)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/context.ts:626](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/runtime/context.ts#L626)
