[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandTransformContextMock

# Function: getCommandTransformContextMock()

> **getCommandTransformContextMock**\<`MessagePayloadType`, `MessageParamsType`, `Resources`\>(`input`): `object`

Defined in: [packages/core/src/mocks/getCommandTransformContext.mock.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getCommandTransformContext.mock.ts#L17)

A function that returns a mock object for command transform function context

## Type Parameters

• **MessagePayloadType** = `unknown`

• **MessageParamsType** = `unknown`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Parameters

### input

#### parameter

`MessageParamsType`

#### payload

`MessagePayloadType`

#### resources?

`Partial`\<`Resources`\>

#### sandbox?

`SinonSandbox`

## Returns

`object`

### mock

> **mock**: `object`

#### mock.configs

> **mock.configs**: `object`

the config store

#### mock.configs.getConfig

> **mock.configs.getConfig**: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

get a config value from the config store

#### mock.configs.removeConfig

> **mock.configs.removeConfig**: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

#### mock.configs.setConfig

> **mock.configs.setConfig**: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

set a config value in the config store

#### mock.logger

> **mock.logger**: [`Logger`](../classes/Logger.md)

the logger instance

#### mock.message

> **mock.message**: `Readonly`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `MessageParamsType`; `payload`: `MessagePayloadType`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

the original message

#### mock.resources

> **mock.resources**: `Resources`

#### mock.secrets

> **mock.secrets**: `object`

the secret store

#### mock.secrets.getSecret

> **mock.secrets.getSecret**: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

get a secret from the secret store

#### mock.secrets.removeSecret

> **mock.secrets.removeSecret**: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

#### mock.secrets.setSecret

> **mock.secrets.setSecret**: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

set a secret in the secret store

#### mock.startActiveSpan()

> **mock.startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

##### Type Parameters

• **F**

##### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### context

`undefined` | `Context`

###### fn

(`span`) => `Promise`\<`F`\>

##### Returns

`Promise`\<`F`\>

#### mock.states

> **mock.states**: `object`

the state store

#### mock.states.getState

> **mock.states.getState**: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

get a state value from the state store

#### mock.states.removeState

> **mock.states.removeState**: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

delete a state value from the state store

#### mock.states.setState

> **mock.states.setState**: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

set a state value in the state store

#### mock.wrapInSpan()

> **mock.wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context`?) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

##### Type Parameters

• **F**

##### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### fn

(`span`) => `Promise`\<`F`\>

###### context?

`Context`

##### Returns

`Promise`\<`F`\>

### stubs

> **stubs**: `object`

#### stubs.getConfig

> **stubs.getConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.getSecret

> **stubs.getSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.getState

> **stubs.getState**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger

> **stubs.logger**: `object` = `logger.stubs`

#### stubs.logger.debug

> **stubs.logger.debug**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.error

> **stubs.logger.error**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.fatal

> **stubs.logger.fatal**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.info

> **stubs.logger.info**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.trace

> **stubs.logger.trace**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.warn

> **stubs.logger.warn**: `SinonStub`\<`any`[], `any`\>

#### stubs.removeConfig

> **stubs.removeConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.removeSecret

> **stubs.removeSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.removeState

> **stubs.removeState**: `SinonStub`\<`any`[], `any`\>

#### stubs.resources

> **stubs.resources**: `Partial`\<`Resources`\>

#### stubs.setConfig

> **stubs.setConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.setSecret

> **stubs.setSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.setState

> **stubs.setState**: `SinonStub`\<`any`[], `any`\>

#### stubs.startActiveSpan

> **stubs.startActiveSpan**: `SinonStub`\<`any`[], `any`\>

#### stubs.wrapInSpan

> **stubs.wrapInSpan**: `SinonStub`\<`any`[], `any`\>
