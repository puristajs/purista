[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / FirecrackerSandboxDriver

# Class: FirecrackerSandboxDriver

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:23](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L23)

FirecrackerSandboxDriver - A driver for AWS Firecracker MicroVMs.
Best for Linux environments with KVM support.
On Mac, this would typically run inside a Linux VM.

## Implements

- [`SandboxDriver`](../interfaces/SandboxDriver.md)

## Constructors

### Constructor

> **new FirecrackerSandboxDriver**(`config`): `FirecrackerSandboxDriver`

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:27](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L27)

#### Parameters

##### config

[`FirecrackerSandboxDriverConfig`](../interfaces/FirecrackerSandboxDriverConfig.md)

#### Returns

`FirecrackerSandboxDriver`

## Properties

### name

> **name**: `string` = `'FirecrackerSandboxDriver'`

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:24](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L24)

The unique name of the driver implementation

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`name`](../interfaces/SandboxDriver.md#name)

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:35](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L35)

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

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:90](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L90)

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

> **executeBash**(`_params`): `Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:99](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L99)

Executes a bash command within the specified sandbox.

#### Parameters

##### \_params

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

> **readFile**(`_params`): `Promise`\<`string`\>

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:109](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L109)

Reads the content of a file from the sandbox.

#### Parameters

##### \_params

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

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:117](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L117)

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`scanRunningSandboxes`](../interfaces/SandboxDriver.md#scanrunningsandboxes)

***

### writeFiles()

> **writeFiles**(`_params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts:113](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/sandbox/driver/FirecrackerSandboxDriver/FirecrackerSandboxDriver.ts#L113)

Writes one or more files to the sandbox workspace.

#### Parameters

##### \_params

Map of file paths to their contents

###### files

`Record`\<`string`, `string`\>

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SandboxDriver`](../interfaces/SandboxDriver.md).[`writeFiles`](../interfaces/SandboxDriver.md#writefiles)
