[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxDriver

# Interface: SandboxDriver

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:99](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L99)

Interface for sandbox drivers.
Implement this interface to add support for new virtualization backends.

## Properties

### name

> **name**: `string`

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:101](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L101)

The unique name of the driver implementation

## Methods

### createSandbox()

> **createSandbox**(`params`): `Promise`\<\{ `containerName`: `string`; `sandboxId`: `string`; \}\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:109](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L109)

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

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:126](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L126)

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

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:134](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L134)

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

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:141](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L141)

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

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:154](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L154)

Scans the underlying system for running sandboxes and recovers their metadata.
This is used for self-healing and service restarts.

#### Returns

`Promise`\<`object`[]\>

***

### writeFiles()

> **writeFiles**(`params`): `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/types/SandboxDriver.ts:148](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/types/SandboxDriver.ts#L148)

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
