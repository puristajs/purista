[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / EchoProvider

# Class: EchoProvider

Defined in: [ai/src/providers/runtime/ModelProvider.ts:34](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L34)

Deterministic provider useful for tests and docs; just echoes the prompt back.

## Implements

- [`ModelProvider`](../interfaces/ModelProvider.md)

## Constructors

### Constructor

> **new EchoProvider**(): `EchoProvider`

#### Returns

`EchoProvider`

## Properties

### name

> `readonly` **name**: `"echo"` = `'echo'`

Defined in: [ai/src/providers/runtime/ModelProvider.ts:35](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L35)

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: [ai/src/providers/runtime/ModelProvider.ts:37](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/runtime/ModelProvider.ts#L37)

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generate`](../interfaces/ModelProvider.md#generate)
