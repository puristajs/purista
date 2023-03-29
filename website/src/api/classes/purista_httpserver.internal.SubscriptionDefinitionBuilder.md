[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, FunctionPayloadType, FunctionParamsType, FunctionResultType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).SubscriptionDefinitionBuilder

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` \| `void` \| `undefined` |

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#constructor)

### Properties

- [autoacknowledge](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#autoacknowledge)
- [durable](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#durable)
- [emitEventName](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#emiteventname)
- [eventName](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#eventname)
- [fn](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#fn)
- [hooks](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#hooks)
- [inputContentEncoding](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#inputcontentencoding)
- [inputContentType](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#inputcontenttype)
- [inputSchema](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#inputschema)
- [instanceId](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#instanceid)
- [messageType](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#messagetype)
- [outputContentEncoding](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#outputcontentencoding)
- [outputContentType](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#outputcontenttype)
- [outputSchema](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#outputschema)
- [parameterSchema](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#parameterschema)
- [principalId](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#principalid)
- [receiver](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#receiver)
- [sender](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#sender)
- [shared](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#shared)
- [subscriptionDescription](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#subscriptiondescription)
- [subscriptionName](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#subscriptionname)

### Methods

- [addOutputSchema](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#addparameterschema)
- [addPayloadSchema](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#addpayloadschema)
- [adviceAutoacknowledgeMessage](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#adviceautoacknowledgemessage)
- [adviceDurable](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#advicedurable)
- [filterForMessageType](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#filterformessagetype)
- [filterInstanceId](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#filterinstanceid)
- [filterPrincipalId](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#filterprincipalid)
- [filterReceivedBy](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#filterreceivedby)
- [filterSentFrom](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#filtersentfrom)
- [getDefinition](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#getdefinition)
- [getFunction](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#getfunction)
- [getSubscriptionFunction](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#getsubscriptionfunction)
- [getTransformInputFunction](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#gettransforminputfunction)
- [getTransformOutputFunction](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#gettransformoutputfunction)
- [receiveMessageOnEveryInstance](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#receivemessageoneveryinstance)
- [setAfterGuardHooks](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#setafterguardhooks)
- [setBeforeGuardHooks](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#setbeforeguardhooks)
- [setFunction](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#setfunction)
- [setSubscriptionFunction](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#setsubscriptionfunction)
- [setTransformInput](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#settransforminput)
- [setTransformOutput](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#settransformoutput)
- [subscribeToEvent](purista_httpserver.internal.SubscriptionDefinitionBuilder.md#subscribetoevent)

## Constructors

### constructor

• **new SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`subscriptionName`, `subscriptionDescription`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md)<`unknown`, `ServiceClassType`\> = [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md)<`unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `undefined` \| `void` \| `MessageResultType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:33

## Properties

### autoacknowledge

• `Private` **autoacknowledge**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:32

___

### durable

• `Private` **durable**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:30

___

### emitEventName

• `Private` `Optional` **emitEventName**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:27

___

### eventName

• `Private` `Optional` **eventName**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:26

___

### fn

• `Private` `Optional` **fn**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:25

___

### hooks

• `Private` **hooks**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:22

___

### inputContentEncoding

• `Private` **inputContentEncoding**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:17

___

### inputContentType

• `Private` **inputContentType**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:16

___

### inputSchema

• `Private` `Optional` **inputSchema**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:15

___

### instanceId

• `Private` `Optional` **instanceId**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:29

___

### messageType

• `Private` **messageType**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:14

___

### outputContentEncoding

• `Private` **outputContentEncoding**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:20

___

### outputContentType

• `Private` **outputContentType**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:19

___

### outputSchema

• `Private` **outputSchema**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:18

___

### parameterSchema

• `Private` `Optional` **parameterSchema**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:21

___

### principalId

• `Private` `Optional` **principalId**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:28

___

### receiver

• `Private` `Optional` **receiver**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:24

___

### sender

• `Private` `Optional` **sender**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:23

___

### shared

• `Private` **shared**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:31

___

### subscriptionDescription

• `Private` **subscriptionDescription**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:13

___

### subscriptionName

• `Private` **subscriptionName**: `any`

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:12

## Methods

### addOutputSchema

▸ **addOutputSchema**<`I`, `D`, `O`\>(`eventName`, `outputSchema`, `outputContentType?`, `outputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `D` | extends `ZodTypeDef` |
| `O` | `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the event name to be used when the subscription result is emitted as custom event |
| `outputSchema` | `ZodType`<`O`, `D`, `I`\> | the validation schema for the output payload |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:148

___

### addParameterSchema

▸ **addParameterSchema**<`I`, `D`, `O`\>(`parameterSchema`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `D` | extends `ZodTypeDef` |
| `O` | `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameterSchema` | `ZodType`<`O`, `D`, `I`\> | the validation schema for output parameter |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:155

___

### addPayloadSchema

▸ **addPayloadSchema**<`I`, `D`, `O`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `unknown` |
| `D` | extends `ZodTypeDef` = `ZodTypeDef` |
| `O` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputSchema` | `ZodType`<`O`, `D`, `I`\> | the validation schema for input payload |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:138

___

### adviceAutoacknowledgeMessage

▸ **adviceAutoacknowledgeMessage**(`acknowledge?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
This means, a message will not be resent, if the subscription execution fails unexpected.

If set to false, the message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the subscription execution fails unexpected
- if sending of optional subscription response failed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `acknowledge?` | `boolean` | Enable (true) and disable (false) |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinition

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:65

___

### adviceDurable

▸ **adviceDurable**(`durable`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.

True: Advises the event bridge (like rabbitMQ) to store all messages if the subscription is not running.
As soon as the subscription is back again, all missed messages will be sent first, before it starts working like a live-subscription.

#### Parameters

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:82

___

### filterForMessageType

▸ **filterForMessageType**(`messageType`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageType` | [`EBMessageType`](../enums/purista_httpserver.internal.EBMessageType.md) | the type of message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:129

___

### filterInstanceId

▸ **filterInstanceId**(`instanceId`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Filter messages only from instance id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instanceId` | `string` | the instance id to subscribe |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:46

___

### filterPrincipalId

▸ **filterPrincipalId**(`principalId`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Filter messages only for principalId

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `principalId` | `string` | the principal id to subscribe |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:52

___

### filterReceivedBy

▸ **filterReceivedBy**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Add filter to only match messages received by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send to function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
receivedBy('UserService', undefined, 'testFunction')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceName` | `undefined` \| `string` | the name of the service that consumes the message |
| `serviceVersion` | `undefined` \| `string` | the version of the service that consumes the message |
| `serviceTarget` | `undefined` \| `string` | the command or subscription name of the service that consumes the message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:118

___

### filterSentFrom

▸ **filterSentFrom**(`serviceName`, `serviceVersion`, `serviceTarget`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Add filter to only match messages send by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send from function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
sentFrom('UserService', undefined, 'testFunction')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceName` | `undefined` \| `string` | the name of the service that produces the message |
| `serviceVersion` | `undefined` \| `string` | the version of the service that produces the message |
| `serviceTarget` | `undefined` \| `string` | the command or subscription name of the service that produces the message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:100

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<`ServiceClassType`, [`SubscriptionDefinitionMetadataBase`](../modules/purista_httpserver.internal.md#subscriptiondefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Returns the final subscription definition which will be passed into the service class.

#### Returns

[`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<`ServiceClassType`, [`SubscriptionDefinitionMetadataBase`](../modules/purista_httpserver.internal.md#subscriptiondefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinition

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:239

___

### getFunction

▸ **getFunction**(): [`SubscriptionFunction`](../modules/purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

**`Deprecated`**

use getSubscriptionFunction instead. It will be removed soon.

#### Returns

[`SubscriptionFunction`](../modules/purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:229

___

### getSubscriptionFunction

▸ **getSubscriptionFunction**(): [`SubscriptionFunction`](../modules/purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Get the function implementation

#### Returns

[`SubscriptionFunction`](../modules/purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

the subscription function

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:234

___

### getTransformInputFunction

▸ **getTransformInputFunction**(): `undefined` \| [`SubscriptionTransformInputHook`](../modules/purista_httpserver.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

Return the transform input function

#### Returns

`undefined` \| [`SubscriptionTransformInputHook`](../modules/purista_httpserver.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

the input transform function if defined

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:172

___

### getTransformOutputFunction

▸ **getTransformOutputFunction**(): `undefined` \| [`SubscriptionTransformOutputHook`](../modules/purista_httpserver.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `FunctionResultType`\>

Return the transform output function

#### Returns

`undefined` \| [`SubscriptionTransformOutputHook`](../modules/purista_httpserver.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `FunctionResultType`\>

the transform output function if defined

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:188

___

### receiveMessageOnEveryInstance

▸ **receiveMessageOnEveryInstance**(`enforce?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Instruct the event bridge message broker to send the matching message to every running instance.
The underlaying message broker must support this functionality.

In serverless environments, this flag should not have any effect

#### Parameters

| Name | Type |
| :------ | :------ |
| `enforce?` | `boolean` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinition

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:75

___

### setAfterGuardHooks

▸ **setAfterGuardHooks**(`afterGuards`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuards` | `Record`<`string`, [`SubscriptionAfterGuardHook`](../modules/purista_httpserver.internal.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:202

___

### setBeforeGuardHooks

▸ **setBeforeGuardHooks**(`beforeGuards`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `beforeGuards` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](../modules/purista_httpserver.internal.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | Object of key = name of guard, value = function |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:195

___

### setFunction

▸ **setFunction**(`fn`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

**`Deprecated`**

use setSubscriptionFunction instead. It will be removed soon.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`SubscriptionFunction`](../modules/purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:207

___

### setSubscriptionFunction

▸ **setSubscriptionFunction**(`fn`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Anonymous functions do not have access to the `this` scope.

**`Example`**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`SubscriptionFunction`](../modules/purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | the function implementation |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:224

___

### setTransformInput

▸ **setTransformInput**<`PayloadIn`, `ParamsIn`, `PayloadOut`, `ParamsOut`, `PayloadD`, `ParamsD`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set a transform input hook which will encode or transform the input payload and parameters.
Will be executed as first step before input validation, before guard and the function itself.
This will change the type of input message payload and input message parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadIn` | `MessagePayloadType` |
| `ParamsIn` | `MessageParamsType` |
| `PayloadOut` | `MessagePayloadType` |
| `ParamsOut` | `MessageParamsType` |
| `PayloadD` | extends `ZodTypeDef` = `ZodTypeDef` |
| `ParamsD` | extends `ZodTypeDef` = `ZodTypeDef` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformInputSchema` | `ZodType`<`PayloadOut`, `PayloadD`, `PayloadIn`\> | Input payload validation schema |
| `transformParameterSchema` | `ZodType`<`ParamsOut`, `ParamsD`, `ParamsIn`\> | Input parameter validation schema |
| `transformFunction` | [`SubscriptionTransformInputHook`](../modules/purista_httpserver.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `PayloadIn`, `ParamsIn`\> | the transform input function |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:167

___

### setTransformOutput

▸ **setTransformOutput**<`PayloadOut`, `PayloadD`, `PayloadIn`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set a transform output hook which will encode or transform the response payload.
Will be executed at very last step after function execution, output validation and after guard hooks.
This will change the type of output message payload.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadOut` | `PayloadOut` |
| `PayloadD` | extends `ZodTypeDef` |
| `PayloadIn` | `PayloadIn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformOutputSchema` | `ZodType`<`PayloadOut`, `PayloadD`, `PayloadIn`\> | The output validation schema |
| `transformFunction` | [`SubscriptionTransformOutputHook`](../modules/purista_httpserver.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `PayloadIn`\> | the transform output function |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:183

___

### subscribeToEvent

▸ **subscribeToEvent**(`eventName`, `serviceVersion?`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Add a filter to only subscribe to messages with matching event name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | The name of event to subscribe |
| `serviceVersion?` | `string` | the version of the service that produces the event |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:40
