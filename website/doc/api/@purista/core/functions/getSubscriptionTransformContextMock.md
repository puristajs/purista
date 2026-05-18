[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getSubscriptionTransformContextMock

# Function: getSubscriptionTransformContextMock()

> **getSubscriptionTransformContextMock**\<`Resources`\>(`input`): `object`

Defined in: [mocks/getSubscriptionTransformContext.mock.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getSubscriptionTransformContext.mock.ts#L20)

A function that returns a mock object for subscription transform function context

## Type Parameters

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

## Parameters

### input

#### message

[`EBMessage`](../type-aliases/EBMessage.md)

#### resources?

`Partial`\<`Resources`\>

#### sandbox?

`SinonSandbox`

## Returns

`object`

### mock

> **mock**: `object`

#### mock.configs

> **configs**: `object`

the config store

#### mock.configs.getConfig

> **getConfig**: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

get a config value from the config store

#### mock.configs.removeConfig

> **removeConfig**: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

#### mock.configs.setConfig

> **setConfig**: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

set a config value in the config store

#### mock.logger

> **logger**: [`Logger`](../classes/Logger.md)

the logger instance

#### mock.message

> **message**: `Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

the original received message

#### mock.metrics

> **metrics**: `PuristaMetricContext`\<`Metrics`\>

typed custom metrics declared on the current builder scope

#### mock.queue

> **queue**: [`QueueContext`](../type-aliases/QueueContext.md)

#### mock.resources

> **resources**: [`EmptyObject`](../type-aliases/EmptyObject.md)

#### mock.secrets

> **secrets**: `object`

the secret store

#### mock.secrets.getSecret

> **getSecret**: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

get a secret from the secret store

#### mock.secrets.removeSecret

> **removeSecret**: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

#### mock.secrets.setSecret

> **setSecret**: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

set a secret in the secret store

#### mock.startActiveSpan

> **startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

##### Type Parameters

###### F

`F`

##### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### context

`Context` \| `undefined`

###### fn

(`span`) => `Promise`\<`F`\>

##### Returns

`Promise`\<`F`\>

#### mock.states

> **states**: `object`

the state store

#### mock.states.getState

> **getState**: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

get a state value from the state store

#### mock.states.removeState

> **removeState**: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

delete a state value from the state store

#### mock.states.setState

> **setState**: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

set a state value in the state store

#### mock.wrapInSpan

> **wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

##### Type Parameters

###### F

`F`

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

#### stubs.enqueue

> **enqueue**: `SinonStub`\<`any`[], `any`\>

#### stubs.getConfig

> **getConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.getSecret

> **getSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.getState

> **getState**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger

> **logger**: `object` = `logger.stubs`

#### stubs.logger.debug

> **debug**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.error

> **error**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.fatal

> **fatal**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.info

> **info**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.trace

> **trace**: `SinonStub`\<`any`[], `any`\>

#### stubs.logger.warn

> **warn**: `SinonStub`\<`any`[], `any`\>

#### stubs.removeConfig

> **removeConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.removeSecret

> **removeSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.removeState

> **removeState**: `SinonStub`\<`any`[], `any`\>

#### stubs.resources

> **resources**: `Partial`\<`Resources`\>

#### stubs.scheduleAt

> **scheduleAt**: `SinonStub`\<`any`[], `any`\>

#### stubs.setConfig

> **setConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.setSecret

> **setSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.setState

> **setState**: `SinonStub`\<`any`[], `any`\>

#### stubs.startActiveSpan

> **startActiveSpan**: `SinonStub`\<`any`[], `any`\>

#### stubs.wrapInSpan

> **wrapInSpan**: `SinonStub`\<`any`[], `any`\>
