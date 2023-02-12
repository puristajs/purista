[PURISTA API - v1.4.9](../README.md) / [@purista/httpserver](purista_httpserver.md) / internal

# Namespace: internal

[@purista/httpserver](purista_httpserver.md).internal

## Table of contents

### Enumerations

- [EBMessageType](../enums/purista_httpserver.internal.EBMessageType.md)
- [StatusCode](../enums/purista_httpserver.internal.StatusCode.md)

### Enumeration Members

- [Command](purista_httpserver.internal.md#command)
- [CommandErrorResponse](purista_httpserver.internal.md#commanderrorresponse)
- [CommandSuccessResponse](purista_httpserver.internal.md#commandsuccessresponse)
- [InfoInvokeTimeout](purista_httpserver.internal.md#infoinvoketimeout)
- [InfoServiceDrain](purista_httpserver.internal.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_httpserver.internal.md#infoservicefunctionadded)
- [InfoServiceInit](purista_httpserver.internal.md#infoserviceinit)
- [InfoServiceNotReady](purista_httpserver.internal.md#infoservicenotready)
- [InfoServiceReady](purista_httpserver.internal.md#infoserviceready)
- [InfoServiceShutdown](purista_httpserver.internal.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_httpserver.internal.md#infosubscriptionerror)

### Classes

- [EventBridge](../classes/purista_httpserver.internal.EventBridge.md)
- [GenericEventEmitter](../classes/purista_httpserver.internal.GenericEventEmitter.md)
- [HandledError](../classes/purista_httpserver.internal.HandledError.md)
- [Logger](../classes/purista_httpserver.internal.Logger.md)
- [Service](../classes/purista_httpserver.internal.Service.md)
- [ServiceBaseClass](../classes/purista_httpserver.internal.ServiceBaseClass.md)
- [ServiceClass](../classes/purista_httpserver.internal.ServiceClass.md)
- [UnhandledError](../classes/purista_httpserver.internal.UnhandledError.md)

### Interfaces

- [IEmitter](../interfaces/purista_httpserver.internal.IEmitter.md)
- [IServiceClass](../interfaces/purista_httpserver.internal.IServiceClass.md)

### Type Aliases

- [AfterGuardHook](purista_httpserver.internal.md#afterguardhook)
- [BeforeGuardHook](purista_httpserver.internal.md#beforeguardhook)
- [Command](purista_httpserver.internal.md#command-1)
- [CommandDefinition](purista_httpserver.internal.md#commanddefinition)
- [CommandDefinitionList](purista_httpserver.internal.md#commanddefinitionlist)
- [CommandErrorResponse](purista_httpserver.internal.md#commanderrorresponse-1)
- [CommandFunction](purista_httpserver.internal.md#commandfunction)
- [CommandFunctionContext](purista_httpserver.internal.md#commandfunctioncontext)
- [CommandResponse](purista_httpserver.internal.md#commandresponse)
- [CommandSuccessResponse](purista_httpserver.internal.md#commandsuccessresponse-1)
- [ContentType](purista_httpserver.internal.md#contenttype)
- [CorrelationId](purista_httpserver.internal.md#correlationid)
- [CustomEvents](purista_httpserver.internal.md#customevents)
- [CustomEvents](purista_httpserver.internal.md#customevents-1)
- [CustomMessage](purista_httpserver.internal.md#custommessage)
- [EBMessage](purista_httpserver.internal.md#ebmessage)
- [EBMessageAddress](purista_httpserver.internal.md#ebmessageaddress)
- [EBMessageBase](purista_httpserver.internal.md#ebmessagebase)
- [EBMessageId](purista_httpserver.internal.md#ebmessageid)
- [ErrorResponse](purista_httpserver.internal.md#errorresponse)
- [EventBridgeEvents](purista_httpserver.internal.md#eventbridgeevents)
- [EventBridgeEventsBasic](purista_httpserver.internal.md#eventbridgeeventsbasic)
- [EventKey](purista_httpserver.internal.md#eventkey)
- [EventMap](purista_httpserver.internal.md#eventmap)
- [EventReceiver](purista_httpserver.internal.md#eventreceiver)
- [HttpExposedServiceMeta](purista_httpserver.internal.md#httpexposedservicemeta)
- [InfoInvokeTimeout](purista_httpserver.internal.md#infoinvoketimeout-1)
- [InfoMessage](purista_httpserver.internal.md#infomessage)
- [InfoMessageType](purista_httpserver.internal.md#infomessagetype)
- [InfoServiceBase](purista_httpserver.internal.md#infoservicebase)
- [InfoServiceDrain](purista_httpserver.internal.md#infoservicedrain-1)
- [InfoServiceFunctionAdded](purista_httpserver.internal.md#infoservicefunctionadded-1)
- [InfoServiceInit](purista_httpserver.internal.md#infoserviceinit-1)
- [InfoServiceNotReady](purista_httpserver.internal.md#infoservicenotready-1)
- [InfoServiceReady](purista_httpserver.internal.md#infoserviceready-1)
- [InfoServiceShutdown](purista_httpserver.internal.md#infoserviceshutdown-1)
- [InfoSubscriptionError](purista_httpserver.internal.md#infosubscriptionerror-1)
- [InstanceId](purista_httpserver.internal.md#instanceid)
- [LogFnParamType](purista_httpserver.internal.md#logfnparamtype)
- [LogLevelName](purista_httpserver.internal.md#loglevelname)
- [LoggerOptions](purista_httpserver.internal.md#loggeroptions)
- [PrincipalId](purista_httpserver.internal.md#principalid)
- [QueryParameter](purista_httpserver.internal.md#queryparameter)
- [ServiceEvents](purista_httpserver.internal.md#serviceevents)
- [ServiceEventsInternal](purista_httpserver.internal.md#serviceeventsinternal)
- [ServiceInfoType](purista_httpserver.internal.md#serviceinfotype)
- [Subscription](purista_httpserver.internal.md#subscription)
- [SubscriptionContext](purista_httpserver.internal.md#subscriptioncontext)
- [SubscriptionDefinition](purista_httpserver.internal.md#subscriptiondefinition)
- [SubscriptionDefinitionList](purista_httpserver.internal.md#subscriptiondefinitionlist)
- [SubscriptionFunction](purista_httpserver.internal.md#subscriptionfunction)
- [SubscriptionSettings](purista_httpserver.internal.md#subscriptionsettings)
- [TraceId](purista_httpserver.internal.md#traceid)
- [TransformInputHook](purista_httpserver.internal.md#transforminputhook)
- [TransformOutputHook](purista_httpserver.internal.md#transformoutputhook)
- [addPrefixToObject](purista_httpserver.internal.md#addprefixtoobject)

## Enumeration Members

### Command

• **Command**: ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse**: ``"commandErrorResponse"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:13

___

### CommandSuccessResponse

• **CommandSuccessResponse**: ``"commandSuccessResponse"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:12

___

### InfoInvokeTimeout

• **InfoInvokeTimeout**: ``"infoInvokeTimeout"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:26

___

### InfoServiceDrain

• **InfoServiceDrain**: ``"infoServiceDrain"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:24

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded**: ``"infoServiceFunctionAdded"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:23

___

### InfoServiceInit

• **InfoServiceInit**: ``"infoServiceInit"``

Info message type:
Message which is sent from a single sender to unspecified receivers.
The sender does not expect any answer to this message and does not process any reply to this message.
Info messages are fire & forget broadcasting messages.

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:20

___

### InfoServiceNotReady

• **InfoServiceNotReady**: ``"infoServiceNotReady"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:22

___

### InfoServiceReady

• **InfoServiceReady**: ``"infoServiceReady"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:21

___

### InfoServiceShutdown

• **InfoServiceShutdown**: ``"infoServiceShutdown"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:25

___

### InfoSubscriptionError

• **InfoSubscriptionError**: ``"infoSubscriptionError"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:27

## Type Aliases

### AfterGuardHook

Ƭ **AfterGuardHook**<`ServiceClassType`, `ResultType`, `PayloadType`, `ParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`PayloadType`, `ParamsType`\>, `result`: `ResultType`, `input`: `PayloadType`, `parameter`: `ParamsType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |
| `ResultType` | `unknown` |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `result`, `input`, `parameter`): `Promise`<`void`\>

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`PayloadType`, `ParamsType`\> |
| `result` | `ResultType` |
| `input` | `PayloadType` |
| `parameter` | `ParamsType` |

##### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/types/commandType/AfterGuardHook.d.ts:7

___

### BeforeGuardHook

Ƭ **BeforeGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `FunctionPayloadType`, `parameter`: `FunctionParamsType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`void`\>

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `FunctionPayloadType` |
| `parameter` | `FunctionParamsType` |

##### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/types/commandType/BeforeGuardHook.d.ts:8

___

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `correlationId`: [`CorrelationId`](purista_httpserver.internal.md#correlationid) ; `messageType`: [`Command`](../enums/purista_httpserver.internal.EBMessageType.md#command) ; `payload`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `receiver`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

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

core/lib/core/types/commandType/Command.d.ts:17

___

### CommandDefinition

Ƭ **CommandDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) = [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |
| `MetadataType` | `Record`<`string`, `unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | [`CommandFunction`](purista_httpserver.internal.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\> |
| `commandDescription` | `string` |
| `commandName` | `string` |
| `eventName?` | `string` |
| `hooks` | { `afterGuard?`: [`AfterGuardHook`](purista_httpserver.internal.md#afterguardhook)<`ServiceClassType`, `MessageResultType`, `MessagePayloadType`, `MessageParamsType`\>[] ; `beforeGuard?`: [`BeforeGuardHook`](purista_httpserver.internal.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] ; `onError?`: () => `Promise`<`void`\> ; `onSuccess?`: () => `Promise`<`void`\> ; `transformInput?`: { `transformFunction`: [`TransformInputHook`](purista_httpserver.internal.md#transforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`TransformOutputHook`](purista_httpserver.internal.md#transformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  }  } |
| `hooks.afterGuard?` | [`AfterGuardHook`](purista_httpserver.internal.md#afterguardhook)<`ServiceClassType`, `MessageResultType`, `MessagePayloadType`, `MessageParamsType`\>[] |
| `hooks.beforeGuard?` | [`BeforeGuardHook`](purista_httpserver.internal.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] |
| `hooks.onError?` | () => `Promise`<`void`\> |
| `hooks.onSuccess?` | () => `Promise`<`void`\> |
| `hooks.transformInput?` | { `transformFunction`: [`TransformInputHook`](purista_httpserver.internal.md#transforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } |
| `hooks.transformInput.transformFunction` | [`TransformInputHook`](purista_httpserver.internal.md#transforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` |
| `hooks.transformOutput?` | { `transformFunction`: [`TransformOutputHook`](purista_httpserver.internal.md#transformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  } |
| `hooks.transformOutput.transformFunction` | [`TransformOutputHook`](purista_httpserver.internal.md#transformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` |
| `metadata` | `MetadataType` |

#### Defined in

core/lib/core/types/commandType/CommandDefinition.d.ts:11

___

### CommandDefinitionList

Ƭ **CommandDefinitionList**<`ServiceClassType`\>: [`CommandDefinition`](purista_httpserver.internal.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |

#### Defined in

core/lib/core/types/commandType/CommandDefinitionList.d.ts:10

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `correlationId`: [`CorrelationId`](purista_httpserver.internal.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_httpserver.internal.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)  } ; `receiver`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

core/lib/core/types/commandType/CommandErrorResponse.d.ts:10

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `FunctionPayloadType`, `parameter`: `FunctionParamsType`) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`FunctionResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `FunctionPayloadType` |
| `parameter` | `FunctionParamsType` |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

core/lib/core/types/commandType/CommandFunction.d.ts:6

___

### CommandFunctionContext

Ƭ **CommandFunctionContext**<`MessagePayloadType`, `MessageParamsType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emit` | <Payload\>(`eventName`: `string`, `payload?`: `Payload`) => `Promise`<`void`\> |
| `invoke` | <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\> |
| `logger` | [`Logger`](../classes/purista_httpserver.internal.Logger.md) |
| `message` | [`Command`](purista_httpserver.internal.md#command-1)<`MessagePayloadType`, `MessageParamsType`\> |
| `startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `Context` \| `undefined`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> |
| `wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> |

#### Defined in

core/lib/core/types/commandType/CommandFunctionContext.d.ts:5

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_httpserver.internal.md#commandsuccessresponse-1)<`T`\> \| [`CommandErrorResponse`](purista_httpserver.internal.md#commanderrorresponse-1)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

core/lib/core/types/commandType/CommandResponse.d.ts:7

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](purista_httpserver.internal.md#correlationid) ; `messageType`: [`CommandSuccessResponse`](purista_httpserver.internal.md#commandsuccessresponse) ; `payload`: `PayloadType` ; `receiver`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

core/lib/core/types/commandType/CommandSuccessResponse.d.ts:10

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| `string`

#### Defined in

core/lib/httpserver/types/ContentType.d.ts:1

___

### CorrelationId

Ƭ **CorrelationId**: `string`

#### Defined in

core/lib/core/types/CorrelationId.d.ts:1

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

core/lib/core/types/ServiceEvents.d.ts:50

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

core/lib/core/types/EventBridgeEvents.d.ts:18

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: { `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_httpserver.internal.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Defined in

core/lib/core/types/CustomMessage.d.ts:5

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_httpserver.internal.md#command-1) \| [`CommandResponse`](purista_httpserver.internal.md#commandresponse) \| [`InfoMessage`](purista_httpserver.internal.md#infomessage) \| [`CustomMessage`](purista_httpserver.internal.md#custommessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

core/lib/core/types/EBMessage.d.ts:7

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

core/lib/core/types/EBMessageAddress.d.ts:4

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId?` | [`CorrelationId`](purista_httpserver.internal.md#correlationid) |
| `eventName?` | `string` |
| `id` | [`EBMessageId`](purista_httpserver.internal.md#ebmessageid) |
| `instanceId` | [`InstanceId`](purista_httpserver.internal.md#instanceid) |
| `otp?` | `string` |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) |
| `timestamp` | `number` |
| `traceId?` | [`TraceId`](purista_httpserver.internal.md#traceid) |

#### Defined in

core/lib/core/types/EBMessageBase.d.ts:6

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

core/lib/core/types/EBMessageId.d.ts:4

___

### ErrorResponse

Ƭ **ErrorResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |
| `message` | `string` |
| `status` | [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md) |
| `traceId?` | [`TraceId`](purista_httpserver.internal.md#traceid) |

#### Defined in

core/lib/core/types/ErrorResponse.d.ts:3

___

### EventBridgeEvents

Ƭ **EventBridgeEvents**: [`EventBridgeEventsBasic`](purista_httpserver.internal.md#eventbridgeeventsbasic) & [`addPrefixToObject`](purista_httpserver.internal.md#addprefixtoobject)<[`CustomEvents`](purista_httpserver.internal.md#customevents-1), ``"adapter-"``\>

#### Defined in

core/lib/core/types/EventBridgeEvents.d.ts:21

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
| `eventbridge-error` | [`UnhandledError`](../classes/purista_httpserver.internal.UnhandledError.md) \| `unknown` | emitted on internal event bridge error |
| `eventbridge-reconnecting` | `undefined` | emitted on retry to connect to event bridge |

#### Defined in

core/lib/core/types/EventBridgeEvents.d.ts:6

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_httpserver.internal.md#eventmap) |

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:2

___

### EventMap

Ƭ **EventMap**: `Record`<`string`, `any`\>

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:1

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

core/lib/core/types/GenericEventEmitter.d.ts:3

___

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `http`: { `contentType?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_httpserver.internal.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `expose.http` | { `contentType?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_httpserver.internal.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  } |
| `expose.http.contentType?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
| `expose.http.contentTypeResponse?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
| `expose.http.method` | ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` |
| `expose.http.openApi?` | { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_httpserver.internal.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } |
| `expose.http.openApi.additionalStatusCodes?` | [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)[] |
| `expose.http.openApi.description` | `string` |
| `expose.http.openApi.inputPayload?` | `SchemaObject` |
| `expose.http.openApi.isSecure` | `boolean` |
| `expose.http.openApi.outputPayload?` | `SchemaObject` |
| `expose.http.openApi.parameter?` | `SchemaObject` |
| `expose.http.openApi.query?` | [`QueryParameter`](purista_httpserver.internal.md#queryparameter)[] |
| `expose.http.openApi.summary` | `string` |
| `expose.http.openApi.tags?` | `string`[] |
| `expose.http.path` | `string` |

#### Defined in

core/lib/httpserver/types/HttpExposedServiceMeta.d.ts:5

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](purista_httpserver.internal.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoInvokeTimeout.d.ts:20

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_httpserver.internal.md#infoservicedrain-1) \| [`InfoServiceFunctionAdded`](purista_httpserver.internal.md#infoservicefunctionadded-1) \| [`InfoServiceInit`](purista_httpserver.internal.md#infoserviceinit-1) \| [`InfoServiceNotReady`](purista_httpserver.internal.md#infoservicenotready-1) \| [`InfoServiceReady`](purista_httpserver.internal.md#infoserviceready-1) \| [`InfoServiceShutdown`](purista_httpserver.internal.md#infoserviceshutdown-1) \| [`InfoInvokeTimeout`](purista_httpserver.internal.md#infoinvoketimeout-1) \| [`InfoSubscriptionError`](purista_httpserver.internal.md#infosubscriptionerror-1)

#### Defined in

core/lib/core/types/infoType/InfoMessage.d.ts:11

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](purista_httpserver.internal.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_httpserver.internal.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_httpserver.internal.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_httpserver.internal.md#infoservicenotready) \| [`InfoServiceReady`](purista_httpserver.internal.md#infoserviceready) \| [`InfoServiceShutdown`](purista_httpserver.internal.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_httpserver.internal.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_httpserver.internal.md#infosubscriptionerror)

#### Defined in

core/lib/core/types/infoType/InfoMessage.d.ts:12

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `payload?`: `unknown` ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceBase.d.ts:2

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](purista_httpserver.internal.md#infoservicedrain)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceDrain.d.ts:3

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](purista_httpserver.internal.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceFunctionAdded.d.ts:4

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](purista_httpserver.internal.md#infoserviceinit)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceInit.d.ts:3

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](purista_httpserver.internal.md#infoservicenotready)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceNotReady.d.ts:3

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](purista_httpserver.internal.md#infoserviceready)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceReady.d.ts:3

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](purista_httpserver.internal.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoServiceShutdown.d.ts:3

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](purista_httpserver.internal.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

core/lib/core/types/infoType/InfoSubscriptionError.d.ts:3

___

### InstanceId

Ƭ **InstanceId**: `string`

#### Defined in

core/lib/core/types/InstanceId.d.ts:1

___

### LogFnParamType

Ƭ **LogFnParamType**: [`unknown`, string?, ...any] \| [`string`, ...any]

#### Defined in

core/lib/core/types/Logger.d.ts:13

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"``

#### Defined in

core/lib/core/types/LogLevelName.d.ts:1

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `instanceId?` | [`InstanceId`](purista_httpserver.internal.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_httpserver.internal.md#traceid) |

#### Defined in

core/lib/core/types/Logger.d.ts:4

___

### PrincipalId

Ƭ **PrincipalId**: `string`

#### Defined in

core/lib/core/types/PrincipalId.d.ts:1

___

### QueryParameter

Ƭ **QueryParameter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `required` | `boolean` |

#### Defined in

core/lib/httpserver/types/QueryParameter.d.ts:1

___

### ServiceEvents

Ƭ **ServiceEvents**: [`ServiceEventsInternal`](purista_httpserver.internal.md#serviceeventsinternal) & [`addPrefixToObject`](purista_httpserver.internal.md#addprefixtoobject)<[`CustomEvents`](purista_httpserver.internal.md#customevents), ``"custom-"``\>

#### Defined in

core/lib/core/types/ServiceEvents.d.ts:53

___

### ServiceEventsInternal

Ƭ **ServiceEventsInternal**: `Object`

Events which can be emitted by a service.
Internal events are prefixed with `service-`.

If you like to use your own events, the event names should be prefixed with `custom-` to have propper types.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `handled-function-error` | { `error`: [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) ; `functionName`: `string` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a function throws a HandledError |
| `handled-function-error.error` | [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) | - |
| `handled-function-error.functionName` | `string` | - |
| `handled-function-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |
| `handled-subscription-error` | { `error`: [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a subscription throws a HandledError |
| `handled-subscription-error.error` | [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) | - |
| `handled-subscription-error.subscriptionName` | `string` | - |
| `handled-subscription-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |
| `service-available` | `undefined` | emitted when the service is fully initialized and ready Should be emitted by custom service class. It is not emitted by default |
| `service-drain` | `undefined` | emitted when the service is going to be stopped |
| `service-not-available` | `undefined` \| `unknown` | emitted when the service is not available (for example database connection could not be established) |
| `service-started` | `undefined` | emitted when the service is started, but not fully initialized and not ready yet |
| `service-stopped` | `undefined` | emitted when the service has been stopped |
| `unhandled-function-error` | { `error`: `unknown` ; `functionName`: `string` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a function throws an error other than a HandledError |
| `unhandled-function-error.error` | `unknown` | - |
| `unhandled-function-error.functionName` | `string` | - |
| `unhandled-function-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |
| `unhandled-subscription-error` | { `error`: `unknown` ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a subscription throws an error other than a HandledError |
| `unhandled-subscription-error.error` | `unknown` | - |
| `unhandled-subscription-error.subscriptionName` | `string` | - |
| `unhandled-subscription-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |

#### Defined in

core/lib/core/types/ServiceEvents.d.ts:10

___

### ServiceInfoType

Ƭ **ServiceInfoType**: `Object`

General service information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `serviceDescription` | `string` |
| `serviceName` | `string` |
| `serviceVersion` | `string` |

#### Defined in

core/lib/core/types/infoType/ServiceInfoType.d.ts:4

___

### Subscription

Ƭ **Subscription**: `Object`

A subscription managed by the event bridge

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |
| `instanceId?` | [`InstanceId`](purista_httpserver.internal.md#instanceid) |
| `messageType?` | [`EBMessageType`](../enums/purista_httpserver.internal.EBMessageType.md) |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `settings` | [`SubscriptionSettings`](purista_httpserver.internal.md#subscriptionsettings) |
| `subscriber` | [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) |

#### Defined in

core/lib/core/types/subscription/Subscription.d.ts:9

___

### SubscriptionContext

Ƭ **SubscriptionContext**<`MessageType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](purista_httpserver.internal.md#ebmessage) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emit` | <Payload\>(`eventName`: `string`, `payload?`: `Payload`) => `Promise`<`void`\> |
| `invoke` | <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\> |
| `logger` | [`Logger`](../classes/purista_httpserver.internal.Logger.md) |
| `message` | `MessageType` |
| `startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `Context` \| `undefined`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> |
| `wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> |

#### Defined in

core/lib/core/types/subscription/SubscriptionContext.d.ts:5

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`ServiceClassType`, `MessageType`, `Payload`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |
| `MessageType` | [`EBMessage`](purista_httpserver.internal.md#ebmessage) |
| `Payload` | `unknown` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | [`SubscriptionFunction`](purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessageType`, `Payload`\> |
| `eventName?` | `string` |
| `instanceId?` | [`InstanceId`](purista_httpserver.internal.md#instanceid) |
| `messageType?` | [`EBMessageType`](../enums/purista_httpserver.internal.EBMessageType.md) |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `settings` | [`SubscriptionSettings`](purista_httpserver.internal.md#subscriptionsettings) |
| `subscriptionDescription` | `string` |
| `subscriptionName` | `string` |

#### Defined in

core/lib/core/types/subscription/SubscriptionDefinition.d.ts:8

___

### SubscriptionDefinitionList

Ƭ **SubscriptionDefinitionList**<`ServiceClassType`\>: [`SubscriptionDefinition`](purista_httpserver.internal.md#subscriptiondefinition)<`ServiceClassType`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |

#### Defined in

core/lib/core/types/subscription/SubscriptionDefinitionList.d.ts:10

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`, `MessageType`, `Payload`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionContext`](purista_httpserver.internal.md#subscriptioncontext)<`MessageType`\>, `payload`: `Payload`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_httpserver.internal.ServiceClass.md) |
| `MessageType` | [`EBMessage`](purista_httpserver.internal.md#ebmessage) |
| `Payload` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`): `Promise`<`void`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionContext`](purista_httpserver.internal.md#subscriptioncontext)<`MessageType`\> |
| `payload` | `Payload` |

##### Returns

`Promise`<`void`\>

#### Defined in

core/lib/core/types/subscription/SubscriptionFunction.d.ts:7

___

### SubscriptionSettings

Ƭ **SubscriptionSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Defined in

core/lib/core/types/subscription/SubscriptionSettings.d.ts:1

___

### TraceId

Ƭ **TraceId**: `string`

#### Defined in

core/lib/core/types/TraceId.d.ts:1

___

### TransformInputHook

Ƭ **TransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: { `logger`: [`Logger`](../classes/purista_httpserver.internal.Logger.md) ; `message`: [`Command`](purista_httpserver.internal.md#command-1)<`PayloadInput`, `ParamsInput`\>  }, `payload`: `PayloadInput`, `parameter`: `ParamsInput`) => `Promise`<{ `parameter`: `ParamsOutput` ; `payload`: `PayloadOutput`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `PayloadOutput` | `unknown` |
| `ParamsOutput` | `unknown` |
| `PayloadInput` | `unknown` |
| `ParamsInput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<{ `parameter`: `ParamsOutput` ; `payload`: `PayloadOutput`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | `Object` |
| `context.logger` | [`Logger`](../classes/purista_httpserver.internal.Logger.md) |
| `context.message` | [`Command`](purista_httpserver.internal.md#command-1)<`PayloadInput`, `ParamsInput`\> |
| `payload` | `PayloadInput` |
| `parameter` | `ParamsInput` |

##### Returns

`Promise`<{ `parameter`: `ParamsOutput` ; `payload`: `PayloadOutput`  }\>

#### Defined in

core/lib/core/types/commandType/TransformInputHook.d.ts:3

___

### TransformOutputHook

Ƭ **TransformOutputHook**<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: { `logger`: [`Logger`](../classes/purista_httpserver.internal.Logger.md) ; `message`: [`Command`](purista_httpserver.internal.md#command-1)<`MessagePayloadType`, `MessageParamsType`\>  }, `payload`: `MessageResultType`, `parameter`: `MessageParamsType`) => `Promise`<`ResponseOutput`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `MessagePayloadType` | `MessagePayloadType` |
| `MessageResultType` | `MessageResultType` |
| `MessageParamsType` | `MessageParamsType` |
| `ResponseOutput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`ResponseOutput`\>

This transform hook is executed after function output validation and AfterGuardHooks.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | `Object` |
| `context.logger` | [`Logger`](../classes/purista_httpserver.internal.Logger.md) |
| `context.message` | [`Command`](purista_httpserver.internal.md#command-1)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `MessageResultType` |
| `parameter` | `MessageParamsType` |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

core/lib/core/types/commandType/TransformOutputHook.d.ts:6

___

### addPrefixToObject

Ƭ **addPrefixToObject**<`T`, `P`\>: { [K in keyof T as K extends string ? \`${P}${K}\` : never]: T[K] }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `string` |

#### Defined in

core/lib/core/types/addPrefixToObject.d.ts:1
