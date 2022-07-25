[PURISTA API - v1.3.1](../README.md) / @purista/core

# Module: @purista/core

## Table of contents

### Namespaces

- [internal](purista_core.internal.md)

### Enumerations

- [EBMessageType](../enums/purista_core.EBMessageType.md)
- [StatusCode](../enums/purista_core.StatusCode.md)

### Classes

- [DefaultEventBridge](../classes/purista_core.DefaultEventBridge.md)
- [FunctionDefinitionBuilder](../classes/purista_core.FunctionDefinitionBuilder.md)
- [GenericEventEmitter](../classes/purista_core.GenericEventEmitter.md)
- [HandledError](../classes/purista_core.HandledError.md)
- [Service](../classes/purista_core.Service.md)
- [ServiceClass](../classes/purista_core.ServiceClass.md)
- [SubscriptionDefinitionBuilder](../classes/purista_core.SubscriptionDefinitionBuilder.md)
- [UnhandledError](../classes/purista_core.UnhandledError.md)

### Interfaces

- [EventBridge](../interfaces/purista_core.EventBridge.md)
- [IEmitter](../interfaces/purista_core.IEmitter.md)
- [IServiceClass](../interfaces/purista_core.IServiceClass.md)

### Type Aliases

- [AfterGuardHook](purista_core.md#afterguardhook)
- [BeforeGuardHook](purista_core.md#beforeguardhook)
- [Command](purista_core.md#command)
- [CommandDefinition](purista_core.md#commanddefinition)
- [CommandDefinitionList](purista_core.md#commanddefinitionlist)
- [CommandErrorResponse](purista_core.md#commanderrorresponse)
- [CommandFunction](purista_core.md#commandfunction)
- [CommandFunctionContext](purista_core.md#commandfunctioncontext)
- [CommandResponse](purista_core.md#commandresponse)
- [CommandSuccessResponse](purista_core.md#commandsuccessresponse)
- [CompressionMethod](purista_core.md#compressionmethod)
- [ContentType](purista_core.md#contenttype)
- [CorrelationId](purista_core.md#correlationid)
- [CustomMessage](purista_core.md#custommessage)
- [EBMessage](purista_core.md#ebmessage)
- [EBMessageAddress](purista_core.md#ebmessageaddress)
- [EBMessageBase](purista_core.md#ebmessagebase)
- [EBMessageId](purista_core.md#ebmessageid)
- [ErrorResponse](purista_core.md#errorresponse)
- [EventBridgeConfig](purista_core.md#eventbridgeconfig)
- [EventBridgeEnsuredDefaults](purista_core.md#eventbridgeensureddefaults)
- [EventKey](purista_core.md#eventkey)
- [EventMap](purista_core.md#eventmap)
- [HttpExposedServiceMeta](purista_core.md#httpexposedservicemeta)
- [InfoInvokeTimeout](purista_core.md#infoinvoketimeout)
- [InfoInvokeTimeoutPayload](purista_core.md#infoinvoketimeoutpayload)
- [InfoMessage](purista_core.md#infomessage)
- [InfoMessageType](purista_core.md#infomessagetype)
- [InfoServiceBase](purista_core.md#infoservicebase)
- [InfoServiceDrain](purista_core.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_core.md#infoservicefunctionadded)
- [InfoServiceInit](purista_core.md#infoserviceinit)
- [InfoServiceNotReady](purista_core.md#infoservicenotready)
- [InfoServiceReady](purista_core.md#infoserviceready)
- [InfoServiceShutdown](purista_core.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_core.md#infosubscriptionerror)
- [InstanceId](purista_core.md#instanceid)
- [LogLevelName](purista_core.md#loglevelname)
- [Logger](purista_core.md#logger)
- [LoggerStubs](purista_core.md#loggerstubs)
- [PrincipalId](purista_core.md#principalid)
- [QueryParameter](purista_core.md#queryparameter)
- [ServiceEvents](purista_core.md#serviceevents)
- [ServiceInfoType](purista_core.md#serviceinfotype)
- [Subscription](purista_core.md#subscription)
- [SubscriptionContext](purista_core.md#subscriptioncontext)
- [SubscriptionDefinition](purista_core.md#subscriptiondefinition)
- [SubscriptionDefinitionList](purista_core.md#subscriptiondefinitionlist)
- [SubscriptionFunction](purista_core.md#subscriptionfunction)
- [SupportedHttpMethod](purista_core.md#supportedhttpmethod)
- [TraceId](purista_core.md#traceid)
- [TransformInputHook](purista_core.md#transforminputhook)
- [TransformOutputHook](purista_core.md#transformoutputhook)
- [ValidationDefinition](purista_core.md#validationdefinition)

### Variables

- [MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION](purista_core.md#min_content_size_for_compression)
- [ServiceInfoValidator](purista_core.md#serviceinfovalidator)
- [infoMessageTypes](purista_core.md#infomessagetypes)

### Functions

- [createErrorResponse](purista_core.md#createerrorresponse)
- [createInfoMessage](purista_core.md#createinfomessage)
- [createSuccessResponse](purista_core.md#createsuccessresponse)
- [createTestCommandErrorResponseMsg](purista_core.md#createtestcommanderrorresponsemsg)
- [createTestCommandMsg](purista_core.md#createtestcommandmsg)
- [createTestCommandResponseMsg](purista_core.md#createtestcommandresponsemsg)
- [createTestCustomMsg](purista_core.md#createtestcustommsg)
- [getCleanedMessage](purista_core.md#getcleanedmessage)
- [getCommandQueueName](purista_core.md#getcommandqueuename)
- [getErrorMessageForCode](purista_core.md#geterrormessageforcode)
- [getEventBridgeMock](purista_core.md#geteventbridgemock)
- [getFunctionContextMock](purista_core.md#getfunctioncontextmock)
- [getFunctionWithValidation](purista_core.md#getfunctionwithvalidation)
- [getLoggerMock](purista_core.md#getloggermock)
- [getNewCorrelationId](purista_core.md#getnewcorrelationid)
- [getNewEBMessageId](purista_core.md#getnewebmessageid)
- [getNewInstanceId](purista_core.md#getnewinstanceid)
- [getNewTraceId](purista_core.md#getnewtraceid)
- [getSubscriptionContextMock](purista_core.md#getsubscriptioncontextmock)
- [getSubscriptionQueueName](purista_core.md#getsubscriptionqueuename)
- [getTimeoutPromise](purista_core.md#gettimeoutpromise)
- [getUniqueId](purista_core.md#getuniqueid)
- [initLogger](purista_core.md#initlogger)
- [isCommand](purista_core.md#iscommand)
- [isCommandErrorResponse](purista_core.md#iscommanderrorresponse)
- [isCommandResponse](purista_core.md#iscommandresponse)
- [isCommandSuccessResponse](purista_core.md#iscommandsuccessresponse)
- [isCustomMessage](purista_core.md#iscustommessage)
- [isDevelop](purista_core.md#isdevelop)
- [isHttpExposedServiceMeta](purista_core.md#ishttpexposedservicemeta)
- [isInfoMessage](purista_core.md#isinfomessage)
- [isInfoServiceFunctionAdded](purista_core.md#isinfoservicefunctionadded)

## Type Aliases

### AfterGuardHook

Ƭ **AfterGuardHook**<`ServiceClassType`, `ResultType`, `PayloadType`, `ParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`PayloadType`, `ParamsType`\>, `result`: `ResultType`, `input`: `PayloadType`, `params`: `ParamsType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_core.ServiceClass.md) |
| `ResultType` | `unknown` |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `result`, `input`, `params`): `Promise`<`void`\>

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`PayloadType`, `ParamsType`\> |
| `result` | `ResultType` |
| `input` | `PayloadType` |
| `params` | `ParamsType` |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/commandType/AfterGuardHook.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/AfterGuardHook.ts#L8)

___

### BeforeGuardHook

Ƭ **BeforeGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `FunctionPayloadType`, `params`: `FunctionParamsType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |

#### Type declaration

▸ (`this`, `context`, `payload`, `params`): `Promise`<`void`\>

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `FunctionPayloadType` |
| `params` | `FunctionParamsType` |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/commandType/BeforeGuardHook.ts:9](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/BeforeGuardHook.ts#L9)

___

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `payload`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

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

[core/src/core/types/commandType/Command.ts:18](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/Command.ts#L18)

___

### CommandDefinition

Ƭ **CommandDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_core.ServiceClass.md) = [`ServiceClass`](../classes/purista_core.ServiceClass.md) |
| `MetadataType` | `Record`<`string`, `unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\> |
| `commandDescription` | `string` |
| `commandName` | `string` |
| `eventName?` | `string` |
| `hooks` | { `afterGuard?`: [`AfterGuardHook`](purista_core.md#afterguardhook)<`ServiceClassType`, `MessageResultType`, `MessagePayloadType`, `MessageParamsType`\>[] ; `beforeGuard?`: [`BeforeGuardHook`](purista_core.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] ; `transformInput?`: { `transformFunction`: [`TransformInputHook`](purista_core.md#transforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`TransformOutputHook`](purista_core.md#transformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  } ; `onError?`: () => `Promise`<`void`\> ; `onSuccess?`: () => `Promise`<`void`\>  } |
| `hooks.afterGuard?` | [`AfterGuardHook`](purista_core.md#afterguardhook)<`ServiceClassType`, `MessageResultType`, `MessagePayloadType`, `MessageParamsType`\>[] |
| `hooks.beforeGuard?` | [`BeforeGuardHook`](purista_core.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] |
| `hooks.transformInput?` | { `transformFunction`: [`TransformInputHook`](purista_core.md#transforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } |
| `hooks.transformInput.transformFunction` | [`TransformInputHook`](purista_core.md#transforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` |
| `hooks.transformOutput?` | { `transformFunction`: [`TransformOutputHook`](purista_core.md#transformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  } |
| `hooks.transformOutput.transformFunction` | [`TransformOutputHook`](purista_core.md#transformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` |
| `hooks.onError?` | [object Object] |
| `hooks.onSuccess?` | [object Object] |
| `metadata` | `MetadataType` |

#### Defined in

[core/src/core/types/commandType/CommandDefinition.ts:13](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandDefinition.ts#L13)

___

### CommandDefinitionList

Ƭ **CommandDefinitionList**<`ServiceClassType`\>: [`CommandDefinition`](purista_core.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_core.ServiceClass.md) |

#### Defined in

[core/src/core/types/commandType/CommandDefinitionList.ts:11](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandDefinitionList.ts#L11)

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

[core/src/core/types/commandType/CommandErrorResponse.ts:11](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandErrorResponse.ts#L11)

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `FunctionPayloadType`, `params`: `FunctionParamsType`) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `params`): `Promise`<`FunctionResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `FunctionPayloadType` |
| `params` | `FunctionParamsType` |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

[core/src/core/types/commandType/CommandFunction.ts:7](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandFunction.ts#L7)

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
| `logger` | [`Logger`](purista_core.md#logger) |
| `message` | [`Command`](purista_core.md#command)<`MessagePayloadType`, `MessageParamsType`\> |
| `emit` | <Payload\>(`eventName`: `string`, `payload?`: `Payload`) => `Promise`<`void`\> |
| `invoke` | <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_core.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\> |

#### Defined in

[core/src/core/types/commandType/CommandFunctionContext.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L5)

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\> \| [`CommandErrorResponse`](purista_core.md#commanderrorresponse)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

[core/src/core/types/commandType/CommandResponse.ts:9](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandResponse.ts#L9)

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `isMultipart?`: `boolean` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `payload`: `PayloadType` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

[core/src/core/types/commandType/CommandSuccessResponse.ts:11](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandSuccessResponse.ts#L11)

___

### CompressionMethod

Ƭ **CompressionMethod**: ``"gzip"`` \| ``"deflat"`` \| ``"br"`` \| `undefined`

#### Defined in

[core/src/helper/types/CompressionMethod.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/helper/types/CompressionMethod.ts#L1)

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| `string`

#### Defined in

[core/src/httpserver/types/ContentType.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/httpserver/types/ContentType.ts#L1)

___

### CorrelationId

Ƭ **CorrelationId**: `string`

#### Defined in

[core/src/core/types/CorrelationId.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/CorrelationId.ts#L1)

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: { `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Defined in

[core/src/core/types/CustomMessage.ts:6](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/CustomMessage.ts#L6)

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_core.md#command) \| [`CommandResponse`](purista_core.md#commandresponse) \| [`InfoMessage`](purista_core.md#infomessage) \| [`CustomMessage`](purista_core.md#custommessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

[core/src/core/types/EBMessage.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EBMessage.ts#L8)

___

### EBMessageAddress

Ƭ **EBMessageAddress**: `Object`

A event bus message address describes receiver/sender of a message.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `serviceName` | `string` |
| `serviceTarget` | `string` |
| `serviceVersion` | `string` |

#### Defined in

[core/src/core/types/EBMessageAddress.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EBMessageAddress.ts#L4)

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId?` | [`CorrelationId`](purista_core.md#correlationid) |
| `eventName?` | `string` |
| `id` | [`EBMessageId`](purista_core.md#ebmessageid) |
| `instanceId` | [`InstanceId`](purista_core.md#instanceid) |
| `principalId?` | [`PrincipalId`](purista_core.md#principalid) |
| `timestamp` | `number` |
| `traceId?` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/src/core/types/EBMessageBase.ts:7](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EBMessageBase.ts#L7)

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

[core/src/core/types/EBMessageId.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EBMessageId.ts#L4)

___

### ErrorResponse

Ƭ **ErrorResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |
| `message` | `string` |
| `status` | [`StatusCode`](../enums/purista_core.StatusCode.md) |
| `traceId?` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/src/core/types/ErrorResponse.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ErrorResponse.ts#L4)

___

### EventBridgeConfig

Ƭ **EventBridgeConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultTtl?` | `number` |
| `instanceId?` | [`InstanceId`](purista_core.md#instanceid) |

#### Defined in

[core/src/core/types/EventBridgeConfig.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridgeConfig.ts#L3)

___

### EventBridgeEnsuredDefaults

Ƭ **EventBridgeEnsuredDefaults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultTtl` | `number` |
| `instanceId` | [`InstanceId`](purista_core.md#instanceid) |

#### Defined in

[core/src/core/types/EventBridgeConfig.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/EventBridgeConfig.ts#L8)

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_core.md#eventmap) |

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/GenericEventEmitter.ts#L5)

___

### EventMap

Ƭ **EventMap**: `Record`<`string`, `any`\>

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/GenericEventEmitter.ts#L3)

___

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `http`: { `contentType?`: [`ContentType`](purista_core.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `expose.http` | { `contentType?`: [`ContentType`](purista_core.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  } |
| `expose.http.contentType?` | [`ContentType`](purista_core.md#contenttype) |
| `expose.http.method` | ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` |
| `expose.http.openApi?` | { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } |
| `expose.http.openApi.additionalStatusCodes?` | [`StatusCode`](../enums/purista_core.StatusCode.md)[] |
| `expose.http.openApi.description` | `string` |
| `expose.http.openApi.inputPayload?` | `SchemaObject` |
| `expose.http.openApi.isSecure` | `boolean` |
| `expose.http.openApi.outputPayload?` | `SchemaObject` |
| `expose.http.openApi.parameter?` | `SchemaObject` |
| `expose.http.openApi.query?` | [`QueryParameter`](purista_core.md#queryparameter)[] |
| `expose.http.openApi.summary` | `string` |
| `expose.http.openApi.tags?` | `string`[] |
| `expose.http.path` | `string` |

#### Defined in

[core/src/httpserver/types/HttpExposedServiceMeta.ts:7](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/httpserver/types/HttpExposedServiceMeta.ts#L7)

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](../enums/purista_core.EBMessageType.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoInvokeTimeout.ts:22](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoInvokeTimeout.ts#L22)

___

### InfoInvokeTimeoutPayload

Ƭ **InfoInvokeTimeoutPayload**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId` | [`CorrelationId`](purista_core.md#correlationid) |
| `receiver` | { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } |
| `receiver.serviceName` | `string` |
| `receiver.serviceTarget` | `string` |
| `receiver.serviceVersion` | `string` |
| `sender` | { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } |
| `sender.serviceName` | `string` |
| `sender.serviceTarget` | `string` |
| `sender.serviceVersion` | `string` |
| `timestamp` | `number` |
| `traceId` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/src/core/types/infoType/InfoInvokeTimeout.ts:6](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoInvokeTimeout.ts#L6)

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_core.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_core.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_core.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_core.md#infoservicenotready) \| [`InfoServiceReady`](purista_core.md#infoserviceready) \| [`InfoServiceShutdown`](purista_core.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_core.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_core.md#infosubscriptionerror)

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:12](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoMessage.ts#L12)

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](../enums/purista_core.EBMessageType.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](../enums/purista_core.EBMessageType.md#infoservicefunctionadded) \| [`InfoServiceInit`](../enums/purista_core.EBMessageType.md#infoserviceinit) \| [`InfoServiceNotReady`](../enums/purista_core.EBMessageType.md#infoservicenotready) \| [`InfoServiceReady`](../enums/purista_core.EBMessageType.md#infoserviceready) \| [`InfoServiceShutdown`](../enums/purista_core.EBMessageType.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](../enums/purista_core.EBMessageType.md#infoinvoketimeout) \| [`InfoSubscriptionError`](../enums/purista_core.EBMessageType.md#infosubscriptionerror)

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:22](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoMessage.ts#L22)

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `payload?`: `Record`<`string`, `unknown`\> ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceBase.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceBase.ts#L3)

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](../enums/purista_core.EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceDrain.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceDrain.ts#L4)

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](../enums/purista_core.EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceFunctionAdded.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceFunctionAdded.ts#L5)

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](../enums/purista_core.EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceInit.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceInit.ts#L4)

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](../enums/purista_core.EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceNotReady.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceNotReady.ts#L4)

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](../enums/purista_core.EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceReady.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceReady.ts#L4)

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](../enums/purista_core.EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceShutdown.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceShutdown.ts#L4)

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](../enums/purista_core.EBMessageType.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoSubscriptionError.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoSubscriptionError.ts#L4)

___

### InstanceId

Ƭ **InstanceId**: `string`

#### Defined in

[core/src/core/types/InstanceId.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/InstanceId.ts#L1)

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"``

#### Defined in

[core/src/core/types/LogLevelName.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/LogLevelName.ts#L1)

___

### Logger

Ƭ **Logger**: `Pick`<[`Logger`](purista_core.md#logger), ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"getChildLogger"``\>

#### Defined in

[core/src/core/types/Logger.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/Logger.ts#L3)

___

### LoggerStubs

Ƭ **LoggerStubs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | `SinonStub` |
| `error` | `SinonStub` |
| `info` | `SinonStub` |
| `trace` | `SinonStub` |
| `warn` | `SinonStub` |

#### Defined in

[core/src/testhelper/getLogger.mock.ts:37](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/getLogger.mock.ts#L37)

___

### PrincipalId

Ƭ **PrincipalId**: `string`

#### Defined in

[core/src/core/types/PrincipalId.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/PrincipalId.ts#L1)

___

### QueryParameter

Ƭ **QueryParameter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `required` | `boolean` |

#### Defined in

[core/src/httpserver/types/QueryParameter.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/httpserver/types/QueryParameter.ts#L1)

___

### ServiceEvents

Ƭ **ServiceEvents**: `Object`

Events which can be emitted by a service

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventbridge-connected` | `undefined` | emitted when then connection to event bridge is established |
| `eventbridge-connection-error` | `undefined` | emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly |
| `eventbridge-disconnected` | `undefined` | emitted when the connection to event bridge closed |
| `eventbridge-reconnecting` | `undefined` | emitted on retry to connect to event bridge |
| `service-available` | `undefined` | emitted when the service is fully initialized and ready |
| `service-drain` | `undefined` | emitted when the service is going to be stopped |
| `service-not-available` | `undefined` | emitted when the service is not available (for example database connection could not be established) |
| `service-start` | `undefined` | emitted when the service is started, but not fully initialized and not ready yet |
| `service-stop` | `undefined` | emitted when the service has been stopped |
| `unhandled-function-error` | { `error`: `unknown` ; `functionName`: `string` ; `traceId`: [`TraceId`](purista_core.md#traceid)  } | emitted when a function throws an error other than a HandledError |
| `unhandled-function-error.error` | `unknown` | - |
| `unhandled-function-error.functionName` | `string` | - |
| `unhandled-function-error.traceId` | [`TraceId`](purista_core.md#traceid) | - |
| `unhandled-subscription-error` | { `error`: `unknown` ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_core.md#traceid)  } | emitted when a subscription throws an error other than a HandledError |
| `unhandled-subscription-error.error` | `unknown` | - |
| `unhandled-subscription-error.subscriptionName` | `string` | - |
| `unhandled-subscription-error.traceId` | [`TraceId`](purista_core.md#traceid) | - |

#### Defined in

[core/src/core/types/ServiceEvents.ts:6](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceEvents.ts#L6)

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

[core/src/core/types/infoType/ServiceInfoType.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/ServiceInfoType.ts#L4)

___

### Subscription

Ƭ **Subscription**: `Object`

A subscription managed by the event bridge

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |
| `messageType?` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `subscriber` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |

#### Defined in

[core/src/core/types/subscription/Subscription.ts:7](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/subscription/Subscription.ts#L7)

___

### SubscriptionContext

Ƭ **SubscriptionContext**<`MessageType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](purista_core.md#ebmessage) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](purista_core.md#logger) |
| `message` | `MessageType` |
| `emit` | <Payload\>(`eventName`: `string`, `payload?`: `Payload`) => `Promise`<`void`\> |
| `invoke` | <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_core.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\> |

#### Defined in

[core/src/core/types/subscription/SubscriptionContext.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/subscription/SubscriptionContext.ts#L5)

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`ServiceClassType`, `MessageType`, `Payload`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_core.ServiceClass.md) |
| `MessageType` | [`EBMessage`](purista_core.md#ebmessage) |
| `Payload` | `unknown` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | [`SubscriptionFunction`](purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessageType`, `Payload`\> |
| `eventName?` | `string` |
| `messageType?` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `subscriptionDescription` | `string` |
| `subscriptionName` | `string` |

#### Defined in

[core/src/core/types/subscription/SubscriptionDefinition.ts:6](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L6)

___

### SubscriptionDefinitionList

Ƭ **SubscriptionDefinitionList**<`ServiceClassType`\>: [`SubscriptionDefinition`](purista_core.md#subscriptiondefinition)<`ServiceClassType`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_core.ServiceClass.md) |

#### Defined in

[core/src/core/types/subscription/SubscriptionDefinitionList.ts:11](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/subscription/SubscriptionDefinitionList.ts#L11)

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`, `MessageType`, `Payload`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionContext`](purista_core.md#subscriptioncontext)<`MessageType`\>, `payload`: `Payload`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../classes/purista_core.ServiceClass.md) |
| `MessageType` | [`EBMessage`](purista_core.md#ebmessage) |
| `Payload` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`): `Promise`<`void`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionContext`](purista_core.md#subscriptioncontext)<`MessageType`\> |
| `payload` | `Payload` |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/subscription/SubscriptionFunction.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/subscription/SubscriptionFunction.ts#L8)

___

### SupportedHttpMethod

Ƭ **SupportedHttpMethod**: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"``

Supported HTTP-Methods for defining endpoints

#### Defined in

[core/src/helper/types/SupportedHttpMethod.ts:2](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/helper/types/SupportedHttpMethod.ts#L2)

___

### TraceId

Ƭ **TraceId**: `string`

#### Defined in

[core/src/core/types/TraceId.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/TraceId.ts#L1)

___

### TransformInputHook

Ƭ **TransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: { `logger`: [`Logger`](purista_core.md#logger) ; `message`: [`Command`](purista_core.md#command)<`PayloadInput`, `ParamsInput`\>  }, `payload`: `PayloadInput`, `params`: `ParamsInput`) => `Promise`<{ `params`: `ParamsOutput` ; `payload`: `PayloadOutput`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `PayloadOutput` | `unknown` |
| `ParamsOutput` | `unknown` |
| `PayloadInput` | `unknown` |
| `ParamsInput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `params`): `Promise`<{ `params`: `ParamsOutput` ; `payload`: `PayloadOutput`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | `Object` |
| `context.logger` | [`Logger`](purista_core.md#logger) |
| `context.message` | [`Command`](purista_core.md#command)<`PayloadInput`, `ParamsInput`\> |
| `payload` | `PayloadInput` |
| `params` | `ParamsInput` |

##### Returns

`Promise`<{ `params`: `ParamsOutput` ; `payload`: `PayloadOutput`  }\>

#### Defined in

[core/src/core/types/commandType/TransformInputHook.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/TransformInputHook.ts#L4)

___

### TransformOutputHook

Ƭ **TransformOutputHook**<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: { `logger`: [`Logger`](purista_core.md#logger) ; `message`: [`Command`](purista_core.md#command)<`MessagePayloadType`, `MessageParamsType`\>  }, `payload`: `MessageResultType`, `params`: `MessageParamsType`) => `Promise`<`ResponseOutput`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `MessagePayloadType` | `MessagePayloadType` |
| `MessageResultType` | `MessageResultType` |
| `MessageParamsType` | `MessageParamsType` |
| `ResponseOutput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `params`): `Promise`<`ResponseOutput`\>

This transform hook is executed after function output validation and AfterGuardHooks.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | `Object` |
| `context.logger` | [`Logger`](purista_core.md#logger) |
| `context.message` | [`Command`](purista_core.md#command)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `MessageResultType` |
| `params` | `MessageParamsType` |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

[core/src/core/types/commandType/TransformOutputHook.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/TransformOutputHook.ts#L8)

___

### ValidationDefinition

Ƭ **ValidationDefinition**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputParameterSchema?` | `z.ZodType`<`unknown`, `z.ZodTypeDef`, `unknown`\> |
| `inputPayloadSchema?` | `z.ZodType`<`unknown`, `z.ZodTypeDef`, `unknown`\> |
| `outputPayloadSchema?` | `z.ZodType`<`unknown`, `z.ZodTypeDef`, `unknown`\> |

#### Defined in

[core/src/helper/types/ValidationDefinition.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/helper/types/ValidationDefinition.ts#L3)

## Variables

### MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION

• `Const` **MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION**: ``1024``

#### Defined in

[core/src/helper/types/MinContentSizeForCompression.const.ts:1](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/helper/types/MinContentSizeForCompression.const.ts#L1)

___

### ServiceInfoValidator

• `Const` **ServiceInfoValidator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `set` | (`obj`: [`ServiceInfoType`](purista_core.md#serviceinfotype), `prop`: keyof [`ServiceInfoType`](purista_core.md#serviceinfotype), `value`: `string`) => `boolean` |

#### Defined in

[core/src/core/Service/ServiceInfoValidator.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/Service/ServiceInfoValidator.ts#L5)

___

### infoMessageTypes

• `Const` **infoMessageTypes**: [`EBMessageType`](../enums/purista_core.EBMessageType.md)[]

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:31](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoMessage.ts#L31)

## Functions

### createErrorResponse

▸ **createErrorResponse**(`originalEBMessage`, `statusCode?`, `error?`): `Readonly`<`Omit`<[`CommandErrorResponse`](purista_core.md#commanderrorresponse), ``"instanceId"``\>\>

Creates a error response object based on original command
Toggles sender and receiver

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `originalEBMessage` | `Readonly`<[`Command`](purista_core.md#command)<`unknown`, `unknown`\>\> | `undefined` |
| `statusCode` | [`StatusCode`](../enums/purista_core.StatusCode.md) | `StatusCode.InternalServerError` |
| `error?` | `unknown` | `undefined` |

#### Returns

`Readonly`<`Omit`<[`CommandErrorResponse`](purista_core.md#commanderrorresponse), ``"instanceId"``\>\>

CommandErrorResponse message object

#### Defined in

[core/src/core/helper/createErrorResponse.impl.ts:15](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/createErrorResponse.impl.ts#L15)

___

### createInfoMessage

▸ **createInfoMessage**(`messageType`, `serviceName`, `serviceVersion`, `serviceTarget?`, `payload?`): `Omit`<[`InfoMessage`](purista_core.md#infomessage), ``"instanceId"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageType` | [`InfoMessageType`](purista_core.md#infomessagetype) |
| `serviceName` | `string` |
| `serviceVersion` | `string` |
| `serviceTarget?` | `string` |
| `payload?` | `Record`<`string`, `unknown`\> |

#### Returns

`Omit`<[`InfoMessage`](purista_core.md#infomessage), ``"instanceId"``\>

#### Defined in

[core/src/core/helper/createInfoMessage.impl.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/createInfoMessage.impl.ts#L5)

___

### createSuccessResponse

▸ **createSuccessResponse**<`T`\>(`originalEBMessage`, `payload`, `eventName?`): `Readonly`<`Omit`<[`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\>, ``"instanceId"``\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalEBMessage` | `Readonly`<[`Command`](purista_core.md#command)<`unknown`, `unknown`\>\> |
| `payload` | `T` |
| `eventName?` | `string` |

#### Returns

`Readonly`<`Omit`<[`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\>, ``"instanceId"``\>\>

#### Defined in

[core/src/core/helper/createSuccessResponse.impl.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/createSuccessResponse.impl.ts#L4)

___

### createTestCommandErrorResponseMsg

▸ **createTestCommandErrorResponseMsg**(`error`, `input?`): [`CommandErrorResponse`](purista_core.md#commanderrorresponse)

A helper to create a command error response message.
You need to provide a HandledError or Unhandled error as input.
All message fields are prefilled with dummy defaults.
They can be overwritten by optional parameter.

```typescript
createTestCommandErrorResponseMsg(
   new HandledError(400,'invalid input)
{
  principalId: 'abc-123-4567'
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | [`HandledError`](../classes/purista_core.HandledError.md) \| [`UnhandledError`](../classes/purista_core.UnhandledError.md) | - |
| `input?` | `Partial`<[`CommandErrorResponse`](purista_core.md#commanderrorresponse)\> | partial Command |

#### Returns

[`CommandErrorResponse`](purista_core.md#commanderrorresponse)

Command

#### Defined in

[core/src/testhelper/messages/createTestCommandErrorResponseMsg.ts:28](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/messages/createTestCommandErrorResponseMsg.ts#L28)

___

### createTestCommandMsg

▸ **createTestCommandMsg**<`Payload`, `Parameter`\>(`input?`): [`Command`](purista_core.md#command)<`Payload`, `Parameter`\>

A helper to create a command message.
All message fields are prefilled with dummy defaults.
They can be overwritten by optional parameter.

```typescript
createTestCommandMsg({
  payload: {
     payload: 'some input payload',
     parameter: 'some parameter input'
   }
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |
| `Parameter` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `Partial`<[`Command`](purista_core.md#command)<`Payload`, `Parameter`\>\> | partial Command |

#### Returns

[`Command`](purista_core.md#command)<`Payload`, `Parameter`\>

Command

#### Defined in

[core/src/testhelper/messages/createTestCommandMsg.ts:20](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/messages/createTestCommandMsg.ts#L20)

___

### createTestCommandResponseMsg

▸ **createTestCommandResponseMsg**<`Payload`\>(`input?`): [`CommandResponse`](purista_core.md#commandresponse)<`Payload`\>

A helper to create a command response message.
All message fields are prefilled with dummy defaults.
They can be overwritten by optional parameter.

```typescript
createTestCommandResponseMsg({
  payload: 'the response payload'
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | `Partial`<[`CommandResponse`](purista_core.md#commandresponse)<`Payload`\>\> | partial CommandResponse |

#### Returns

[`CommandResponse`](purista_core.md#commandresponse)<`Payload`\>

CommandResponse

#### Defined in

[core/src/testhelper/messages/createTestCommandResponseMsg.ts:17](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/messages/createTestCommandResponseMsg.ts#L17)

___

### createTestCustomMsg

▸ **createTestCustomMsg**<`Payload`\>(`eventName`, `payload?`, `input?`): [`CustomMessage`](purista_core.md#custommessage)<`Payload`\>

A helper to create a custom message.
All message fields are prefilled with dummy defaults.
They can be overwritten by optional parameter.

```typescript
createTestCustomMsg('theEvenName', 'the custom event payload ,{
  principalId: 'abc-1234'
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | - |
| `payload?` | `Payload` | - |
| `input?` | `Partial`<[`CustomMessage`](purista_core.md#custommessage)<`Payload`\>\> | partial CustomMessage |

#### Returns

[`CustomMessage`](purista_core.md#custommessage)<`Payload`\>

CustomMessage

#### Defined in

[core/src/testhelper/messages/createTestCustomMsg.ts:17](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/messages/createTestCustomMsg.ts#L17)

___

### getCleanedMessage

▸ **getCleanedMessage**(`message`, `stripeOutContent?`): `Record`<`string`, `unknown`\>

Helper function for logging.
Returns a message object, where fields which might contain sensitive data, are overwritten with string values.
For command messages, parameter and payload are overwritten with string values.

For command success responses, the response field is overwritten.

Command error responses are not changed.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\> | `undefined` |
| `stripeOutContent` | `boolean` | `!isDevelop()` |

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[core/src/core/helper/getCleanedMessage.impl.ts:13](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getCleanedMessage.impl.ts#L13)

___

### getCommandQueueName

▸ **getCommandQueueName**(`address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |

#### Returns

`string`

#### Defined in

[core/src/core/helper/getCommandQueueName.impl.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getCommandQueueName.impl.ts#L3)

___

### getErrorMessageForCode

▸ **getErrorMessageForCode**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`StatusCode`](../enums/purista_core.StatusCode.md) |

#### Returns

`string`

#### Defined in

[core/src/core/helper/getErrorMessageForCode.impl.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getErrorMessageForCode.impl.ts#L3)

___

### getEventBridgeMock

▸ **getEventBridgeMock**(): `Object`

Mocks the eventbridge and methods are stubs

#### Returns

`Object`

EventBridge mocked

| Name | Type |
| :------ | :------ |
| `mock` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) |
| `stubs` | `Record`<`string`, `SinonStub`<`any`[], `any`\>\> |

#### Defined in

[core/src/testhelper/getEventBridge.mock.ts:9](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/getEventBridge.mock.ts#L9)

___

### getFunctionContextMock

▸ **getFunctionContextMock**<`MessagePayloadType`, `MessageParamsType`\>(`payload`, `parameter`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `MessagePayloadType` |
| `parameter` | `MessageParamsType` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mock` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `stubs` | { `emit`: `SinonStub`<`any`[], `any`\> ; `invoke`: `SinonStub`<`any`[], `any`\> ; `logger`: `Record`<`string`, `SinonStub`<`any`[], `any`\>\> = logger.stubs } |
| `stubs.emit` | `SinonStub`<`any`[], `any`\> |
| `stubs.invoke` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger` | `Record`<`string`, `SinonStub`<`any`[], `any`\>\> |

#### Defined in

[core/src/testhelper/getFunctionContext.mock.ts:7](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/getFunctionContext.mock.ts#L7)

___

### getFunctionWithValidation

▸ **getFunctionWithValidation**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards?`): [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../classes/purista_core.ServiceClass.md)<`ServiceClassType`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fn` | [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | `undefined` |
| `inputPayloadSchema` | `undefined` \| `ZodType`<`FunctionPayloadType`, `ZodTypeDef`, `MessagePayloadType`\> | `undefined` |
| `inputParameterSchema` | `undefined` \| `ZodType`<`FunctionParamsType`, `ZodTypeDef`, `MessageParamsType`\> | `undefined` |
| `outputPayloadSchema` | `undefined` \| `ZodType`<`MessageResultType`, `ZodTypeDef`, `FunctionResultType`\> | `undefined` |
| `beforeGuards` | [`BeforeGuardHook`](purista_core.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] | `[]` |

#### Returns

[`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\>

#### Defined in

[core/src/helper/getFunctionWithValidation.ts:5](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/helper/getFunctionWithValidation.ts#L5)

___

### getLoggerMock

▸ **getLoggerMock**(): `Object`

Mocks the logger and methods are stubs

#### Returns

`Object`

logger mocked

| Name | Type |
| :------ | :------ |
| `mock` | [`Logger`](purista_core.md#logger) |
| `stubs` | `Record`<`string`, `SinonStub`<`any`[], `any`\>\> |

#### Defined in

[core/src/testhelper/getLogger.mock.ts:9](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/getLogger.mock.ts#L9)

___

### getNewCorrelationId

▸ **getNewCorrelationId**(): `string`

Create a new unique event bridge correlation id

#### Returns

`string`

EBMessageId

#### Defined in

[core/src/core/helper/getNewCorrelationId.impl.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getNewCorrelationId.impl.ts#L8)

___

### getNewEBMessageId

▸ **getNewEBMessageId**(): `string`

Create a new unique event bridge message id

#### Returns

`string`

EBMessageId

#### Defined in

[core/src/core/helper/getNewEBMessageId.impl.ts:8](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getNewEBMessageId.impl.ts#L8)

___

### getNewInstanceId

▸ **getNewInstanceId**(): `string`

#### Returns

`string`

#### Defined in

[core/src/core/helper/getNewInstanceId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getNewInstanceId.impl.ts#L3)

___

### getNewTraceId

▸ **getNewTraceId**(): `string`

#### Returns

`string`

#### Defined in

[core/src/core/helper/getNewTraceId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getNewTraceId.impl.ts#L3)

___

### getSubscriptionContextMock

▸ **getSubscriptionContextMock**<`MessageType`\>(`message`): `Object`

#### Type parameters

| Name |
| :------ |
| `MessageType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `MessageType` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mock` | [`SubscriptionContext`](purista_core.md#subscriptioncontext)<`MessageType`\> |
| `stubs` | { `emit`: `SinonStub`<`any`[], `any`\> ; `invoke`: `SinonStub`<`any`[], `any`\> ; `logger`: `Record`<`string`, `SinonStub`<`any`[], `any`\>\> = logger.stubs } |
| `stubs.emit` | `SinonStub`<`any`[], `any`\> |
| `stubs.invoke` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger` | `Record`<`string`, `SinonStub`<`any`[], `any`\>\> |

#### Defined in

[core/src/testhelper/getSubscriptionContext.mock.ts:6](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/testhelper/getSubscriptionContext.mock.ts#L6)

___

### getSubscriptionQueueName

▸ **getSubscriptionQueueName**(`address`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |

#### Returns

`string`

#### Defined in

[core/src/core/helper/getSubscriptionQueueName.impl.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getSubscriptionQueueName.impl.ts#L3)

___

### getTimeoutPromise

▸ **getTimeoutPromise**(`ttl`, `traceId`): `Promise`<`never`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ttl` | `number` |
| `traceId` | `string` |

#### Returns

`Promise`<`never`\>

#### Defined in

[core/src/core/helper/getTimeoutPromise.impl.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getTimeoutPromise.impl.ts#L4)

___

### getUniqueId

▸ **getUniqueId**(): `string`

#### Returns

`string`

#### Defined in

[core/src/core/helper/getUniqueId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/getUniqueId.impl.ts#L3)

___

### initLogger

▸ **initLogger**(`minLevel`, `opt?`): [`Logger`](purista_core.md#logger)

Create a new logger with the given minimum log level

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minLevel` | `undefined` \| [`LogLevelName`](purista_core.md#loglevelname) | The minimum level of log messages to display. |
| `opt?` | `Record`<`string`, `unknown`\> | - |

#### Returns

[`Logger`](purista_core.md#logger)

#### Defined in

[core/src/core/initLogger.impl.ts:9](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/initLogger.impl.ts#L9)

___

### isCommand

▸ **isCommand**(`message`): message is Command<unknown, unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is Command<unknown, unknown\>

#### Defined in

[core/src/core/types/commandType/Command.ts:29](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/Command.ts#L29)

___

### isCommandErrorResponse

▸ **isCommandErrorResponse**(`message`): message is CommandErrorResponse

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `unknown` |

#### Returns

message is CommandErrorResponse

#### Defined in

[core/src/core/types/commandType/CommandErrorResponse.ts:24](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandErrorResponse.ts#L24)

___

### isCommandResponse

▸ **isCommandResponse**(`message`): message is CommandResponse<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is CommandResponse<unknown\>

#### Defined in

[core/src/core/types/commandType/CommandResponse.ts:11](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandResponse.ts#L11)

___

### isCommandSuccessResponse

▸ **isCommandSuccessResponse**(`message`): message is CommandSuccessResponse<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is CommandSuccessResponse<unknown\>

#### Defined in

[core/src/core/types/commandType/CommandSuccessResponse.ts:20](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/commandType/CommandSuccessResponse.ts#L20)

___

### isCustomMessage

▸ **isCustomMessage**(`message`): message is CustomMessage<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is CustomMessage<unknown\>

#### Defined in

[core/src/core/types/CustomMessage.ts:14](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/CustomMessage.ts#L14)

___

### isDevelop

▸ **isDevelop**(): `boolean`

returns true if NODE_ENV is set to value starting with "develop"

#### Returns

`boolean`

#### Defined in

[core/src/core/helper/isDevelop.impl.ts:4](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/helper/isDevelop.impl.ts#L4)

___

### isHttpExposedServiceMeta

▸ **isHttpExposedServiceMeta**(`data?`): data is HttpExposedServiceMeta

#### Parameters

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |

#### Returns

data is HttpExposedServiceMeta

#### Defined in

[core/src/httpserver/types/HttpExposedServiceMeta.ts:28](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/httpserver/types/HttpExposedServiceMeta.ts#L28)

___

### isInfoMessage

▸ **isInfoMessage**(`message`): message is InfoMessage

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is InfoMessage

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:42](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoMessage.ts#L42)

___

### isInfoServiceFunctionAdded

▸ **isInfoServiceFunctionAdded**(`message`): message is InfoServiceFunctionAdded

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is InfoServiceFunctionAdded

#### Defined in

[core/src/core/types/infoType/InfoServiceFunctionAdded.ts:9](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/infoType/InfoServiceFunctionAdded.ts#L9)
