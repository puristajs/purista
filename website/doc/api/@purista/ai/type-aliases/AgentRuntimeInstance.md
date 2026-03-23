[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeInstance

# Type Alias: AgentRuntimeInstance\<EmitPayloads\>

> **AgentRuntimeInstance**\<`EmitPayloads`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:101](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L101)

## Type Parameters

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:109](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L109)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getStatus()

> **getStatus**(): [`AgentRuntimeStatus`](AgentRuntimeStatus.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:108](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L108)

#### Returns

[`AgentRuntimeStatus`](AgentRuntimeStatus.md)

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:104](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L104)

#### Parameters

##### request

[`AgentInvokeRequest`](AgentInvokeRequest.md)

##### contextOverrides?

`Partial`\<[`AgentInvokeContext`](AgentInvokeContext.md)\<`EmitPayloads`\>\>

#### Returns

`Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:102](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L102)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:103](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/types/AgentDefinition.ts#L103)

#### Returns

`Promise`\<`void`\>
