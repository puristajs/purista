[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxAdapter

# Type Alias: SandboxAdapter

> **SandboxAdapter** = `object`

Defined in: [packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:4](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts#L4)

## Properties

### executeCommand()

> **executeCommand**: (`command`) => `Promise`\<[`ExecuteBashOutput`](ExecuteBashOutput.md)\>

Defined in: [packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:5](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts#L5)

#### Parameters

##### command

`string`

#### Returns

`Promise`\<[`ExecuteBashOutput`](ExecuteBashOutput.md)\>

***

### readFile()

> **readFile**: (`path`) => `Promise`\<`string`\>

Defined in: [packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:6](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts#L6)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string`\>

***

### writeFiles()

> **writeFiles**: (`files`) => `Promise`\<`void`\>

Defined in: [packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts:7](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/sandbox/adapter/BashTool/createPuristaSandboxAdapter.ts#L7)

#### Parameters

##### files

`object`[]

#### Returns

`Promise`\<`void`\>
