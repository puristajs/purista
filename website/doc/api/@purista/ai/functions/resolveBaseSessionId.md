[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / resolveBaseSessionId

# Function: resolveBaseSessionId()

> **resolveBaseSessionId**(`context`, `payload`): `string`

Defined in: [packages/ai/src/runtime/sessionIdentity.ts:49](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/sessionIdentity.ts#L49)

Resolves the base session id used for implicit session helpers.

## Parameters

### context

\{ `configs`: \{ `getConfig`: [`ConfigGetterFunction`](../../core/type-aliases/ConfigGetterFunction.md); `removeConfig`: [`ConfigDeleteFunction`](../../core/type-aliases/ConfigDeleteFunction.md); `setConfig`: [`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md); \}; `emit`: [`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>; `invokeAgent`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `logger`: [`Logger`](../../core/classes/Logger.md); `message`: `Readonly`\<[`Command`](../../core/type-aliases/Command.md)\<`MessagePayloadType`, `MessageParamsType`\>\>; `queue`: [`QueueContext`](../../core/type-aliases/QueueContext.md) & [`QueueContext`](../../core/type-aliases/QueueContext.md)\<[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>; `resources`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `secrets`: \{ `getSecret`: [`SecretGetterFunction`](../../core/type-aliases/SecretGetterFunction.md); `removeSecret`: [`SecretDeleteFunction`](../../core/type-aliases/SecretDeleteFunction.md); `setSecret`: [`SecretSetterFunction`](../../core/type-aliases/SecretSetterFunction.md); \}; `service`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `startActiveSpan`: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>; `states`: \{ `getState`: [`StateGetterFunction`](../../core/type-aliases/StateGetterFunction.md); `removeState`: [`StateDeleteFunction`](../../core/type-aliases/StateDeleteFunction.md); `setState`: [`StateSetterFunction`](../../core/type-aliases/StateSetterFunction.md); \}; `stream`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `wrapInSpan`: \<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>; \}

#### configs

\{ `getConfig`: [`ConfigGetterFunction`](../../core/type-aliases/ConfigGetterFunction.md); `removeConfig`: [`ConfigDeleteFunction`](../../core/type-aliases/ConfigDeleteFunction.md); `setConfig`: [`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md); \}

the config store

#### configs.getConfig

[`ConfigGetterFunction`](../../core/type-aliases/ConfigGetterFunction.md)

get a config value from the config store

#### configs.removeConfig

[`ConfigDeleteFunction`](../../core/type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

#### configs.setConfig

[`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md)

set a config value in the config store

#### emit

[`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>

emit a custom message

#### invokeAgent

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Invokes an agent and returns the result.

#### logger

[`Logger`](../../core/classes/Logger.md)

the logger instance

#### message

`Readonly`\<[`Command`](../../core/type-aliases/Command.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

the original message

#### queue

[`QueueContext`](../../core/type-aliases/QueueContext.md) & [`QueueContext`](../../core/type-aliases/QueueContext.md)\<[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>

typed queue enqueue helpers

#### resources

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Provides resources defined in service builder and set via config during service creation

#### secrets

\{ `getSecret`: [`SecretGetterFunction`](../../core/type-aliases/SecretGetterFunction.md); `removeSecret`: [`SecretDeleteFunction`](../../core/type-aliases/SecretDeleteFunction.md); `setSecret`: [`SecretSetterFunction`](../../core/type-aliases/SecretSetterFunction.md); \}

the secret store

#### secrets.getSecret

[`SecretGetterFunction`](../../core/type-aliases/SecretGetterFunction.md)

get a secret from the secret store

#### secrets.removeSecret

[`SecretDeleteFunction`](../../core/type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

#### secrets.setSecret

[`SecretSetterFunction`](../../core/type-aliases/SecretSetterFunction.md)

set a secret in the secret store

#### service

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

**Example**

```typescript
// define your invocation in command builder
.canInvoke('ServiceA', '1', 'test', responseOutputSchema, payloadSchema, parameterSchema)
.setCommandFunction(async function (context, payload, _parameter) {
const inputPayload = { my: 'input' }
const inputParameter = { search: 'for_me' }
const result = await context.service.ServiceA[1].test(inputPayload,inputParameter)
})
```

#### startActiveSpan

\<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

#### states

\{ `getState`: [`StateGetterFunction`](../../core/type-aliases/StateGetterFunction.md); `removeState`: [`StateDeleteFunction`](../../core/type-aliases/StateDeleteFunction.md); `setState`: [`StateSetterFunction`](../../core/type-aliases/StateSetterFunction.md); \}

the state store

#### states.getState

[`StateGetterFunction`](../../core/type-aliases/StateGetterFunction.md)

get a state value from the state store

#### states.removeState

[`StateDeleteFunction`](../../core/type-aliases/StateDeleteFunction.md)

delete a state value from the state store

#### states.setState

[`StateSetterFunction`](../../core/type-aliases/StateSetterFunction.md)

set a state value in the state store

#### stream

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

consumes stream responses from other service stream endpoints

#### wrapInSpan

\<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

|

\{ `configs`: \{ `getConfig`: [`ConfigGetterFunction`](../../core/type-aliases/ConfigGetterFunction.md); `removeConfig`: [`ConfigDeleteFunction`](../../core/type-aliases/ConfigDeleteFunction.md); `setConfig`: [`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md); \}; `emit`: [`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>; `invokeAgent`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `logger`: [`Logger`](../../core/classes/Logger.md); `message`: `Readonly`\<[`StreamOpenRequest`](../../core/type-aliases/StreamOpenRequest.md)\<`MessagePayloadType`, `MessageParamsType`\>\>; `queue`: [`QueueContext`](../../core/type-aliases/QueueContext.md) & [`QueueContext`](../../core/type-aliases/QueueContext.md)\<[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>; `resources`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `secrets`: \{ `getSecret`: [`SecretGetterFunction`](../../core/type-aliases/SecretGetterFunction.md); `removeSecret`: [`SecretDeleteFunction`](../../core/type-aliases/SecretDeleteFunction.md); `setSecret`: [`SecretSetterFunction`](../../core/type-aliases/SecretSetterFunction.md); \}; `service`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `startActiveSpan`: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>; `states`: \{ `getState`: [`StateGetterFunction`](../../core/type-aliases/StateGetterFunction.md); `removeState`: [`StateDeleteFunction`](../../core/type-aliases/StateDeleteFunction.md); `setState`: [`StateSetterFunction`](../../core/type-aliases/StateSetterFunction.md); \}; `stream`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `wrapInSpan`: \<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>; \}

#### configs

\{ `getConfig`: [`ConfigGetterFunction`](../../core/type-aliases/ConfigGetterFunction.md); `removeConfig`: [`ConfigDeleteFunction`](../../core/type-aliases/ConfigDeleteFunction.md); `setConfig`: [`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md); \}

the config store

#### configs.getConfig

[`ConfigGetterFunction`](../../core/type-aliases/ConfigGetterFunction.md)

get a config value from the config store

#### configs.removeConfig

[`ConfigDeleteFunction`](../../core/type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

#### configs.setConfig

[`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md)

set a config value in the config store

#### emit

[`EmitCustomMessageFunction`](../../core/type-aliases/EmitCustomMessageFunction.md)\<[`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>

#### invokeAgent

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Invokes an agent and returns the result.

#### logger

[`Logger`](../../core/classes/Logger.md)

the logger instance

#### message

`Readonly`\<[`StreamOpenRequest`](../../core/type-aliases/StreamOpenRequest.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

#### queue

[`QueueContext`](../../core/type-aliases/QueueContext.md) & [`QueueContext`](../../core/type-aliases/QueueContext.md)\<[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>

#### resources

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

#### secrets

\{ `getSecret`: [`SecretGetterFunction`](../../core/type-aliases/SecretGetterFunction.md); `removeSecret`: [`SecretDeleteFunction`](../../core/type-aliases/SecretDeleteFunction.md); `setSecret`: [`SecretSetterFunction`](../../core/type-aliases/SecretSetterFunction.md); \}

the secret store

#### secrets.getSecret

[`SecretGetterFunction`](../../core/type-aliases/SecretGetterFunction.md)

get a secret from the secret store

#### secrets.removeSecret

[`SecretDeleteFunction`](../../core/type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

#### secrets.setSecret

[`SecretSetterFunction`](../../core/type-aliases/SecretSetterFunction.md)

set a secret in the secret store

#### service

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

#### startActiveSpan

\<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

#### states

\{ `getState`: [`StateGetterFunction`](../../core/type-aliases/StateGetterFunction.md); `removeState`: [`StateDeleteFunction`](../../core/type-aliases/StateDeleteFunction.md); `setState`: [`StateSetterFunction`](../../core/type-aliases/StateSetterFunction.md); \}

the state store

#### states.getState

[`StateGetterFunction`](../../core/type-aliases/StateGetterFunction.md)

get a state value from the state store

#### states.removeState

[`StateDeleteFunction`](../../core/type-aliases/StateDeleteFunction.md)

delete a state value from the state store

#### states.setState

[`StateSetterFunction`](../../core/type-aliases/StateSetterFunction.md)

set a state value in the state store

#### stream

[`EmptyObject`](../../core/type-aliases/EmptyObject.md)

#### wrapInSpan

\<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

### payload

`unknown`

## Returns

`string`
