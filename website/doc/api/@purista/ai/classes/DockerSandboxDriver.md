[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DockerSandboxDriver

# Class: DockerSandboxDriver

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:35](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L35)

DockerSandboxDriver - A robust driver for Docker, OrbStack, and Colima.
It provides secure execution environments using Docker containers.

## Implements

- [`SandboxDriver`](../interfaces/SandboxDriver.md)

## Constructors

### Constructor

> **new DockerSandboxDriver**(`config`): `DockerSandboxDriver`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:42](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L42)

#### Parameters

##### config

[`DockerSandboxDriverConfig`](../interfaces/DockerSandboxDriverConfig.md)

Driver configuration

#### Returns

`DockerSandboxDriver`

## Properties

### name

> **name**: `string` = `'DockerSandboxDriver'`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:36](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L36)

The unique name of the driver implementation

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`name`](../interfaces/SandboxDriver.md#name)

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:97](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L97)

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

###### scope?

\{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}

###### userId

`string`

#### Returns

`Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`createSandbox`](../interfaces/SandboxDriver.md#createsandbox)

***

### destroySandbox()

> **destroySandbox**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:205](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L205)

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

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:219](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L219)

Executes a command via 'docker exec'.

#### Parameters

##### params

###### command

`string`

###### cwd?

`string`

###### sandboxId

`string`

###### timeoutMs?

`number`

#### Returns

`Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`executeBash`](../interfaces/SandboxDriver.md#executebash)

***

### getContainerName()

> **getContainerName**(`sandboxId`): `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:56](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L56)

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

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:48](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L48)

#### Returns

`string`

***

### readFile()

> **readFile**(`params`): `Promise`\<`string`\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:263](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L263)

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

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:305](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L305)

Scans for running containers and recovers metadata from labels.

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`scanRunningSandboxes`](../interfaces/SandboxDriver.md#scanrunningsandboxes)

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:278](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L278)

Writes files to the container by creating a local temp file and using 'docker cp'.

#### Parameters

##### params

###### files

`Record`\<`string`, [`SandboxFileContent`](../type-aliases/SandboxFileContent.md)\>

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`writeFiles`](../interfaces/SandboxDriver.md#writefiles)
