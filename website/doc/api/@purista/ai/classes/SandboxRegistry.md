[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxRegistry

# Class: SandboxRegistry

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:12](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L12)

SandboxRegistry - A state-store backed registry for tracking active sandboxes.
This class handles the persistence of sandbox metadata and provides reconciliation
logic for self-healing after service restarts.

## Constructors

### Constructor

> **new SandboxRegistry**(`store`): `SandboxRegistry`

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:21](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L21)

#### Parameters

##### store

[`StateStore`](../../core/interfaces/StateStore.md)

The PURISTA StateStore instance to use for persistence.

#### Returns

`SandboxRegistry`

## Methods

### findByOwner()

> **findByOwner**(`owner`): `Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `scope?`: \{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}; `userId`: `string`; \} \| `undefined`\>

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:103](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L103)

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

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:88](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L88)

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

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:220](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L220)

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

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:59](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L59)

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

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:70](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L70)

Removes a sandbox from the registry.

#### Parameters

##### sandboxId

`string`

Unique ID of the sandbox to unregister.

#### Returns

`Promise`\<`void`\>

***

### withOwnerProvisionLock()

> **withOwnerProvisionLock**\<`T`\>(`owner`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/ai/src/sandbox/resources/SandboxRegistry.ts:196](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/resources/SandboxRegistry.ts#L196)

Runs owner-scoped provisioning work under a persistent lock.

#### Type Parameters

##### T

`T`

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

##### fn

() => `Promise`\<`T`\>

##### options?

###### lockTtlMs?

`number`

###### pollIntervalMs?

`number`

###### waitTimeoutMs?

`number`

#### Returns

`Promise`\<`T`\>
