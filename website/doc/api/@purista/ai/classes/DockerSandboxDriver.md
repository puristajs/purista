[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DockerSandboxDriver

# Class: DockerSandboxDriver

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:33](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L33)

DockerSandboxDriver - A robust driver for Docker, OrbStack, and Colima.
It provides secure execution environments using Docker containers.

## Implements

- [`SandboxDriver`](../interfaces/SandboxDriver.md)

## Constructors

### Constructor

> **new DockerSandboxDriver**(`config`): `DockerSandboxDriver`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:40](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L40)

#### Parameters

##### config

[`DockerSandboxDriverConfig`](../interfaces/DockerSandboxDriverConfig.md)

Driver configuration

#### Returns

`DockerSandboxDriver`

## Properties

### name

> **name**: `string` = `'DockerSandboxDriver'`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:34](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L34)

The unique name of the driver implementation

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`name`](../interfaces/SandboxDriver.md#name)

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:62](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L62)

Provisions and starts a new Docker container.
Securely configures Git identity and GitHub CLI inside the container.

#### Parameters

##### params

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

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`createSandbox`](../interfaces/SandboxDriver.md#createsandbox)

***

### destroySandbox()

> **destroySandbox**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:169](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L169)

Forcefully removes the Docker container.

#### Parameters

##### params

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`destroySandbox`](../interfaces/SandboxDriver.md#destroysandbox)

***

### executeBash()

> **executeBash**(`params`): `Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:183](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L183)

Executes a command via 'docker exec'.

#### Parameters

##### params

###### command

`string`

###### cwd?

`string`

###### sandboxId

`string`

#### Returns

`Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`executeBash`](../interfaces/SandboxDriver.md#executebash)

***

### getContainerName()

> **getContainerName**(`sandboxId`): `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:54](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L54)

Generates the standardized container name for a sandbox.

#### Parameters

##### sandboxId

`string`

Unique sandbox ID

#### Returns

`string`

***

### getImageName()

> **getImageName**(): `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:46](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L46)

#### Returns

`string`

***

### readFile()

> **readFile**(`params`): `Promise`\<`string`\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:216](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L216)

Reads a file from the container using 'cat'.

#### Parameters

##### params

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

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:254](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L254)

Scans for running containers and recovers metadata from labels.

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`scanRunningSandboxes`](../interfaces/SandboxDriver.md#scanrunningsandboxes)

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:229](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L229)

Writes files to the container by creating a local temp file and using 'docker cp'.

#### Parameters

##### params

###### files

`Record`\<`string`, `string`\>

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`writeFiles`](../interfaces/SandboxDriver.md#writefiles)
