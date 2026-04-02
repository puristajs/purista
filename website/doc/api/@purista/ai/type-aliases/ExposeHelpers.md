[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ExposeHelpers

# Type Alias: ExposeHelpers

> **ExposeHelpers** = `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:81](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/bridge/externalRuntime.ts#L81)

## Methods

### agent()

> **agent**(`agent`, `options?`): [`ExternalAgentBinding`](ExternalAgentBinding.md)

Defined in: [packages/ai/src/bridge/externalRuntime.ts:86](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/bridge/externalRuntime.ts#L86)

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

Defined in: [packages/ai/src/bridge/externalRuntime.ts:96](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/bridge/externalRuntime.ts#L96)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### tool()

> **tool**(`command`, `options?`): [`ExternalCommandBinding`](ExternalCommandBinding.md)

Defined in: [packages/ai/src/bridge/externalRuntime.ts:82](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/bridge/externalRuntime.ts#L82)

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

Defined in: [packages/ai/src/bridge/externalRuntime.ts:95](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/bridge/externalRuntime.ts#L95)

#### Parameters

##### input

###### agents?

[`ExposedAgentInput`](ExposedAgentInput.md)[]

###### commands?

[`ExposedCommandInput`](ExposedCommandInput.md)[]

#### Returns

[`ExternalBindingSet`](ExternalBindingSet.md)
