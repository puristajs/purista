[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](purista_amqpbridge.md) / internal

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
- [CustomMessage](purista_amqpbridge.internal.md#custommessage)

### Event bridge

- [EventBridgeBaseClass](../classes/purista_amqpbridge.internal.EventBridgeBaseClass.md)
- [EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md)
- [EventBridgeEventsBasic](purista_amqpbridge.internal.md#eventbridgeeventsbasic)

### Classes

- [GenericEventEmitter](../classes/purista_amqpbridge.internal.GenericEventEmitter.md)
- [HandledError](../classes/purista_amqpbridge.internal.HandledError.md)
- [Logger](../classes/purista_amqpbridge.internal.Logger.md)
- [UnhandledError](../classes/purista_amqpbridge.internal.UnhandledError.md)

### Interfaces

- [IEmitter](../interfaces/purista_amqpbridge.internal.IEmitter.md)

### Type Aliases

- [Command](purista_amqpbridge.internal.md#command-1)
- [CommandDefinitionMetadataBase](purista_amqpbridge.internal.md#commanddefinitionmetadatabase)
- [Complete](purista_amqpbridge.internal.md#complete)
- [ContentType](purista_amqpbridge.internal.md#contenttype)
- [CorrelationId](purista_amqpbridge.internal.md#correlationid)
- [CustomEvents](purista_amqpbridge.internal.md#customevents)
- [CustomMessage](purista_amqpbridge.internal.md#custommessage-1)
- [DefinitionEventBridgeConfig](purista_amqpbridge.internal.md#definitioneventbridgeconfig)
- [EBMessage](purista_amqpbridge.internal.md#ebmessage)
- [EBMessageAddress](purista_amqpbridge.internal.md#ebmessageaddress)
- [EBMessageBase](purista_amqpbridge.internal.md#ebmessagebase)
- [EBMessageId](purista_amqpbridge.internal.md#ebmessageid)
- [EncoderFunctions](purista_amqpbridge.internal.md#encoderfunctions)
- [ErrorResponsePayload](purista_amqpbridge.internal.md#errorresponsepayload)
- [EventBridgeConfig](purista_amqpbridge.internal.md#eventbridgeconfig)
- [EventBridgeEvents](purista_amqpbridge.internal.md#eventbridgeevents)
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
- [LogFnParamType](purista_amqpbridge.internal.md#logfnparamtype)
- [LoggerOptions](purista_amqpbridge.internal.md#loggeroptions)
- [PendigInvocation](purista_amqpbridge.internal.md#pendiginvocation)
- [PrincipalId](purista_amqpbridge.internal.md#principalid)
- [TraceId](purista_amqpbridge.internal.md#traceid)
- [addPrefixToObject](purista_amqpbridge.internal.md#addprefixtoobject)

### Command

- [CommandErrorResponse](purista_amqpbridge.internal.md#commanderrorresponse-1)
- [CommandResponse](purista_amqpbridge.internal.md#commandresponse)
- [CommandSuccessResponse](purista_amqpbridge.internal.md#commandsuccessresponse-1)

### Subscription

- [Subscription](purista_amqpbridge.internal.md#subscription)

## Enumeration Members

### Command

• **Command**: ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse**: ``"commandErrorResponse"``

a error response from receiver of a command message

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:15

___

### CommandSuccessResponse

• **CommandSuccessResponse**: ``"commandSuccessResponse"``

a success response from receiver of a command message

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:13

___

### CustomMessage

• **CustomMessage**: ``"customMessage"``

a custom message / custom event

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:39

## Event bridge

• **EventBridgeBaseClass**<`ConfigType`\>: `Object`

The base class to be extended by event bridge implementations

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:10

• **EventBridge**: `Object`

Event bridge interface
The event bridge must implement this interface.

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridge.d.ts:8

### EventBridgeEventsBasic

Ƭ **EventBridgeEventsBasic**: `Object`

Events which can be emitted by a event bridge

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventbridge-connected` | `never` | emitted when then connection to event bridge is established |
| `eventbridge-connection-error` | `undefined` \| `unknown` \| `Error` | emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly |
| `eventbridge-disconnected` | `never` | emitted when the connection to event bridge closed |
| `eventbridge-error` | [`UnhandledError`](../classes/purista_amqpbridge.internal.UnhandledError.md) \| `unknown` | emitted on internal event bridge error |
| `eventbridge-reconnecting` | `never` | emitted on retry to connect to event bridge |

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridgeEvents.d.ts:8

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

packages/core/lib/core/types/commandType/Command.d.ts:16

___

### CommandDefinitionMetadataBase

Ƭ **CommandDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_amqpbridge.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_amqpbridge.internal.md#contenttype) ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_amqpbridge.internal.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_amqpbridge.internal.md#contenttype) |
| `expose.deprecated?` | `boolean` |
| `expose.inputPayload?` | `SchemaObject` |
| `expose.outputPayload?` | `SchemaObject` |
| `expose.parameter?` | `SchemaObject` |

#### Defined in

packages/core/lib/core/types/commandType/CommandDefinitionMetadataBase.d.ts:3

___

### Complete

Ƭ **Complete**<`T`\>: { [P in keyof Required<T\>]: Pick<T, P\> extends Required<Pick<T, P\>\> ? T[P] : T[P] \| undefined }

A helper which forces to provide all object keys, even if they are optional.

**`Example`**

```typescript
type A = {
 one?: string,
 two?: number,
 three: string
}

// without:
const x:A = { three: 'will work'}

// this will fail
const y:Complete<A> = { three: 'will complain that one and two is missing'}
// needs to be like this:
const z:Complete<A> = { one: undefined, two: undefined, three: 'will work'}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

packages/core/lib/core/types/Complete.d.ts:20

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| ``"text/xml"`` \| `string`

List of content types for message payloads.
If the content type is other than `application/json`, the message payload must be a string.
It is up to the implementation to extract the content type from the original message and to convert or transform data.

#### Defined in

packages/core/lib/core/types/ContentType.d.ts:6

___

### CorrelationId

Ƭ **CorrelationId**: `string`

the correlation id links the command invocation message with the command response message

#### Defined in

packages/core/lib/core/types/CorrelationId.d.ts:2

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridgeEvents.d.ts:20

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: { `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_amqpbridge.internal.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

A custom message is a message which can be used to pass business information.
The producer emits the message without knowledge about any consumer.
The producer does not expect a response from a consumer.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Defined in

packages/core/lib/core/types/CustomMessage.d.ts:9

___

### DefinitionEventBridgeConfig

Ƭ **DefinitionEventBridgeConfig**: `Object`

Settings and advices for the event bridge, which are set in the command or subscription builder.
The properties are advices and hints.
It depends on the used event bridge implementation and underlaying message broker, if a specific property can be respected.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoacknowledge?` | `boolean` | Send the acknowledge to message broker as soon as the message arrives - defaults to true for commands - defaults to false for subscriptions |
| `durable?` | `boolean` | Advise the underlaying message broker to store messages if no consumer is available. Messages will be send as soon as the service is able to consume. |
| `shared?` | `boolean` | If set to true, the event bridge is adviced to deliver one message to at least one consumer instance. True is the default value. If set to false, the event bridge is adviced to deliver one message to all consumer instances. Use case: Receiving Info of message, which need to be passed to all instance to keep information in sync. In serverless environments, this flag should not have any effect **`Default`** true |

#### Defined in

packages/core/lib/core/types/DefinitionEventBridgeConfig.d.ts:6

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_amqpbridge.internal.md#command-1) \| [`CommandResponse`](purista_amqpbridge.internal.md#commandresponse) \| [`InfoMessage`](purista_amqpbridge.internal.md#infomessage) \| [`CustomMessage`](purista_amqpbridge.internal.md#custommessage-1)

EBMessage is some message which is handled by the event bridge.

#### Defined in

packages/core/lib/core/types/EBMessage.d.ts:7

___

### EBMessageAddress

Ƭ **EBMessageAddress**: `Object`

A event bridge message address describes the sender or receiver of a message.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceName` | `string` | the name of the service |
| `serviceTarget` | `string` | the name of the command or subscription |
| `serviceVersion` | `string` | the version of the service |

#### Defined in

packages/core/lib/core/types/EBMessageAddress.d.ts:4

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

Default fields which are part of any purista message

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `contentEncoding` | `string` | content encoding of message payload |
| `contentType` | [`ContentType`](purista_amqpbridge.internal.md#contenttype) | content type of message payload |
| `correlationId?` | [`CorrelationId`](purista_amqpbridge.internal.md#correlationid) | correlation id to know which command response referrs to which command |
| `eventName?` | `string` | event name for this message |
| `id` | [`EBMessageId`](purista_amqpbridge.internal.md#ebmessageid) | global unique id of message |
| `instanceId` | [`InstanceId`](purista_amqpbridge.internal.md#instanceid) | instance id of eventbridge which was creating the message |
| `otp?` | `string` | stringified Opentelemetry parent trace id |
| `principalId?` | [`PrincipalId`](purista_amqpbridge.internal.md#principalid) | principal id |
| `timestamp` | `number` | timestamp of message creation time |
| `traceId?` | [`TraceId`](purista_amqpbridge.internal.md#traceid) | trace id of message |

#### Defined in

packages/core/lib/core/types/EBMessageBase.d.ts:10

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

packages/core/lib/core/types/EBMessageId.d.ts:4

___

### EncoderFunctions

Ƭ **EncoderFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decode` | <T\>(`input`: `Buffer`) => `Promise`<`T`\> |
| `encode` | <T\>(`input`: `T`) => `Promise`<`Buffer`\> |

#### Defined in

[packages/amqpbridge/src/types/EncoderFunctions.ts:1](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/types/EncoderFunctions.ts#L1)

___

### ErrorResponsePayload

Ƭ **ErrorResponsePayload**: `Object`

Error message payload

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | addition data |
| `message` | `string` | a human readable error message |
| `status` | [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md) | the error status code |
| `traceId?` | [`TraceId`](purista_amqpbridge.internal.md#traceid) | the trace if of the request |

#### Defined in

packages/core/lib/core/types/ErrorResponsePayload.d.ts:6

___

### EventBridgeConfig

Ƭ **EventBridgeConfig**<`CustomConfig`\>: `Object`

The config object for an event bridge.
Every event bridge implementation must use this type for configuration.

#### Type parameters

| Name |
| :------ |
| `CustomConfig` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `CustomConfig` | - |
| `defaultCommandTimeout?` | `number` | the default timeout of command invocations |
| `instanceId?` | `string` | the instance id of the event bridge |
| `logger?` | [`Logger`](../classes/purista_amqpbridge.internal.Logger.md) | - |
| `spanProcessor?` | `SpanProcessor` | - |

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridgeConfig.d.ts:8

___

### EventBridgeEvents

Ƭ **EventBridgeEvents**: [`EventBridgeEventsBasic`](purista_amqpbridge.internal.md#eventbridgeeventsbasic) & [`addPrefixToObject`](purista_amqpbridge.internal.md#addprefixtoobject)<[`CustomEvents`](purista_amqpbridge.internal.md#customevents), ``"adapter-"``\>

#### Defined in

packages/core/lib/core/EventBridge/types/EventBridgeEvents.d.ts:23

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_amqpbridge.internal.md#eventmap) |

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:2

___

### EventMap

Ƭ **EventMap**: `Record`<`string`, `any`\>

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:1

___

### EventReceiver

Ƭ **EventReceiver**<`T`\>: (`parameter`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`parameter`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `T` |

##### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:3

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoInvokeTimeout.d.ts:20

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_amqpbridge.internal.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_amqpbridge.internal.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_amqpbridge.internal.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_amqpbridge.internal.md#infoservicenotready) \| [`InfoServiceReady`](purista_amqpbridge.internal.md#infoserviceready) \| [`InfoServiceShutdown`](purista_amqpbridge.internal.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_amqpbridge.internal.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_amqpbridge.internal.md#infosubscriptionerror)

#### Defined in

packages/core/lib/core/types/infoType/InfoMessage.d.ts:10

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `payload?`: `unknown` ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceBase.d.ts:2

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceDrain.d.ts:3

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceFunctionAdded.d.ts:3

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceInit.d.ts:3

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceNotReady.d.ts:3

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceReady.d.ts:3

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](../enums/purista_amqpbridge.internal.EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceShutdown.d.ts:3

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](../enums/purista_amqpbridge.internal.EBMessageType.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_amqpbridge.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoSubscriptionError.d.ts:3

___

### InstanceId

Ƭ **InstanceId**: `string`

the instance id of the event bridge

#### Defined in

packages/core/lib/core/types/InstanceId.d.ts:2

___

### LogFnParamType

Ƭ **LogFnParamType**: [`unknown`, string?, ...any] \| [`string`, ...any]

#### Defined in

packages/core/lib/core/types/Logger.d.ts:15

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hostname?` | `string` |
| `instanceId?` | [`InstanceId`](purista_amqpbridge.internal.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_amqpbridge.internal.md#principalid) |
| `puristaVersion?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_amqpbridge.internal.md#traceid) |

#### Defined in

packages/core/lib/core/types/Logger.d.ts:4

___

### PendigInvocation

Ƭ **PendigInvocation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reject` | (`error`: [`HandledError`](../classes/purista_amqpbridge.internal.HandledError.md) \| [`UnhandledError`](../classes/purista_amqpbridge.internal.UnhandledError.md)) => `void` |
| `resolve` | (`responsePayload`: `unknown`) => `void` |

#### Defined in

packages/core/lib/DefaultEventBridge/types/PendingInvocations.d.ts:2

___

### PrincipalId

Ƭ **PrincipalId**: `string`

the principal id

#### Defined in

packages/core/lib/core/types/PrincipalId.d.ts:2

___

### TraceId

Ƭ **TraceId**: `string`

The trace id which will be passed through all commands, invocations and subscriptions

#### Defined in

packages/core/lib/core/types/TraceId.d.ts:4

___

### addPrefixToObject

Ƭ **addPrefixToObject**<`T`, `P`\>: { [K in keyof T as K extends string ? \`${P}${K}\` : never]: T[K] }

Helper for better typescript type.
All keys of given object must start with the given prefix. Otherwise Typescript will complain.

```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `string` |

#### Defined in

packages/core/lib/core/types/addPrefixToObject.d.ts:7

## Command

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: [`CorrelationId`](purista_amqpbridge.internal.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_amqpbridge.internal.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_amqpbridge.internal.StatusCode.md)  } ; `receiver`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_amqpbridge.internal.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

packages/core/lib/core/types/commandType/CommandErrorResponse.d.ts:11

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_amqpbridge.internal.md#commandsuccessresponse-1)<`T`\> \| [`CommandErrorResponse`](purista_amqpbridge.internal.md#commanderrorresponse-1)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/CommandResponse.d.ts:8

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

packages/core/lib/core/types/commandType/CommandSuccessResponse.d.ts:11

## Subscription

### Subscription

Ƭ **Subscription**<`PayloadType`, `ParameterType`\>: `Object`

A subscription managed by the event bridge

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitEventName?` | `string` | the event name to be used for custom message if the subscriptions returns a result |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_amqpbridge.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the event name to subscribe for |
| `instanceId?` | [`InstanceId`](purista_amqpbridge.internal.md#instanceid) | the principal id |
| `messageType?` | [`EBMessageType`](../enums/purista_amqpbridge.internal.EBMessageType.md) | the message type |
| `payload?` | { `parameter?`: `ParameterType` ; `payload?`: `PayloadType`  } | the message payload |
| `payload.parameter?` | `ParameterType` | - |
| `payload.payload?` | `PayloadType` | - |
| `principalId?` | [`PrincipalId`](purista_amqpbridge.internal.md#principalid) | the principal id |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the consumer address of the message |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the producer address of the message |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriber` | [`EBMessageAddress`](purista_amqpbridge.internal.md#ebmessageaddress) | the address of the subscription (service name, version and subscription name) |

#### Defined in

packages/core/lib/core/types/subscription/Subscription.d.ts:11
