[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRequest

# Type Alias: ProviderRequest

> **ProviderRequest** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:7](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L7)

Payload sent to a model provider.

## Properties

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:17](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L17)

***

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:9](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L9)

***

### developerInstruction?

> `optional` **developerInstruction**: `string` \| `string`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:14](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L14)

Optional high-priority app/developer instruction(s) injected on every call.
Providers may map these to dedicated instruction roles when supported.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:18](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L18)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:8](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L8)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:16](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L16)

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:15](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/providers/runtime/ModelProvider.ts#L15)
