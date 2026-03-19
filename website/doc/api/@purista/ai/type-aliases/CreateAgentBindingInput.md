[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentBindingInput

# Type Alias: CreateAgentBindingInput

> **CreateAgentBindingInput** = `BaseBindingFactoryInput` & `object`

Defined in: packages/ai/src/bridge/externalRuntime.ts:57

## Type Declaration

### agent

> **agent**: [`AllowedAgentDefinition`](AllowedAgentDefinition.md)

### execute()

> **execute**: (`payload`, `parameter?`) => `Promise`\<`unknown`\>

#### Parameters

##### payload

`unknown`

##### parameter?

`unknown`

#### Returns

`Promise`\<`unknown`\>

### resultMode?

> `optional` **resultMode**: [`ExternalResultMode`](ExternalResultMode.md)
