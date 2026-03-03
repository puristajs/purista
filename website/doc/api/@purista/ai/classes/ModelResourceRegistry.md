[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelResourceRegistry

# Class: ModelResourceRegistry

Defined in: [ai/src/providers/resources/ModelResourceRegistry.ts:14](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L14)

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

Defined in: [ai/src/providers/resources/ModelResourceRegistry.ts:17](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L17)

#### Parameters

##### defaultProvider

[`ModelProvider`](../interfaces/ModelProvider.md)

#### Returns

`ModelResourceRegistry`

## Methods

### get()

> **get**(`name`): [`ModelProvider`](../interfaces/ModelProvider.md) \| `undefined`

Defined in: [ai/src/providers/resources/ModelResourceRegistry.ts:25](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L25)

#### Parameters

##### name

`string`

#### Returns

[`ModelProvider`](../interfaces/ModelProvider.md) \| `undefined`

***

### register()

> **register**(`name`, `provider`): `void`

Defined in: [ai/src/providers/resources/ModelResourceRegistry.ts:21](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L21)

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

Defined in: [ai/src/providers/resources/ModelResourceRegistry.ts:29](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L29)

#### Returns

`string`[]
