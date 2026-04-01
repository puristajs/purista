[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderJsonRequest

# Type Alias: ProviderJsonRequest

> **ProviderJsonRequest** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:70](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L70)

Payload sent to structured JSON generation capable providers.

The runtime compiles Standard Schema or plain JSON Schema inputs into
provider-safe structured-output schemas before the request reaches the SDK.

`input` and `attachments` follow the same multimodal rules as
[ProviderRequest](ProviderRequest.md).

## Properties

### attachments?

> `optional` **attachments**: [`AgentAttachment`](AgentAttachment.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:73](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L73)

***

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:78](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L78)

***

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:74](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L74)

***

### developerInstruction?

> `optional` **developerInstruction**: `string` \| `string`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:75](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L75)

***

### input?

> `optional` **input**: [`AgentInputPart`](AgentInputPart.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:72](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L72)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:80](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L80)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:71](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L71)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:77](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L77)

***

### schema?

> `optional` **schema**: `unknown`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:79](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L79)

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:76](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L76)
