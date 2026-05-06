[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ExposeHelpers

# Type Alias: ExposeHelpers

> **ExposeHelpers** = `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:82](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L82)

## Methods

### agent()

> **agent**(`agent`, `options?`): [`ExternalAgentBinding`](ExternalAgentBinding.md)

Defined in: [packages/ai/src/bridge/externalRuntime.ts:87](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L87)

#### Parameters

##### agent

[`AllowedAgentDefinition`](AllowedAgentDefinition.md)

##### options?

###### description?

`string`

###### name?

`string`

###### parameter?

`unknown`

###### resultMode?

[`ExternalResultMode`](ExternalResultMode.md)

#### Returns

[`ExternalAgentBinding`](ExternalAgentBinding.md)

***

### metadata()

> **metadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/bridge/externalRuntime.ts:97](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L97)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### tool()

> **tool**(`command`, `options?`): [`ExternalCommandBinding`](ExternalCommandBinding.md)

Defined in: [packages/ai/src/bridge/externalRuntime.ts:83](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L83)

#### Parameters

##### command

[`AllowedToolDefinition`](AllowedToolDefinition.md)

##### options?

###### description?

`string`

###### name?

`string`

###### parameter?

`unknown`

#### Returns

[`ExternalCommandBinding`](ExternalCommandBinding.md)

***

### tools()

> **tools**(`input`): [`ExternalBindingSet`](ExternalBindingSet.md)

Defined in: [packages/ai/src/bridge/externalRuntime.ts:96](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/bridge/externalRuntime.ts#L96)

#### Parameters

##### input

###### agents?

[`ExposedAgentInput`](ExposedAgentInput.md)[]

###### commands?

[`ExposedCommandInput`](ExposedCommandInput.md)[]

#### Returns

[`ExternalBindingSet`](ExternalBindingSet.md)
