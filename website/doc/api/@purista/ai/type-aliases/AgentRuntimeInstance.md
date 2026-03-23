[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeInstance

# Type Alias: AgentRuntimeInstance\<EmitPayloads\>

> **AgentRuntimeInstance**\<`EmitPayloads`\> = `object`

Defined in: [packages/ai/src/types/AgentDefinition.ts:102](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L102)

## Type Parameters

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Methods

### getExternalRuntimeMetadata()

> **getExternalRuntimeMetadata**(): [`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:127](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L127)

#### Returns

[`ExternalRuntimeMetadata`](ExternalRuntimeMetadata.md)

***

### getService()

> **getService**(): [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\> \| `undefined`

Defined in: [packages/ai/src/types/AgentDefinition.ts:121](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L121)

Return the underlying PURISTA service instance backing this agent runtime.

This is mainly useful for HTTP/bootstrap integration where services need to be
registered with another PURISTA-aware runtime, for example an HTTP server.

#### Returns

[`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\> \| `undefined`

#### Example

```ts
const instance = await supportAgent.getInstance(eventBridge, { models })
await instance.start()
const service = instance.getService()
if (service) {
  httpService.registerService(service)
}
```

***

### getStatus()

> **getStatus**(): [`AgentRuntimeStatus`](AgentRuntimeStatus.md)

Defined in: [packages/ai/src/types/AgentDefinition.ts:126](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L126)

#### Returns

[`AgentRuntimeStatus`](AgentRuntimeStatus.md)

***

### invoke()

> **invoke**(`request`, `contextOverrides?`): `Promise`\<[`AgentInvokeResult`](AgentInvokeResult.md)\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:122](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L122)

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

Defined in: [packages/ai/src/types/AgentDefinition.ts:103](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L103)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/types/AgentDefinition.ts:104](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/types/AgentDefinition.ts#L104)

#### Returns

`Promise`\<`void`\>
