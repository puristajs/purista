[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / CreateAgentBindingInput

# Type Alias: CreateAgentBindingInput

> **CreateAgentBindingInput** = [`BaseBindingFactoryInput`](BaseBindingFactoryInput.md) & `object`

Defined in: [packages/ai/src/bridge/externalRuntime.ts:57](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/bridge/externalRuntime.ts#L57)

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
