[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandContextMock

# Function: getCommandContextMock()

> **getCommandContextMock**\<`MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `_MetadataType`, `QueueInvokes`, `AgentInvokes`\>(`input`): `object`

Defined in: [mocks/getCommandContext.mock.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getCommandContext.mock.ts#L26)

A function that returns a mock object for command function context

## Type Parameters

### MessagePayloadType

`MessagePayloadType`

### MessageParamsType

`MessageParamsType`

### FunctionPayloadType

`FunctionPayloadType`

### FunctionParamsType

`FunctionParamsType`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Invokes

`Invokes` *extends* [`InvokeList`](../type-aliases/InvokeList.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](../type-aliases/StreamInvokeList.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>

### _MetadataType

`_MetadataType` *extends* [`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md) = [`CommandDefinitionMetadataBase`](../type-aliases/CommandDefinitionMetadataBase.md)

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](../type-aliases/QueueInvokeList.md) = [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../type-aliases/AgentInvokeList.md)

## Parameters

### input

#### agentInvokes?

`AgentInvokes`

#### emitList

[`FromEmitToOtherType`](../type-aliases/FromEmitToOtherType.md)\<`EmitList`, [`Schema`](../type-aliases/Schema.md)\>

#### invokes

[`FromInvokeToOtherType`](../type-aliases/FromInvokeToOtherType.md)\<`Invokes`, \{ `outputSchema?`: [`Schema`](../type-aliases/Schema.md); `parameterSchema?`: [`Schema`](../type-aliases/Schema.md); `payloadSchema?`: [`Schema`](../type-aliases/Schema.md); \}\>

#### message?

\{ `parameter`: `MessageParamsType`; `payload`: `MessagePayloadType`; \}

#### message.parameter

`MessageParamsType`

#### message.payload

`MessagePayloadType`

#### parameter

`FunctionParamsType`

#### payload

`FunctionPayloadType`

#### queueInvokes?

[`QueueInvokeList`](../type-aliases/QueueInvokeList.md)

#### resources?

`Partial`\<`Resources`\>

#### sandbox?

`SinonSandbox`

#### streamInvokes?

`StreamInvokes`

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

#### mock.emit

> **emit**: [`EmitCustomMessageFunction`](../type-aliases/EmitCustomMessageFunction.md)\<`EmitList`\>

emit a custom message

#### mock.invokeAgent

> **invokeAgent**: `AgentInvokes`

Invokes an agent and returns the result.

#### mock.logger

> **logger**: [`Logger`](../classes/Logger.md)

the logger instance

#### mock.message

> **message**: `Readonly`\<[`Command`](../type-aliases/Command.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

the original message

#### mock.queue

> **queue**: [`QueueContext`](../type-aliases/QueueContext.md) & [`QueueContext`](../type-aliases/QueueContext.md)\<`QueueInvokes`\>

typed queue enqueue helpers

#### mock.resources

> **resources**: `Resources`

Provides resources defined in service builder and set via config during service creation

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

#### mock.service

> **service**: `Invokes`

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

##### Example

```typescript
// define your invocation in command builder
.canInvoke('ServiceA', '1', 'test', responseOutputSchema, payloadSchema, parameterSchema)
.setCommandFunction(async function (context, payload, _parameter) {
   const inputPayload = { my: 'input' }
   const inputParameter = { search: 'for_me' }
   const result = await context.service.ServiceA[1].test(inputPayload,inputParameter)
})
```

#### mock.startActiveSpan()

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

`Context` | `undefined`

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

#### mock.stream

> **stream**: `StreamInvokes`

consumes stream responses from other service stream endpoints

#### mock.wrapInSpan()

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

#### stubs.emit

> **emit**: [`FromEmitToOtherType`](../type-aliases/FromEmitToOtherType.md)\<`EmitList`, `SinonStub`\<`any`[], `any`\>\> = `eventList`

#### stubs.enqueue

> **enqueue**: `SinonStub`\<`any`[], `any`\>

#### stubs.getConfig

> **getConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.getSecret

> **getSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.getState

> **getState**: `SinonStub`\<`any`[], `any`\>

#### stubs.invoke

> **invoke**: `SinonStub`\<`any`[], `any`\>

#### stubs.invokeAgent

> **invokeAgent**: `AgentInvokes`

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

#### stubs.service

> **service**: [`FromInvokeToOtherType`](../type-aliases/FromInvokeToOtherType.md)\<`Invokes`, `SinonStub`\<`any`[], `any`\>\>

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
