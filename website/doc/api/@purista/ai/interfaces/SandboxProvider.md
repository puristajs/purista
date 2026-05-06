[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxProvider

# Interface: SandboxProvider

Defined in: packages/ai/src/sandbox/provider.ts:73

## Methods

### createAdapter()

> **createAdapter**(`input`): [`SandboxAdapter`](../type-aliases/SandboxAdapter.md)

Defined in: packages/ai/src/sandbox/provider.ts:75

#### Parameters

##### input

[`SandboxProviderCreateAdapterInput`](../type-aliases/SandboxProviderCreateAdapterInput.md)

#### Returns

[`SandboxAdapter`](../type-aliases/SandboxAdapter.md)

***

### destroySandbox()?

> `optional` **destroySandbox**(`input`): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/provider.ts:76

#### Parameters

##### input

[`SandboxProviderCreateAdapterInput`](../type-aliases/SandboxProviderCreateAdapterInput.md)

#### Returns

`Promise`\<`void`\>

***

### ensureSandbox()

> **ensureSandbox**(`input`): `Promise`\<\{ `created`: `boolean`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `status`: `"ready"` \| `"starting"` \| `"failed"`; `subject`: \{ `principalId`: `string`; `projectId`: `string`; `tenantId`: `string`; \}; \}\>

Defined in: packages/ai/src/sandbox/provider.ts:74

#### Parameters

##### input

[`SandboxProviderEnsureInput`](../type-aliases/SandboxProviderEnsureInput.md)

#### Returns

`Promise`\<\{ `created`: `boolean`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `status`: `"ready"` \| `"starting"` \| `"failed"`; `subject`: \{ `principalId`: `string`; `projectId`: `string`; `tenantId`: `string`; \}; \}\>
