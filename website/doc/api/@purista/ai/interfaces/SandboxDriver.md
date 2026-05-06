[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxDriver

# Interface: SandboxDriver

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:111](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L111)

Interface for sandbox drivers.
Implement this interface to add support for new virtualization backends.

## Properties

### name

> **name**: `string`

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:113](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L113)

The unique name of the driver implementation

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:121](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L121)

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

###### scope?

\{ `kind`: `"shared-project-user"`; \} \| \{ `key`: `string`; `kind`: `"agent-run"`; \} \| \{ `key`: `string`; `kind`: `"agent-instance"`; \} \| \{ `key`: `string`; `kind`: `"conversation"`; \} \| \{ `key`: `string`; `kind`: `"runtime-instance"`; \} \| \{ `key`: `string`; `kind`: `"custom"`; \}

###### userId

`string`

#### Returns

`Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

The sandbox ID and underlying container name

***

### destroySandbox()

> **destroySandbox**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:139](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L139)

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

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:147](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L147)

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

###### timeoutMs?

`number`

#### Returns

`Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

The result of the command execution

***

### readFile()

> **readFile**(`params`): `Promise`\<`string`\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:159](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L159)

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

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:172](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L172)

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:166](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/types/SandboxDriver.ts#L166)

Writes one or more files to the sandbox workspace.

#### Parameters

##### params

Map of file paths to their contents

###### files

`Record`\<`string`, [`SandboxFileContent`](../type-aliases/SandboxFileContent.md)\>

###### sandboxId

`string`

#### Returns

`Promise`\<`void`\>
