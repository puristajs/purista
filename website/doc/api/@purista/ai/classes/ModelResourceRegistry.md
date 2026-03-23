[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelResourceRegistry

# Class: ModelResourceRegistry

Defined in: [packages/ai/src/providers/resources/ModelResourceRegistry.ts:13](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L13)

Simple registry that maps resource names to provider implementations.

## Example

```ts
const registry = new ModelResourceRegistry()
registry.register('anthropic:claude-3', claudeProvider)
const provider = registry.get('anthropic:claude-3')
```

## Constructors

### Constructor

> **new ModelResourceRegistry**(): `ModelResourceRegistry`

#### Returns

`ModelResourceRegistry`

## Methods

### get()

> **get**(`name`): [`ModelProvider`](../interfaces/ModelProvider.md) \| `undefined`

Defined in: [packages/ai/src/providers/resources/ModelResourceRegistry.ts:20](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L20)

#### Parameters

##### name

`string`

#### Returns

[`ModelProvider`](../interfaces/ModelProvider.md) \| `undefined`

***

### register()

> **register**(`name`, `provider`): `void`

Defined in: [packages/ai/src/providers/resources/ModelResourceRegistry.ts:16](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L16)

#### Parameters

##### name

`string`

##### provider

[`ModelProvider`](../interfaces/ModelProvider.md)

#### Returns

`void`

***

### snapshot()

> **snapshot**(): `string`[]

Defined in: [packages/ai/src/providers/resources/ModelResourceRegistry.ts:24](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L24)

#### Returns

`string`[]
