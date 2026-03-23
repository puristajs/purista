[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxRegistry

# Class: SandboxRegistry

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:11

SandboxRegistry - A state-store backed registry for tracking active sandboxes.
This class handles the persistence of sandbox metadata and provides reconciliation
logic for self-healing after service restarts.

## Constructors

### Constructor

> **new SandboxRegistry**(`store`): `SandboxRegistry`

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:19

#### Parameters

##### store

[`StateStore`](../../core/interfaces/StateStore.md)

The PURISTA StateStore instance to use for persistence.

#### Returns

`SandboxRegistry`

## Methods

### findByOwner()

> **findByOwner**(`owner`): `Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `userId`: `string`; \} \| `undefined`\>

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:92

Returns metadata for an existing sandbox bound to the same owner tuple.

#### Parameters

##### owner

###### organizationId

`string`

###### projectId

`string`

###### scope?

\{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}

###### userId

`string`

#### Returns

`Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `userId`: `string`; \} \| `undefined`\>

***

### getMetadata()

> **getMetadata**(`sandboxId`): `Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `userId`: `string`; \} \| `undefined`\>

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:77

Retrieves metadata for a specific sandbox.

#### Parameters

##### sandboxId

`string`

Unique ID of the sandbox.

#### Returns

`Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `userId`: `string`; \} \| `undefined`\>

Metadata object or undefined if not found or invalid.

***

### reconcile()

> **reconcile**(`sandboxes`): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:127

Reconciles a list of discovered sandboxes with the persistent registry.
Discovered sandboxes that are missing from the registry are added.

#### Parameters

##### sandboxes

`object`[]

List of sandboxes discovered by the driver (e.g., from Docker labels).

#### Returns

`Promise`\<`void`\>

***

### register()

> **register**(`metadata`): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:48

Registers a new sandbox in the persistent state store.

#### Parameters

##### metadata

Full metadata of the sandbox to register.

###### containerName

`string` = `...`

###### createdAt

`number` = `...`

###### gitConfigured?

`boolean` = `...`

Indicates if Git/GitHub was configured

###### organizationId

`string` = `...`

###### projectId

`string` = `...`

###### sandboxId

`string` = `...`

###### scope?

\{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \} = `...`

###### userId

`string` = `...`

#### Returns

`Promise`\<`void`\>

***

### unregister()

> **unregister**(`sandboxId`): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/resources/SandboxRegistry.ts:59

Removes a sandbox from the registry.

#### Parameters

##### sandboxId

`string`

Unique ID of the sandbox to unregister.

#### Returns

`Promise`\<`void`\>
