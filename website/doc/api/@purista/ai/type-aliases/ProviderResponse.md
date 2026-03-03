[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ProviderResponse

# Type Alias: ProviderResponse

> **ProviderResponse** = `object`

Defined in: [ai/src/providers/runtime/ModelProvider.ts:13](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L13)

Response emitted by a model provider.

## Properties

### costUsd?

> `optional` **costUsd**: `number`

Defined in: [ai/src/providers/runtime/ModelProvider.ts:19](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L19)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/providers/runtime/ModelProvider.ts:20](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L20)

***

### output

> **output**: `string`

Defined in: [ai/src/providers/runtime/ModelProvider.ts:14](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L14)

***

### tokens?

> `optional` **tokens**: `object`

Defined in: [ai/src/providers/runtime/ModelProvider.ts:15](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L15)

#### completion

> **completion**: `number`

#### prompt

> **prompt**: `number`
