[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRequest

# Type Alias: ProviderRequest

> **ProviderRequest** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:16](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L16)

Payload sent to a model provider.

`prompt` remains the convenience field for pure text requests.
`input` and `attachments` are the canonical multimodal surfaces.

Applications should pass already-normalized parts into providers.
File extraction itself belongs behind a file-ingestion adapter and is not
built into the framework for PDF/Office formats.

## Properties

### attachments?

> `optional` **attachments**: [`AgentAttachment`](AgentAttachment.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:19](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L19)

***

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:48](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L48)

Optional executable bindings for allowlisted PURISTA commands and child agents.

In normal PURISTA handler code you can usually omit this field when calling
`context.models['alias'].generateText(...)`. The agent runtime automatically
exposes the allowlisted commands and agents declared in the builder.

***

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:20](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L20)

***

### developerInstruction?

> `optional` **developerInstruction**: `string` \| `string`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:25](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L25)

Optional high-priority app/developer instruction(s) injected on every call.
Providers may map these to dedicated instruction roles when supported.

***

### input?

> `optional` **input**: [`AgentInputPart`](AgentInputPart.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:18](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L18)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:49](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L49)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:17](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L17)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:40](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L40)

Optional reference documents belonging to already selected skills.

References are not auto-loaded because they are usually a more deliberate,
skill-specific choice made by the handler.

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:33](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/providers/runtime/ModelProvider.ts#L33)

Optional skill documents that shape reasoning and prompt context.

In normal PURISTA handler code you can usually omit this field when calling
`context.models['alias'].generateText(...)`. The agent runtime automatically
loads the skills declared via `builder.useSkills([...])` and fills them in.
