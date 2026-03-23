[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRequest

# Type Alias: ProviderRequest

> **ProviderRequest** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:7](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L7)

Payload sent to a model provider.

## Properties

### bindings?

> `optional` **bindings**: [`ExternalBindingSet`](ExternalBindingSet.md) \| [`ExternalBinding`](ExternalBinding.md)[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:37](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L37)

Optional executable bindings for allowlisted PURISTA commands and child agents.

In normal PURISTA handler code you can usually omit this field when calling
`context.models['alias'].generateText(...)`. The agent runtime automatically
exposes the allowlisted commands and agents declared in the builder.

***

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:9](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L9)

***

### developerInstruction?

> `optional` **developerInstruction**: `string` \| `string`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:14](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L14)

Optional high-priority app/developer instruction(s) injected on every call.
Providers may map these to dedicated instruction roles when supported.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:38](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L38)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:8](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L8)

***

### references?

> `optional` **references**: `Pick`\<[`SkillReferenceDocument`](SkillReferenceDocument.md), `"skillName"` \| `"relativePath"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:29](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L29)

Optional reference documents belonging to already selected skills.

References are not auto-loaded because they are usually a more deliberate,
skill-specific choice made by the handler.

***

### skills?

> `optional` **skills**: `Pick`\<[`SkillDocument`](SkillDocument.md), `"name"` \| `"content"`\>[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:22](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/providers/runtime/ModelProvider.ts#L22)

Optional skill documents that shape reasoning and prompt context.

In normal PURISTA handler code you can usually omit this field when calling
`context.models['alias'].generateText(...)`. The agent runtime automatically
loads the skills declared via `builder.useSkills([...])` and fills them in.
