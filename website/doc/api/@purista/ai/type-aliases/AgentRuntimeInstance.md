[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeInstance

# Type Alias: AgentRuntimeInstance

> **AgentRuntimeInstance** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:66](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L66)

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:71](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L71)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getStatus()

> **getStatus**(): [`AgentRuntimeStatus`](AgentRuntimeStatus.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:70](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L70)

#### Returns

[`AgentRuntimeStatus`](AgentRuntimeStatus.md)

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:69](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L69)

#### Parameters

##### request

[`AgentInvokeRequest`](AgentInvokeRequest.md)

##### contextOverrides?

`Partial`\<[`AgentInvokeContext`](AgentInvokeContext.md)\>

#### Returns

`Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:67](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L67)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:68](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/types/AgentDefinition.ts#L68)

#### Returns

`Promise`\<`void`\>
