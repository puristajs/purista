[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ExposeHelpers

# Type Alias: ExposeHelpers

> **ExposeHelpers** = `object`

Defined in: packages/ai/src/bridge/externalRuntime.ts:81

## Methods

### agent()

> **agent**(`agent`, `options?`): [`ExternalAgentBinding`](ExternalAgentBinding.md)

Defined in: packages/ai/src/bridge/externalRuntime.ts:86

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

Defined in: packages/ai/src/bridge/externalRuntime.ts:96

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### tool()

> **tool**(`command`, `options?`): [`ExternalCommandBinding`](ExternalCommandBinding.md)

Defined in: packages/ai/src/bridge/externalRuntime.ts:82

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

Defined in: packages/ai/src/bridge/externalRuntime.ts:95

#### Parameters

##### input

###### agents?

`ExposedAgentInput`[]

###### commands?

`ExposedCommandInput`[]

#### Returns

[`ExternalBindingSet`](ExternalBindingSet.md)
