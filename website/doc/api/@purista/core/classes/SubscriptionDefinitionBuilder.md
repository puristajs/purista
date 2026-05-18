[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder\<S, C\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L44)

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type Parameters

### S

`S` *extends* [`Service`](Service.md) = [`Service`](Service.md)

### C

`C` *extends* [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md) = [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)

## Constructors

### Constructor

> **new SubscriptionDefinitionBuilder**\<`S`, `C`\>(`subscriptionName`, `subscriptionDescription`, `deprecated?`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:113](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L113)

#### Parameters

##### subscriptionName

`string`

##### subscriptionDescription

`string`

##### deprecated?

`boolean` = `false`

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

## Methods

### addOutputSchema()

> **addOutputSchema**\<`OutputSchema`\>(`eventName`, `outputSchema`, `outputContentType?`, `outputContentEncoding?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `OutputSchema`, `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:541](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L541)

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type Parameters

##### OutputSchema

`OutputSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### eventName

`string`

the event name to be used when the subscription result is emitted as custom event

##### outputSchema

`OutputSchema`

the validation schema for the output payload

##### outputContentType?

`string` = `'application/json'`

optional the content type of payload

##### outputContentEncoding?

`string` = `'utf-8'`

optional the content encoding

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `OutputSchema`, `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### addParameterSchema()

> **addParameterSchema**\<`ParamsSchema`\>(`parameterSchema`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:574](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L574)

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type Parameters

##### ParamsSchema

`ParamsSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### parameterSchema

`ParamsSchema`

the validation schema for output parameter

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `ParamsSchema`, `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### addPayloadSchema()

> **addPayloadSchema**\<`PayloadSchema`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`PayloadSchema`, `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:506](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L506)

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type Parameters

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### inputSchema

`PayloadSchema`

the validation schema for input payload

##### inputContentType?

`string` = `'application/json'`

optional the content type of payload

##### inputContentEncoding?

`string` = `'utf-8'`

optional the content encoding

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`PayloadSchema`, `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### adviceAutoacknowledgeMessage()

> **adviceAutoacknowledgeMessage**(`acknowledge?`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:364](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L364)

Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
This means, a message will not be resent, if the subscription execution fails unexpected.

If set to false, the message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the subscription execution fails unexpected
- if sending of optional subscription response failed

#### Parameters

##### acknowledge?

`boolean` = `true`

Enable (true) and disable (false)

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinition

***

### adviceConsumerFailureHandling()

> **adviceConsumerFailureHandling**(`config`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:401](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L401)

Advise retry and dead-letter handling for this subscription.

The selected event bridge decides which parts it can honor. Production
adapters should document whether retries are broker-native, bridge-emulated,
or unsupported.

#### Parameters

##### config

[`DefinitionEventBridgeConsumerFailureHandling`](../type-aliases/DefinitionEventBridgeConsumerFailureHandling.md)

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### adviceDurable()

> **adviceDurable**(`durable`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:389](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L389)

False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.

True: Advises the event bridge (like rabbitMQ) to store all messages if the subscription is not running.
As soon as the subscription is back again, all missed messages will be sent first, before it starts working like a live-subscription.

#### Parameters

##### durable

`boolean`

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### canConsumeStream()

> **canConsumeStream**\<`Chunk`, `Final`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `chunkSchema?`, `payloadSchema?`, `parameterSchema?`, `finalSchema?`, `validateChunk?`, `validateFinal?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<\{ `sessionId`: `string`; `[asyncIterator]`: `AsyncIterator`\<\{ `payload`: ...; \}\>; `cancel`: `Promise`\<`void`\>; \}\>\>\>\>, `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:198](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L198)

#### Type Parameters

##### Chunk

`Chunk` *extends* [`Schema`](../type-aliases/Schema.md)

##### Final

`Final` *extends* [`Schema`](../type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

##### Fname

`Fname` *extends* `string` = `string`

#### Parameters

##### serviceName

`SName`

##### serviceVersion

`Version`

##### serviceTarget

`Fname`

##### chunkSchema?

`Chunk`

##### payloadSchema?

`Payload`

##### parameterSchema?

`Parameter`

##### finalSchema?

`Final`

##### validateChunk?

`boolean` = `true`

##### validateFinal?

`boolean` = `true`

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<\{ `sessionId`: `string`; `[asyncIterator]`: `AsyncIterator`\<\{ `payload`: ...; \}\>; `cancel`: `Promise`\<`void`\>; \}\>\>\>\>, `C`\[`"EmitList"`\]\>\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\] & `Record`\<`EventName`, [`InferIn`](../type-aliases/InferIn.md)\<`T`\>\>\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:287](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L287)

Define which custom events the subscription can emit.

#### Type Parameters

##### EventName

`EventName` *extends* `string`

##### T

`T` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### eventName

`EventName`

The custom event name

##### schema

`T`

the payload schema

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\] & `Record`\<`EventName`, [`InferIn`](../type-aliases/InferIn.md)\<`T`\>\>\>\>

***

### canInvoke()

> **canInvoke**\<`Output`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<[`Infer`](../type-aliases/Infer.md)\<`Output`\>\>\>\>\>, `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:132](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L132)

Define a command which can be invoked by the current subscription

#### Type Parameters

##### Output

`Output` *extends* [`Schema`](../type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

##### Fname

`Fname` *extends* `string` = `string`

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

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<[`Infer`](../type-aliases/Infer.md)\<`Output`\>\>\>\>\>, `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

***

### filterForMessageType()

> **filterForMessageType**(`messageType`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:492](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L492)

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

##### messageType

[`EBMessageType`](../enumerations/EBMessageType.md)

the type of message

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### filterPrincipalId()

> **filterPrincipalId**\<`T`\>(`principalId`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:337](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L337)

Filter messages only for principalId

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### principalId

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

the principal id to subscribe

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### filterReceivedBy()

> **filterReceivedBy**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:467](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L467)

Add filter to only match messages received by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send to function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
receivedBy('UserService', undefined, 'testFunction')
```

#### Type Parameters

##### N

`N` *extends* `string`

##### V

`V` *extends* `string`

##### T

`T` *extends* `string`

##### I

`I` *extends* `string`

#### Parameters

##### serviceName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\> \| `undefined`

the name of the service that consumes the message

##### serviceVersion

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\> \| `undefined`

the version of the service that consumes the message

##### serviceTarget

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\> \| `undefined`

the command or subscription name of the service that consumes the message

##### instanceId

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`I`\> \| `undefined`

the event bridge instance id which should receive the message

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### filterSentFrom()

> **filterSentFrom**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:434](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L434)

Add filter to only match messages send by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send from function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
sentFrom('UserService', undefined, 'testFunction')
```

#### Type Parameters

##### N

`N` *extends* `string`

##### V

`V` *extends* `string`

##### T

`T` *extends* `string`

##### I

`I` *extends* `string`

#### Parameters

##### serviceName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\> \| `undefined`

the name of the service that produces the message

##### serviceVersion

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\> \| `undefined`

the version of the service that produces the message

##### serviceTarget

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\> \| `undefined`

the command or subscription name of the service that produces the message

##### instanceId

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`I`\> \| `undefined`

the event bridge instance id which was publishing the message

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### filterTenantId()

> **filterTenantId**\<`T`\>(`tenantId`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:347](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L347)

Filter messages only for tenantId

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### tenantId

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

the principal id to subscribe

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`Complete`](../type-aliases/Complete.md)\<[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`SubscriptionDefinitionMetadataBase`](../type-aliases/SubscriptionDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\]\>\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:870](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L870)

Returns the final subscription definition which will be passed into the service class.

#### Returns

`Promise`\<[`Complete`](../type-aliases/Complete.md)\<[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`SubscriptionDefinitionMetadataBase`](../type-aliases/SubscriptionDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\]\>\>\>

SubscriptionDefinition

***

### getSubscriptionFunction()

> **getSubscriptionFunction**(): [`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:814](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L814)

Get the function implementation including input and output validation.
Also, before and after hooks are triggered during execution.

#### Returns

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

the subscription function

***

### getSubscriptionFunctionPlain()

> **getSubscriptionFunctionPlain**(): [`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:846](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L846)

Get the function implementation without input and output validation.
No hooks are triggered during execution.

#### Returns

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

the subscription function

***

### getSubscriptionTransformContextMock()

> **getSubscriptionTransformContextMock**(`input`): `object`

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:951](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L951)

Returns a mocked transform function context, which can be used in unit tests.

#### Parameters

##### input

Options to create the transform context mock (message/resources/sandbox)

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

> **configs**: `object`

the config store

###### mock.configs.getConfig

> **getConfig**: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

get a config value from the config store

###### mock.configs.removeConfig

> **removeConfig**: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

delete a config value from the config store

###### mock.configs.setConfig

> **setConfig**: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

set a config value in the config store

###### mock.logger

> **logger**: [`Logger`](Logger.md)

the logger instance

###### mock.message

> **message**: `Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

the original received message

###### mock.queue

> **queue**: [`QueueContext`](../type-aliases/QueueContext.md)

###### mock.resources

> **resources**: [`EmptyObject`](../type-aliases/EmptyObject.md)

###### mock.secrets

> **secrets**: `object`

the secret store

###### mock.secrets.getSecret

> **getSecret**: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

get a secret from the secret store

###### mock.secrets.removeSecret

> **removeSecret**: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

delete a secret from the secret store

###### mock.secrets.setSecret

> **setSecret**: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

set a secret in the secret store

###### mock.startActiveSpan

> **startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

###### Type Parameters

###### F

`F`

###### Parameters

###### name

`string`

###### opts

`SpanOptions`

###### context

`Context` \| `undefined`

###### fn

(`span`) => `Promise`\<`F`\>

###### Returns

`Promise`\<`F`\>

###### mock.states

> **states**: `object`

the state store

###### mock.states.getState

> **getState**: [`StateGetterFunction`](../type-aliases/StateGetterFunction.md)

get a state value from the state store

###### mock.states.removeState

> **removeState**: [`StateDeleteFunction`](../type-aliases/StateDeleteFunction.md)

delete a state value from the state store

###### mock.states.setState

> **setState**: [`StateSetterFunction`](../type-aliases/StateSetterFunction.md)

set a state value in the state store

###### mock.wrapInSpan

> **wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

###### Type Parameters

###### F

`F`

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

###### stubs.enqueue

> **enqueue**: `SinonStub`\<`any`[], `any`\>

###### stubs.getConfig

> **getConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.getSecret

> **getSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.getState

> **getState**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger

> **logger**: `object` = `logger.stubs`

###### stubs.logger.debug

> **debug**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.error

> **error**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.fatal

> **fatal**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.info

> **info**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.trace

> **trace**: `SinonStub`\<`any`[], `any`\>

###### stubs.logger.warn

> **warn**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeConfig

> **removeConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeSecret

> **removeSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.removeState

> **removeState**: `SinonStub`\<`any`[], `any`\>

###### stubs.resources

> **resources**: `Partial`\<[`EmptyObject`](../type-aliases/EmptyObject.md)\>

###### stubs.scheduleAt

> **scheduleAt**: `SinonStub`\<`any`[], `any`\>

###### stubs.setConfig

> **setConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.setSecret

> **setSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.setState

> **setState**: `SinonStub`\<`any`[], `any`\>

###### stubs.startActiveSpan

> **startActiveSpan**: `SinonStub`\<`any`[], `any`\>

###### stubs.wrapInSpan

> **wrapInSpan**: `SinonStub`\<`any`[], `any`\>

***

### getTransformInputFunction()

> **getTransformInputFunction**(): [`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>\> \| `undefined`

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:647](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L647)

Return the transform input function

#### Returns

[`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>\> \| `undefined`

the input transform function if defined

***

### getTransformOutputFunction()

> **getTransformOutputFunction**(): [`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>\> \| `undefined`

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:711](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L711)

Return the transform output function

#### Returns

[`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>\> \| `undefined`

the transform output function if defined

***

### markAsDeprecated()

> **markAsDeprecated**(): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:311](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L311)

Mark this subscription as deprecated

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### receiveMessageOnEveryInstance()

> **receiveMessageOnEveryInstance**(`enforce?`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:378](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L378)

Instruct the event bridge message broker to send the matching message to every running instance.
The underlaying message broker must support this functionality.

In serverless environments, this flag should not have any effect

#### Parameters

##### enforce?

`boolean` = `true`

Set to true to deliver message to every running instance

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinition

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`afterGuards`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:754](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L754)

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

##### afterGuards

`Record`\<`string`, [`SubscriptionAfterGuardHook`](../type-aliases/SubscriptionAfterGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Object of key = name of guard, value = function

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`beforeGuards`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:730](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L730)

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

##### beforeGuards

`Record`\<`string`, [`SubscriptionBeforeGuardHook`](../type-aliases/SubscriptionBeforeGuardHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Object of key = name of guard, value = function

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### setSubscriptionFunction()

> **setSubscriptionFunction**(`fn`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:789](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L789)

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Arrow functions do not have access to the `this` scope.

#### Parameters

##### fn

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\]\>

the function implementation

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinitionBuilder

#### Example

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

***

### setTransformInput()

> **setTransformInput**\<`TransformInputPayloadSchema`, `TransformInputParamsSchema`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `TransformInputPayloadSchema`, `TransformInputParamsSchema`, `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:604](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L604)

Set a transform input hook which will encode or transform the input payload and parameters.
Will be executed as first step before input validation, before guard and the function itself.
This will change the type of input message payload and input message parameter.

#### Type Parameters

##### TransformInputPayloadSchema

`TransformInputPayloadSchema` *extends* [`Schema`](../type-aliases/Schema.md)

##### TransformInputParamsSchema

`TransformInputParamsSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### transformInputSchema

`TransformInputPayloadSchema`

Input payload validation schema

##### transformParameterSchema

`TransformInputParamsSchema`

Input parameter validation schema

##### transformFunction

[`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`TransformInputPayloadSchema`\>, [`Infer`](../type-aliases/Infer.md)\<`TransformInputParamsSchema`\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>\>

the transform input function

##### inputContentType?

`string`

optional the content type of payload

##### inputContentEncoding?

`string`

optional the content encoding

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `TransformInputPayloadSchema`, `TransformInputParamsSchema`, `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### setTransformOutput()

> **setTransformOutput**\<`TransformOutputSchema`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `TransformOutputSchema`, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:671](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L671)

Set a transform output hook which will encode or transform the response payload.
Will be executed at very last step after function execution, output validation and after guard hooks.
This will change the type of output message payload.

#### Type Parameters

##### TransformOutputSchema

`TransformOutputSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### transformOutputSchema

`TransformOutputSchema`

The output validation schema

##### transformFunction

[`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`TransformOutputSchema`\>\>

the transform output function

##### outputContentType?

`string`

optional the content type of payload

##### outputContentEncoding?

`string`

optional the content encoding

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `TransformOutputSchema`, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

SubscriptionDefinitionBuilder

***

### subscribeToEvent()

> **subscribeToEvent**\<`N`, `V`\>(`eventName`, `serviceVersion?`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:322](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L322)

Add a filter to only subscribe to messages with matching event name

#### Type Parameters

##### N

`N` *extends* `string`

##### V

`V` *extends* `string`

#### Parameters

##### eventName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

The name of event to subscribe

##### serviceVersion?

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\>

the version of the service that produces the event

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinitionBuilder
