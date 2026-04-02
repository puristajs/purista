[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionInput

# Type Alias: AgentExecutionInput

> **AgentExecutionInput** = `object`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:36](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L36)

Payload the executor receives whenever a run is initiated.

For multimodal requests, keep `prompt` as the human-visible text task and
pass files/images through `input` or `attachments`.

## Properties

### attachments?

> `optional` **attachments**: [`AgentAttachment`](AgentAttachment.md)[]

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:40](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L40)

***

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:41](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L41)

***

### input?

> `optional` **input**: [`AgentInputPart`](AgentInputPart.md)[]

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:39](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L39)

***

### metadata?

> `optional` **metadata**: [`ProviderRequest`](ProviderRequest.md)\[`"metadata"`\]

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:42](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L42)

***

### principalId?

> `optional` **principalId**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:44](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L44)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:38](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L38)

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:37](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L37)

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/ai/src/runtime/AgentExecutor.ts:43](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/AgentExecutor.ts#L43)
