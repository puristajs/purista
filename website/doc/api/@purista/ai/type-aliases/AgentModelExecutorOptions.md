[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentModelExecutorOptions

# Type Alias: AgentModelExecutorOptions\<Alias, OutputSchema\>

> **AgentModelExecutorOptions**\<`Alias`, `OutputSchema`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:256](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L256)

Declarative model-executor options for planner worker/delegates.

`id` and `description` are optional; runtime creates deterministic defaults.
Provide `schema` to enable structured-object execution automatically.
Without `schema`, execution defaults to streamed text.

## Example

```ts
const worker = context.ai.createModelExecutor({
  model: 'openai:gpt-4o-mini',
  systemPrompt: 'You are a concise support assistant.',
})

const triage = context.ai.createModelExecutor({
  id: 'triage',
  model: 'openai:gpt-4o-mini',
  schema: supportAgentResponseSchema,
})
```

## Type Parameters

### Alias

`Alias` *extends* `string` = `string`

### OutputSchema

`OutputSchema` = `undefined`

## Properties

### description?

> `optional` **description**: `string`

Defined in: [packages/ai/src/runtime/context.ts:260](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L260)

Optional planner description. Auto-generated if omitted.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/ai/src/runtime/context.ts:258](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L258)

Optional stable id. Auto-generated if omitted.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/runtime/context.ts:272](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L272)

Optional invocation metadata forwarded to the provider.

***

### model

> **model**: `Alias`

Defined in: [packages/ai/src/runtime/context.ts:262](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L262)

Model alias declared via `builder.addModel(...)`.

***

### publishToCurrentStream?

> `optional` **publishToCurrentStream**: `Omit`\<[`AgentStreamObjectPublishOptions`](AgentStreamObjectPublishOptions.md), `"taskId"`\>

Defined in: [packages/ai/src/runtime/context.ts:281](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L281)

Optional publication settings for current stream/task lanes.

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/runtime/context.ts:270](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L270)

Optional inlined skill reference documents.

***

### schema?

> `optional` **schema**: `OutputSchema`

Defined in: [packages/ai/src/runtime/context.ts:277](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L277)

Structured output schema.
When present, the executor runs in object mode and returns typed object output.

***

### sections?

> `optional` **sections**: [`ProviderObjectStreamRequest`](ProviderObjectStreamRequest.md)\<`unknown`, `OutputSchema`\>\[`"sections"`\]

Defined in: [packages/ai/src/runtime/context.ts:279](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L279)

Optional section streaming instructions for object mode.

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/runtime/context.ts:268](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L268)

Optional inlined skill documents.

***

### systemPrompt?

> `optional` **systemPrompt**: `string` \| `string`[]

Defined in: [packages/ai/src/runtime/context.ts:264](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L264)

Developer/system instruction prepended on each task call.

***

### tools?

> `optional` **tools**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/runtime/context.ts:266](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L266)

Optional allowlisted tool/agent bindings for the model call.
