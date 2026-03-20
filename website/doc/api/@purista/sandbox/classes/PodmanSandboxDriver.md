[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / PodmanSandboxDriver

# Class: PodmanSandboxDriver

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:26](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L26)

PodmanSandboxDriver - A driver for Podman (daemonless, rootless containers).
Podman is Docker-CLI compatible but has nuances in connection management
and user-mode networking.

## Implements

- [`SandboxDriver`](../interfaces/SandboxDriver.md)

## Constructors

### Constructor

> **new PodmanSandboxDriver**(`config`): `PodmanSandboxDriver`

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:30](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L30)

#### Parameters

##### config

[`PodmanSandboxDriverConfig`](../interfaces/PodmanSandboxDriverConfig.md)

#### Returns

`PodmanSandboxDriver`

## Properties

### name

> **name**: `string` = `'PodmanSandboxDriver'`

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:27](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L27)

The unique name of the driver implementation

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`name`](../interfaces/SandboxDriver.md#name)

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:38](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L38)

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

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:124](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L124)

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

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:135](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L135)

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

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:157](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L157)

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

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:173](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L173)

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`scanRunningSandboxes`](../interfaces/SandboxDriver.md#scanrunningsandboxes)

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts:163](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/sandbox-service/src/driver/PodmanSandboxDriver/PodmanSandboxDriver.ts#L163)

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
