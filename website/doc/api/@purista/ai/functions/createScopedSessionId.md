[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createScopedSessionId

# Function: createScopedSessionId()

> **createScopedSessionId**(`input`): `string`

Defined in: [packages/ai/src/runtime/sessionIdentity.ts:29](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/sessionIdentity.ts#L29)

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
