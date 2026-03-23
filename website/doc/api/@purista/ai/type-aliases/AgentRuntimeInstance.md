[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeInstance

# Type Alias: AgentRuntimeInstance

> **AgentRuntimeInstance** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:67](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L67)

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:72](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L72)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getStatus()

> **getStatus**(): [`AgentRuntimeStatus`](AgentRuntimeStatus.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:71](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L71)

#### Returns

[`AgentRuntimeStatus`](AgentRuntimeStatus.md)

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:70](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L70)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:68](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L68)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:69](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/types/AgentDefinition.ts#L69)

#### Returns

`Promise`\<`void`\>
