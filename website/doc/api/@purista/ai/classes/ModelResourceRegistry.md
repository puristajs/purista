[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelResourceRegistry

# Class: ModelResourceRegistry

Defined in: providers/resources/ModelResourceRegistry.ts:13

Simple registry that maps resource names to provider implementations.

## Example

```ts
const registry = new ModelResourceRegistry(new EchoProvider())
registry.register('anthropic:claude-3', claudeProvider)
const provider = registry.get('anthropic:claude-3')
```

## Constructors

### Constructor

> **new ModelResourceRegistry**(`defaultProvider`): `ModelResourceRegistry`

Defined in: providers/resources/ModelResourceRegistry.ts:16

#### Parameters

##### defaultProvider

[`ModelProvider`](../interfaces/ModelProvider.md)

#### Returns

`ModelResourceRegistry`

## Methods

### get()

> **get**(`name`): [`ModelProvider`](../interfaces/ModelProvider.md) \| `undefined`

Defined in: providers/resources/ModelResourceRegistry.ts:24

#### Parameters

##### name

`string`

#### Returns

[`ModelProvider`](../interfaces/ModelProvider.md) \| `undefined`

***

### register()

> **register**(`name`, `provider`): `void`

Defined in: providers/resources/ModelResourceRegistry.ts:20

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

Defined in: providers/resources/ModelResourceRegistry.ts:28

#### Returns

`string`[]
