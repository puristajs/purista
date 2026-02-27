[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / EchoProvider

# Class: EchoProvider

Defined in: providers/runtime/ModelProvider.ts:33

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

Defined in: providers/runtime/ModelProvider.ts:34

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`name`](../interfaces/ModelProvider.md#name)

## Methods

### generate()

> **generate**(`request`): `Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

Defined in: providers/runtime/ModelProvider.ts:36

#### Parameters

##### request

[`ProviderRequest`](../type-aliases/ProviderRequest.md)

#### Returns

`Promise`\<[`ProviderResponse`](../type-aliases/ProviderResponse.md)\>

#### Implementation of

[`ModelProvider`](../interfaces/ModelProvider.md).[`generate`](../interfaces/ModelProvider.md#generate)
