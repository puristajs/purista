[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamTextOptions

# Type Alias: AgentStreamTextOptions\<Alias\>

> **AgentStreamTextOptions**\<`Alias`\> = [`ProviderGenerateTextRequest`](ProviderGenerateTextRequest.md) & `object`

Defined in: [packages/ai/src/runtime/context.ts:223](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L223)

Options for `context.ai.streamText(...)`.

## Type Declaration

### model

> **model**: `Alias`

### publishToCurrentStream?

> `optional` **publishToCurrentStream**: [`AgentStreamTextPublishOptions`](AgentStreamTextPublishOptions.md)

## Type Parameters

### Alias

`Alias` *extends* `string` = `string`

## Example

```ts
const answer = await context.ai.streamText({
  model: 'openai:gpt-4o-mini',
  prompt: payload.prompt,
  publishToCurrentStream: { taskId: 'draft-answer' },
})
```
