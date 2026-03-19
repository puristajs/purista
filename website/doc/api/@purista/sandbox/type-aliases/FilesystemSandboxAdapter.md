[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / FilesystemSandboxAdapter

# Type Alias: FilesystemSandboxAdapter

> **FilesystemSandboxAdapter** = `object`

Defined in: [sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts:6](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts#L6)

## Properties

### executeCommand()

> **executeCommand**: (`command`) => `Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

Defined in: [sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts:7](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts#L7)

#### Parameters

##### command

`string`

#### Returns

`Promise`\<\{ `exitCode`: `number`; `stderr`: `string`; `stdout`: `string`; \}\>

***

### readFile()

> **readFile**: (`path`) => `Promise`\<`string`\>

Defined in: [sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts:8](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts#L8)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string`\>

***

### writeFiles()

> **writeFiles**: (`files`) => `Promise`\<`void`\>

Defined in: [sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts:9](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/local/createLocalFilesystemSandboxAdapter.ts#L9)

#### Parameters

##### files

`object`[]

#### Returns

`Promise`\<`void`\>
