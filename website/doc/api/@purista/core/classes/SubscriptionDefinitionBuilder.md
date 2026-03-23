[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder\<S, C\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:61](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L61)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:130](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L130)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:657](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L657)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:690](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L690)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:622](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L622)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:502](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L502)

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

### adviceDurable()

> **adviceDurable**(`durable`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:527](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L527)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:215](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L215)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:425](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L425)

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

### canEnqueue()

> **canEnqueue**\<`Payload`, `Parameter`, `QueueName`\>(`queueName`, `payloadSchema?`, `parameterSchema?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\] & `Record`\<`QueueName`, (`payload`, `parameter`, `options?`) => `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>\>\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:375](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L375)

#### Type Parameters

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

##### QueueName

`QueueName` *extends* `string` = `string`

#### Parameters

##### queueName

`QueueName`

##### payloadSchema?

`Payload`

##### parameterSchema?

`Parameter`

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\] & `Record`\<`QueueName`, (`payload`, `parameter`, `options?`) => `Promise`\<[`QueueEnqueueResult`](../type-aliases/QueueEnqueueResult.md)\>\>\>\>

***

### canInvoke()

> **canInvoke**\<`Output`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\] & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`, `parameter`) => `Promise`\<[`Infer`](../type-aliases/Infer.md)\<`Output`\>\>\>\>\>, `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\]\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:149](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L149)

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

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:307](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L307)

Define an agent which can be invoked by the current subscription.
The agent must follow the PURISTA agent protocol.

#### Type Parameters

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md) = `ZodObject`\<\{ `attachments`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `conversationId`: `ZodOptional`\<`ZodString`\>; `history`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `message`: `ZodString`; \}, `$loose`\>

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md) = [`Schema`](../type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

#### Parameters

##### agentName

`SName`

The name of the agent service

##### agentVersion

`Version`

The version of the agent service

##### invokeConfigOrParameterSchema?

Optional invoke configuration:
- `parameterSchema` (legacy shorthand) validates `.call(_, parameter)`
- `{ payloadSchema, parameterSchema }` validates both `.call(payload, parameter)` arguments

`Parameter` | [`SubscriptionAgentInvokeConfig`](../type-aliases/SubscriptionAgentInvokeConfig.md)\<`Payload`, `Parameter`\>

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`C`\[`"PayloadSchema"`\], `C`\[`"ParamsSchema"`\], `C`\[`"OutputSchema"`\], `C`\[`"TransformInputPayloadSchema"`\], `C`\[`"TransformInputParamsSchema"`\], `C`\[`"TransformOutputSchema"`\], `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\] & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>\>

***

### filterForMessageType()

> **filterForMessageType**(`messageType`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:608](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L608)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:475](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L475)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:583](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L583)

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

the name of the service that consumes the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\> | `undefined`

##### serviceVersion

the version of the service that consumes the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\> | `undefined`

##### serviceTarget

the command or subscription name of the service that consumes the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\> | `undefined`

##### instanceId

the event bridge instance id which should receive the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`I`\> | `undefined`

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### filterSentFrom()

> **filterSentFrom**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:550](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L550)

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

the name of the service that produces the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\> | `undefined`

##### serviceVersion

the version of the service that produces the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`V`\> | `undefined`

##### serviceTarget

the command or subscription name of the service that produces the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\> | `undefined`

##### instanceId

the event bridge instance id which was publishing the message

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`I`\> | `undefined`

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

***

### filterTenantId()

> **filterTenantId**\<`T`\>(`tenantId`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:485](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L485)

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

> **getDefinition**(): `Promise`\<[`Complete`](../type-aliases/Complete.md)\<[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`SubscriptionDefinitionMetadataBase`](../type-aliases/SubscriptionDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:989](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L989)

Returns the final subscription definition which will be passed into the service class.

#### Returns

`Promise`\<[`Complete`](../type-aliases/Complete.md)\<[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], [`SubscriptionDefinitionMetadataBase`](../type-aliases/SubscriptionDefinitionMetadataBase.md), `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>\>\>

SubscriptionDefinition

***

### getSubscriptionContextMock()

> **getSubscriptionContextMock**(`input`): `object`

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:1071](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L1071)

Returns a mocked command function context, which can be used in unit tests.

#### Parameters

##### input

Options to create the context mock (message/resources/sandbox)

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

###### mock.emit

> **emit**: [`EmitCustomMessageFunction`](../type-aliases/EmitCustomMessageFunction.md)\<`C`\[`"EmitList"`\]\>

emit a custom message

###### mock.invokeAgent

> **invokeAgent**: `C`\[`"AgentInvokes"`\]

Invokes an agent and returns the result.

###### mock.logger

> **logger**: [`Logger`](Logger.md)

the logger instance

###### mock.message

> **message**: `Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

the original message

###### mock.queue

> **queue**: [`QueueContext`](../type-aliases/QueueContext.md) & [`QueueContext`](../type-aliases/QueueContext.md)\<`C`\[`"QueueInvokes"`\]\>

###### mock.resources

> **resources**: `C`\[`"Resources"`\]

Provides resources defined in service builder and set via config during service creation

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

###### mock.service

> **service**: `C`\[`"Invokes"`\]

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

`Context` | `undefined`

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

###### mock.stream

> **stream**: `C`\[`"StreamInvokes"`\]

consumes stream responses from other service stream endpoints

###### mock.wrapInSpan()

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

###### stubs.emit

> **emit**: [`FromEmitToOtherType`](../type-aliases/FromEmitToOtherType.md)\<`C`\[`"EmitList"`\], `SinonStub`\<`any`[], `any`\>\> = `eventList`

###### stubs.enqueue

> **enqueue**: `SinonStub`\<`any`[], `any`\>

###### stubs.getConfig

> **getConfig**: `SinonStub`\<`any`[], `any`\>

###### stubs.getSecret

> **getSecret**: `SinonStub`\<`any`[], `any`\>

###### stubs.getState

> **getState**: `SinonStub`\<`any`[], `any`\>

###### stubs.invoke

> **invoke**: `SinonStub`\<`any`[], `any`\>

###### stubs.invokeAgent

> **invokeAgent**: `C`\[`"AgentInvokes"`\]

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

> **resources**: `Partial`\<`C`\[`"Resources"`\]\>

###### stubs.scheduleAt

> **scheduleAt**: `SinonStub`\<`any`[], `any`\>

###### stubs.service

> **service**: [`FromInvokeToOtherType`](../type-aliases/FromInvokeToOtherType.md)\<`C`\[`"Invokes"`\], `SinonStub`\<`any`[], `any`\>\>

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

### getSubscriptionFunction()

> **getSubscriptionFunction**(): [`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:931](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L931)

Get the function implementation including input and output validation.
Also, before and after hooks are triggered during execution.

#### Returns

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

the subscription function

***

### getSubscriptionFunctionPlain()

> **getSubscriptionFunctionPlain**(): [`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:964](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L964)

Get the function implementation without input and output validation.
No hooks are triggered during execution.

#### Returns

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

the subscription function

***

### getSubscriptionTransformContextMock()

> **getSubscriptionTransformContextMock**(`input`): `object`

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:1099](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L1099)

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

###### mock.startActiveSpan()

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

`Context` | `undefined`

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

###### mock.wrapInSpan()

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:763](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L763)

Return the transform input function

#### Returns

[`SubscriptionTransformInputHook`](../type-aliases/SubscriptionTransformInputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputPayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"TransformInputParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"ParamsSchema"`\]\>\> \| `undefined`

the input transform function if defined

***

### getTransformOutputFunction()

> **getTransformOutputFunction**(): [`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>\> \| `undefined`

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:827](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L827)

Return the transform output function

#### Returns

[`SubscriptionTransformOutputHook`](../type-aliases/SubscriptionTransformOutputHook.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"OutputSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"TransformOutputSchema"`\]\>\> \| `undefined`

the transform output function if defined

***

### markAsDeprecated()

> **markAsDeprecated**(): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:449](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L449)

Mark this subscription as deprecated

#### Returns

`SubscriptionDefinitionBuilder`\<`S`, `C`\>

SubscriptionDefinitionBuilder

***

### receiveMessageOnEveryInstance()

> **receiveMessageOnEveryInstance**(`enforce?`): `SubscriptionDefinitionBuilder`\<`S`, `C`\>

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:516](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L516)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:870](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L870)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:846](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L846)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:905](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L905)

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Arrow functions do not have access to the `this` scope.

#### Parameters

##### fn

[`SubscriptionFunction`](../type-aliases/SubscriptionFunction.md)\<`S`, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"PayloadSchema"`\]\>, [`Infer`](../type-aliases/Infer.md)\<`C`\[`"ParamsSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`C`\[`"OutputSchema"`\]\>, `C`\[`"Resources"`\], `C`\[`"Invokes"`\], `C`\[`"StreamInvokes"`\], `C`\[`"EmitList"`\], `C`\[`"QueueInvokes"`\], `C`\[`"AgentInvokes"`\]\>

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:720](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L720)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:787](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L787)

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

Defined in: [SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:460](https://github.com/puristajs/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L460)

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
