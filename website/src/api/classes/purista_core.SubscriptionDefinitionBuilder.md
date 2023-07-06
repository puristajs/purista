[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, FunctionPayloadType, FunctionParamsType, FunctionResultType\>

[@purista/core](../modules/purista_core.md).SubscriptionDefinitionBuilder

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` \| `void` \| `undefined` |

## Table of contents

### Constructors

- [constructor](purista_core.SubscriptionDefinitionBuilder.md#constructor)

### Properties

- [autoacknowledge](purista_core.SubscriptionDefinitionBuilder.md#autoacknowledge)
- [durable](purista_core.SubscriptionDefinitionBuilder.md#durable)
- [emitEventName](purista_core.SubscriptionDefinitionBuilder.md#emiteventname)
- [eventName](purista_core.SubscriptionDefinitionBuilder.md#eventname)
- [fn](purista_core.SubscriptionDefinitionBuilder.md#fn)
- [hooks](purista_core.SubscriptionDefinitionBuilder.md#hooks)
- [inputContentEncoding](purista_core.SubscriptionDefinitionBuilder.md#inputcontentencoding)
- [inputContentType](purista_core.SubscriptionDefinitionBuilder.md#inputcontenttype)
- [inputSchema](purista_core.SubscriptionDefinitionBuilder.md#inputschema)
- [messageType](purista_core.SubscriptionDefinitionBuilder.md#messagetype)
- [outputContentEncoding](purista_core.SubscriptionDefinitionBuilder.md#outputcontentencoding)
- [outputContentType](purista_core.SubscriptionDefinitionBuilder.md#outputcontenttype)
- [outputSchema](purista_core.SubscriptionDefinitionBuilder.md#outputschema)
- [parameterSchema](purista_core.SubscriptionDefinitionBuilder.md#parameterschema)
- [principalId](purista_core.SubscriptionDefinitionBuilder.md#principalid)
- [receiver](purista_core.SubscriptionDefinitionBuilder.md#receiver)
- [sender](purista_core.SubscriptionDefinitionBuilder.md#sender)
- [shared](purista_core.SubscriptionDefinitionBuilder.md#shared)
- [subscriptionDescription](purista_core.SubscriptionDefinitionBuilder.md#subscriptiondescription)
- [subscriptionName](purista_core.SubscriptionDefinitionBuilder.md#subscriptionname)

### Methods

- [addOutputSchema](purista_core.SubscriptionDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](purista_core.SubscriptionDefinitionBuilder.md#addparameterschema)
- [addPayloadSchema](purista_core.SubscriptionDefinitionBuilder.md#addpayloadschema)
- [adviceAutoacknowledgeMessage](purista_core.SubscriptionDefinitionBuilder.md#adviceautoacknowledgemessage)
- [adviceDurable](purista_core.SubscriptionDefinitionBuilder.md#advicedurable)
- [filterForMessageType](purista_core.SubscriptionDefinitionBuilder.md#filterformessagetype)
- [filterInstanceId](purista_core.SubscriptionDefinitionBuilder.md#filterinstanceid)
- [filterPrincipalId](purista_core.SubscriptionDefinitionBuilder.md#filterprincipalid)
- [filterReceivedBy](purista_core.SubscriptionDefinitionBuilder.md#filterreceivedby)
- [filterSentFrom](purista_core.SubscriptionDefinitionBuilder.md#filtersentfrom)
- [getDefinition](purista_core.SubscriptionDefinitionBuilder.md#getdefinition)
- [getSubscriptionFunction](purista_core.SubscriptionDefinitionBuilder.md#getsubscriptionfunction)
- [getTransformInputFunction](purista_core.SubscriptionDefinitionBuilder.md#gettransforminputfunction)
- [getTransformOutputFunction](purista_core.SubscriptionDefinitionBuilder.md#gettransformoutputfunction)
- [receiveMessageOnEveryInstance](purista_core.SubscriptionDefinitionBuilder.md#receivemessageoneveryinstance)
- [setAfterGuardHooks](purista_core.SubscriptionDefinitionBuilder.md#setafterguardhooks)
- [setBeforeGuardHooks](purista_core.SubscriptionDefinitionBuilder.md#setbeforeguardhooks)
- [setSubscriptionFunction](purista_core.SubscriptionDefinitionBuilder.md#setsubscriptionfunction)
- [setTransformInput](purista_core.SubscriptionDefinitionBuilder.md#settransforminput)
- [setTransformOutput](purista_core.SubscriptionDefinitionBuilder.md#settransformoutput)
- [subscribeToEvent](purista_core.SubscriptionDefinitionBuilder.md#subscribetoevent)

## Constructors

### constructor

• **new SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`subscriptionName`, `subscriptionDescription`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`unknown`\> = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`unknown`\> |
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

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:105](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L105)

## Properties

### autoacknowledge

• `Private` **autoacknowledge**: `boolean` = `false`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:102](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L102)

___

### durable

• `Private` **durable**: `boolean` = `true`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:99](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L99)

___

### emitEventName

• `Private` `Optional` **emitEventName**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:95](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L95)

___

### eventName

• `Private` `Optional` **eventName**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:94](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L94)

___

### fn

• `Private` `Optional` **fn**: [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:85](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L85)

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard` | `Record`<`string`, [`SubscriptionAfterGuardHook`](../modules/purista_core.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |
| `beforeGuard` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](../modules/purista_core.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |
| `transformInput?` | { `transformFunction`: [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `any`, `any`, `any`, `any`\> ; `transformInputSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\> ; `transformParameterSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\>  } |
| `transformInput.transformFunction` | [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `any`, `any`, `any`, `any`\> |
| `transformInput.transformInputSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |
| `transformInput.transformParameterSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |
| `transformOutput?` | { `transformFunction`: [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\>  } |
| `transformOutput.transformFunction` | [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> |
| `transformOutput.transformOutputSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:49](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L49)

___

### inputContentEncoding

• `Private` **inputContentEncoding**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L43)

___

### inputContentType

• `Private` **inputContentType**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L42)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodTypeAny`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:41](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L41)

___

### messageType

• `Private` **messageType**: `undefined` \| [`EBMessageType`](../enums/purista_core.EBMessageType.md)

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:39](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L39)

___

### outputContentEncoding

• `Private` **outputContentEncoding**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:46](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L46)

___

### outputContentType

• `Private` **outputContentType**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L45)

___

### outputSchema

• `Private` **outputSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L44)

___

### parameterSchema

• `Private` `Optional` **parameterSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L47)

___

### principalId

• `Private` `Optional` **principalId**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:97](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L97)

___

### receiver

• `Private` `Optional` **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `instanceId?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:78](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L78)

___

### sender

• `Private` `Optional` **sender**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `instanceId?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L71)

___

### shared

• `Private` **shared**: `boolean` = `true`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:101](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L101)

___

### subscriptionDescription

• `Private` **subscriptionDescription**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:107](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L107)

___

### subscriptionName

• `Private` **subscriptionName**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:106](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L106)

## Methods

### addOutputSchema

▸ **addOutputSchema**<`I`, `D`, `O`\>(`eventName`, `outputSchema`, `outputContentType?`, `outputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `D` | extends `ZodTypeDef` |
| `O` | `O` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `eventName` | `string` | `undefined` | the event name to be used when the subscription result is emitted as custom event |
| `outputSchema` | `ZodType`<`O`, `D`, `I`\> | `undefined` | the validation schema for the output payload |
| `outputContentType` | `string` | `'application/json'` | optional the content type of payload |
| `outputContentEncoding` | `string` | `'utf-8'` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:306](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L306)

___

### addParameterSchema

▸ **addParameterSchema**<`I`, `D`, `O`\>(`parameterSchema`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

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

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:333](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L333)

___

### addPayloadSchema

▸ **addPayloadSchema**<`I`, `D`, `O`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `unknown` |
| `D` | extends `ZodTypeDef` = `ZodTypeDef` |
| `O` | `unknown` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `inputSchema` | `ZodType`<`O`, `D`, `I`\> | `undefined` | the validation schema for input payload |
| `inputContentType` | `string` | `'application/json'` | optional the content type of payload |
| `inputContentEncoding` | `string` | `'utf-8'` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:277](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L277)

___

### adviceAutoacknowledgeMessage

▸ **adviceAutoacknowledgeMessage**(`acknowledge?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
This means, a message will not be resent, if the subscription execution fails unexpected.

If set to false, the message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the subscription execution fails unexpected
- if sending of optional subscription response failed

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `acknowledge` | `boolean` | `true` | Enable (true) and disable (false) |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinition

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:157](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L157)

___

### adviceDurable

▸ **adviceDurable**(`durable`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.

True: Advises the event bridge (like rabbitMQ) to store all messages if the subscription is not running.
As soon as the subscription is back again, all missed messages will be sent first, before it starts working like a live-subscription.

#### Parameters

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:182](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L182)

___

### filterForMessageType

▸ **filterForMessageType**(`messageType`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageType` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) | the type of message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:263](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L263)

___

### filterInstanceId

▸ **filterInstanceId**(`instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Filter messages only from instance id

**`Deprecated`**

Use filterSentFrom or filterReceivedBy

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instanceId` | `string` | the instance id to subscribe |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:129](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L129)

___

### filterPrincipalId

▸ **filterPrincipalId**(`principalId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Filter messages only for principalId

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `principalId` | `string` | the principal id to subscribe |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:140](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L140)

___

### filterReceivedBy

▸ **filterReceivedBy**(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `instanceId` | `undefined` \| `string` | the event bridge instance id which should receive the message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:238](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L238)

___

### filterSentFrom

▸ **filterSentFrom**(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `instanceId` | `undefined` \| `string` | the event bridge instance id which was publishing the message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:205](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L205)

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`ServiceClassType`, [`SubscriptionDefinitionMetadataBase`](../modules/purista_core.md#subscriptiondefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Returns the final subscription definition which will be passed into the service class.

#### Returns

[`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<`ServiceClassType`, [`SubscriptionDefinitionMetadataBase`](../modules/purista_core.md#subscriptiondefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinition

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:589](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L589)

___

### getSubscriptionFunction

▸ **getSubscriptionFunction**(): [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Get the function implementation

#### Returns

[`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

the subscription function

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:560](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L560)

___

### getTransformInputFunction

▸ **getTransformInputFunction**(): `undefined` \| [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

Return the transform input function

#### Returns

`undefined` \| [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

the input transform function if defined

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:400](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L400)

___

### getTransformOutputFunction

▸ **getTransformOutputFunction**(): `undefined` \| [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `FunctionResultType`\>

Return the transform output function

#### Returns

`undefined` \| [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `FunctionResultType`\>

the transform output function if defined

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:457](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L457)

___

### receiveMessageOnEveryInstance

▸ **receiveMessageOnEveryInstance**(`enforce?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Instruct the event bridge message broker to send the matching message to every running instance.
The underlaying message broker must support this functionality.

In serverless environments, this flag should not have any effect

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enforce` | `boolean` | `true` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinition

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:171](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L171)

___

### setAfterGuardHooks

▸ **setAfterGuardHooks**(`afterGuards`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuards` | `Record`<`string`, [`SubscriptionAfterGuardHook`](../modules/purista_core.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:492](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L492)

___

### setBeforeGuardHooks

▸ **setBeforeGuardHooks**(`beforeGuards`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `beforeGuards` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](../modules/purista_core.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | Object of key = name of guard, value = function |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:476](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L476)

___

### setSubscriptionFunction

▸ **setSubscriptionFunction**(`fn`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `fn` | [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | the function implementation |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:518](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L518)

___

### setTransformInput

▸ **setTransformInput**<`PayloadIn`, `ParamsIn`, `PayloadOut`, `ParamsOut`, `PayloadD`, `ParamsD`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `transformFunction` | [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `PayloadIn`, `ParamsIn`\> | the transform input function |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:357](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L357)

___

### setTransformOutput

▸ **setTransformOutput**<`PayloadOut`, `PayloadD`, `PayloadIn`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `transformFunction` | [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `PayloadIn`\> | the transform output function |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:424](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L424)

___

### subscribeToEvent

▸ **subscribeToEvent**(`eventName`, `serviceVersion?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Add a filter to only subscribe to messages with matching event name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | The name of event to subscribe |
| `serviceVersion?` | `string` | the version of the service that produces the event |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:116](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L116)
