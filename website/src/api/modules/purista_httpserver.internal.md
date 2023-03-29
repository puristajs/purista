[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](purista_httpserver.md) / internal

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
- [CustomMessage](purista_httpserver.internal.md#custommessage)
- [InfoInvokeTimeout](purista_httpserver.internal.md#infoinvoketimeout)
- [InfoServiceDrain](purista_httpserver.internal.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_httpserver.internal.md#infoservicefunctionadded)
- [InfoServiceInit](purista_httpserver.internal.md#infoserviceinit)
- [InfoServiceNotReady](purista_httpserver.internal.md#infoservicenotready)
- [InfoServiceReady](purista_httpserver.internal.md#infoserviceready)
- [InfoServiceShutdown](purista_httpserver.internal.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_httpserver.internal.md#infosubscriptionerror)

### Command

- [CommandDefinitionBuilder](../classes/purista_httpserver.internal.CommandDefinitionBuilder.md)
- [CommandAfterGuardHook](purista_httpserver.internal.md#commandafterguardhook)
- [CommandBeforeGuardHook](purista_httpserver.internal.md#commandbeforeguardhook)
- [CommandDefinition](purista_httpserver.internal.md#commanddefinition)
- [CommandErrorResponse](purista_httpserver.internal.md#commanderrorresponse-1)
- [CommandFunction](purista_httpserver.internal.md#commandfunction)
- [CommandFunctionContext](purista_httpserver.internal.md#commandfunctioncontext)
- [CommandFunctionContextEnhancements](purista_httpserver.internal.md#commandfunctioncontextenhancements)
- [CommandResponse](purista_httpserver.internal.md#commandresponse)
- [CommandSuccessResponse](purista_httpserver.internal.md#commandsuccessresponse-1)
- [CommandTransformFunctionContext](purista_httpserver.internal.md#commandtransformfunctioncontext)
- [CommandTransformInputHook](purista_httpserver.internal.md#commandtransforminputhook)
- [CommandTransformOutputHook](purista_httpserver.internal.md#commandtransformoutputhook)

### Classes

- [GenericEventEmitter](../classes/purista_httpserver.internal.GenericEventEmitter.md)
- [HandledError](../classes/purista_httpserver.internal.HandledError.md)
- [HttpServerClass](../classes/purista_httpserver.internal.HttpServerClass.md)
- [Logger](../classes/purista_httpserver.internal.Logger.md)

### Service

- [Service](../classes/purista_httpserver.internal.Service.md)
- [ServiceBaseClass](../classes/purista_httpserver.internal.ServiceBaseClass.md)
- [ServiceBuilder](../classes/purista_httpserver.internal.ServiceBuilder.md)
- [ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md)
- [ServiceConstructorInput](purista_httpserver.internal.md#serviceconstructorinput)
- [ServiceEventsInternal](purista_httpserver.internal.md#serviceeventsinternal)

### Subscription

- [SubscriptionDefinitionBuilder](../classes/purista_httpserver.internal.SubscriptionDefinitionBuilder.md)
- [Subscription](purista_httpserver.internal.md#subscription)
- [SubscriptionAfterGuardHook](purista_httpserver.internal.md#subscriptionafterguardhook)
- [SubscriptionBeforeGuardHook](purista_httpserver.internal.md#subscriptionbeforeguardhook)
- [SubscriptionDefinition](purista_httpserver.internal.md#subscriptiondefinition)
- [SubscriptionFunction](purista_httpserver.internal.md#subscriptionfunction)
- [SubscriptionFunctionContext](purista_httpserver.internal.md#subscriptionfunctioncontext)
- [SubscriptionFunctionContextEnhancements](purista_httpserver.internal.md#subscriptionfunctioncontextenhancements)
- [SubscriptionTransformFunctionContext](purista_httpserver.internal.md#subscriptiontransformfunctioncontext)
- [SubscriptionTransformInputHook](purista_httpserver.internal.md#subscriptiontransforminputhook)
- [SubscriptionTransformOutputHook](purista_httpserver.internal.md#subscriptiontransformoutputhook)

### Store

- [ConfigStore](../interfaces/purista_httpserver.internal.ConfigStore.md)
- [SecretStore](../interfaces/purista_httpserver.internal.SecretStore.md)
- [StateStore](../interfaces/purista_httpserver.internal.StateStore.md)
- [ConfigDeleteFunction](purista_httpserver.internal.md#configdeletefunction)
- [ConfigGetterFunction](purista_httpserver.internal.md#configgetterfunction)
- [ConfigSetterFunction](purista_httpserver.internal.md#configsetterfunction)
- [SecretDeleteFunction](purista_httpserver.internal.md#secretdeletefunction)
- [SecretGetterFunction](purista_httpserver.internal.md#secretgetterfunction)
- [SecretSetterFunction](purista_httpserver.internal.md#secretsetterfunction)
- [StateDeleteFunction](purista_httpserver.internal.md#statedeletefunction)
- [StateGetterFunction](purista_httpserver.internal.md#stategetterfunction)
- [StateSetterFunction](purista_httpserver.internal.md#statesetterfunction)

### Event bridge

- [EventBridge](../interfaces/purista_httpserver.internal.EventBridge.md)

### Interfaces

- [IEmitter](../interfaces/purista_httpserver.internal.IEmitter.md)

### Type Aliases

- [BeforeResponseHook](purista_httpserver.internal.md#beforeresponsehook)
- [Command](purista_httpserver.internal.md#command-1)
- [CommandDefinitionList](purista_httpserver.internal.md#commanddefinitionlist)
- [CommandDefinitionMetadataBase](purista_httpserver.internal.md#commanddefinitionmetadatabase)
- [Complete](purista_httpserver.internal.md#complete)
- [ContentType](purista_httpserver.internal.md#contenttype)
- [ContextBase](purista_httpserver.internal.md#contextbase)
- [CorrelationId](purista_httpserver.internal.md#correlationid)
- [CustomEvents](purista_httpserver.internal.md#customevents)
- [CustomMessage](purista_httpserver.internal.md#custommessage-1)
- [DefinitionEventBridgeConfig](purista_httpserver.internal.md#definitioneventbridgeconfig)
- [EBMessage](purista_httpserver.internal.md#ebmessage)
- [EBMessageAddress](purista_httpserver.internal.md#ebmessageaddress)
- [EBMessageBase](purista_httpserver.internal.md#ebmessagebase)
- [EBMessageId](purista_httpserver.internal.md#ebmessageid)
- [EmitCustomMessageFunction](purista_httpserver.internal.md#emitcustommessagefunction)
- [ErrorResponsePayload](purista_httpserver.internal.md#errorresponsepayload)
- [EventKey](purista_httpserver.internal.md#eventkey)
- [EventMap](purista_httpserver.internal.md#eventmap)
- [EventReceiver](purista_httpserver.internal.md#eventreceiver)
- [HttpExposedServiceMeta](purista_httpserver.internal.md#httpexposedservicemeta)
- [HttpServerServiceV1ConfigRaw](purista_httpserver.internal.md#httpserverservicev1configraw)
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
- [InvokeFunction](purista_httpserver.internal.md#invokefunction)
- [LogFnParamType](purista_httpserver.internal.md#logfnparamtype)
- [LogLevelName](purista_httpserver.internal.md#loglevelname)
- [LoggerOptions](purista_httpserver.internal.md#loggeroptions)
- [Newable](purista_httpserver.internal.md#newable)
- [PrincipalId](purista_httpserver.internal.md#principalid)
- [QueryParameter](purista_httpserver.internal.md#queryparameter)
- [ServiceEvents](purista_httpserver.internal.md#serviceevents)
- [ServiceInfoType](purista_httpserver.internal.md#serviceinfotype)
- [SubscriptionDefinitionList](purista_httpserver.internal.md#subscriptiondefinitionlist)
- [SubscriptionDefinitionMetadataBase](purista_httpserver.internal.md#subscriptiondefinitionmetadatabase)
- [SupportedHttpMethod](purista_httpserver.internal.md#supportedhttpmethod)
- [TraceId](purista_httpserver.internal.md#traceid)
- [addPrefixToObject](purista_httpserver.internal.md#addprefixtoobject)

### Variables

- [httpServerServiceV1ConfigSchema](purista_httpserver.internal.md#httpserverservicev1configschema)
- [httpServerV1ServiceCommandsToRestApiInputPayloadSchema](purista_httpserver.internal.md#httpserverv1servicecommandstorestapiinputpayloadschema)

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

___

### InfoInvokeTimeout

• **InfoInvokeTimeout**: ``"infoInvokeTimeout"``

a service invoked a other function and did not get a answer within given ttl

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:35

___

### InfoServiceDrain

• **InfoServiceDrain**: ``"infoServiceDrain"``

indicates that a service is going to shut down and does no longer accept new requests

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:31

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded**: ``"infoServiceFunctionAdded"``

send when a service provides a new function

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:29

___

### InfoServiceInit

• **InfoServiceInit**: ``"infoServiceInit"``

indicates that a service is booting

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:23

___

### InfoServiceNotReady

• **InfoServiceNotReady**: ``"infoServiceNotReady"``

indicates that a service is not able to process requests (e.g. db not available)

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:27

___

### InfoServiceReady

• **InfoServiceReady**: ``"infoServiceReady"``

indicates that a service is ready

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:25

___

### InfoServiceShutdown

• **InfoServiceShutdown**: ``"infoServiceShutdown"``

last event from service before service is destroyed

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:33

___

### InfoSubscriptionError

• **InfoSubscriptionError**: ``"infoSubscriptionError"``

a subscription function is throwing

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:37

## Command

• **CommandDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

Command definition builder is a helper to create and define a command for a service.
It helps to set all needed information like schemas and hooks.
With these information, the types are automatically set and extended.

A working schema definition needs at least a command name, a short description and the function implementation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:13

### CommandAfterGuardHook

Ƭ **CommandAfterGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `result`: `Readonly`<`FunctionResultType`\>, `input`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionResultType` | `unknown` |
| `FunctionPayloadType` | `unknown` |
| `FunctionParamsType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `result`, `input`, `parameter`): `Promise`<`void`\>

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `result` | `Readonly`<`FunctionResultType`\> |
| `input` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandAfterGuardHook.d.ts:9

___

### CommandBeforeGuardHook

Ƭ **CommandBeforeGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
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
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandBeforeGuardHook.d.ts:10

___

### CommandDefinition

Ƭ **CommandDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MetadataType` | [`CommandDefinitionMetadataBase`](purista_httpserver.internal.md#commanddefinitionmetadatabase) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`CommandFunction`](purista_httpserver.internal.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\> | the command function |
| `commandDescription` | `string` | the description of the command |
| `commandName` | `string` | the name of the command |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_httpserver.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the eventName for the command response |
| `hooks` | { `afterGuard?`: `Record`<`string`, [`CommandAfterGuardHook`](purista_httpserver.internal.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `beforeGuard?`: `Record`<`string`, [`CommandBeforeGuardHook`](purista_httpserver.internal.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `transformInput?`: { `transformFunction`: [`CommandTransformInputHook`](purista_httpserver.internal.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`CommandTransformOutputHook`](purista_httpserver.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  }  } | hooks of command |
| `hooks.afterGuard?` | `Record`<`string`, [`CommandAfterGuardHook`](purista_httpserver.internal.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.beforeGuard?` | `Record`<`string`, [`CommandBeforeGuardHook`](purista_httpserver.internal.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.transformInput?` | { `transformFunction`: [`CommandTransformInputHook`](purista_httpserver.internal.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } | - |
| `hooks.transformInput.transformFunction` | [`CommandTransformInputHook`](purista_httpserver.internal.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> | - |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` | - |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` | - |
| `hooks.transformOutput?` | { `transformFunction`: [`CommandTransformOutputHook`](purista_httpserver.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  } | - |
| `hooks.transformOutput.transformFunction` | [`CommandTransformOutputHook`](purista_httpserver.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> | - |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` | - |
| `metadata` | `MetadataType` | the metadata of the command |

#### Defined in

packages/core/lib/core/types/commandType/CommandDefinition.d.ts:15

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: [`CorrelationId`](purista_httpserver.internal.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_httpserver.internal.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)  } ; `receiver`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

packages/core/lib/core/types/commandType/CommandErrorResponse.d.ts:11

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_httpserver.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
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
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandFunction.d.ts:8

___

### CommandFunctionContext

Ƭ **CommandFunctionContext**<`MessagePayloadType`, `MessageParamsType`\>: [`ContextBase`](purista_httpserver.internal.md#contextbase) & [`CommandFunctionContextEnhancements`](purista_httpserver.internal.md#commandfunctioncontextenhancements)<`MessagePayloadType`, `MessageParamsType`\>

The command function context which will be passed into command function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/CommandFunctionContext.d.ts:44

___

### CommandFunctionContextEnhancements

Ƭ **CommandFunctionContextEnhancements**<`MessagePayloadType`, `MessageParamsType`\>: `Object`

It provides the original command message with types for payload and parameter.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emit` | [`EmitCustomMessageFunction`](purista_httpserver.internal.md#emitcustommessagefunction) | emit a custom message |
| `invoke` | [`InvokeFunction`](purista_httpserver.internal.md#invokefunction) | Invokes a command and returns the result. It is recommended to validate the result against a schema which only contains the data you actually need. **`Example`** ```typescript const address: EBMessageAddress = { serviceName: 'name-of-service-to-invoke', serviceVersion: '1', serviceTarget: 'command-name-to-invoke', } const inputPayload = { my: 'input' } const inputParameter = { search: 'for_me' } const result = await invoke<MyResultType>(address, inputPayload inputParameter ) ``` |
| `message` | `Readonly`<[`Command`](purista_httpserver.internal.md#command-1)<`MessagePayloadType`, `MessageParamsType`\>\> | the original message |

#### Defined in

packages/core/lib/core/types/commandType/CommandFunctionContext.d.ts:14

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_httpserver.internal.md#commandsuccessresponse-1)<`T`\> \| [`CommandErrorResponse`](purista_httpserver.internal.md#commanderrorresponse-1)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/CommandResponse.d.ts:8

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

packages/core/lib/core/types/commandType/CommandSuccessResponse.d.ts:11

___

### CommandTransformFunctionContext

Ƭ **CommandTransformFunctionContext**<`PayloadType`, `ParameterType`\>: [`ContextBase`](purista_httpserver.internal.md#contextbase) & { `message`: `Readonly`<[`Command`](purista_httpserver.internal.md#command-1)<`PayloadType`, `ParameterType`\>\>  }

#### Type parameters

| Name |
| :------ |
| `PayloadType` |
| `ParameterType` |

#### Defined in

packages/core/lib/core/types/commandType/CommandTransformFunctionContext.d.ts:6

___

### CommandTransformInputHook

Ƭ **CommandTransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: [`CommandTransformFunctionContext`](purista_httpserver.internal.md#commandtransformfunctioncontext)<`PayloadInput`, `ParamsInput`\>, `payload`: `Readonly`<`PayloadInput`\>, `parameter`: `Readonly`<`ParamsInput`\>) => `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `PayloadOutput` | `unknown` |
| `ParamsOutput` | `unknown` |
| `PayloadInput` | `unknown` |
| `ParamsInput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

The command transform gets the raw message payload and parameter input, which is validated against the transform input schemas.
The command transform function is called before guard hooks and before the actual command function.

It should throw HandledError or return an object with the transformed payload and parameter.
The type of returned payload and parameter must match the command function input for payload and parameter

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandTransformFunctionContext`](purista_httpserver.internal.md#commandtransformfunctioncontext)<`PayloadInput`, `ParamsInput`\> |
| `payload` | `Readonly`<`PayloadInput`\> |
| `parameter` | `Readonly`<`ParamsInput`\> |

##### Returns

`Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Defined in

packages/core/lib/core/types/commandType/CommandTransformInputHook.d.ts:11

___

### CommandTransformOutputHook

Ƭ **CommandTransformOutputHook**<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: [`CommandTransformFunctionContext`](purista_httpserver.internal.md#commandtransformfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`MessageResultType`\>, `parameter`: `Readonly`<`MessageParamsType`\>) => `Promise`<`ResponseOutput`\>

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
| `context` | [`CommandTransformFunctionContext`](purista_httpserver.internal.md#commandtransformfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`MessageResultType`\> |
| `parameter` | `Readonly`<`MessageParamsType`\> |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandTransformOutputHook.d.ts:6

## Service

• **Service**<`ConfigType`\>: `Object`

Base class for all services.
This class provides base functions to work with the event bridge, logging and so on

Every service should extend this class and should not directly access the eventbridge or other service

```typescript
class MyService extends Service {

  async start() {
    await super.start()
    // your custom implementation
  }

  async destroy() {
    // your custom implementation
   await super.destroy()
  }
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:26

• **ServiceBaseClass**: `Object`

Class which contains basic functions that are not directly related to

- handling of messages
- handling of commands
- handling of subscriptions

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:17

• **ServiceBuilder**<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>: `Object`

This class is used to build a service.
The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
command definitions and subscription definitions to the service. It also has a method that is used
to create an instance of the service class.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) = [`Service`](../classes/purista_httpserver.internal.Service.md)<`ConfigType`\> |

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:17

• **ServiceClass**<`ConfigType`\>: `Object`

The ServiceClass interface

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:9

### ServiceConstructorInput

Ƭ **ServiceConstructorInput**<`ConfigType`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinitionList` | [`CommandDefinitionList`](purista_httpserver.internal.md#commanddefinitionlist)<`any`\> | The list of command definitions for this service |
| `config` | `ConfigType` | The service specific config |
| `configStore?` | [`ConfigStore`](../interfaces/purista_httpserver.internal.ConfigStore.md) | The config store instance |
| `eventBridge` | [`EventBridge`](../interfaces/purista_httpserver.internal.EventBridge.md) | The eventBridge instance |
| `info` | [`ServiceInfoType`](purista_httpserver.internal.md#serviceinfotype) | The service info with name, version and description of service |
| `logger` | [`Logger`](../classes/purista_httpserver.internal.Logger.md) | A logger instance |
| `secretStore?` | [`SecretStore`](../interfaces/purista_httpserver.internal.SecretStore.md) | The secret store instance |
| `spanProcessor?` | `SpanProcessor` | The opentelemetry span processor instance |
| `stateStore?` | [`StateStore`](../interfaces/purista_httpserver.internal.StateStore.md) | the state store instance |
| `subscriptionDefinitionList` | [`SubscriptionDefinitionList`](purista_httpserver.internal.md#subscriptiondefinitionlist)<`any`\> | The list of subscription definitions for this service |

#### Defined in

packages/core/lib/core/types/ServiceConstructorInput.d.ts:13

___

### ServiceEventsInternal

Ƭ **ServiceEventsInternal**: `Object`

Events which can be emitted by a service.
Internal events are prefixed with `service-`.

Response messages, which have an event name assigned, are prefixed with `custom-`
If you like to use your own events, the event name must be prefixed with `misc-`.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `service-available` | `undefined` | emitted when the service is fully initialized and ready Should be emitted by custom service class. It is not emitted by default |
| `service-drain` | `undefined` | emitted when the service is going to be stopped |
| `service-handled-command-error` | { `commandName`: `string` ; `error`: [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a command throws a HandledError |
| `service-handled-command-error.commandName` | `string` | - |
| `service-handled-command-error.error` | [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) | - |
| `service-handled-command-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |
| `service-handled-subscription-error` | { `error`: [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a subscription throws a HandledError |
| `service-handled-subscription-error.error` | [`HandledError`](../classes/purista_httpserver.internal.HandledError.md) | - |
| `service-handled-subscription-error.subscriptionName` | `string` | - |
| `service-handled-subscription-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |
| `service-not-available` | `undefined` \| `unknown` | emitted when the service is not available (for example database connection could not be established) |
| `service-started` | `undefined` | emitted when the service is started, but not fully initialized and not ready yet |
| `service-stopped` | `undefined` | emitted when the service has been stopped |
| `service-unhandled-command-error` | { `commandName`: `string` ; `error`: `unknown` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a command throws an error other than a HandledError |
| `service-unhandled-command-error.commandName` | `string` | - |
| `service-unhandled-command-error.error` | `unknown` | - |
| `service-unhandled-command-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |
| `service-unhandled-subscription-error` | { `error`: `unknown` ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_httpserver.internal.md#traceid)  } | emitted when a subscription throws an error other than a HandledError |
| `service-unhandled-subscription-error.error` | `unknown` | - |
| `service-unhandled-subscription-error.subscriptionName` | `string` | - |
| `service-unhandled-subscription-error.traceId` | [`TraceId`](purista_httpserver.internal.md#traceid) | - |

#### Defined in

packages/core/lib/core/types/ServiceEvents.d.ts:44

## Subscription

• **SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` \| `void` \| `undefined` |

#### Defined in

packages/core/lib/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.d.ts:11

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
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_httpserver.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the event name to subscribe for |
| `instanceId?` | [`InstanceId`](purista_httpserver.internal.md#instanceid) | the principal id |
| `messageType?` | [`EBMessageType`](../enums/purista_httpserver.internal.EBMessageType.md) | the message type |
| `payload?` | { `parameter?`: `ParameterType` ; `payload?`: `PayloadType`  } | the message payload |
| `payload.parameter?` | `ParameterType` | - |
| `payload.payload?` | `PayloadType` | - |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) | the principal id |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the consumer address of the message |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the producer address of the message |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriber` | [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) | the address of the subscription (service name, version and subscription name) |

#### Defined in

packages/core/lib/core/types/subscription/Subscription.d.ts:11

___

### SubscriptionAfterGuardHook

Ƭ **SubscriptionAfterGuardHook**<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadOutputType`, `FunctionParameterType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_httpserver.internal.md#subscriptionfunctioncontext), `result`: `Readonly`<`FunctionResultType`\>, `payload`: `Readonly`<`FunctionPayloadOutputType`\>, `parameter`: `Readonly`<`FunctionParameterType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `FunctionResultType` | `unknown` |
| `FunctionPayloadOutputType` | `unknown` |
| `FunctionParameterType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `result`, `payload`, `parameter`): `Promise`<`void`\>

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionFunctionContext`](purista_httpserver.internal.md#subscriptionfunctioncontext) |
| `result` | `Readonly`<`FunctionResultType`\> |
| `payload` | `Readonly`<`FunctionPayloadOutputType`\> |
| `parameter` | `Readonly`<`FunctionParameterType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionAfterGuardHook.d.ts:9

___

### SubscriptionBeforeGuardHook

Ƭ **SubscriptionBeforeGuardHook**<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_httpserver.internal.md#subscriptionfunctioncontext), `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `FunctionPayloadType` | `unknown` |
| `FunctionParamsType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`void`\>

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionFunctionContext`](purista_httpserver.internal.md#subscriptionfunctioncontext) |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionBeforeGuardHook.d.ts:10

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

The definition for a subscription provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MetadataType` | [`SubscriptionDefinitionMetadataBase`](purista_httpserver.internal.md#subscriptiondefinitionmetadatabase) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`SubscriptionFunction`](purista_httpserver.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\> | the subscription function |
| `emitEventName?` | `string` | event name to be used for custom message if the subscription functions returns value |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_httpserver.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | filter forevent name |
| `hooks` | { `afterGuard?`: `Record`<`string`, [`SubscriptionAfterGuardHook`](purista_httpserver.internal.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `beforeGuard?`: `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_httpserver.internal.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `transformInput?`: { `transformFunction`: [`SubscriptionTransformInputHook`](purista_httpserver.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`SubscriptionTransformOutputHook`](purista_httpserver.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `z.ZodType`  }  } | hooks of subscription |
| `hooks.afterGuard?` | `Record`<`string`, [`SubscriptionAfterGuardHook`](purista_httpserver.internal.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.beforeGuard?` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_httpserver.internal.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.transformInput?` | { `transformFunction`: [`SubscriptionTransformInputHook`](purista_httpserver.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } | - |
| `hooks.transformInput.transformFunction` | [`SubscriptionTransformInputHook`](purista_httpserver.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> | - |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` | - |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` | - |
| `hooks.transformOutput?` | { `transformFunction`: [`SubscriptionTransformOutputHook`](purista_httpserver.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `z.ZodType`  } | - |
| `hooks.transformOutput.transformFunction` | [`SubscriptionTransformOutputHook`](purista_httpserver.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> | - |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` | - |
| `instanceId?` | [`InstanceId`](purista_httpserver.internal.md#instanceid) | filter for instance id |
| `messageType?` | [`EBMessageType`](../enums/purista_httpserver.internal.EBMessageType.md) | filter for message type |
| `metadata` | `MetadataType` | the metadata of the subscription |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) | filter for principal id |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | filter for messages consumed by given receiver |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | filter for messages produced by given sender |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriptionDescription` | `string` | the description of the subscription |
| `subscriptionName` | `string` | the name of the subscription |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionDefinition.d.ts:18

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_httpserver.internal.md#subscriptionfunctioncontext), `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `undefined` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`FunctionResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionFunctionContext`](purista_httpserver.internal.md#subscriptionfunctioncontext) |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionFunction.d.ts:8

___

### SubscriptionFunctionContext

Ƭ **SubscriptionFunctionContext**: [`ContextBase`](purista_httpserver.internal.md#contextbase) & [`SubscriptionFunctionContextEnhancements`](purista_httpserver.internal.md#subscriptionfunctioncontextenhancements)

The subscription function context which will be passed into subscription function.

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionFunctionContext.d.ts:44

___

### SubscriptionFunctionContextEnhancements

Ƭ **SubscriptionFunctionContextEnhancements**: `Object`

It provides the original command message.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emit` | [`EmitCustomMessageFunction`](purista_httpserver.internal.md#emitcustommessagefunction) | emit a custom message |
| `invoke` | [`InvokeFunction`](purista_httpserver.internal.md#invokefunction) | Invokes a command and returns the result. It is recommended to validate the result against a schema which only contains the data you actually need. **`Example`** ```typescript const address: EBMessageAddress = { serviceName: 'name-of-service-to-invoke', serviceVersion: '1', serviceTarget: 'command-name-to-invoke', } const inputPayload = { my: 'input' } const inputParameter = { search: 'for_me' } const result = await invoke<MyResultType>(address, inputPayload inputParameter ) ``` |
| `message` | `Readonly`<[`EBMessage`](purista_httpserver.internal.md#ebmessage)\> | the original message |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionFunctionContext.d.ts:14

___

### SubscriptionTransformFunctionContext

Ƭ **SubscriptionTransformFunctionContext**: [`ContextBase`](purista_httpserver.internal.md#contextbase) & { `message`: `Readonly`<[`EBMessage`](purista_httpserver.internal.md#ebmessage)\>  }

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionTransformFunctionContext.d.ts:6

___

### SubscriptionTransformInputHook

Ƭ **SubscriptionTransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionTransformFunctionContext`](purista_httpserver.internal.md#subscriptiontransformfunctioncontext), `payload`: `Readonly`<`PayloadInput`\>, `parameter`: `Readonly`<`ParamsInput`\>) => `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `PayloadOutput` | `unknown` |
| `ParamsOutput` | `unknown` |
| `PayloadInput` | `unknown` |
| `ParamsInput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionTransformFunctionContext`](purista_httpserver.internal.md#subscriptiontransformfunctioncontext) |
| `payload` | `Readonly`<`PayloadInput`\> |
| `parameter` | `Readonly`<`ParamsInput`\> |

##### Returns

`Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionTransformInputHook.d.ts:5

___

### SubscriptionTransformOutputHook

Ƭ **SubscriptionTransformOutputHook**<`ServiceClassType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionTransformFunctionContext`](purista_httpserver.internal.md#subscriptiontransformfunctioncontext), `payload`: `Readonly`<`MessageResultType`\>, `parameter`: `Readonly`<`MessageParamsType`\>) => `Promise`<`ResponseOutput`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `MessageResultType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `ResponseOutput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`ResponseOutput`\>

This transform hook is executed after function output validation and AfterGuardHooks.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionTransformFunctionContext`](purista_httpserver.internal.md#subscriptiontransformfunctioncontext) |
| `payload` | `Readonly`<`MessageResultType`\> |
| `parameter` | `Readonly`<`MessageParamsType`\> |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionTransformOutputHook.d.ts:7

## Store

• **ConfigStore**: `Object`

Interface definition for config store adapters

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:9

• **SecretStore**: `Object`

Interface definition for a secret store implementation

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:8

• **StateStore**: `Object`

Interface definition for state store implementations

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:9

### ConfigDeleteFunction

Ƭ **ConfigDeleteFunction**: (`configName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`configName`): `Promise`<`void`\>

delete a config value from the config store

##### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigDeleteFunction.d.ts:2

___

### ConfigGetterFunction

Ƭ **ConfigGetterFunction**: (...`configNames`: `string`[]) => `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Type declaration

▸ (`...configNames`): `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

get a config value from the config store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigGetterFunction.d.ts:2

___

### ConfigSetterFunction

Ƭ **ConfigSetterFunction**: (`secretName`: `string`, `secretValue`: `unknown`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a config value in the config store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `unknown` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigSetterFunction.d.ts:2

___

### SecretDeleteFunction

Ƭ **SecretDeleteFunction**: (`secretName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`): `Promise`<`void`\>

delete a secret from the secret store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretDeleteFunction.d.ts:2

___

### SecretGetterFunction

Ƭ **SecretGetterFunction**: (...`secretName`: `string`[]) => `Promise`<`Record`<`string`, `string` \| `undefined`\>\>

#### Type declaration

▸ (`...secretName`): `Promise`<`Record`<`string`, `string` \| `undefined`\>\>

get a secret from the secret store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...secretName` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `string` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretGetterFunction.d.ts:2

___

### SecretSetterFunction

Ƭ **SecretSetterFunction**: (`secretName`: `string`, `secretValue`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a secret in the secret store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretSetterFunction.d.ts:2

___

### StateDeleteFunction

Ƭ **StateDeleteFunction**: (`stateName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`stateName`): `Promise`<`void`\>

delete a state value from the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateDeleteFunction.d.ts:2

___

### StateGetterFunction

Ƭ **StateGetterFunction**: (...`stateNames`: `string`[]) => `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Type declaration

▸ (`...stateNames`): `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

get a state value from the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/StateStore/types/StateGetterFunction.d.ts:2

___

### StateSetterFunction

Ƭ **StateSetterFunction**: (`secretName`: `string`, `secretValue`: `unknown`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a state value in the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `unknown` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateSetterFunction.d.ts:2

## Type Aliases

### BeforeResponseHook

Ƭ **BeforeResponseHook**: <T\>(`payload`: `T`, `request`: `FastifyRequest`, `reply`: `FastifyReply`, `parameter`: `Record`<`string`, `unknown`\>) => `void`

#### Type declaration

▸ <`T`\>(`payload`, `request`, `reply`, `parameter`): `void`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `T` |
| `request` | `FastifyRequest` |
| `reply` | `FastifyReply` |
| `parameter` | `Record`<`string`, `unknown`\> |

##### Returns

`void`

#### Defined in

[packages/httpserver/src/service/httpServer/v1/types/BeforeResponseHook.ts:3](https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/types/BeforeResponseHook.ts#L3)

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

packages/core/lib/core/types/commandType/Command.d.ts:16

___

### CommandDefinitionList

Ƭ **CommandDefinitionList**<`ServiceClassType`\>: [`CommandDefinition`](purista_httpserver.internal.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](purista_httpserver.internal.md#commanddefinitionmetadatabase), `any`, `any`, `any`, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |

#### Defined in

packages/core/lib/core/types/commandType/CommandDefinitionList.d.ts:11

___

### CommandDefinitionMetadataBase

Ƭ **CommandDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
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

### ContextBase

Ƭ **ContextBase**: `Object`

The ContextBase provides is a basic type.
Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `configs` | { `getConfig`: [`ConfigGetterFunction`](purista_httpserver.internal.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_httpserver.internal.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_httpserver.internal.md#configsetterfunction)  } | the config store |
| `configs.getConfig` | [`ConfigGetterFunction`](purista_httpserver.internal.md#configgetterfunction) | get a config value from the config store |
| `configs.removeConfig` | [`ConfigDeleteFunction`](purista_httpserver.internal.md#configdeletefunction) | delete a config value from the config store |
| `configs.setConfig` | [`ConfigSetterFunction`](purista_httpserver.internal.md#configsetterfunction) | set a config value in the config store |
| `logger` | [`Logger`](../classes/purista_httpserver.internal.Logger.md) | the logger instance |
| `secrets` | { `getSecret`: [`SecretGetterFunction`](purista_httpserver.internal.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_httpserver.internal.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_httpserver.internal.md#secretsetterfunction)  } | the secret store |
| `secrets.getSecret` | [`SecretGetterFunction`](purista_httpserver.internal.md#secretgetterfunction) | get a secret from the secret store |
| `secrets.removeSecret` | [`SecretDeleteFunction`](purista_httpserver.internal.md#secretdeletefunction) | delete a secret from the secret store |
| `secrets.setSecret` | [`SecretSetterFunction`](purista_httpserver.internal.md#secretsetterfunction) | set a secret in the secret store |
| `startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `Context` \| `undefined`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> | wrap given function in an opentelemetry active span |
| `states` | { `getState`: [`StateGetterFunction`](purista_httpserver.internal.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_httpserver.internal.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_httpserver.internal.md#statesetterfunction)  } | the state store |
| `states.getState` | [`StateGetterFunction`](purista_httpserver.internal.md#stategetterfunction) | get a state value from the state store |
| `states.removeState` | [`StateDeleteFunction`](purista_httpserver.internal.md#statedeletefunction) | delete a state value from the state store |
| `states.setState` | [`StateSetterFunction`](purista_httpserver.internal.md#statesetterfunction) | set a state value in the state store |
| `wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> | wrap given function in an opentelemetry span |

#### Defined in

packages/core/lib/core/types/ContextBase.d.ts:10

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

packages/core/lib/core/types/ServiceEvents.d.ts:84

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: { `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_httpserver.internal.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

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

Ƭ **EBMessage**: [`Command`](purista_httpserver.internal.md#command-1) \| [`CommandResponse`](purista_httpserver.internal.md#commandresponse) \| [`InfoMessage`](purista_httpserver.internal.md#infomessage) \| [`CustomMessage`](purista_httpserver.internal.md#custommessage-1)

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
| `contentType` | [`ContentType`](purista_httpserver.internal.md#contenttype) | content type of message payload |
| `correlationId?` | [`CorrelationId`](purista_httpserver.internal.md#correlationid) | correlation id to know which command response referrs to which command |
| `eventName?` | `string` | event name for this message |
| `id` | [`EBMessageId`](purista_httpserver.internal.md#ebmessageid) | global unique id of message |
| `instanceId` | [`InstanceId`](purista_httpserver.internal.md#instanceid) | instance id of eventbridge which was creating the message |
| `otp?` | `string` | stringified Opentelemetry parent trace id |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) | principal id |
| `timestamp` | `number` | timestamp of message creation time |
| `traceId?` | [`TraceId`](purista_httpserver.internal.md#traceid) | trace id of message |

#### Defined in

packages/core/lib/core/types/EBMessageBase.d.ts:10

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

packages/core/lib/core/types/EBMessageId.d.ts:4

___

### EmitCustomMessageFunction

Ƭ **EmitCustomMessageFunction**: <Payload\>(`eventName`: `string`, `payload?`: `Payload`, `contentType?`: [`ContentType`](purista_httpserver.internal.md#contenttype), `contentEncoding?`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ <`Payload`\>(`eventName`, `payload?`, `contentType?`, `contentEncoding?`): `Promise`<`void`\>

Emits the given payload as custom message with the given event name.

**`Example`**

```typescript
await emit('my-custom-event-name', { the: 'payload' })
```

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `payload?` | `Payload` |
| `contentType?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/EmitCustomMessageFunction.d.ts:9

___

### ErrorResponsePayload

Ƭ **ErrorResponsePayload**: `Object`

Error message payload

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | addition data |
| `message` | `string` | a human readable error message |
| `status` | [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md) | the error status code |
| `traceId?` | [`TraceId`](purista_httpserver.internal.md#traceid) | the trace if of the request |

#### Defined in

packages/core/lib/core/types/ErrorResponsePayload.d.ts:6

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_httpserver.internal.md#eventmap) |

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

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**<`ParameterType`\>: [`CommandDefinitionMetadataBase`](purista_httpserver.internal.md#commanddefinitionmetadatabase) & { `expose`: { `http`: { `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](purista_httpserver.internal.md#queryparameter)<`ParameterType`\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  }  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParameterType` | {} |

#### Defined in

packages/core/lib/core/HttpServer/types/HttpExposedServiceMeta.d.ts:3

___

### HttpServerServiceV1ConfigRaw

Ƭ **HttpServerServiceV1ConfigRaw**: `z.input`<typeof [`httpServerServiceV1ConfigSchema`](purista_httpserver.internal.md#httpserverservicev1configschema)\>

#### Defined in

[packages/httpserver/src/service/httpServer/v1/httpServerServiceConfig.ts:90](https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/httpServerServiceConfig.ts#L90)

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](purista_httpserver.internal.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoInvokeTimeout.d.ts:20

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_httpserver.internal.md#infoservicedrain-1) \| [`InfoServiceFunctionAdded`](purista_httpserver.internal.md#infoservicefunctionadded-1) \| [`InfoServiceInit`](purista_httpserver.internal.md#infoserviceinit-1) \| [`InfoServiceNotReady`](purista_httpserver.internal.md#infoservicenotready-1) \| [`InfoServiceReady`](purista_httpserver.internal.md#infoserviceready-1) \| [`InfoServiceShutdown`](purista_httpserver.internal.md#infoserviceshutdown-1) \| [`InfoInvokeTimeout`](purista_httpserver.internal.md#infoinvoketimeout-1) \| [`InfoSubscriptionError`](purista_httpserver.internal.md#infosubscriptionerror-1)

#### Defined in

packages/core/lib/core/types/infoType/InfoMessage.d.ts:10

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](purista_httpserver.internal.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_httpserver.internal.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_httpserver.internal.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_httpserver.internal.md#infoservicenotready) \| [`InfoServiceReady`](purista_httpserver.internal.md#infoserviceready) \| [`InfoServiceShutdown`](purista_httpserver.internal.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_httpserver.internal.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_httpserver.internal.md#infosubscriptionerror)

#### Defined in

packages/core/lib/core/types/infoType/InfoMessage.d.ts:11

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `payload?`: `unknown` ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_httpserver.internal.md#ebmessagebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceBase.d.ts:2

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](purista_httpserver.internal.md#infoservicedrain)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceDrain.d.ts:3

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](purista_httpserver.internal.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceFunctionAdded.d.ts:3

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](purista_httpserver.internal.md#infoserviceinit)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceInit.d.ts:3

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](purista_httpserver.internal.md#infoservicenotready)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceNotReady.d.ts:3

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](purista_httpserver.internal.md#infoserviceready)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceReady.d.ts:3

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](purista_httpserver.internal.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceShutdown.d.ts:3

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](purista_httpserver.internal.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_httpserver.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoSubscriptionError.d.ts:3

___

### InstanceId

Ƭ **InstanceId**: `string`

the instance id of the event bridge

#### Defined in

packages/core/lib/core/types/InstanceId.d.ts:2

___

### InvokeFunction

Ƭ **InvokeFunction**: <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\>

#### Type declaration

▸ <`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`address`, `payload`, `parameter`): `Promise`<`InvokeResponseType`\>

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

**`Example`**

```typescript

const address: EBMessageAddress = {
  serviceName: 'name-of-service-to-invoke',
  serviceVersion: '1',
  serviceTarget: 'command-name-to-invoke',
}

const inputPayload = { my: 'input' }
const inputParameter = { search: 'for_me' }

const result = await invoke<MyResultType>(address, inputPayload inputParameter )
```

##### Type parameters

| Name | Type |
| :------ | :------ |
| `InvokeResponseType` | `unknown` |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](purista_httpserver.internal.md#ebmessageaddress) |
| `payload` | `PayloadType` |
| `parameter` | `ParameterType` |

##### Returns

`Promise`<`InvokeResponseType`\>

#### Defined in

packages/core/lib/core/types/InvokeFunction.d.ts:20

___

### LogFnParamType

Ƭ **LogFnParamType**: [`unknown`, string?, ...any] \| [`string`, ...any]

#### Defined in

packages/core/lib/core/types/Logger.d.ts:15

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"``

#### Defined in

packages/core/lib/core/types/LogLevelName.d.ts:1

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hostname?` | `string` |
| `instanceId?` | [`InstanceId`](purista_httpserver.internal.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_httpserver.internal.md#principalid) |
| `puristaVersion?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_httpserver.internal.md#traceid) |

#### Defined in

packages/core/lib/core/types/Logger.d.ts:4

___

### Newable

Ƭ **Newable**<`T`, `ConfigType`\>: (`config`: [`ServiceConstructorInput`](purista_httpserver.internal.md#serviceconstructorinput)<`ConfigType`\>) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |
| `ConfigType` |

#### Type declaration

• **new Newable**(`config`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ServiceConstructorInput`](purista_httpserver.internal.md#serviceconstructorinput)<`ConfigType`\> |

##### Returns

`T`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:6

___

### PrincipalId

Ƭ **PrincipalId**: `string`

the principal id

#### Defined in

packages/core/lib/core/types/PrincipalId.d.ts:2

___

### QueryParameter

Ƭ **QueryParameter**<`ParameterType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParameterType` | {} |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | keyof `ParameterType` |
| `required` | `boolean` |

#### Defined in

packages/core/lib/core/HttpServer/types/QueryParameter.d.ts:1

___

### ServiceEvents

Ƭ **ServiceEvents**: [`ServiceEventsInternal`](purista_httpserver.internal.md#serviceeventsinternal) & [`addPrefixToObject`](purista_httpserver.internal.md#addprefixtoobject)<[`CustomEvents`](purista_httpserver.internal.md#customevents), ``"custom-"``\> & [`addPrefixToObject`](purista_httpserver.internal.md#addprefixtoobject)<[`CustomEvents`](purista_httpserver.internal.md#customevents), ``"misc-"``\>

ServiceEvents are plain javascript events sent by the service.
There are three types:
- technical events when a services starts, stops, an error occurs and so on are prefixed with `service-`
- response messages, which have a event name assigned, are prefixed with `custom-`
- additional events, free defined by developer are prefixed with `misc-`

#### Defined in

packages/core/lib/core/types/ServiceEvents.d.ts:94

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

packages/core/lib/core/types/infoType/ServiceInfoType.d.ts:4

___

### SubscriptionDefinitionList

Ƭ **SubscriptionDefinitionList**<`ServiceClassType`\>: [`SubscriptionDefinition`](purista_httpserver.internal.md#subscriptiondefinition)<`ServiceClassType`, `any`, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionDefinitionList.d.ts:10

___

### SubscriptionDefinitionMetadataBase

Ƭ **SubscriptionDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_httpserver.internal.md#contenttype) ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_httpserver.internal.md#contenttype) |
| `expose.inputPayload?` | `SchemaObject` |
| `expose.outputPayload?` | `SchemaObject` |
| `expose.parameter?` | `SchemaObject` |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionDefinitionMetadataBase.d.ts:3

___

### SupportedHttpMethod

Ƭ **SupportedHttpMethod**: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"``

Supported HTTP-Methods for defining endpoints

#### Defined in

packages/core/lib/core/HttpServer/types/SupportedHttpMethod.d.ts:2

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

## Variables

### httpServerServiceV1ConfigSchema

• `Const` **httpServerServiceV1ConfigSchema**: `ZodObject`<{ `apiMountPath`: `ZodOptional`<`ZodString`\> ; `compressOptions`: `ZodOptional`<`ZodAny`\> ; `cookieSecret`: `ZodOptional`<`ZodString`\> ; `corsOptions`: `ZodOptional`<`ZodAny`\> ; `domain`: `ZodString` ; `enableCompress`: `ZodOptional`<`ZodBoolean`\> ; `enableCors`: `ZodOptional`<`ZodBoolean`\> ; `enableHealthz`: `ZodOptional`<`ZodBoolean`\> ; `enableHelmet`: `ZodOptional`<`ZodBoolean`\> ; `fastify`: `ZodAny` ; `helmetOptions`: `ZodOptional`<`ZodObject`<{ `enableCSPNonces`: `ZodOptional`<`ZodBoolean`\> ; `global`: `ZodOptional`<`ZodBoolean`\>  }, ``"strip"``, `ZodTypeAny`, { `enableCSPNonces?`: `boolean` ; `global?`: `boolean`  }, { `enableCSPNonces?`: `boolean` ; `global?`: `boolean`  }\>\> ; `host`: `ZodOptional`<`ZodString`\> ; `logLevel`: `ZodOptional`<`ZodEnum`<[``"info"``, ``"error"``, ``"warn"``, ``"debug"``, ``"trace"``, ``"fatal"``]\>\> ; `openApi`: `ZodOptional`<`ZodObject`<{ `components`: `ZodOptional`<`ZodAny`\> ; `enabled`: `ZodOptional`<`ZodBoolean`\> ; `externalDocs`: `ZodOptional`<`ZodObject`<{ `description`: `ZodOptional`<`ZodString`\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, { `description?`: `string` ; `url`: `string`  }, { `description?`: `string` ; `url`: `string`  }\>\> ; `info`: `ZodObject`<{ `contact`: `ZodOptional`<`ZodObject`<{ `email`: `ZodOptional`<`ZodString`\> ; `name`: `ZodOptional`<`ZodString`\> ; `url`: `ZodOptional`<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, { `email?`: `string` ; `name?`: `string` ; `url?`: `string`  }, { `email?`: `string` ; `name?`: `string` ; `url?`: `string`  }\>\> ; `description`: `ZodOptional`<`ZodString`\> ; `license`: `ZodOptional`<`ZodObject`<{ `name`: `ZodString` ; `url`: `ZodOptional`<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, { `name`: `string` ; `url?`: `string`  }, { `name`: `string` ; `url?`: `string`  }\>\> ; `termsOfService`: `ZodOptional`<`ZodString`\> ; `title`: `ZodString` ; `version`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, { `contact?`: { name?: string \| undefined; url?: string \| undefined; email?: string \| undefined; } ; `description?`: `string` ; `license?`: { name: string; url?: string \| undefined; } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  }, { `contact?`: { name?: string \| undefined; url?: string \| undefined; email?: string \| undefined; } ; `description?`: `string` ; `license?`: { name: string; url?: string \| undefined; } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  }\> = InfoObjectSchema; `path`: `ZodOptional`<`ZodString`\> ; `security`: `ZodOptional`<`ZodArray`<`ZodAny`, ``"many"``\>\> ; `servers`: `ZodOptional`<`ZodArray`<`ZodObject`<{ `description`: `ZodOptional`<`ZodString`\> ; `url`: `ZodString` ; `variables`: `ZodOptional`<`ZodAny`\>  }, ``"strip"``, `ZodTypeAny`, { `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }, { `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }\>, ``"many"``\>\> ; `tags`: `ZodOptional`<`ZodArray`<`ZodObject`<{ `description`: `ZodOptional`<`ZodString`\> ; `externalDocs`: `ZodOptional`<`ZodObject`<{ `description`: `ZodOptional`<`ZodString`\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, { `description?`: `string` ; `url`: `string`  }, { `description?`: `string` ; `url`: `string`  }\>\> ; `name`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, { `description?`: `string` ; `externalDocs?`: { url: string; description?: string \| undefined; } ; `name`: `string`  }, { `description?`: `string` ; `externalDocs?`: { url: string; description?: string \| undefined; } ; `name`: `string`  }\>, ``"many"``\>\>  }, ``"strip"``, `ZodTypeAny`, { `components?`: `any` ; `enabled?`: `boolean` ; `externalDocs?`: { url: string; description?: string \| undefined; } ; `info`: { title: string; version: string; description?: string \| undefined; termsOfService?: string \| undefined; contact?: { name?: string \| undefined; url?: string \| undefined; email?: string \| undefined; } \| undefined; license?: { ...; } \| undefined; } = InfoObjectSchema; `path?`: `string` ; `security?`: `any`[] ; `servers?`: { url: string; description?: string \| undefined; variables?: any; }[] ; `tags?`: { name: string; description?: string \| undefined; externalDocs?: { url: string; description?: string \| undefined; } \| undefined; }[]  }, { `components?`: `any` ; `enabled?`: `boolean` ; `externalDocs?`: { url: string; description?: string \| undefined; } ; `info`: { title: string; version: string; description?: string \| undefined; termsOfService?: string \| undefined; contact?: { name?: string \| undefined; url?: string \| undefined; email?: string \| undefined; } \| undefined; license?: { ...; } \| undefined; } = InfoObjectSchema; `path?`: `string` ; `security?`: `any`[] ; `servers?`: { url: string; description?: string \| undefined; variables?: any; }[] ; `tags?`: { name: string; description?: string \| undefined; externalDocs?: { url: string; description?: string \| undefined; } \| undefined; }[]  }\>\> ; `port`: `ZodNumber` ; `uploadDir`: `ZodOptional`<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, { `apiMountPath?`: `string` ; `compressOptions?`: `any` ; `cookieSecret?`: `string` ; `corsOptions?`: `any` ; `domain`: `string` ; `enableCompress?`: `boolean` ; `enableCors?`: `boolean` ; `enableHealthz?`: `boolean` ; `enableHelmet?`: `boolean` ; `fastify?`: `any` ; `helmetOptions?`: { enableCSPNonces?: boolean \| undefined; global?: boolean \| undefined; } ; `host?`: `string` ; `logLevel?`: ``"error"`` \| ``"debug"`` \| ``"fatal"`` \| ``"warn"`` \| ``"info"`` \| ``"trace"`` ; `openApi?`: { info: { title: string; version: string; description?: string \| undefined; termsOfService?: string \| undefined; contact?: { name?: string \| undefined; url?: string \| undefined; email?: string \| undefined; } \| undefined; license?: { ...; } \| undefined; }; ... 6 more ...; tags?: { ...; }[] \| undefined; } ; `port`: `number` ; `uploadDir?`: `string`  }, { `apiMountPath?`: `string` ; `compressOptions?`: `any` ; `cookieSecret?`: `string` ; `corsOptions?`: `any` ; `domain`: `string` ; `enableCompress?`: `boolean` ; `enableCors?`: `boolean` ; `enableHealthz?`: `boolean` ; `enableHelmet?`: `boolean` ; `fastify?`: `any` ; `helmetOptions?`: { enableCSPNonces?: boolean \| undefined; global?: boolean \| undefined; } ; `host?`: `string` ; `logLevel?`: ``"error"`` \| ``"debug"`` \| ``"fatal"`` \| ``"warn"`` \| ``"info"`` \| ``"trace"`` ; `openApi?`: { info: { title: string; version: string; description?: string \| undefined; termsOfService?: string \| undefined; contact?: { name?: string \| undefined; url?: string \| undefined; email?: string \| undefined; } \| undefined; license?: { ...; } \| undefined; }; ... 6 more ...; tags?: { ...; }[] \| undefined; } ; `port`: `number` ; `uploadDir?`: `string`  }\>

#### Defined in

[packages/httpserver/src/service/httpServer/v1/httpServerServiceConfig.ts:60](https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/httpServerServiceConfig.ts#L60)

___

### httpServerV1ServiceCommandsToRestApiInputPayloadSchema

• `Const` **httpServerV1ServiceCommandsToRestApiInputPayloadSchema**: `ZodUnknown`

#### Defined in

[packages/httpserver/src/service/httpServer/v1/subscription/serviceCommandsToRestApi/schema.ts:4](https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/subscription/serviceCommandsToRestApi/schema.ts#L4)
