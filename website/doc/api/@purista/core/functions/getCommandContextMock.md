[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandContextMock

# Function: getCommandContextMock()

> **getCommandContextMock**\<`MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `EmitList`\>(`input`): `object`

Defined in: [packages/core/src/mocks/getCommandContext.mock.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/mocks/getCommandContext.mock.ts#L20)

A function that returns a mock object for command function context

## Type Parameters

• **MessagePayloadType**

• **MessageParamsType**

• **FunctionPayloadType**

• **FunctionParamsType**

• **Resources** *extends* `Record`\<`string`, `any`\>

• **Invokes** *extends* [`InvokeList`](../type-aliases/InvokeList.md)

• **EmitList** *extends* `Record`\<`string`, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>\>

## Parameters

### input

#### emitList

[`FromEmitToOtherType`](../type-aliases/FromEmitToOtherType.md)\<`EmitList`, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>\>

#### invokes

[`FromInvokeToOtherType`](../type-aliases/FromInvokeToOtherType.md)\<`Invokes`, \{ `outputSchema`: `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>; `parameterSchema`: `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>; `payloadSchema`: `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>; \}\>

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

#### mock.emit

> **mock.emit**: [`EmitCustomMessageFunction`](../type-aliases/EmitCustomMessageFunction.md)\<`EmitList`\>

emit a custom message

#### mock.logger

> **mock.logger**: [`Logger`](../classes/Logger.md)

the logger instance

#### mock.message

> **mock.message**: `Readonly`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `MessageParamsType`; `payload`: `MessagePayloadType`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

the original message

#### mock.resources

> **mock.resources**: `Resources`

Provides resources defined in service builder and set via config during service creation

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

#### mock.service

> **mock.service**: `Invokes`

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

#### stubs.emit

> **stubs.emit**: [`FromEmitToOtherType`](../type-aliases/FromEmitToOtherType.md)\<`EmitList`, `SinonStub`\<`any`[], `any`\>\> = `eventList`

#### stubs.getConfig

> **stubs.getConfig**: `SinonStub`\<`any`[], `any`\>

#### stubs.getSecret

> **stubs.getSecret**: `SinonStub`\<`any`[], `any`\>

#### stubs.getState

> **stubs.getState**: `SinonStub`\<`any`[], `any`\>

#### stubs.invoke

> **stubs.invoke**: `SinonStub`\<`any`[], `any`\>

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

#### stubs.service

> **stubs.service**: [`FromInvokeToOtherType`](../type-aliases/FromInvokeToOtherType.md)\<`Invokes`, `SinonStub`\<`any`[], `any`\>\>

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
