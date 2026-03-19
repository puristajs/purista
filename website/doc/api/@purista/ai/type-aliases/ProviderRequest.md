[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderRequest

# Type Alias: ProviderRequest

> **ProviderRequest** = `object`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:4](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/ModelProvider.ts#L4)

Payload sent to a model provider.

## Properties

### context?

> `optional` **context**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:6](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/ModelProvider.ts#L6)

***

### developerInstruction?

> `optional` **developerInstruction**: `string` \| `string`[]

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:11](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/ModelProvider.ts#L11)

Optional high-priority app/developer instruction(s) injected on every call.
Providers may map these to dedicated instruction roles when supported.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:12](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/ModelProvider.ts#L12)

***

### prompt

> **prompt**: `string`

Defined in: [packages/ai/src/providers/runtime/ModelProvider.ts:5](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/providers/runtime/ModelProvider.ts#L5)
