[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunLockHandle

# Type Alias: AgentRunLockHandle

> **AgentRunLockHandle** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:224](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/runState.ts#L224)

## Properties

### lock

> **lock**: [`AgentRunLock`](AgentRunLock.md)

Defined in: [packages/ai/src/runtime/runState.ts:225](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/runState.ts#L225)

## Methods

### heartbeat()

> **heartbeat**(`ttlMs?`): `Promise`\<\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:226](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/runState.ts#L226)

#### Parameters

##### ttlMs?

`number`

#### Returns

`Promise`\<\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}\>

***

### release()

> **release**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:227](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/runtime/runState.ts#L227)

#### Returns

`Promise`\<`void`\>
