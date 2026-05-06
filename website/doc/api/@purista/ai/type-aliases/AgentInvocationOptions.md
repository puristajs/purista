[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptions

# Type Alias: AgentInvocationOptions

> **AgentInvocationOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:1313](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1313)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/context.ts:1314](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1314)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:1320](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1320)

***

### deliveryMode?

> `optional` **deliveryMode**: [`AgentInvocationDeliveryMode`](AgentInvocationDeliveryMode.md)

Defined in: [packages/ai/src/runtime/context.ts:1346](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1346)

***

### emitInvocationToolEvents?

> `optional` **emitInvocationToolEvents**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:1339](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1339)

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:1344](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1344)

Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
Defaults to `true`.

***

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: `boolean` \| \{ `artifacts?`: `boolean` \| \{ `files?`: `boolean`; `generic?`: `boolean`; `output?`: `boolean`; `sources?`: `boolean`; `workflow?`: `boolean`; \}; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}

Defined in: [packages/ai/src/runtime/context.ts:1322](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1322)

***

### outputSchema?

> `optional` **outputSchema**: [`Schema`](../../core/type-aliases/Schema.md)

Defined in: [packages/ai/src/runtime/context.ts:1318](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1318)

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:1317](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1317)

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:1316](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1316)

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [packages/ai/src/runtime/context.ts:1315](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1315)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:1321](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1321)

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/context.ts:1345](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1345)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/context.ts:1319](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L1319)
