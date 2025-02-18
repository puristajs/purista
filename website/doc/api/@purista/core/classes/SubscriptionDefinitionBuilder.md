[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder\<S, C\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L41)

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type Parameters

• **S** *extends* [`Service`](Service.md) = [`Service`](Service.md)

• **C** *extends* [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md) = [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)

## Constructors

### new SubscriptionDefinitionBuilder()

> **new SubscriptionDefinitionBuilder**\<`S`, `C`\>(`subscriptionName`, `subscriptionDescription`, `deprecated`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:107](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L107)

#### Parameters

##### subscriptionName

`string`

##### subscriptionDescription

`string`

##### deprecated

`boolean` = `false`

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

## Methods

### addOutputSchema()

> **addOutputSchema**\<`OutputSchema`\>(`eventName`, `outputSchema`, `outputContentType`, `outputContentEncoding`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `OutputSchema`, `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:438](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L438)

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type Parameters

• **OutputSchema** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### eventName

`string`

the event name to be used when the subscription result is emitted as custom event

##### outputSchema

`OutputSchema`

the validation schema for the output payload

##### outputContentType

`string` = `'application/json'`

optional the content type of payload

##### outputContentEncoding

`string` = `'utf-8'`

optional the content encoding

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `OutputSchema`, `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### addParameterSchema()

> **addParameterSchema**\<`ParamsSchema`\>(`parameterSchema`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:470](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L470)

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type Parameters

• **ParamsSchema** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### parameterSchema

`ParamsSchema`

the validation schema for output parameter

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### addPayloadSchema()

> **addPayloadSchema**\<`PayloadSchema`\>(`inputSchema`, `inputContentType`, `inputContentEncoding`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`PayloadSchema`, `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:404](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L404)

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type Parameters

• **PayloadSchema** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### inputSchema

`PayloadSchema`

the validation schema for input payload

##### inputContentType

`string` = `'application/json'`

optional the content type of payload

##### inputContentEncoding

`string` = `'utf-8'`

optional the content encoding

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`PayloadSchema`, `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### adviceAutoacknowledgeMessage()

> **adviceAutoacknowledgeMessage**(`acknowledge`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:284](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L284)

Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
This means, a message will not be resent, if the subscription execution fails unexpected.

If set to false, the message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the subscription execution fails unexpected
- if sending of optional subscription response failed

#### Parameters

##### acknowledge

`boolean` = `true`

Enable (true) and disable (false)

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinition

***

### adviceDurable()

> **adviceDurable**(`durable`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:309](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L309)

False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.

True: Advises the event bridge (like rabbitMQ) to store all messages if the subscription is not running.
As soon as the subscription is back again, all missed messages will be sent first, before it starts working like a live-subscription.

#### Parameters

##### durable

`boolean`

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\] & `Record`\<`EventName`, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `T`\>\>\>\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:204](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L204)

Define which custom events the subscription can emit.

#### Type Parameters

• **EventName** *extends* `string`

• **T** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### eventName

`EventName`

The custom event name

##### schema

`T`

the payload schema

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\] & `Record`\<`EventName`, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `T`\>\>\>\>\>

***

### canInvoke()

> **canInvoke**\<`Output`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `outputSchema`?, `payloadSchema`?, `parameterSchema`?): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<`UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `Output`\>\>\>\>\>\>, `C`\[`"EmitList"`\]\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L126)

Define a command which can be invoked by the current subscription

#### Type Parameters

• **Output** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

• **Payload** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

• **Parameter** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

• **SName** *extends* `string` = `string`

• **Version** *extends* `string` = `string`

• **Fname** *extends* `string` = `string`

#### Parameters

##### serviceName

`SName`

##### serviceVersion

`Version`

##### serviceTarget

`Fname`

##### outputSchema?

`Output`

##### payloadSchema?

`Payload`

##### parameterSchema?

`Parameter`

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<`UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `Output`\>\>\>\>\>\>, `C`\[`"EmitList"`\]\>\>

***

### filterForMessageType()

> **filterForMessageType**(`messageType`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:390](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L390)

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

##### messageType

[`EBMessageType`](../enumerations/EBMessageType.md)

the type of message

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

***

### filterPrincipalId()

> **filterPrincipalId**\<`T`\>(`principalId`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:257](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L257)

Filter messages only for principalId

#### Type Parameters

• **T** *extends* `string`

#### Parameters

##### principalId

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

the principal id to subscribe

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

***

### filterReceivedBy()

> **filterReceivedBy**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:365](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L365)

Add filter to only match messages received by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send to function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
receivedBy('UserService', undefined, 'testFunction')
```

#### Type Parameters

• **N** *extends* `string`

• **V** *extends* `string`

• **T** *extends* `string`

• **I** *extends* `string`

#### Parameters

##### serviceName

the name of the service that consumes the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

##### serviceVersion

the version of the service that consumes the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\>

##### serviceTarget

the command or subscription name of the service that consumes the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### instanceId

the event bridge instance id which should receive the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`I`\>

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

***

### filterSentFrom()

> **filterSentFrom**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:332](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L332)

Add filter to only match messages send by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send from function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
sentFrom('UserService', undefined, 'testFunction')
```

#### Type Parameters

• **N** *extends* `string`

• **V** *extends* `string`

• **T** *extends* `string`

• **I** *extends* `string`

#### Parameters

##### serviceName

the name of the service that produces the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

##### serviceVersion

the version of the service that produces the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\>

##### serviceTarget

the command or subscription name of the service that produces the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### instanceId

the event bridge instance id which was publishing the message

`undefined` | [`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`I`\>

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

***

### filterTenantId()

> **filterTenantId**\<`T`\>(`tenantId`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:267](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L267)

Filter messages only for tenantId

#### Type Parameters

• **T** *extends* `string`

#### Parameters

##### tenantId

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

the principal id to subscribe

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`Complete`](../type-aliases/Complete.md)\<[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputPayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputParamsSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"TransformOutputSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\], [`SubscriptionDefinitionMetadataBase`](../type-aliases/SubscriptionDefinitionMetadataBase.md)\>\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:752](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L752)

Returns the final subscription definition which will be passed into the service class.

#### Returns

`Promise`\<[`Complete`](../type-aliases/Complete.md)\<[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputPayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputParamsSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"TransformOutputSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\], [`SubscriptionDefinitionMetadataBase`](../type-aliases/SubscriptionDefinitionMetadataBase.md)\>\>\>

SubscriptionDefinition

***

### getSubscriptionContextMock()

> **getSubscriptionContextMock**(`input`): `object`

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:831](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L831)

Returns a mocked command function context, which can be used in unit tests.

#### Parameters

##### input

###### message

[`EBMessage`](../type-aliases/EBMessage.md)

###### resources?

`Partial`\<`C`\[`"Resources"`\]\>

###### sandbox?

`SinonSandbox`

#### Returns

`object`

a mocked command function context

##### mock

> **mock**: `object`

###### mock.configs

> **mock.configs**: `object`

the config store

###### mock.configs.getConfig

> **mock.configs.getConfig**: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

get a config value from the config store

###### mock.configs.removeConfig

> **mock.configs.removeConfig**: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

###### mock.configs.setConfig

> **mock.configs.setConfig**: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

set a config value in the config store

###### mock.emit

> **mock.emit**: [`EmitCustomMessageFunction`](../type-aliases/EmitCustomMessageFunction.md)\<`C`\[`"EmitList"`\]\>

emit a custom message

###### mock.logger

> **mock.logger**: [`Logger`](Logger.md)

the logger instance

###### mock.message

> **mock.message**: `Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

the original message

###### mock.resources

> **mock.resources**: `C`\[`"Resources"`\]

Provides resources defined in service builder and set via config during service creation

###### mock.secrets

> **mock.secrets**: `object`

the secret store

###### mock.secrets.getSecret

> **mock.secrets.getSecret**: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

get a secret from the secret store

###### mock.secrets.removeSecret

> **mock.secrets.removeSecret**: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

###### mock.secrets.setSecret

> **mock.secrets.setSecret**: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

set a secret in the secret store

###### mock.service

> **mock.service**: `C`\[`"Invokes"`\]

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

###### Example

```typescript
// define your invocation in subscription builder
.canInvoke<{ response: string }>('ServiceA', '1', 'test', payloadSchema, parameterSchema)
.setCommandFunction(async function (context, payload, _parameter) {
   const inputPayload = { my: 'input' }
   const inputParameter = { search: 'for_me' }
   const result = await context.service.ServiceA[1].test(inputPayload,inputParameter)
})
```

###### mock.startActiveSpan()

> **mock.startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

###### Type Parameters

• **F**

###### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### context

`undefined` | `Context`

###### fn

(`span`) => `Promise`\<`F`\>

###### Returns

`Promise`\<`F`\>

###### mock.states

> **mock.states**: `object`

the state store

###### mock.states.getState

> **mock.states.getState**: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

get a state value from the state store

###### mock.states.removeState

> **mock.states.removeState**: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

delete a state value from the state store

###### mock.states.setState

> **mock.states.setState**: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

set a state value in the state store

###### mock.wrapInSpan()

> **mock.wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context`?) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

###### Type Parameters

• **F**

###### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### fn

(`span`) => `Promise`\<`F`\>

###### context?

`Context`

###### Returns

`Promise`\<`F`\>

##### stubs

> **stubs**: `object`

###### stubs.emit

> **stubs.emit**: [`FromEmitToOtherType`](../type-aliases/FromEmitToOtherType.md)\<`C`\[`"EmitList"`\], `SinonStub`\<`any`[], `any`\>\> = `eventList`

###### stubs.getConfig

> **stubs.getConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.getSecret

> **stubs.getSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.getState

> **stubs.getState**: `SinonStub`\<`any`[], `any`\>

###### stubs.invoke

> **stubs.invoke**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger

> **stubs.logger**: `object` = `logger.stubs`

###### stubs.logger.debug

> **stubs.logger.debug**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.error

> **stubs.logger.error**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.fatal

> **stubs.logger.fatal**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.info

> **stubs.logger.info**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.trace

> **stubs.logger.trace**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.warn

> **stubs.logger.warn**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeConfig

> **stubs.removeConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeSecret

> **stubs.removeSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeState

> **stubs.removeState**: `SinonStub`\<`any`[], `any`\>

###### stubs.resources

> **stubs.resources**: `C`\[`"Resources"`\]

###### stubs.service

> **stubs.service**: [`FromInvokeToOtherType`](../type-aliases/FromInvokeToOtherType.md)\<`C`\[`"Invokes"`\], `SinonStub`\<`any`[], `any`\>\>

###### stubs.setConfig

> **stubs.setConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.setSecret

> **stubs.setSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.setState

> **stubs.setState**: `SinonStub`\<`any`[], `any`\>

###### stubs.startActiveSpan

> **stubs.startActiveSpan**: `SinonStub`\<`any`[], `any`\>

###### stubs.wrapInSpan

> **stubs.wrapInSpan**: `SinonStub`\<`any`[], `any`\>

***

### getSubscriptionFunction()

> **getSubscriptionFunction**(): [`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:700](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L700)

Get the function implementation including input and output validation.
Also, before and after hooks are triggered during execution.

#### Returns

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>

the subscription function

***

### getSubscriptionFunctionPlain()

> **getSubscriptionFunctionPlain**(): `void`

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:730](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L730)

Get the function implementation without input and output validation.
No hooks are triggered during execution.

#### Returns

`void`

the subscription function

***

### getSubscriptionTransformContextMock()

> **getSubscriptionTransformContextMock**(`input`): `object`

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:851](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L851)

Returns a mocked transform function context, which can be used in unit tests.

#### Parameters

##### input

###### message

[`EBMessage`](../type-aliases/EBMessage.md)

###### resources?

`C`\[`"Resources"`\]

###### sandbox?

`SinonSandbox`

#### Returns

`object`

a mocked transform function context

##### mock

> **mock**: `object`

###### mock.configs

> **mock.configs**: `object`

the config store

###### mock.configs.getConfig

> **mock.configs.getConfig**: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

get a config value from the config store

###### mock.configs.removeConfig

> **mock.configs.removeConfig**: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

###### mock.configs.setConfig

> **mock.configs.setConfig**: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

set a config value in the config store

###### mock.logger

> **mock.logger**: [`Logger`](Logger.md)

the logger instance

###### mock.message

> **mock.message**: `Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

the original received message

###### mock.resources

> **mock.resources**: [`EmptyObject`](../type-aliases/EmptyObject.md)

###### mock.secrets

> **mock.secrets**: `object`

the secret store

###### mock.secrets.getSecret

> **mock.secrets.getSecret**: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

get a secret from the secret store

###### mock.secrets.removeSecret

> **mock.secrets.removeSecret**: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

###### mock.secrets.setSecret

> **mock.secrets.setSecret**: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

set a secret in the secret store

###### mock.startActiveSpan()

> **mock.startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

###### Type Parameters

• **F**

###### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### context

`undefined` | `Context`

###### fn

(`span`) => `Promise`\<`F`\>

###### Returns

`Promise`\<`F`\>

###### mock.states

> **mock.states**: `object`

the state store

###### mock.states.getState

> **mock.states.getState**: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

get a state value from the state store

###### mock.states.removeState

> **mock.states.removeState**: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

delete a state value from the state store

###### mock.states.setState

> **mock.states.setState**: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

set a state value in the state store

###### mock.wrapInSpan()

> **mock.wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context`?) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

###### Type Parameters

• **F**

###### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### fn

(`span`) => `Promise`\<`F`\>

###### context?

`Context`

###### Returns

`Promise`\<`F`\>

##### stubs

> **stubs**: `object`

###### stubs.getConfig

> **stubs.getConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.getSecret

> **stubs.getSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.getState

> **stubs.getState**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger

> **stubs.logger**: `object` = `logger.stubs`

###### stubs.logger.debug

> **stubs.logger.debug**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.error

> **stubs.logger.error**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.fatal

> **stubs.logger.fatal**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.info

> **stubs.logger.info**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.trace

> **stubs.logger.trace**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.warn

> **stubs.logger.warn**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeConfig

> **stubs.removeConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeSecret

> **stubs.removeSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeState

> **stubs.removeState**: `SinonStub`\<`any`[], `any`\>

###### stubs.resources

> **stubs.resources**: `Partial`\<[`EmptyObject`](../type-aliases/EmptyObject.md)\>

###### stubs.setConfig

> **stubs.setConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.setSecret

> **stubs.setSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.setState

> **stubs.setState**: `SinonStub`\<`any`[], `any`\>

###### stubs.startActiveSpan

> **stubs.startActiveSpan**: `SinonStub`\<`any`[], `any`\>

###### stubs.wrapInSpan

> **stubs.wrapInSpan**: `SinonStub`\<`any`[], `any`\>

***

### getTransformInputFunction()

> **getTransformInputFunction**(): `undefined` \| [`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputPayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:540](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L540)

Return the transform input function

#### Returns

`undefined` \| [`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputPayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"TransformInputParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>\>

the input transform function if defined

***

### getTransformOutputFunction()

> **getTransformOutputFunction**(): `undefined` \| [`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"TransformOutputSchema"`\]\>\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:602](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L602)

Return the transform output function

#### Returns

`undefined` \| [`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"TransformOutputSchema"`\]\>\>\>

the transform output function if defined

***

### markAsDeprecated()

> **markAsDeprecated**(): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:231](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L231)

Mark this subscription as deprecated

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### receiveMessageOnEveryInstance()

> **receiveMessageOnEveryInstance**(`enforce`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:298](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L298)

Instruct the event bridge message broker to send the matching message to every running instance.
The underlaying message broker must support this functionality.

In serverless environments, this flag should not have any effect

#### Parameters

##### enforce

`boolean` = `true`

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinition

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`afterGuards`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:644](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L644)

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

##### afterGuards

`Record`\<`string`, [`SubscriptionAfterGuardHook`](../type-aliases/SubscriptionAfterGuardHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`beforeGuards`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:621](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L621)

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

##### beforeGuards

`Record`\<`string`, [`SubscriptionBeforeGuardHook`](../type-aliases/SubscriptionBeforeGuardHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

Object of key = name of guard, value = function

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### setSubscriptionFunction()

> **setSubscriptionFunction**(`fn`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:678](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L678)

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Anonymous functions do not have access to the `this` scope.

#### Parameters

##### fn

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>

the function implementation

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinitionBuilder

#### Example

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

***

### setTransformInput()

> **setTransformInput**\<`TransformInputPayloadSchema`, `TransformInputParamsSchema`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType`?, `inputContentEncoding`?): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `TransformInputPayloadSchema`, `TransformInputParamsSchema`, `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:499](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L499)

Set a transform input hook which will encode or transform the input payload and parameters.
Will be executed as first step before input validation, before guard and the function itself.
This will change the type of input message payload and input message parameter.

#### Type Parameters

• **TransformInputPayloadSchema** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

• **TransformInputParamsSchema** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### transformInputSchema

`TransformInputPayloadSchema`

Input payload validation schema

##### transformParameterSchema

`TransformInputParamsSchema`

Input parameter validation schema

##### transformFunction

[`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `TransformInputPayloadSchema`\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `TransformInputParamsSchema`\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"PayloadSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>\>

the transform input function

##### inputContentType?

`string`

optional the content type of payload

##### inputContentEncoding?

`string`

optional the content encoding

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `TransformInputPayloadSchema`, `TransformInputParamsSchema`, `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### setTransformOutput()

> **setTransformOutput**\<`TransformOutputSchema`\>(`transformOutputSchema`, `transformFunction`, `outputContentType`?, `outputContentEncoding`?): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `TransformOutputSchema`, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:564](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L564)

Set a transform output hook which will encode or transform the response payload.
Will be executed at very last step after function execution, output validation and after guard hooks.
This will change the type of output message payload.

#### Type Parameters

• **TransformOutputSchema** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### transformOutputSchema

`TransformOutputSchema`

The output validation schema

##### transformFunction

[`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"OutputSchema"`\]\>\>, `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `C`\[`"ParamsSchema"`\]\>\>, `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `TransformOutputSchema`\>\>\>

the transform output function

##### outputContentType?

`string`

optional the content type of payload

##### outputContentEncoding?

`string`

optional the content encoding

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `TransformOutputSchema`, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### subscribeToEvent()

> **subscribeToEvent**\<`N`, `V`\>(`eventName`, `serviceVersion`?): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

Defined in: [packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:242](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L242)

Add a filter to only subscribe to messages with matching event name

#### Type Parameters

• **N** *extends* `string`

• **V** *extends* `string`

#### Parameters

##### eventName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

The name of event to subscribe

##### serviceVersion?

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\>

the version of the service that produces the event

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`, `C`\>

SubscriptionDefinitionBuilder
