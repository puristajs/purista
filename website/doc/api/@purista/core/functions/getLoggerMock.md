[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getLoggerMock

# Function: getLoggerMock()

> **getLoggerMock**(`sandbox`?): `object`

Defined in: [packages/core/src/mocks/getLogger.mock.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getLogger.mock.ts#L11)

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

> **stubs.debug**: `SinonStub`\<`any`[], `any`\>

#### stubs.error

> **stubs.error**: `SinonStub`\<`any`[], `any`\>

#### stubs.fatal

> **stubs.fatal**: `SinonStub`\<`any`[], `any`\>

#### stubs.info

> **stubs.info**: `SinonStub`\<`any`[], `any`\>

#### stubs.trace

> **stubs.trace**: `SinonStub`\<`any`[], `any`\>

#### stubs.warn

> **stubs.warn**: `SinonStub`\<`any`[], `any`\>
