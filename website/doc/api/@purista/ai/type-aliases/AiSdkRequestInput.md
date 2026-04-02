[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkRequestInput

# Type Alias: AiSdkRequestInput

> **AiSdkRequestInput** = `object`

Defined in: [packages/ai/src/bridge/aiSdk.ts:24](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L24)

## Properties

### aiSdk?

> `optional` **aiSdk**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/bridge/aiSdk.ts:33](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L33)

***

### attachments?

> `optional` **attachments**: [`AgentAttachment`](AgentAttachment.md)[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:27](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L27)

***

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:28](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L28)

***

### input?

> `optional` **input**: [`AgentInputPart`](AgentInputPart.md)[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:26](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L26)

***

### instructions?

> `optional` **instructions**: `string` \| `string`[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:31](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L31)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/bridge/aiSdk.ts:32](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L32)

***

### prompt

> **prompt**: `string` \| `string`[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:25](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L25)

***

### referenceLabel?

> `optional` **referenceLabel**: `string`

Defined in: [packages/ai/src/bridge/aiSdk.ts:35](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L35)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:30](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L30)

***

### skillLabel?

> `optional` **skillLabel**: `string`

Defined in: [packages/ai/src/bridge/aiSdk.ts:34](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L34)

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/bridge/aiSdk.ts:29](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/bridge/aiSdk.ts#L29)
