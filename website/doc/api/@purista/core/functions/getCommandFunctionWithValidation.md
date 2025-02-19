[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getCommandFunctionWithValidation

# Function: getCommandFunctionWithValidation()

> **getCommandFunctionWithValidation**\<`S`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards`): (`this`, `context`, `payload`, `parameter`) => `Promise`\<`unknown`\>

Defined in: [packages/core/src/CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts#L7)

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\>

## Parameters

### fn

[`CommandFunction`](../type-aliases/CommandFunction.md)\<`S`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

### inputPayloadSchema

`undefined` | `SchemaObject` | `Schema`\<`any`, `any`, `any`, `""`\> | `ZodType`\<`any`, `ZodTypeDef`, `any`\>

### inputParameterSchema

`undefined` | `SchemaObject` | `Schema`\<`any`, `any`, `any`, `""`\> | `ZodType`\<`any`, `ZodTypeDef`, `any`\>

### outputPayloadSchema

`undefined` | `SchemaObject` | `Schema`\<`any`, `any`, `any`, `""`\> | `ZodType`\<`any`, `ZodTypeDef`, `any`\>

### beforeGuards

`Record`\<`string`, [`CommandBeforeGuardHook`](../type-aliases/CommandBeforeGuardHook.md)\<`S`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>\>

## Returns

`Function`

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

`Readonly`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

the original message

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

##### wrapInSpan

\<`F`\>(`name`, `opts`, `fn`, `context`?) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

#### payload

`unknown`

#### parameter

`unknown`

### Returns

`Promise`\<`unknown`\>
