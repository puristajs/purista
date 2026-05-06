[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunLockHandle

# Type Alias: AgentRunLockHandle

> **AgentRunLockHandle** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:366](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L366)

## Properties

### lock

> **lock**: [`AgentRunLock`](AgentRunLock.md)

Defined in: [packages/ai/src/runtime/runState.ts:367](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L367)

## Methods

### heartbeat()

> **heartbeat**(`ttlMs?`): `Promise`\<\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:368](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L368)

#### Parameters

##### ttlMs?

`number`

#### Returns

`Promise`\<\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}\>

***

### release()

> **release**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:369](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L369)

#### Returns

`Promise`\<`void`\>
