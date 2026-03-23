[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentBindingInput

# Type Alias: CreateAgentBindingInput

> **CreateAgentBindingInput** = [`BaseBindingFactoryInput`](BaseBindingFactoryInput.md) & `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:57](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/bridge/externalRuntime.ts#L57)

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
