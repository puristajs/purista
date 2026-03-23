[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / LimaSandboxDriver

# Class: LimaSandboxDriver

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:21

LimaSandboxDriver - A 100% Open Source driver for Apple Silicon and Linux.
It uses 'limactl' to manage Linux VMs and can natively leverage Apple's Virtualization Framework (vz).
Best for users who want to avoid the licensing constraints of Tart/OrbStack.

## Implements

- [`SandboxDriver`](../interfaces/SandboxDriver.md)

## Constructors

### Constructor

> **new LimaSandboxDriver**(`config`): `LimaSandboxDriver`

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:25

#### Parameters

##### config

[`LimaSandboxDriverConfig`](../interfaces/LimaSandboxDriverConfig.md)

#### Returns

`LimaSandboxDriver`

## Properties

### name

> **name**: `string` = `'LimaSandboxDriver'`

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:22

The unique name of the driver implementation

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`name`](../interfaces/SandboxDriver.md#name)

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:36

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

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`createSandbox`](../interfaces/SandboxDriver.md#createsandbox)

***

### destroySandbox()

> **destroySandbox**(`params`): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:99

Permanently removes a sandbox and its resources.

#### Parameters

##### params

Reference to the sandbox to destroy

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`destroySandbox`](../interfaces/SandboxDriver.md#destroysandbox)

***

### executeBash()

> **executeBash**(`params`): `Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:111

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

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`executeBash`](../interfaces/SandboxDriver.md#executebash)

***

### readFile()

> **readFile**(`params`): `Promise`\<`string`\>

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:130

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

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`readFile`](../interfaces/SandboxDriver.md#readfile)

***

### scanRunningSandboxes()

> **scanRunningSandboxes**(): `Promise`\<`object`[]\>

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:146

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`scanRunningSandboxes`](../interfaces/SandboxDriver.md#scanrunningsandboxes)

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:136

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

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`writeFiles`](../interfaces/SandboxDriver.md#writefiles)
