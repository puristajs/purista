[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createScopedSessionId

# Function: createScopedSessionId()

> **createScopedSessionId**(`input`): `string`

Defined in: [packages/ai/src/runtime/sessionIdentity.ts:29](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/sessionIdentity.ts#L29)

Returns a stable scoped session id that keeps tenant/principal/agent histories isolated.

## Parameters

### input

[`ScopedSessionIdInput`](../type-aliases/ScopedSessionIdInput.md)

## Returns

`string`

## Example

```ts
const scoped = createScopedSessionId({
  agentName: 'supportAgent',
  agentVersion: '1',
  baseSessionId: 'msg-1',
  tenantId: 'tenant-a',
  principalId: 'user-42',
})
// supportAgent:1:tenant-a:user-42:msg-1
```
