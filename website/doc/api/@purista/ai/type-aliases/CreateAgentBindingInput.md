[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentBindingInput

# Type Alias: CreateAgentBindingInput

> **CreateAgentBindingInput** = [`BaseBindingFactoryInput`](BaseBindingFactoryInput.md) & `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:57](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/bridge/externalRuntime.ts#L57)

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
