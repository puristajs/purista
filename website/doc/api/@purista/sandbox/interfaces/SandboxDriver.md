[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / SandboxDriver

# Interface: SandboxDriver

Defined in: [sandbox-service/src/types/SandboxDriver.ts:60](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L60)

Interface for sandbox drivers.
Implement this interface to add support for new virtualization backends.

## Properties

### name

> **name**: `string`

Defined in: [sandbox-service/src/types/SandboxDriver.ts:62](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L62)

The unique name of the driver implementation

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:70](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L70)

Provisions and starts a new sandbox environment.

#### Parameters

##### params

Configuration for the new sandbox

###### gitConfig?

\{ `email`: `string`; `token?`: `string`; `username`: `string`; \}

###### gitConfig.email

`string`

###### gitConfig.token?

`string`

###### gitConfig.username

`string`

###### organizationId

`string`

###### projectId

`string`

###### sandboxId

`string`

###### userId

`string`

#### Returns

`Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

The sandbox ID and underlying container name

***

### destroySandbox()

> **destroySandbox**(`params`): `Promise`\<`void`\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:87](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L87)

Permanently removes a sandbox and its resources.

#### Parameters

##### params

Reference to the sandbox to destroy

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>

***

### executeBash()

> **executeBash**(`params`): `Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:95](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L95)

Executes a bash command within the specified sandbox.

#### Parameters

##### params

Command and execution context

###### command

`string`

###### cwd?

`string`

###### sandboxId

`string`

#### Returns

`Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

The result of the command execution

***

### readFile()

> **readFile**(`params`): `Promise`\<`string`\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:102](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L102)

Reads the content of a file from the sandbox.

#### Parameters

##### params

Path to the file

###### path

`string`

###### sandboxId

`string`

#### Returns

`Promise`\<`string`\>

***

### scanRunningSandboxes()

> **scanRunningSandboxes**(): `Promise`\<`object`[]\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:115](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L115)

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [sandbox-service/src/types/SandboxDriver.ts:109](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/types/SandboxDriver.ts#L109)

Writes one or more files to the sandbox workspace.

#### Parameters

##### params

Map of file paths to their contents

###### files

`Record`\<`string`, `string`\>

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>
