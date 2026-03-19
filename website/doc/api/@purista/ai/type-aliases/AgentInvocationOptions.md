[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptions

# Type Alias: AgentInvocationOptions

> **AgentInvocationOptions** = `object`

Defined in: [packages/ai/src/runtime/context.ts:745](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L745)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/context.ts:746](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L746)

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/context.ts:747](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L747)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:751](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L751)

***

### emitInvocationToolEvents?

> `optional` **emitInvocationToolEvents**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:762](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L762)

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:767](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L767)

Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
Defaults to `true`.

***

### forwardToCurrentStream?

> `optional` **forwardToCurrentStream**: `boolean` \| \{ `artifacts?`: `boolean`; `assistant?`: `boolean`; `errors?`: `boolean`; `reasoning?`: `boolean`; `toolEvents?`: `boolean`; \}

Defined in: [packages/ai/src/runtime/context.ts:753](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L753)

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:749](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L749)

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/context.ts:748](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L748)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:752](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L752)

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/context.ts:768](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L768)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/context.ts:750](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L750)
