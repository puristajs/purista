[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamObjectOptions

# Type Alias: AgentStreamObjectOptions\<Alias, T, OutputSchema\>

> **AgentStreamObjectOptions**\<`Alias`, `T`, `OutputSchema`\> = [`ProviderObjectStreamRequest`](ProviderObjectStreamRequest.md)\<`T`, `OutputSchema`\> & `object`

Defined in: [packages/ai/src/runtime/context.ts:191](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L191)

Options for `context.ai.streamObject(...)`.

Use `schema` for typed final object validation and optional stream publication
to the current protocol stream.

## Type Declaration

### model

> **model**: `Alias`

### publishToCurrentStream?

> `optional` **publishToCurrentStream**: [`AgentStreamObjectPublishOptions`](AgentStreamObjectPublishOptions.md)

## Type Parameters

### Alias

`Alias` *extends* `string` = `string`

### T

`T` = `unknown`

### OutputSchema

`OutputSchema` = `unknown`

## Example

```ts
const triage = await context.ai.streamObject({
  model: 'openai:gpt-4o-mini',
  prompt: payload.prompt,
  schema: supportAgentResponseSchema,
  publishToCurrentStream: { taskId: 'classify-urgency' },
})
```
