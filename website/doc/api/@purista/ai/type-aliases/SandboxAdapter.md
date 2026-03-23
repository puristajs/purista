[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxAdapter

# Type Alias: SandboxAdapter

> **SandboxAdapter** = `object`

Defined in: packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:4

## Properties

### executeCommand()

> **executeCommand**: (`command`) => `Promise`\<[`ExecuteBashOutput`](ExecuteBashOutput.md)\>

Defined in: packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:5

#### Parameters

##### command

`string`

#### Returns

`Promise`\<[`ExecuteBashOutput`](ExecuteBashOutput.md)\>

***

### readFile()

> **readFile**: (`path`) => `Promise`\<`string`\>

Defined in: packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:6

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string`\>

***

### writeFiles()

> **writeFiles**: (`files`) => `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:7

#### Parameters

##### files

`object`[]

#### Returns

`Promise`\<`void`\>
