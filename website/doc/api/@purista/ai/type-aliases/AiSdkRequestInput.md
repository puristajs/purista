[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkRequestInput

# Type Alias: AiSdkRequestInput

> **AiSdkRequestInput** = `object`

Defined in: [packages/ai/src/bridge/aiSdk.ts:16](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L16)

## Properties

### aiSdk?

> `optional` **aiSdk**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/bridge/aiSdk.ts:23](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L23)

***

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:18](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L18)

***

### instructions?

> `optional` **instructions**: `string` \| `string`[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:21](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L21)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/bridge/aiSdk.ts:22](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L22)

***

### prompt

> **prompt**: `string` \| `string`[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:17](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L17)

***

### referenceLabel?

> `optional` **referenceLabel**: `string`

Defined in: [packages/ai/src/bridge/aiSdk.ts:25](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L25)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:20](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L20)

***

### skillLabel?

> `optional` **skillLabel**: `string`

Defined in: [packages/ai/src/bridge/aiSdk.ts:24](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L24)

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:19](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/aiSdk.ts#L19)
