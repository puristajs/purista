[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeInstance

# Type Alias: AgentRuntimeInstance

> **AgentRuntimeInstance** = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:79](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L79)

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:84](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L84)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getStatus()

> **getStatus**(): [`AgentRuntimeStatus`](AgentRuntimeStatus.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:83](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L83)

#### Returns

[`AgentRuntimeStatus`](AgentRuntimeStatus.md)

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:82](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L82)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:80](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L80)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:81](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/types/AgentDefinition.ts#L81)

#### Returns

`Promise`\<`void`\>
