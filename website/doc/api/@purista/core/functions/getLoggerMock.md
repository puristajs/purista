[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getLoggerMock

# Function: getLoggerMock()

> **getLoggerMock**(`sandbox?`): `object`

Defined in: [mocks/getLogger.mock.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getLogger.mock.ts#L11)

Mocks the logger and methods are stubs

## Parameters

### sandbox?

`SinonSandbox`

## Returns

`object`

logger mocked

### mock

> **mock**: [`Logger`](../classes/Logger.md)

### stubs

> **stubs**: `object`

#### stubs.debug

> **debug**: `SinonStub`\<`any`[], `any`\>

#### stubs.error

> **error**: `SinonStub`\<`any`[], `any`\>

#### stubs.fatal

> **fatal**: `SinonStub`\<`any`[], `any`\>

#### stubs.info

> **info**: `SinonStub`\<`any`[], `any`\>

#### stubs.trace

> **trace**: `SinonStub`\<`any`[], `any`\>

#### stubs.warn

> **warn**: `SinonStub`\<`any`[], `any`\>
