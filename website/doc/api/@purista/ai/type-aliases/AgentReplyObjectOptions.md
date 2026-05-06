[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentReplyObjectOptions

# Type Alias: AgentReplyObjectOptions\<Alias, OutputSchema\>

> **AgentReplyObjectOptions**\<`Alias`, `OutputSchema`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:130](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L130)

Options for `context.ai.replyObject(...)`.

This helper is intended for the common "finalize a structured answer in the
current conversation" flow.

## Type Parameters

### Alias

`Alias` *extends* `string` = `string`

### OutputSchema

`OutputSchema` = `unknown`

## Properties

### assistantMetadata?

> `optional` **assistantMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/runtime/context.ts:150](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L150)

Optional metadata stored alongside the persisted assistant message.

***

### historyHeader?

> `optional` **historyHeader**: `string`

Defined in: [packages/ai/src/runtime/context.ts:144](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L144)

Header inserted before serialized conversation history when included.

***

### includeConversationHistory?

> `optional` **includeConversationHistory**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:142](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L142)

Include current conversation history in the prompt (default: `false`).

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/runtime/context.ts:146](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L146)

Optional provider metadata forwarded with the generation request.

***

### model

> **model**: `Alias`

Defined in: [packages/ai/src/runtime/context.ts:132](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L132)

Model alias declared via `builder.addModel(...)`.

***

### persistAssistantMessage?

> `optional` **persistAssistantMessage**: `boolean`

Defined in: [packages/ai/src/runtime/context.ts:148](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L148)

Persist a final assistant-visible message back into conversation history.

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/runtime/context.ts:134](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L134)

Prompt used for the structured reply generation call.

***

### schema

> **schema**: `OutputSchema`

Defined in: [packages/ai/src/runtime/context.ts:136](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L136)

Structured output schema used for generation and validation.

***

### selectMessage()?

> `optional` **selectMessage**: (`data`) => `string`

Defined in: [packages/ai/src/runtime/context.ts:152](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L152)

Select the assistant-visible message from the structured output.

#### Parameters

##### data

[`ProviderJsonOutputFromSchema`](ProviderJsonOutputFromSchema.md)\<`OutputSchema`, `unknown`\>

#### Returns

`string`

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/context.ts:140](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L140)

Conversation session id used for history lookup and optional persistence.

***

### system?

> `optional` **system**: `string` \| `string`[]

Defined in: [packages/ai/src/runtime/context.ts:138](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L138)

Optional developer/system instruction prepended to the request.
