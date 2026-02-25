[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandFunctionWithValidation

# Function: getCommandFunctionWithValidation()

> **getCommandFunctionWithValidation**\<`S`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards`): (`this`, `context`, `payload`, `parameter`) => `Promise`\<`unknown`\>

Defined in: [CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts#L15)

Wraps a command handler with schema validation and guard execution.
Input payload/parameter is validated before execution and output can be validated after execution.

## Type Parameters

### S

`S` *extends* [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\>

## Parameters

### fn

[`CommandFunction`](../type-aliases/CommandFunction.md)\<`S`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `any`, `any`, `any`\>

### inputPayloadSchema

[`Schema`](../type-aliases/Schema.md) | `undefined`

### inputParameterSchema

[`Schema`](../type-aliases/Schema.md) | `undefined`

### outputPayloadSchema

[`Schema`](../type-aliases/Schema.md) | `undefined`

### beforeGuards

`Record`\<`string`, [`CommandBeforeGuardHook`](../type-aliases/CommandBeforeGuardHook.md)\<`S`, `unknown`, `unknown`, `unknown`, `unknown`, `any`, `any`, `any`\>\>

## Returns

> (`this`, `context`, `payload`, `parameter`): `Promise`\<`unknown`\>

### Parameters

#### this

`S`

#### context

##### configs

\{ `getConfig`: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md); `removeConfig`: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md); `setConfig`: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md); \}

the config store

##### configs.getConfig

[`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

get a config value from the config store

##### configs.removeConfig

[`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

##### configs.setConfig

[`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

set a config value in the config store

##### emit

[`EmitCustomMessageFunction`](../type-aliases/EmitCustomMessageFunction.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md)\>

emit a custom message

##### logger

[`Logger`](../classes/Logger.md)

the logger instance

##### message

`Readonly`\<[`Command`](../type-aliases/Command.md)\<`MessagePayloadType`, `MessageParamsType`\>\>

the original message

##### queue

[`QueueContext`](../type-aliases/QueueContext.md) & [`QueueContext`](../type-aliases/QueueContext.md)\<[`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>

typed queue enqueue helpers

##### resources

[`EmptyObject`](../type-aliases/EmptyObject.md)

Provides resources defined in service builder and set via config during service creation

##### secrets

\{ `getSecret`: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md); `removeSecret`: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md); `setSecret`: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md); \}

the secret store

##### secrets.getSecret

[`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

get a secret from the secret store

##### secrets.removeSecret

[`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

##### secrets.setSecret

[`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

set a secret in the secret store

##### service

[`EmptyObject`](../type-aliases/EmptyObject.md)

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

##### startActiveSpan

\<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

##### states

\{ `getState`: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md); `removeState`: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md); `setState`: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md); \}

the state store

##### states.getState

[`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

get a state value from the state store

##### states.removeState

[`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

delete a state value from the state store

##### states.setState

[`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

set a state value in the state store

##### stream

[`EmptyObject`](../type-aliases/EmptyObject.md)

consumes stream responses from other service stream endpoints

##### wrapInSpan

\<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

#### payload

`unknown`

#### parameter

`unknown`

### Returns

`Promise`\<`unknown`\>
