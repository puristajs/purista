[PURISTA API - v1.4.3](../README.md) / [@purista/amqpbridge](purista_amqpbridge.md) / internal

# Namespace: internal

[@purista/amqpbridge](purista_amqpbridge.md).internal

## Table of contents

### Enumerations

- [EBMessageType](../enums/purista_amqpbridge.internal.EBMessageType.md)
- [StatusCode](../enums/purista_amqpbridge.internal.StatusCode.md)

### Enumeration Members

- [Command](purista_amqpbridge.internal.md#command)
- [CommandErrorResponse](purista_amqpbridge.internal.md#commanderrorresponse)
- [CommandSuccessResponse](purista_amqpbridge.internal.md#commandsuccessresponse)

### Classes

- [EventBridge](../classes/purista_amqpbridge.internal.EventBridge.md)
- [GenericEventEmitter](../classes/purista_amqpbridge.internal.GenericEventEmitter.md)
- [HandledError](../classes/purista_amqpbridge.internal.HandledError.md)
- [Logger](../classes/purista_amqpbridge.internal.Logger.md)
- [UnhandledError](../classes/purista_amqpbridge.internal.UnhandledError.md)

### Interfaces

- [IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md)

### Type Aliases

- [Command](purista_amqpbridge.internal.md#command-1)
- [CommandErrorResponse](purista_amqpbridge.internal.md#commanderrorresponse-1)
- [CommandResponse](purista_amqpbridge.internal.md#commandresponse)
- [CommandSuccessResponse](purista_amqpbridge.internal.md#commandsuccessresponse-1)
- [CorrelationId](purista_amqpbridge.internal.md#correlationid)
- [CustomEvents](purista_amqpbridge.internal.md#customevents)
- [CustomMessage](purista_amqpbridge.internal.md#custommessage)
- [EBMessage](purista_amqpbridge.internal.md#ebmessage)
- [EBMessageAddress](purista_amqpbridge.internal.md#ebmessageaddress)
- [EBMessageBase](purista_amqpbridge.internal.md#ebmessagebase)
- [EBMessageId](purista_amqpbridge.internal.md#ebmessageid)
- [EncoderFunctions](purista_amqpbridge.internal.md#encoderfunctions)
- [ErrorResponse](purista_amqpbridge.internal.md#errorresponse)
- [EventBridgeEvents](purista_amqpbridge.internal.md#eventbridgeevents)
- [EventBridgeEventsBasic](purista_amqpbridge.internal.md#eventbridgeeventsbasic)
- [EventKey](purista_amqpbridge.internal.md#eventkey)
- [EventMap](purista_amqpbridge.internal.md#eventmap)
- [EventReceiver](purista_amqpbridge.internal.md#eventreceiver)
- [InfoInvokeTimeout](purista_amqpbridge.internal.md#infoinvoketimeout)
- [InfoMessage](purista_amqpbridge.internal.md#infomessage)
- [InfoServiceBase](purista_amqpbridge.internal.md#infoservicebase)
- [InfoServiceDrain](purista_amqpbridge.internal.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_amqpbridge.internal.md#infoservicefunctionadded)
- [InfoServiceInit](purista_amqpbridge.internal.md#infoserviceinit)
- [InfoServiceNotReady](purista_amqpbridge.internal.md#infoservicenotready)
- [InfoServiceReady](purista_amqpbridge.internal.md#infoserviceready)
- [InfoServiceShutdown](purista_amqpbridge.internal.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_amqpbridge.internal.md#infosubscriptionerror)
- [InstanceId](purista_amqpbridge.internal.md#instanceid)
- [LoggerOptions](purista_amqpbridge.internal.md#loggeroptions)
- [PendigInvocation](purista_amqpbridge.internal.md#pendiginvocation)
- [PrincipalId](purista_amqpbridge.internal.md#principalid)
- [Subscription](purista_amqpbridge.internal.md#subscription)
- [SubscriptionSettings](purista_amqpbridge.internal.md#subscriptionsettings)
- [TraceId](purista_amqpbridge.internal.md#traceid)
- [addPrefixToObject](purista_amqpbridge.internal.md#addprefixtoobject)

## Enumeration Members

### Command

• **Command**: ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

core/lib/types/core/types/EBMessageType.enum.d.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse**: ``"commandErrorResponse"``

#### Defined in

core/lib/types/core/types/EBMessageType.enum.d.ts:13

___

### CommandSuccessResponse

• **CommandSuccessResponse**: ``"commandSuccessResponse"``

#### Defined in

core/lib/types/core/types/EBMessageType.enum.d.ts:12

## Type Aliases

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `correlationId`: [`CorrelationId`](purista_amqpbridge.internal.md#correlationid) ; `messageType`: [`Command`](purista_amqpbridge.internal.md#command) ; `payload`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `receiver`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

Command is a event bridge message, which is emitted by sender to event bridge.
The event bridge dispatches the event to the receiver.
A command expects to get a response message from receiver back to sender.

Also if there are subscriptions which are matching given command,
the event bridge also dispatches the command message to the subscriber(s).

BE AWARE:
Subscribers should not respond with command responses if they are "silent" subscribers/listeners.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

#### Defined in

core/lib/types/core/types/commandType/Command.d.ts:17

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `correlationId`: [`CorrelationId`](purista_amqpbridge.internal.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_amqpbridge.internal.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md)  } ; `receiver`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

core/lib/types/core/types/commandType/CommandErrorResponse.d.ts:10

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_amqpbridge.internal.md#commandsuccessresponse-1)<`T`\> \| [`CommandErrorResponse`](purista_amqpbridge.internal.md#commanderrorresponse-1)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

core/lib/types/core/types/commandType/CommandResponse.d.ts:7

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](purista_amqpbridge.internal.md#correlationid) ; `messageType`: [`CommandSuccessResponse`](../enums/purista_amqpbridge.internal.EBMessageType.md#commandsuccessresponse) ; `payload`: `PayloadType` ; `receiver`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

core/lib/types/core/types/commandType/CommandSuccessResponse.d.ts:10

___

### CorrelationId

Ƭ **CorrelationId**: `string`

#### Defined in

core/lib/types/core/types/CorrelationId.d.ts:1

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

core/lib/types/core/types/EventBridgeEvents.d.ts:18

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: { `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_amqpbridge.internal.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Defined in

core/lib/types/core/types/CustomMessage.d.ts:5

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_amqpbridge.internal.md#command-1) \| [`CommandResponse`](purista_amqpbridge.internal.md#commandresponse) \| [`InfoMessage`](purista_amqpbridge.internal.md#infomessage) \| [`CustomMessage`](purista_amqpbridge.internal.md#custommessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

core/lib/types/core/types/EBMessage.d.ts:7

___

### EBMessageAddress

Ƭ **EBMessageAddress**: `Object`

A event bridge message address describes receiver/sender of a message.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `serviceName` | `string` |
| `serviceTarget` | `string` |
| `serviceVersion` | `string` |

#### Defined in

core/lib/types/core/types/EBMessageAddress.d.ts:4

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId?` | [`CorrelationId`](purista_amqpbridge.internal.md#correlationid) |
| `eventName?` | `string` |
| `id` | [`EBMessageId`](purista_amqpbridge.internal.md#ebmessageid) |
| `instanceId` | [`InstanceId`](purista_amqpbridge.internal.md#instanceid) |
| `principalId?` | [`PrincipalId`](purista_amqpbridge.internal.md#principalid) |
| `timestamp` | `number` |
| `traceId?` | [`TraceId`](purista_amqpbridge.internal.md#traceid) |

#### Defined in

core/lib/types/core/types/EBMessageBase.d.ts:6

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

core/lib/types/core/types/EBMessageId.d.ts:4

___

### EncoderFunctions

Ƭ **EncoderFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decode` | <T\>(`input`: `Buffer`) => `Promise`<`T`\> |
| `encode` | <T\>(`input`: `T`) => `Promise`<`Buffer`\> |

#### Defined in

[amqpbridge/src/types/EncoderFunctions.ts:1](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/amqpbridge/src/types/EncoderFunctions.ts#L1)

___

### ErrorResponse

Ƭ **ErrorResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |
| `message` | `string` |
| `status` | [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md) |
| `traceId?` | [`TraceId`](purista_amqpbridge.internal.md#traceid) |

#### Defined in

core/lib/types/core/types/ErrorResponse.d.ts:3

___

### EventBridgeEvents

Ƭ **EventBridgeEvents**: [`EventBridgeEventsBasic`](purista_amqpbridge.internal.md#eventbridgeeventsbasic) & [`addPrefixToObject`](purista_amqpbridge.internal.md#addprefixtoobject)<[`CustomEvents`](purista_amqpbridge.internal.md#customevents), ``"adapter-"``\>

#### Defined in

core/lib/types/core/types/EventBridgeEvents.d.ts:21

___

### EventBridgeEventsBasic

Ƭ **EventBridgeEventsBasic**: `Object`

Events which can be emitted by a event bridge

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventbridge-connected` | `undefined` | emitted when then connection to event bridge is established |
| `eventbridge-connection-error` | `undefined` \| `unknown` | emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly |
| `eventbridge-disconnected` | `undefined` | emitted when the connection to event bridge closed |
| `eventbridge-error` | [`UnhandledError`](../classes/purista_amqpbridge.internal.UnhandledError.md) \| `unknown` | emitted on internal event bridge error |
| `eventbridge-reconnecting` | `undefined` | emitted on retry to connect to event bridge |

#### Defined in

core/lib/types/core/types/EventBridgeEvents.d.ts:6

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_amqpbridge.internal.md#eventmap) |

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:2

___

### EventMap

Ƭ **EventMap**: `Record`<`string`, `any`\>

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:1

___

### EventReceiver

Ƭ **EventReceiver**<`T`\>: (`params`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`params`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `T` |

##### Returns

`void`

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:3

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoInvokeTimeout.d.ts:20

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_amqpbridge.internal.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_amqpbridge.internal.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_amqpbridge.internal.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_amqpbridge.internal.md#infoservicenotready) \| [`InfoServiceReady`](purista_amqpbridge.internal.md#infoserviceready) \| [`InfoServiceShutdown`](purista_amqpbridge.internal.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_amqpbridge.internal.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_amqpbridge.internal.md#infosubscriptionerror)

#### Defined in

core/lib/types/core/types/infoType/InfoMessage.d.ts:11

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `payload?`: `unknown` ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceBase.d.ts:2

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceDrain.d.ts:3

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceFunctionAdded.d.ts:4

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceInit.d.ts:3

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceNotReady.d.ts:3

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceReady.d.ts:3

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoServiceShutdown.d.ts:3

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](../enums/purista_amqpbridge.internal.EBMessageType.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

core/lib/types/core/types/infoType/InfoSubscriptionError.d.ts:3

___

### InstanceId

Ƭ **InstanceId**: `string`

#### Defined in

core/lib/types/core/types/InstanceId.d.ts:1

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `instanceId?` | [`InstanceId`](purista_amqpbridge.internal.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_amqpbridge.internal.md#principalid) |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_amqpbridge.internal.md#traceid) |

#### Defined in

core/lib/types/core/types/Logger.d.ts:4

___

### PendigInvocation

Ƭ **PendigInvocation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reject` | (`error`: [`HandledError`](../classes/purista_amqpbridge.internal.HandledError.md) \| [`UnhandledError`](../classes/purista_amqpbridge.internal.UnhandledError.md)) => `void` |
| `resolve` | (`responsePayload`: `unknown`) => `void` |

#### Defined in

core/lib/types/core/DefaultEventBridge/types/PendingInvocations.d.ts:3

___

### PrincipalId

Ƭ **PrincipalId**: `string`

#### Defined in

core/lib/types/core/types/PrincipalId.d.ts:1

___

### Subscription

Ƭ **Subscription**: `Object`

A subscription managed by the event bridge

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |
| `instanceId?` | [`InstanceId`](purista_amqpbridge.internal.md#instanceid) |
| `messageType?` | [`EBMessageType`](../enums/purista_amqpbridge.internal.EBMessageType.md) |
| `principalId?` | [`PrincipalId`](purista_amqpbridge.internal.md#principalid) |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `settings` | [`SubscriptionSettings`](purista_amqpbridge.internal.md#subscriptionsettings) |
| `subscriber` | [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) |

#### Defined in

core/lib/types/core/types/subscription/Subscription.d.ts:9

___

### SubscriptionSettings

Ƭ **SubscriptionSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Defined in

core/lib/types/core/types/subscription/SubscriptionSettings.d.ts:1

___

### TraceId

Ƭ **TraceId**: `string`

#### Defined in

core/lib/types/core/types/TraceId.d.ts:1

___

### addPrefixToObject

Ƭ **addPrefixToObject**<`T`, `P`\>: { [K in keyof T as K extends string ? \`${P}${K}\` : never]: T[K] }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `string` |

#### Defined in

core/lib/types/core/types/addPrefixToObject.d.ts:1
