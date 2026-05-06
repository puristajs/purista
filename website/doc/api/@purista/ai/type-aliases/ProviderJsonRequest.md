[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderJsonRequest

# Type Alias: ProviderJsonRequest\<OutputSchema\>

> **ProviderJsonRequest**\<`OutputSchema`\> = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:71](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L71)

Payload sent to structured JSON generation capable providers.

The runtime compiles Standard Schema or plain JSON Schema inputs into
provider-safe structured-output schemas before the request reaches the SDK.

`input` and `attachments` follow the same multimodal rules as
[ProviderRequest](ProviderRequest.md).

## Type Parameters

### OutputSchema

`OutputSchema` = `unknown`

## Properties

### attachments?

> `optional` **attachments**: [`AgentAttachment`](AgentAttachment.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:74](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L74)

***

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:79](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L79)

***

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:75](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L75)

***

### developerInstruction?

> `optional` **developerInstruction**: `string` \| `string`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:76](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L76)

***

### input?

> `optional` **input**: [`AgentInputPart`](AgentInputPart.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:73](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L73)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:81](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L81)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:72](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L72)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:78](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L78)

***

### schema?

> `optional` **schema**: `OutputSchema`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:80](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L80)

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:77](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/providers/runtime/ModelProvider.ts#L77)
