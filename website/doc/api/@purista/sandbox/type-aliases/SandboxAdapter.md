[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / SandboxAdapter

# Type Alias: SandboxAdapter

> **SandboxAdapter** = `object`

Defined in: [sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts:4](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts#L4)

## Properties

### executeCommand()

> **executeCommand**: (`command`) => `Promise`\<`ExecuteBashOutput`\>

Defined in: [sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts:5](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts#L5)

#### Parameters

##### command

`string`

#### Returns

`Promise`\<`ExecuteBashOutput`\>

***

### readFile()

> **readFile**: (`path`) => `Promise`\<`string`\>

Defined in: [sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts:6](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts#L6)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string`\>

***

### writeFiles()

> **writeFiles**: (`files`) => `Promise`\<`void`\>

Defined in: [sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts:7](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/adapter/BashTool/createPuristaSandboxAdapter.ts#L7)

#### Parameters

##### files

`object`[]

#### Returns

`Promise`\<`void`\>
