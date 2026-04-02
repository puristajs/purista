[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AppleContainerSandboxDriver

# Class: AppleContainerSandboxDriver

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:21](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L21)

AppleContainerSandboxDriver - macOS-focused local container driver.

It reuses Docker-compatible CLI semantics and is therefore suitable for
OrbStack/Colima-based development without changing sandbox command contracts.

## Implements

- [`SandboxDriver`](../interfaces/SandboxDriver.md)

## Constructors

### Constructor

> **new AppleContainerSandboxDriver**(`config`): `AppleContainerSandboxDriver`

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:25](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L25)

#### Parameters

##### config

[`DockerSandboxDriverConfig`](../interfaces/DockerSandboxDriverConfig.md)

#### Returns

`AppleContainerSandboxDriver`

## Properties

### name

> **name**: `string` = `'AppleContainerSandboxDriver'`

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:22](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L22)

The unique name of the driver implementation

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`name`](../interfaces/SandboxDriver.md#name)

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:33](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L33)

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

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:47](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L47)

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

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:51](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L51)

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

### getImageName()

> **getImageName**(): `string`

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:29](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L29)

#### Returns

`string`

***

### readFile()

> **readFile**(`params`): `Promise`\<`string`\>

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:59](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L59)

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

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:67](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L67)

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`scanRunningSandboxes`](../interfaces/SandboxDriver.md#scanrunningsandboxes)

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts:63](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/ai/src/sandbox/driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.ts#L63)

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
