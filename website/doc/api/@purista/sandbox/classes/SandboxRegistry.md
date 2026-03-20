[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / SandboxRegistry

# Class: SandboxRegistry

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:11](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L11)

SandboxRegistry - A state-store backed registry for tracking active sandboxes.
This class handles the persistence of sandbox metadata and provides reconciliation
logic for self-healing after service restarts.

## Constructors

### Constructor

> **new SandboxRegistry**(`store`): `SandboxRegistry`

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:19](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L19)

#### Parameters

##### store

[`StateStore`](../../core/interfaces/StateStore.md)

The PURISTA StateStore instance to use for persistence.

#### Returns

`SandboxRegistry`

## Methods

### findByOwner()

> **findByOwner**(`owner`): `Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `userId`: `string`; \} \| `undefined`\>

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:80](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L80)

Returns metadata for an existing sandbox bound to the same owner tuple.

#### Parameters

##### owner

###### organizationId

`string`

###### projectId

`string`

###### userId

`string`

#### Returns

`Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `userId`: `string`; \} \| `undefined`\>

***

### getMetadata()

> **getMetadata**(`sandboxId`): `Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `userId`: `string`; \} \| `undefined`\>

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:65](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L65)

Retrieves metadata for a specific sandbox.

#### Parameters

##### sandboxId

`string`

Unique ID of the sandbox.

#### Returns

`Promise`\<\{ `containerName`: `string`; `createdAt`: `number`; `gitConfigured?`: `boolean`; `organizationId`: `string`; `projectId`: `string`; `sandboxId`: `string`; `userId`: `string`; \} \| `undefined`\>

Metadata object or undefined if not found or invalid.

***

### reconcile()

> **reconcile**(`sandboxes`): `Promise`\<`void`\>

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:113](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L113)

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

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:36](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L36)

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

###### userId

`string` = `...`

#### Returns

`Promise`\<`void`\>

***

### unregister()

> **unregister**(`sandboxId`): `Promise`\<`void`\>

Defined in: [sandbox-service/src/resources/SandboxRegistry.ts:47](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/resources/SandboxRegistry.ts#L47)

Removes a sandbox from the registry.

#### Parameters

##### sandboxId

`string`

Unique ID of the sandbox to unregister.

#### Returns

`Promise`\<`void`\>
