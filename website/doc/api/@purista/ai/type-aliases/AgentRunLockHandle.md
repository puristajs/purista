[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRunLockHandle

# Type Alias: AgentRunLockHandle

> **AgentRunLockHandle** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:224](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/runState.ts#L224)

## Properties

### lock

> **lock**: [`AgentRunLock`](AgentRunLock.md)

Defined in: [packages/ai/src/runtime/runState.ts:225](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/runState.ts#L225)

## Methods

### heartbeat()

> **heartbeat**(`ttlMs?`): `Promise`\<\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}\>

Defined in: [packages/ai/src/runtime/runState.ts:226](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/runState.ts#L226)

#### Parameters

##### ttlMs?

`number`

#### Returns

`Promise`\<\{ `acquiredAt`: `string`; `expiresAt`: `string`; `heartbeatAt`: `string`; `key`: `string`; `lockId`: `string`; `runId?`: `string`; `scopeKey`: `string`; \}\>

***

### release()

> **release**(): `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:227](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/runState.ts#L227)

#### Returns

`Promise`\<`void`\>
