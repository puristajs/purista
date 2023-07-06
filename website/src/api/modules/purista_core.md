[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/core

# Module: @purista/core

This is the main package of PURISTA.

A backend framework for building message based domain services.

This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.

It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, OpenApi documentation (swagger).

It contains the builders, classes & types and some helper functions.
For easier testing of commands and subscriptions, the package contains different mock creation helper based on [jest](https://jestjs.io) and [sinon](https://sinonjs.org)

Learn PURIST at [purista.dev](https://purista.dev)

## Table of contents

### Enumerations

- [EBMessageType](../enums/purista_core.EBMessageType.md)
- [EventBridgeEventNames](../enums/purista_core.EventBridgeEventNames.md)
- [PuristaSpanName](../enums/purista_core.PuristaSpanName.md)
- [PuristaSpanTag](../enums/purista_core.PuristaSpanTag.md)
- [StatusCode](../enums/purista_core.StatusCode.md)
- [StoreType](../enums/purista_core.StoreType.md)

### Classes

- [DefaultLogger](../classes/purista_core.DefaultLogger.md)
- [GenericEventEmitter](../classes/purista_core.GenericEventEmitter.md)
- [HandledError](../classes/purista_core.HandledError.md)
- [HttpClient](../classes/purista_core.HttpClient.md)
- [Logger](../classes/purista_core.Logger.md)
- [UnhandledError](../classes/purista_core.UnhandledError.md)

### Interfaces

- [IEmitter](../interfaces/purista_core.IEmitter.md)
- [ILogger](../interfaces/purista_core.ILogger.md)
- [OpenApiZodAny](../interfaces/purista_core.OpenApiZodAny.md)
- [RestClient](../interfaces/purista_core.RestClient.md)

### Type Aliases

- [AuthCredentials](purista_core.md#authcredentials)
- [BrokerHeaderCommandMsg](purista_core.md#brokerheadercommandmsg)
- [BrokerHeaderCommandResponseMsg](purista_core.md#brokerheadercommandresponsemsg)
- [BrokerHeaderCustomMsg](purista_core.md#brokerheadercustommsg)
- [Command](purista_core.md#command)
- [CommandDefinitionList](purista_core.md#commanddefinitionlist)
- [CommandDefinitionMetadataBase](purista_core.md#commanddefinitionmetadatabase)
- [Complete](purista_core.md#complete)
- [CompressionMethod](purista_core.md#compressionmethod)
- [ContentType](purista_core.md#contenttype)
- [ContextBase](purista_core.md#contextbase)
- [CorrelationId](purista_core.md#correlationid)
- [CustomMessage](purista_core.md#custommessage)
- [DefaultConfigStoreConfig](purista_core.md#defaultconfigstoreconfig)
- [DefaultEventBridgeConfig](purista_core.md#defaulteventbridgeconfig)
- [DefaultSecretStoreConfig](purista_core.md#defaultsecretstoreconfig)
- [DefaultStateStoreConfig](purista_core.md#defaultstatestoreconfig)
- [DefinitionEventBridgeConfig](purista_core.md#definitioneventbridgeconfig)
- [EBMessage](purista_core.md#ebmessage)
- [EBMessageAddress](purista_core.md#ebmessageaddress)
- [EBMessageBase](purista_core.md#ebmessagebase)
- [EBMessageId](purista_core.md#ebmessageid)
- [EBMessageSenderAddress](purista_core.md#ebmessagesenderaddress)
- [EmitCustomMessageFunction](purista_core.md#emitcustommessagefunction)
- [ErrorResponsePayload](purista_core.md#errorresponsepayload)
- [EventBridgeAdapterEvents](purista_core.md#eventbridgeadapterevents)
- [EventBridgeConfig](purista_core.md#eventbridgeconfig)
- [EventBridgeCustomEvents](purista_core.md#eventbridgecustomevents)
- [EventBridgeEvents](purista_core.md#eventbridgeevents)
- [EventKey](purista_core.md#eventkey)
- [EventMap](purista_core.md#eventmap)
- [HttpClientConfig](purista_core.md#httpclientconfig)
- [HttpClientRequestOptions](purista_core.md#httpclientrequestoptions)
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
- [InvokeFunction](purista_core.md#invokefunction)
- [LogFnParamType](purista_core.md#logfnparamtype)
- [LogLevelName](purista_core.md#loglevelname)
- [LoggerOptions](purista_core.md#loggeroptions)
- [LoggerStubs](purista_core.md#loggerstubs)
- [Newable](purista_core.md#newable)
- [PendigInvocation](purista_core.md#pendiginvocation)
- [Prettify](purista_core.md#prettify)
- [PrincipalId](purista_core.md#principalid)
- [QueryParameter](purista_core.md#queryparameter)
- [ServiceEvents](purista_core.md#serviceevents)
- [ServiceInfoType](purista_core.md#serviceinfotype)
- [ShutdownEntry](purista_core.md#shutdownentry)
- [StoreBaseConfig](purista_core.md#storebaseconfig)
- [SubscriptionDefinitionList](purista_core.md#subscriptiondefinitionlist)
- [SubscriptionDefinitionMetadataBase](purista_core.md#subscriptiondefinitionmetadatabase)
- [SubscriptionStorageEntry](purista_core.md#subscriptionstorageentry)
- [SupportedHttpMethod](purista_core.md#supportedhttpmethod)
- [TraceId](purista_core.md#traceid)
- [addPrefixToObject](purista_core.md#addprefixtoobject)

### Variables

- [MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION](purista_core.md#min_content_size_for_compression)
- [ServiceInfoValidator](purista_core.md#serviceinfovalidator)
- [infoMessageTypes](purista_core.md#infomessagetypes)
- [puristaVersion](purista_core.md#puristaversion)

### Functions

- [extendApi](purista_core.md#extendapi)
- [generateSchema](purista_core.md#generateschema)
- [getCommandFunctionWithValidation](purista_core.md#getcommandfunctionwithvalidation)
- [getDefaultEventBridgeConfig](purista_core.md#getdefaulteventbridgeconfig)
- [getDefaultLogLevel](purista_core.md#getdefaultloglevel)
- [getNewSubscriptionStorageEntry](purista_core.md#getnewsubscriptionstorageentry)
- [getSubscriptionFunctionWithValidation](purista_core.md#getsubscriptionfunctionwithvalidation)
- [getTimeoutPromise](purista_core.md#gettimeoutpromise)
- [initDefaultConfigStore](purista_core.md#initdefaultconfigstore)
- [initDefaultSecretStore](purista_core.md#initdefaultsecretstore)
- [initDefaultStateStore](purista_core.md#initdefaultstatestore)
- [initLogger](purista_core.md#initlogger)
- [isCustomMessage](purista_core.md#iscustommessage)
- [isHttpExposedServiceMeta](purista_core.md#ishttpexposedservicemeta)
- [isInfoMessage](purista_core.md#isinfomessage)
- [isInfoServiceFunctionAdded](purista_core.md#isinfoservicefunctionadded)
- [isMessageMatchingSubscription](purista_core.md#ismessagematchingsubscription)
- [throwIfNotValidMessage](purista_core.md#throwifnotvalidmessage)

### Command

- [CommandDefinitionBuilder](../classes/purista_core.CommandDefinitionBuilder.md)
- [CommandAfterGuardHook](purista_core.md#commandafterguardhook)
- [CommandBeforeGuardHook](purista_core.md#commandbeforeguardhook)
- [CommandDefinition](purista_core.md#commanddefinition)
- [CommandErrorResponse](purista_core.md#commanderrorresponse)
- [CommandFunction](purista_core.md#commandfunction)
- [CommandFunctionContext](purista_core.md#commandfunctioncontext)
- [CommandFunctionContextEnhancements](purista_core.md#commandfunctioncontextenhancements)
- [CommandResponse](purista_core.md#commandresponse)
- [CommandSuccessResponse](purista_core.md#commandsuccessresponse)
- [CommandTransformFunctionContext](purista_core.md#commandtransformfunctioncontext)
- [CommandTransformInputHook](purista_core.md#commandtransforminputhook)
- [CommandTransformOutputHook](purista_core.md#commandtransformoutputhook)
- [isCommand](purista_core.md#iscommand)
- [isCommandErrorResponse](purista_core.md#iscommanderrorresponse)
- [isCommandResponse](purista_core.md#iscommandresponse)
- [isCommandSuccessResponse](purista_core.md#iscommandsuccessresponse)

### Event bridge

- [DefaultEventBridge](../classes/purista_core.DefaultEventBridge.md)
- [EventBridgeBaseClass](../classes/purista_core.EventBridgeBaseClass.md)
- [EventBridge](../interfaces/purista_core.EventBridge.md)
- [EventBridgeEventsBasic](purista_core.md#eventbridgeeventsbasic)
- [getCommandQueueName](purista_core.md#getcommandqueuename)

### Helper

- [convertToCamelCase](purista_core.md#converttocamelcase)
- [convertToKebabCase](purista_core.md#converttokebabcase)
- [convertToPascalCase](purista_core.md#converttopascalcase)
- [convertToSnakeCase](purista_core.md#converttosnakecase)
- [createErrorResponse](purista_core.md#createerrorresponse)
- [createInfoMessage](purista_core.md#createinfomessage)
- [createSuccessResponse](purista_core.md#createsuccessresponse)
- [deserializeOtp](purista_core.md#deserializeotp)
- [getCleanedMessage](purista_core.md#getcleanedmessage)
- [getErrorMessageForCode](purista_core.md#geterrormessageforcode)
- [getNewCorrelationId](purista_core.md#getnewcorrelationid)
- [getNewEBMessageId](purista_core.md#getnewebmessageid)
- [getNewInstanceId](purista_core.md#getnewinstanceid)
- [getNewTraceId](purista_core.md#getnewtraceid)
- [getSubscriptionQueueName](purista_core.md#getsubscriptionqueuename)
- [getUniqueId](purista_core.md#getuniqueid)
- [gracefulShutdown](purista_core.md#gracefulshutdown)
- [isDevelop](purista_core.md#isdevelop)
- [serializeOtp](purista_core.md#serializeotp)

### Service

- [ServiceEventsNames](../enums/purista_core.ServiceEventsNames.md)
- [Service](../classes/purista_core.Service.md)
- [ServiceBuilder](../classes/purista_core.ServiceBuilder.md)
- [ServiceClass](../interfaces/purista_core.ServiceClass.md)
- [ServiceConstructorInput](purista_core.md#serviceconstructorinput)
- [ServiceEventsInternal](purista_core.md#serviceeventsinternal)

### Store

- [ConfigStoreBaseClass](../classes/purista_core.ConfigStoreBaseClass.md)
- [DefaultConfigStore](../classes/purista_core.DefaultConfigStore.md)
- [DefaultSecretStore](../classes/purista_core.DefaultSecretStore.md)
- [DefaultStateStore](../classes/purista_core.DefaultStateStore.md)
- [SecretStoreBaseClass](../classes/purista_core.SecretStoreBaseClass.md)
- [StateStoreBaseClass](../classes/purista_core.StateStoreBaseClass.md)
- [ConfigStore](../interfaces/purista_core.ConfigStore.md)
- [SecretStore](../interfaces/purista_core.SecretStore.md)
- [StateStore](../interfaces/purista_core.StateStore.md)
- [ConfigDeleteFunction](purista_core.md#configdeletefunction)
- [ConfigGetterFunction](purista_core.md#configgetterfunction)
- [ConfigSetterFunction](purista_core.md#configsetterfunction)
- [SecretDeleteFunction](purista_core.md#secretdeletefunction)
- [SecretGetterFunction](purista_core.md#secretgetterfunction)
- [SecretSetterFunction](purista_core.md#secretsetterfunction)
- [StateDeleteFunction](purista_core.md#statedeletefunction)
- [StateGetterFunction](purista_core.md#stategetterfunction)
- [StateSetterFunction](purista_core.md#statesetterfunction)

### Subscription

- [SubscriptionDefinitionBuilder](../classes/purista_core.SubscriptionDefinitionBuilder.md)
- [Subscription](purista_core.md#subscription)
- [SubscriptionAfterGuardHook](purista_core.md#subscriptionafterguardhook)
- [SubscriptionBeforeGuardHook](purista_core.md#subscriptionbeforeguardhook)
- [SubscriptionDefinition](purista_core.md#subscriptiondefinition)
- [SubscriptionFunction](purista_core.md#subscriptionfunction)
- [SubscriptionFunctionContext](purista_core.md#subscriptionfunctioncontext)
- [SubscriptionFunctionContextEnhancements](purista_core.md#subscriptionfunctioncontextenhancements)
- [SubscriptionTransformFunctionContext](purista_core.md#subscriptiontransformfunctioncontext)
- [SubscriptionTransformInputHook](purista_core.md#subscriptiontransforminputhook)
- [SubscriptionTransformOutputHook](purista_core.md#subscriptiontransformoutputhook)

### Unit test helper

- [getCommandContextMock](purista_core.md#getcommandcontextmock)
- [getCommandErrorMessageMock](purista_core.md#getcommanderrormessagemock)
- [getCommandMessageMock](purista_core.md#getcommandmessagemock)
- [getCommandSuccessMessageMock](purista_core.md#getcommandsuccessmessagemock)
- [getCommandTransformContextMock](purista_core.md#getcommandtransformcontextmock)
- [getCustomMessageMessageMock](purista_core.md#getcustommessagemessagemock)
- [getEventBridgeMock](purista_core.md#geteventbridgemock)
- [getLoggerMock](purista_core.md#getloggermock)
- [getSubscriptionContextMock](purista_core.md#getsubscriptioncontextmock)
- [getSubscriptionTransformContextMock](purista_core.md#getsubscriptiontransformcontextmock)

## Type Aliases

### AuthCredentials

Ƭ **AuthCredentials**: `Object`

HTTP authentication information

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `basicAuth?` | { `password`: `string` ; `username`: `string`  } | Basic-Auth information |
| `basicAuth.password` | `string` | Basic-Auth password |
| `basicAuth.username` | `string` | Basic-Auth username |
| `bearerToken?` | `string` | Bearer token header |

#### Defined in

[HttpClient/types/AuthCredentials.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/AuthCredentials.ts#L4)

___

### BrokerHeaderCommandMsg

Ƭ **BrokerHeaderCommandMsg**: [`Prettify`](purista_core.md#prettify)<[`BrokerHeaderCustomMsg`](purista_core.md#brokerheadercustommsg) & { `receiverInstanceId?`: [`InstanceId`](purista_core.md#instanceid) ; `receiverServiceName`: `string` ; `receiverServiceTarget`: `string` ; `receiverServiceVersion`: `string`  }\>

#### Defined in

[core/types/BrokerHeaderCommandMsg.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/BrokerHeaderCommandMsg.ts#L5)

___

### BrokerHeaderCommandResponseMsg

Ƭ **BrokerHeaderCommandResponseMsg**: [`Prettify`](purista_core.md#prettify)<[`BrokerHeaderCommandMsg`](purista_core.md#brokerheadercommandmsg) & { `receiverInstanceId`: [`InstanceId`](purista_core.md#instanceid)  }\>

#### Defined in

[core/types/BrokerHeaderCommandResponseMsg.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/BrokerHeaderCommandResponseMsg.ts#L5)

___

### BrokerHeaderCustomMsg

Ƭ **BrokerHeaderCustomMsg**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |
| `messageType` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) |
| `principalId?` | `string` |
| `senderInstanceId` | [`InstanceId`](purista_core.md#instanceid) |
| `senderServiceName` | `string` |
| `senderServiceTarget` | `string` |
| `senderServiceVersion` | `string` |

#### Defined in

[core/types/BrokerHeaderCustomMsg.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/BrokerHeaderCustomMsg.ts#L4)

___

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: [`Prettify`](purista_core.md#prettify)<{ `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `payload`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)\>

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

[core/types/commandType/Command.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/Command.ts#L18)

___

### CommandDefinitionList

Ƭ **CommandDefinitionList**<`ServiceClassType`\>: [`CommandDefinition`](purista_core.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](purista_core.md#commanddefinitionmetadatabase), `any`, `any`, `any`, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |

#### Defined in

[core/types/commandType/CommandDefinitionList.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinitionList.ts#L12)

___

### CommandDefinitionMetadataBase

Ƭ **CommandDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_core.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_core.md#contenttype) ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_core.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_core.md#contenttype) |
| `expose.deprecated?` | `boolean` |
| `expose.inputPayload?` | `SchemaObject` |
| `expose.outputPayload?` | `SchemaObject` |
| `expose.parameter?` | `SchemaObject` |

#### Defined in

[core/types/commandType/CommandDefinitionMetadataBase.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinitionMetadataBase.ts#L5)

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

[core/types/Complete.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Complete.ts#L20)

___

### CompressionMethod

Ƭ **CompressionMethod**: ``"gzip"`` \| ``"deflat"`` \| ``"br"`` \| `undefined`

#### Defined in

[core/HttpServer/types/CompressionMethod.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/HttpServer/types/CompressionMethod.ts#L1)

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| ``"text/xml"`` \| `string`

List of content types for message payloads.
If the content type is other than `application/json`, the message payload must be a string.
It is up to the implementation to extract the content type from the original message and to convert or transform data.

#### Defined in

[core/types/ContentType.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ContentType.ts#L6)

___

### ContextBase

Ƭ **ContextBase**: `Object`

The ContextBase provides is a basic type.
Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `configs` | { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } | the config store |
| `configs.getConfig` | [`ConfigGetterFunction`](purista_core.md#configgetterfunction) | get a config value from the config store |
| `configs.removeConfig` | [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) | delete a config value from the config store |
| `configs.setConfig` | [`ConfigSetterFunction`](purista_core.md#configsetterfunction) | set a config value in the config store |
| `logger` | [`Logger`](../classes/purista_core.Logger.md) | the logger instance |
| `secrets` | { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } | the secret store |
| `secrets.getSecret` | [`SecretGetterFunction`](purista_core.md#secretgetterfunction) | get a secret from the secret store |
| `secrets.removeSecret` | [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) | delete a secret from the secret store |
| `secrets.setSecret` | [`SecretSetterFunction`](purista_core.md#secretsetterfunction) | set a secret in the secret store |
| `startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `Context` \| `undefined`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> | wrap given function in an opentelemetry active span |
| `states` | { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } | the state store |
| `states.getState` | [`StateGetterFunction`](purista_core.md#stategetterfunction) | get a state value from the state store |
| `states.removeState` | [`StateDeleteFunction`](purista_core.md#statedeletefunction) | delete a state value from the state store |
| `states.setState` | [`StateSetterFunction`](purista_core.md#statesetterfunction) | set a state value in the state store |
| `wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> | wrap given function in an opentelemetry span |

#### Defined in

[core/types/ContextBase.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L12)

___

### CorrelationId

Ƭ **CorrelationId**: `string`

the correlation id links the command invocation message with the command response message

#### Defined in

[core/types/CorrelationId.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/CorrelationId.ts#L2)

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: [`Prettify`](purista_core.md#prettify)<{ `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)\>

A custom message is a message which can be used to pass business information.
The producer emits the message without knowledge about any consumer.
The producer does not expect a response from a consumer.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Defined in

[core/types/CustomMessage.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/CustomMessage.ts#L11)

___

### DefaultConfigStoreConfig

Ƭ **DefaultConfigStoreConfig**: `Record`<`string`, `unknown`\>

#### Defined in

[DefaultConfigStore/types/DefaultConfigStoreConfig.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/types/DefaultConfigStoreConfig.ts#L1)

___

### DefaultEventBridgeConfig

Ƭ **DefaultEventBridgeConfig**: `Object`

The configuration for the DefaultEventBridge.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitMessagesAsEventBridgeEvents?` | `boolean` | Emit messages which have an event name set as javascript events on the event bridge instance |
| `logWarnOnMessagesWithoutReceiver?` | `boolean` | Log warnings on messages which are emitted, but could not delivered to at least one receiver |

#### Defined in

[DefaultEventBridge/types/DefaultEventBridgeConfig.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/types/DefaultEventBridgeConfig.ts#L4)

___

### DefaultSecretStoreConfig

Ƭ **DefaultSecretStoreConfig**: `Record`<`string`, `unknown`\>

#### Defined in

[DefaultSecretStore/types/DefaultSecretStoreConfig.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/types/DefaultSecretStoreConfig.ts#L1)

___

### DefaultStateStoreConfig

Ƭ **DefaultStateStoreConfig**: `Record`<`string`, `unknown`\>

#### Defined in

[DefaultStateStore/types/DefaultStateStoreConfig.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/types/DefaultStateStoreConfig.ts#L1)

___

### DefinitionEventBridgeConfig

Ƭ **DefinitionEventBridgeConfig**: `Object`

Settings and advices for the event bridge, which are set in the command or subscription builder.
The properties are advices and hints.
It depends on the used event bridge implementation and underlaying message broker, if a specific property can be respected.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoacknowledge` | `boolean` | Send the acknowledge to message broker as soon as the message arrives - defaults to true for commands - defaults to false for subscriptions |
| `durable` | `boolean` | Advise the underlaying message broker to store messages if no consumer is available. Messages will be send as soon as the service is able to consume. |
| `shared` | `boolean` | If set to true, the event bridge is adviced to deliver one message to at least one consumer instance. True is the default value. If set to false, the event bridge is adviced to deliver one message to all consumer instances. Use case: Receiving Info of message, which need to be passed to all instance to keep information in sync. In serverless environments, this flag should not have any effect **`Default`** ```ts true ``` |

#### Defined in

[core/types/DefinitionEventBridgeConfig.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConfig.ts#L6)

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_core.md#command) \| [`CommandResponse`](purista_core.md#commandresponse) \| [`InfoMessage`](purista_core.md#infomessage) \| [`CustomMessage`](purista_core.md#custommessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

[core/types/EBMessage.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/EBMessage.ts#L8)

___

### EBMessageAddress

Ƭ **EBMessageAddress**: `Object`

A event bridge message address describes the sender or receiver of a message.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `instanceId?` | [`InstanceId`](purista_core.md#instanceid) | instance id of eventbridge |
| `serviceName` | `string` | the name of the service |
| `serviceTarget` | `string` | the name of the command or subscription |
| `serviceVersion` | `string` | the version of the service |

#### Defined in

[core/types/EBMessageAddress.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/EBMessageAddress.ts#L6)

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

Default fields which are part of any purista message

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `contentEncoding` | `string` | content encoding of message payload |
| `contentType` | [`ContentType`](purista_core.md#contenttype) | content type of message payload |
| `correlationId?` | [`CorrelationId`](purista_core.md#correlationid) | correlation id to know which command response referrs to which command |
| `eventName?` | `string` | event name for this message |
| `id` | [`EBMessageId`](purista_core.md#ebmessageid) | global unique id of message |
| `otp?` | `string` | stringified Opentelemetry parent trace id |
| `principalId?` | [`PrincipalId`](purista_core.md#principalid) | principal id |
| `sender` | [`EBMessageSenderAddress`](purista_core.md#ebmessagesenderaddress) | - |
| `timestamp` | `number` | timestamp of message creation time |
| `traceId?` | [`TraceId`](purista_core.md#traceid) | trace id of message |

#### Defined in

[core/types/EBMessageBase.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/EBMessageBase.ts#L11)

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

[core/types/EBMessageId.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/EBMessageId.ts#L4)

___

### EBMessageSenderAddress

Ƭ **EBMessageSenderAddress**: [`Prettify`](purista_core.md#prettify)<`Omit`<[`EBMessageAddress`](purista_core.md#ebmessageaddress), ``"instanceId"``\> & `Required`<`Pick`<[`EBMessageAddress`](purista_core.md#ebmessageaddress), ``"instanceId"``\>\>\>

A event bridge message address describes the sender or receiver of a message.

#### Defined in

[core/types/EBMessageSenderAddress.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/EBMessageSenderAddress.ts#L7)

___

### EmitCustomMessageFunction

Ƭ **EmitCustomMessageFunction**: <Payload\>(`eventName`: `string`, `payload?`: `Payload`, `contentType?`: [`ContentType`](purista_core.md#contenttype), `contentEncoding?`: `string`) => `Promise`<`void`\>

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
| `contentType?` | [`ContentType`](purista_core.md#contenttype) |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/types/EmitCustomMessageFunction.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/EmitCustomMessageFunction.ts#L10)

___

### ErrorResponsePayload

Ƭ **ErrorResponsePayload**: `Object`

Error message payload

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | addition data |
| `message` | `string` | a human readable error message |
| `status` | [`StatusCode`](../enums/purista_core.StatusCode.md) | the error status code |
| `traceId?` | [`TraceId`](purista_core.md#traceid) | the trace if of the request |

#### Defined in

[core/types/ErrorResponsePayload.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ErrorResponsePayload.ts#L7)

___

### EventBridgeAdapterEvents

Ƭ **EventBridgeAdapterEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[core/EventBridge/types/EventBridgeEvents.ts:42](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L42)

___

### EventBridgeConfig

Ƭ **EventBridgeConfig**<`CustomConfig`\>: [`Prettify`](purista_core.md#prettify)<{ `defaultCommandTimeout?`: `number` ; `instanceId?`: `string` ; `logLevel?`: [`LogLevelName`](purista_core.md#loglevelname) ; `logger?`: [`Logger`](../classes/purista_core.Logger.md) ; `spanProcessor?`: `SpanProcessor`  } & `CustomConfig`\>

The config object for an event bridge.
Every event bridge implementation must use this type for configuration.

#### Type parameters

| Name |
| :------ |
| `CustomConfig` |

#### Defined in

[core/EventBridge/types/EventBridgeConfig.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeConfig.ts#L10)

___

### EventBridgeCustomEvents

Ƭ **EventBridgeCustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[core/EventBridge/types/EventBridgeEvents.ts:37](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L37)

___

### EventBridgeEvents

Ƭ **EventBridgeEvents**: [`Prettify`](purista_core.md#prettify)<[`EventBridgeEventsBasic`](purista_core.md#eventbridgeeventsbasic) & [`addPrefixToObject`](purista_core.md#addprefixtoobject)<[`EventBridgeAdapterEvents`](purista_core.md#eventbridgeadapterevents), ``"adapter-"``\> & [`addPrefixToObject`](purista_core.md#addprefixtoobject)<[`EventBridgeCustomEvents`](purista_core.md#eventbridgecustomevents), ``"custom-"``\>\>

#### Defined in

[core/EventBridge/types/EventBridgeEvents.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L47)

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_core.md#eventmap) |

#### Defined in

[core/types/GenericEventEmitter.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L5)

___

### EventMap

Ƭ **EventMap**: `Record`<`string`, `any`\>

#### Defined in

[core/types/GenericEventEmitter.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L3)

___

### HttpClientConfig

Ƭ **HttpClientConfig**<`CustomConfig`\>: [`Prettify`](purista_core.md#prettify)<{ `baseUrl`: `string` ; `basicAuth?`: { `password`: `string` ; `username`: `string`  } ; `bearerToken?`: `string` ; `defaultHeaders?`: `Record`<`string`, `string`\> ; `defaultTimeout?`: `number` ; `enableOpentelemetry?`: `boolean` ; `isKeepAlive?`: `boolean` ; `logLevel?`: [`LogLevelName`](purista_core.md#loglevelname) ; `logger?`: [`Logger`](../classes/purista_core.Logger.md) ; `name?`: `string` ; `spanProcessor?`: `SpanProcessor`  } & `CustomConfig`\>

Tha basic configuration for a HTTPClient
Requires as least a `baseUrl`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends `Record`<`string`, `unknown`\> |

#### Defined in

[HttpClient/types/HttpClientConfig.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/HttpClientConfig.ts#L9)

___

### HttpClientRequestOptions

Ƭ **HttpClientRequestOptions**: `Object`

Options for a single request

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `hash?` | `string` | url hash @example: http://example.com/index.html#hash |
| `headers?` | `Record`<`string`, `string`\> | additional headers |
| `query?` | `Record`<`string`, `string`\> | query/search string parameter |
| `timeout?` | `number` | Timeout for the request in ms **`Default`** ```ts 30000 ``` |

#### Defined in

[HttpClient/types/HttpClientRequestOptions.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpClient/types/HttpClientRequestOptions.ts#L4)

___

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**<`ParameterType`\>: [`Prettify`](purista_core.md#prettify)<[`CommandDefinitionMetadataBase`](purista_core.md#commanddefinitionmetadatabase) & { `expose`: { `http`: { `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)<`ParameterType`\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  }  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParameterType` | {} |

#### Defined in

[core/HttpServer/types/HttpExposedServiceMeta.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/HttpServer/types/HttpExposedServiceMeta.ts#L4)

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](../enums/purista_core.EBMessageType.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/types/infoType/InfoInvokeTimeout.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoInvokeTimeout.ts#L22)

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

[core/types/infoType/InfoInvokeTimeout.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoInvokeTimeout.ts#L6)

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_core.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_core.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_core.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_core.md#infoservicenotready) \| [`InfoServiceReady`](purista_core.md#infoserviceready) \| [`InfoServiceShutdown`](purista_core.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_core.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_core.md#infosubscriptionerror)

#### Defined in

[core/types/infoType/InfoMessage.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoMessage.ts#L11)

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](../enums/purista_core.EBMessageType.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](../enums/purista_core.EBMessageType.md#infoservicefunctionadded) \| [`InfoServiceInit`](../enums/purista_core.EBMessageType.md#infoserviceinit) \| [`InfoServiceNotReady`](../enums/purista_core.EBMessageType.md#infoservicenotready) \| [`InfoServiceReady`](../enums/purista_core.EBMessageType.md#infoserviceready) \| [`InfoServiceShutdown`](../enums/purista_core.EBMessageType.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](../enums/purista_core.EBMessageType.md#infoinvoketimeout) \| [`InfoSubscriptionError`](../enums/purista_core.EBMessageType.md#infosubscriptionerror)

#### Defined in

[core/types/infoType/InfoMessage.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoMessage.ts#L21)

___

### InfoServiceBase

Ƭ **InfoServiceBase**: [`Prettify`](purista_core.md#prettify)<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `payload?`: `unknown`  } & [`EBMessageBase`](purista_core.md#ebmessagebase)\>

#### Defined in

[core/types/infoType/InfoServiceBase.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceBase.ts#L4)

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoServiceDrain`](../enums/purista_core.EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoServiceDrain.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceDrain.ts#L5)

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoServiceFunctionAdded`](../enums/purista_core.EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoServiceFunctionAdded.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceFunctionAdded.ts#L5)

___

### InfoServiceInit

Ƭ **InfoServiceInit**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoServiceInit`](../enums/purista_core.EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoServiceInit.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceInit.ts#L5)

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoServiceNotReady`](../enums/purista_core.EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoServiceNotReady.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceNotReady.ts#L5)

___

### InfoServiceReady

Ƭ **InfoServiceReady**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoServiceReady`](../enums/purista_core.EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoServiceReady.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceReady.ts#L5)

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoServiceShutdown`](../enums/purista_core.EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoServiceShutdown.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoServiceShutdown.ts#L5)

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: [`Prettify`](purista_core.md#prettify)<{ `messageType`: [`InfoSubscriptionError`](../enums/purista_core.EBMessageType.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)\>

#### Defined in

[core/types/infoType/InfoSubscriptionError.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoSubscriptionError.ts#L5)

___

### InstanceId

Ƭ **InstanceId**: `string`

the instance id of the event bridge

#### Defined in

[core/types/InstanceId.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/InstanceId.ts#L2)

___

### InvokeFunction

Ƭ **InvokeFunction**: <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_core.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\>

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
| `address` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |
| `payload` | `PayloadType` |
| `parameter` | `ParameterType` |

##### Returns

`Promise`<`InvokeResponseType`\>

#### Defined in

[core/types/InvokeFunction.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/InvokeFunction.ts#L21)

___

### LogFnParamType

Ƭ **LogFnParamType**: [`unknown`, string?, ...any] \| [`string`, ...any]

#### Defined in

[core/types/Logger.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L17)

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"``

#### Defined in

[core/types/LogLevelName.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/LogLevelName.ts#L1)

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hostname?` | `string` |
| `instanceId?` | [`InstanceId`](purista_core.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_core.md#principalid) |
| `puristaVersion?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/types/Logger.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Logger.ts#L5)

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

[mocks/getLogger.mock.ts:41](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getLogger.mock.ts#L41)

___

### Newable

Ƭ **Newable**<`T`, `ConfigType`\>: (`config`: [`ServiceConstructorInput`](purista_core.md#serviceconstructorinput)<`ConfigType`\>) => `T`

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
| `config` | [`ServiceConstructorInput`](purista_core.md#serviceconstructorinput)<`ConfigType`\> |

##### Returns

`T`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L28)

___

### PendigInvocation

Ƭ **PendigInvocation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reject` | (`error`: [`HandledError`](../classes/purista_core.HandledError.md) \| [`UnhandledError`](../classes/purista_core.UnhandledError.md)) => `void` |
| `resolve` | (`responsePayload`: `unknown`) => `void` |

#### Defined in

[DefaultEventBridge/types/PendingInvocations.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/types/PendingInvocations.ts#L3)

___

### Prettify

Ƭ **Prettify**<`T`\>: { [K in keyof T]: T[K] } & {}

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[core/types/Prettify.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/Prettify.ts#L1)

___

### PrincipalId

Ƭ **PrincipalId**: `string`

the principal id

#### Defined in

[core/types/PrincipalId.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/PrincipalId.ts#L2)

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

[core/HttpServer/types/QueryParameter.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/HttpServer/types/QueryParameter.ts#L1)

___

### ServiceEvents

Ƭ **ServiceEvents**: [`ServiceEventsInternal`](purista_core.md#serviceeventsinternal) & [`addPrefixToObject`](purista_core.md#addprefixtoobject)<`CustomEvents`, ``"custom-"``\> & [`addPrefixToObject`](purista_core.md#addprefixtoobject)<`CustomEvents`, ``"misc-"``\>

ServiceEvents are plain javascript events sent by the service.
There are three types:
- technical events when a services starts, stops, an error occurs and so on are prefixed with `service-`
- response messages, which have a event name assigned, are prefixed with `custom-`
- additional events, free defined by developer are prefixed with `misc-`

#### Defined in

[core/types/ServiceEvents.ts:98](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L98)

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

[core/types/infoType/ServiceInfoType.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/ServiceInfoType.ts#L4)

___

### ShutdownEntry

Ƭ **ShutdownEntry**: `Object`

Entry of thing you like to shutdown gracefully

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `destroy` | () => `Promise`<`void`\> | a async function that is called during shutdown |
| `name` | `string` | the name |

#### Defined in

[helper/types/ShutdownEntry.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/types/ShutdownEntry.ts#L4)

___

### StoreBaseConfig

Ƭ **StoreBaseConfig**<`Config`\>: [`Prettify`](purista_core.md#prettify)<{ `enableGet?`: `boolean` ; `enableRemove?`: `boolean` ; `enableSet?`: `boolean` ; `logLevel?`: [`LogLevelName`](purista_core.md#loglevelname) ; `logger?`: [`Logger`](../classes/purista_core.Logger.md)  } & `Config`\>

Basic configuration object which is used by any store

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Config` | extends `Record`<`string`, `unknown`\> |

#### Defined in

[core/types/StoreBaseConfig.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/StoreBaseConfig.ts#L8)

___

### SubscriptionDefinitionList

Ƭ **SubscriptionDefinitionList**<`ServiceClassType`\>: [`SubscriptionDefinition`](purista_core.md#subscriptiondefinition)<`ServiceClassType`, `any`, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |

#### Defined in

[core/types/subscription/SubscriptionDefinitionList.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinitionList.ts#L11)

___

### SubscriptionDefinitionMetadataBase

Ƭ **SubscriptionDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_core.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_core.md#contenttype) ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_core.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_core.md#contenttype) |
| `expose.inputPayload?` | `SchemaObject` |
| `expose.outputPayload?` | `SchemaObject` |
| `expose.parameter?` | `SchemaObject` |

#### Defined in

[core/types/subscription/SubscriptionDefinitionMetadataBase.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinitionMetadataBase.ts#L5)

___

### SubscriptionStorageEntry

Ƭ **SubscriptionStorageEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cb` | (`message`: [`EBMessage`](purista_core.md#ebmessage)) => `Promise`<`Omit`<[`CustomMessage`](purista_core.md#custommessage), ``"id"`` \| ``"timestamp"``\> \| `undefined`\> |
| `emitEventName?` | `string` |
| `isMatchingEventName` | (`input?`: `string`) => `boolean` |
| `isMatchingMessageType` | (`input`: [`EBMessageType`](../enums/purista_core.EBMessageType.md)) => `boolean` |
| `isMatchingPrincipalId` | (`input?`: `string`) => `boolean` |
| `isMatchingReceiverInstanceId` | (`input?`: `string`) => `boolean` |
| `isMatchingReceiverServiceName` | (`input?`: `string`) => `boolean` |
| `isMatchingReceiverServiceTarget` | (`input?`: `string`) => `boolean` |
| `isMatchingReceiverServiceVersion` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderInstanceId` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderServiceName` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderServiceTarget` | (`input?`: `string`) => `boolean` |
| `isMatchingSenderServiceVersion` | (`input?`: `string`) => `boolean` |

#### Defined in

[DefaultEventBridge/types/SubscriptionStorageEntry.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/types/SubscriptionStorageEntry.ts#L3)

___

### SupportedHttpMethod

Ƭ **SupportedHttpMethod**: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"``

Supported HTTP-Methods for defining endpoints

#### Defined in

[core/HttpServer/types/SupportedHttpMethod.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/HttpServer/types/SupportedHttpMethod.ts#L2)

___

### TraceId

Ƭ **TraceId**: `string`

The trace id which will be passed through all commands, invocations and subscriptions

#### Defined in

[core/types/TraceId.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/TraceId.ts#L4)

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

[core/types/addPrefixToObject.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/addPrefixToObject.ts#L7)

## Variables

### MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION

• `Const` **MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION**: ``1024``

#### Defined in

[core/HttpServer/MinContentSizeForCompression.const.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/HttpServer/MinContentSizeForCompression.const.ts#L1)

___

### ServiceInfoValidator

• `Const` **ServiceInfoValidator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `set` | (`obj`: [`ServiceInfoType`](purista_core.md#serviceinfotype), `prop`: keyof [`ServiceInfoType`](purista_core.md#serviceinfotype), `value`: `string`) => `boolean` |

#### Defined in

[core/Service/ServiceInfoValidator.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceInfoValidator.impl.ts#L5)

___

### infoMessageTypes

• `Const` **infoMessageTypes**: [`EBMessageType`](../enums/purista_core.EBMessageType.md)[]

#### Defined in

[core/types/infoType/InfoMessage.ts:30](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/InfoMessage.ts#L30)

___

### puristaVersion

• `Const` **puristaVersion**: ``"1.7.4"``

#### Defined in

[version.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/version.ts#L1)

## Functions

### extendApi

▸ **extendApi**<`T`\>(`schema`, `SchemaObject?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`OpenApiZodAny`](../interfaces/purista_core.OpenApiZodAny.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `T` |
| `SchemaObject` | `SchemaObject` |

#### Returns

`T`

#### Defined in

[zodOpenApi/zodOpenApi.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/zodOpenApi/zodOpenApi.impl.ts#L25)

___

### generateSchema

▸ **generateSchema**(`zodRef`, `useOutput?`): `SchemaObject`

#### Parameters

| Name | Type |
| :------ | :------ |
| `zodRef` | [`OpenApiZodAny`](../interfaces/purista_core.OpenApiZodAny.md) |
| `useOutput?` | `boolean` |

#### Returns

`SchemaObject`

#### Defined in

[zodOpenApi/zodOpenApi.impl.ts:414](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/zodOpenApi/zodOpenApi.impl.ts#L414)

___

### getCommandFunctionWithValidation

▸ **getCommandFunctionWithValidation**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards?`): [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> |
| `inputPayloadSchema` | `undefined` \| `ZodType`<`FunctionPayloadType`, `ZodTypeDef`, `MessagePayloadType`\> |
| `inputParameterSchema` | `undefined` \| `ZodType`<`FunctionParamsType`, `ZodTypeDef`, `MessageParamsType`\> |
| `outputPayloadSchema` | `undefined` \| `ZodType`<`MessageResultType`, `ZodTypeDef`, `FunctionResultType`\> |
| `beforeGuards` | `Record`<`string`, [`CommandBeforeGuardHook`](purista_core.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |

#### Returns

[`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts#L13)

___

### getDefaultEventBridgeConfig

▸ **getDefaultEventBridgeConfig**(): [`Complete`](purista_core.md#complete)<[`DefaultEventBridgeConfig`](purista_core.md#defaulteventbridgeconfig)\>

#### Returns

[`Complete`](purista_core.md#complete)<[`DefaultEventBridgeConfig`](purista_core.md#defaulteventbridgeconfig)\>

#### Defined in

[DefaultEventBridge/getDefaultEventBridgeConfig.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/getDefaultEventBridgeConfig.impl.ts#L4)

___

### getDefaultLogLevel

▸ **getDefaultLogLevel**(): [`LogLevelName`](purista_core.md#loglevelname)

#### Returns

[`LogLevelName`](purista_core.md#loglevelname)

#### Defined in

[DefaultLogger/getDefaultLogLevel.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/getDefaultLogLevel.ts#L4)

___

### getNewSubscriptionStorageEntry

▸ **getNewSubscriptionStorageEntry**(`subscription`, `cb`): [`SubscriptionStorageEntry`](purista_core.md#subscriptionstorageentry)

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](purista_core.md#subscription) |
| `cb` | (`message`: [`EBMessage`](purista_core.md#ebmessage)) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> |

#### Returns

[`SubscriptionStorageEntry`](purista_core.md#subscriptionstorageentry)

#### Defined in

[DefaultEventBridge/getNewSubscriptionStorageEntry.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/getNewSubscriptionStorageEntry.impl.ts#L4)

___

### getSubscriptionFunctionWithValidation

▸ **getSubscriptionFunctionWithValidation**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`, `beforeGuards?`): [`SubscriptionFunction`](purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`SubscriptionFunction`](purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> |
| `inputPayloadSchema` | `undefined` \| `ZodType`<`FunctionPayloadType`, `ZodTypeDef`, `MessagePayloadType`\> |
| `inputParameterSchema` | `undefined` \| `ZodType`<`FunctionParamsType`, `ZodTypeDef`, `MessageParamsType`\> |
| `outputPayloadSchema` | `undefined` \| `ZodType`<`MessageResultType`, `ZodTypeDef`, `FunctionResultType`\> |
| `beforeGuards` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_core.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |

#### Returns

[`SubscriptionFunction`](purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[SubscriptionDefinitionBuilder/getSubscriptionFunctionWithValidation.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/getSubscriptionFunctionWithValidation.impl.ts#L13)

___

### getTimeoutPromise

▸ **getTimeoutPromise**<`T`\>(`fn`, `ttl?`): `Promise`<`T`\>

**`Default`**

```ts
30000
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fn` | `Promise`<`T`\> | `undefined` | the promise which should get a timeout |
| `ttl` | `number` | `30000` | the timeout in ms |

#### Returns

`Promise`<`T`\>

#### Defined in

[helper/getTimeoutPromise.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/getTimeoutPromise.impl.ts#L9)

___

### initDefaultConfigStore

▸ **initDefaultConfigStore**(`options`): [`DefaultConfigStore`](../classes/purista_core.DefaultConfigStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.logger` | [`Logger`](../classes/purista_core.Logger.md) |

#### Returns

[`DefaultConfigStore`](../classes/purista_core.DefaultConfigStore.md)

#### Defined in

[DefaultConfigStore/initDefaultConfigStore.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/initDefaultConfigStore.impl.ts#L4)

___

### initDefaultSecretStore

▸ **initDefaultSecretStore**(`options`): [`DefaultSecretStore`](../classes/purista_core.DefaultSecretStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.logger` | [`Logger`](../classes/purista_core.Logger.md) |

#### Returns

[`DefaultSecretStore`](../classes/purista_core.DefaultSecretStore.md)

#### Defined in

[DefaultSecretStore/initDefaultSecretStore.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/initDefaultSecretStore.impl.ts#L4)

___

### initDefaultStateStore

▸ **initDefaultStateStore**(`options`): [`DefaultStateStore`](../classes/purista_core.DefaultStateStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.logger` | [`Logger`](../classes/purista_core.Logger.md) |

#### Returns

[`DefaultStateStore`](../classes/purista_core.DefaultStateStore.md)

#### Defined in

[DefaultStateStore/initDefaultStateStore.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/initDefaultStateStore.impl.ts#L4)

___

### initLogger

▸ **initLogger**(`level?`, `opt?`): [`Logger`](../classes/purista_core.Logger.md)

Create a new logger with the given minimum log level

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | [`LogLevelName`](purista_core.md#loglevelname) |
| `opt?` | `LoggerOptions` |

#### Returns

[`Logger`](../classes/purista_core.Logger.md)

#### Defined in

[DefaultLogger/initLogger.impl.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/initLogger.impl.ts#L13)

___

### isCustomMessage

▸ **isCustomMessage**(`message`): message is Object

Checks if a PURISTA message is type of custom message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) | any PURISTA message |

#### Returns

message is Object

true if message is type of custom message

#### Defined in

[core/types/isCustomMessage.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/isCustomMessage.impl.ts#L10)

___

### isHttpExposedServiceMeta

▸ **isHttpExposedServiceMeta**(`input?`): input is Object

Checks if given input is type of HttpExposedServiceMeta

#### Parameters

| Name | Type |
| :------ | :------ |
| `input?` | `any` |

#### Returns

input is Object

boolean - true if input is type of HttpExposedServiceMeta

#### Defined in

[core/HttpServer/types/isHttpExposedServiceMeta.impl.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/HttpServer/types/isHttpExposedServiceMeta.impl.ts#L8)

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

[core/types/infoType/isInfoMessage.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/isInfoMessage.impl.ts#L4)

___

### isInfoServiceFunctionAdded

▸ **isInfoServiceFunctionAdded**(`message`): message is Object

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is Object

#### Defined in

[core/types/infoType/isInfoServiceFunctionAdded.impl.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/infoType/isInfoServiceFunctionAdded.impl.ts#L5)

___

### isMessageMatchingSubscription

▸ **isMessageMatchingSubscription**(`_log`, `message`, `subscription`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_log` | [`Logger`](../classes/purista_core.Logger.md) |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |
| `subscription` | [`SubscriptionStorageEntry`](purista_core.md#subscriptionstorageentry) |

#### Returns

`boolean`

#### Defined in

[DefaultEventBridge/isMessageMatchingSubscription.impl.ts:4](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/isMessageMatchingSubscription.impl.ts#L4)

___

### throwIfNotValidMessage

▸ **throwIfNotValidMessage**(`input`): `void`

Validates if the given input might be valid event bridge message
It only checks for "technically possible"

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

`void`

#### Defined in

[helper/throwIfNotValidMessage.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/throwIfNotValidMessage.impl.ts#L10)

## Command

• **CommandDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

Command definition builder is a helper to create and define a command for a service.
It helps to set all needed information like schemas and hooks.
With these information, the types are automatically set and extended.

A working schema definition needs at least a command name, a short description and the function implementation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L31)

### CommandAfterGuardHook

Ƭ **CommandAfterGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `result`: `Readonly`<`FunctionResultType`\>, `input`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
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
| `context` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `result` | `Readonly`<`FunctionResultType`\> |
| `input` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/types/commandType/CommandAfterGuardHook.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandAfterGuardHook.ts#L10)

___

### CommandBeforeGuardHook

Ƭ **CommandBeforeGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
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
| `context` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/types/commandType/CommandBeforeGuardHook.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandBeforeGuardHook.ts#L11)

___

### CommandDefinition

Ƭ **CommandDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MetadataType` | [`CommandDefinitionMetadataBase`](purista_core.md#commanddefinitionmetadatabase) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | the command function |
| `commandDescription` | `string` | the description of the command |
| `commandName` | `string` | the name of the command |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_core.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the eventName for the command response |
| `hooks` | { `afterGuard?`: `Record`<`string`, [`CommandAfterGuardHook`](purista_core.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `beforeGuard?`: `Record`<`string`, [`CommandBeforeGuardHook`](purista_core.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `transformInput?`: { `transformFunction`: [`CommandTransformInputHook`](purista_core.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`CommandTransformOutputHook`](purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  }  } | hooks of command |
| `hooks.afterGuard?` | `Record`<`string`, [`CommandAfterGuardHook`](purista_core.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.beforeGuard?` | `Record`<`string`, [`CommandBeforeGuardHook`](purista_core.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.transformInput?` | { `transformFunction`: [`CommandTransformInputHook`](purista_core.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } | - |
| `hooks.transformInput.transformFunction` | [`CommandTransformInputHook`](purista_core.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> | - |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` | - |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` | - |
| `hooks.transformOutput?` | { `transformFunction`: [`CommandTransformOutputHook`](purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  } | - |
| `hooks.transformOutput.transformFunction` | [`CommandTransformOutputHook`](purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> | - |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` | - |
| `metadata` | `MetadataType` | the metadata of the command |

#### Defined in

[core/types/commandType/CommandDefinition.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L17)

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: [`Prettify`](purista_core.md#prettify)<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `receiver`: [`EBMessageSenderAddress`](purista_core.md#ebmessagesenderaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)\>

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

[core/types/commandType/CommandErrorResponse.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandErrorResponse.ts#L13)

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
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
| `context` | [`CommandFunctionContext`](purista_core.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

[core/types/commandType/CommandFunction.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandFunction.ts#L9)

___

### CommandFunctionContext

Ƭ **CommandFunctionContext**<`MessagePayloadType`, `MessageParamsType`\>: [`Prettify`](purista_core.md#prettify)<[`ContextBase`](purista_core.md#contextbase) & [`CommandFunctionContextEnhancements`](purista_core.md#commandfunctioncontextenhancements)<`MessagePayloadType`, `MessageParamsType`\>\>

The command function context which will be passed into command function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Defined in

[core/types/commandType/CommandFunctionContext.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L47)

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
| `emit` | [`EmitCustomMessageFunction`](purista_core.md#emitcustommessagefunction) | emit a custom message |
| `invoke` | [`InvokeFunction`](purista_core.md#invokefunction) | Invokes a command and returns the result. It is recommended to validate the result against a schema which only contains the data you actually need. **`Example`** ```typescript const address: EBMessageAddress = { serviceName: 'name-of-service-to-invoke', serviceVersion: '1', serviceTarget: 'command-name-to-invoke', } const inputPayload = { my: 'input' } const inputParameter = { search: 'for_me' } const result = await invoke<MyResultType>(address, inputPayload inputParameter ) ``` |
| `message` | `Readonly`<[`Command`](purista_core.md#command)<`MessagePayloadType`, `MessageParamsType`\>\> | the original message |

#### Defined in

[core/types/commandType/CommandFunctionContext.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandFunctionContext.ts#L16)

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\> \| [`CommandErrorResponse`](purista_core.md#commanderrorresponse)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

[core/types/commandType/CommandResponse.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandResponse.ts#L9)

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: [`Prettify`](purista_core.md#prettify)<{ `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `payload`: `PayloadType` ; `receiver`: [`EBMessageSenderAddress`](purista_core.md#ebmessagesenderaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)\>

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

[core/types/commandType/CommandSuccessResponse.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandSuccessResponse.ts#L13)

___

### CommandTransformFunctionContext

Ƭ **CommandTransformFunctionContext**<`PayloadType`, `ParameterType`\>: [`Prettify`](purista_core.md#prettify)<[`ContextBase`](purista_core.md#contextbase) & { `message`: `Readonly`<[`Command`](purista_core.md#command)<`PayloadType`, `ParameterType`\>\>  }\>

#### Type parameters

| Name |
| :------ |
| `PayloadType` |
| `ParameterType` |

#### Defined in

[core/types/commandType/CommandTransformFunctionContext.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandTransformFunctionContext.ts#L8)

___

### CommandTransformInputHook

Ƭ **CommandTransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: [`CommandTransformFunctionContext`](purista_core.md#commandtransformfunctioncontext)<`PayloadInput`, `ParamsInput`\>, `payload`: `Readonly`<`PayloadInput`\>, `parameter`: `Readonly`<`ParamsInput`\>) => `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

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
| `context` | [`CommandTransformFunctionContext`](purista_core.md#commandtransformfunctioncontext)<`PayloadInput`, `ParamsInput`\> |
| `payload` | `Readonly`<`PayloadInput`\> |
| `parameter` | `Readonly`<`ParamsInput`\> |

##### Returns

`Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Defined in

[core/types/commandType/CommandTransformInputHook.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandTransformInputHook.ts#L12)

___

### CommandTransformOutputHook

Ƭ **CommandTransformOutputHook**<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: [`CommandTransformFunctionContext`](purista_core.md#commandtransformfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`MessageResultType`\>, `parameter`: `Readonly`<`MessageParamsType`\>) => `Promise`<`ResponseOutput`\>

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
| `context` | [`CommandTransformFunctionContext`](purista_core.md#commandtransformfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`MessageResultType`\> |
| `parameter` | `Readonly`<`MessageParamsType`\> |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

[core/types/commandType/CommandTransformOutputHook.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/CommandTransformOutputHook.ts#L7)

___

### isCommand

▸ **isCommand**(`message`): message is Object

Checks if given message is type of Command

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is Object

boolean

#### Defined in

[core/types/commandType/isCommand.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/isCommand.impl.ts#L12)

___

### isCommandErrorResponse

▸ **isCommandErrorResponse**(`message`): message is Object

Checks if given message is type of CommandErrorResponse

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `unknown` |

#### Returns

message is Object

boolean

#### Defined in

[core/types/commandType/isCommandErrorResponse.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/isCommandErrorResponse.impl.ts#L12)

___

### isCommandResponse

▸ **isCommandResponse**(`message`): message is CommandResponse

Checks if given message is type of CommandResponse (success or error)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is CommandResponse

boolean

#### Defined in

[core/types/commandType/isCommandResponse.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/isCommandResponse.impl.ts#L12)

___

### isCommandSuccessResponse

▸ **isCommandSuccessResponse**(`message`): message is Object

Checks if given message is type of CommandSuccessResponse

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is Object

boolean

#### Defined in

[core/types/commandType/isCommandSuccessResponse.impl.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/commandType/isCommandSuccessResponse.impl.ts#L12)

## Event bridge

• **DefaultEventBridge**: `Object`

Simple implementation of some simple in-memory event bridge.
Does not support threads and does not need any external databases.

**`Example`**

```typescript
import { DefaultEventBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your services
```

#### Defined in

[DefaultEventBridge/DefaultEventBridge.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts#L61)

• **EventBridgeBaseClass**<`ConfigType`\>: `Object`

The base class to be extended by event bridge implementations

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L17)

• **EventBridge**: `Object`

Event bridge interface
The event bridge must implement this interface.

#### Defined in

[core/EventBridge/types/EventBridge.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridge.ts#L19)

### EventBridgeEventsBasic

Ƭ **EventBridgeEventsBasic**: `Object`

Events which can be emitted by a event bridge

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventbridge-connected` | `never` | emitted when then connection to event bridge is established |
| `eventbridge-connection-error` | `undefined` \| `unknown` \| `Error` | emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly |
| `eventbridge-disconnected` | `never` | emitted when the connection to event bridge closed |
| `eventbridge-error` | [`UnhandledError`](../classes/purista_core.UnhandledError.md) \| `unknown` | emitted on internal event bridge error |
| `eventbridge-reconnecting` | `never` | emitted on retry to connect to event bridge |

#### Defined in

[core/EventBridge/types/EventBridgeEvents.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L20)

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

[core/helper/getCommandQueueName.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getCommandQueueName.impl.ts#L10)

## Helper

### convertToCamelCase

▸ **convertToCamelCase**(`str`): `string`

Converts a string into camelCase

**`Link`**

https://github.com/30-seconds/30-seconds-of-code

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | string |

#### Returns

`string`

string converted to camelCase

#### Defined in

[helper/string/convertToCamelCase.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/string/convertToCamelCase.impl.ts#L9)

___

### convertToKebabCase

▸ **convertToKebabCase**(`str`): `string`

Converts a string into kebab-case

**`Link`**

https://github.com/30-seconds/30-seconds-of-code

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | string |

#### Returns

`string`

string converted to kebab-case

#### Defined in

[helper/string/convertToKebabCase.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/string/convertToKebabCase.impl.ts#L9)

___

### convertToPascalCase

▸ **convertToPascalCase**(`str`): `string`

Converts a string into PascalCase

**`Link`**

https://github.com/30-seconds/30-seconds-of-code

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | string |

#### Returns

`string`

string converted to PascalCase

#### Defined in

[helper/string/convertToPascalCase.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/string/convertToPascalCase.impl.ts#L9)

___

### convertToSnakeCase

▸ **convertToSnakeCase**(`str`): `string`

Converts a string into snake_case

**`Link`**

https://github.com/30-seconds/30-seconds-of-code

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | string |

#### Returns

`string`

string converted to snake_case

#### Defined in

[helper/string/convertToSnakeCase.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/string/convertToSnakeCase.impl.ts#L9)

___

### createErrorResponse

▸ **createErrorResponse**(`instanceId`, `originalEBMessage`, `statusCode?`, `error?`): `Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\>

Creates a error response object based on original command
Toggles sender and receiver

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instanceId` | `string` | `undefined` |
| `originalEBMessage` | `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> | `undefined` |
| `statusCode` | [`StatusCode`](../enums/purista_core.StatusCode.md) | `StatusCode.InternalServerError` |
| `error?` | `unknown` | `undefined` |

#### Returns

`Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\>

CommandErrorResponse message object

#### Defined in

[core/helper/createErrorResponse.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/createErrorResponse.impl.ts#L18)

___

### createInfoMessage

▸ **createInfoMessage**(`messageType`, `sender`, `additional?`): [`InfoMessage`](purista_core.md#infomessage)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageType` | [`InfoMessageType`](purista_core.md#infomessagetype) | - |
| `sender` | `Object` | - |
| `sender.instanceId` | `string` | instance id of eventbridge |
| `sender.serviceName` | `string` | the name of the service |
| `sender.serviceTarget` | `string` | the name of the command or subscription |
| `sender.serviceVersion` | `string` | the version of the service |
| `additional?` | `Partial`<[`InfoMessage`](purista_core.md#infomessage)\> | - |

#### Returns

[`InfoMessage`](purista_core.md#infomessage)

#### Defined in

[core/helper/createInfoMessage.impl.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/createInfoMessage.impl.ts#L14)

___

### createSuccessResponse

▸ **createSuccessResponse**<`T`\>(`instanceId`, `originalEBMessage`, `payload`, `eventName?`, `contentType?`, `contentEncoding?`): `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `T` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instanceId` | `string` | `undefined` |
| `originalEBMessage` | `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> | `undefined` |
| `payload` | `T` | `undefined` |
| `eventName?` | `string` | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |

#### Returns

`Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `T` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[core/helper/createSuccessResponse.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/createSuccessResponse.impl.ts#L15)

___

### deserializeOtp

▸ **deserializeOtp**(`logger`, `otp?`): `undefined` \| `Context`

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](../classes/purista_core.Logger.md) |
| `otp?` | `string` |

#### Returns

`undefined` \| `Context`

#### Defined in

[core/helper/serializeOtp.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/serializeOtp.impl.ts#L26)

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

[core/helper/getCleanedMessage.impl.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getCleanedMessage.impl.ts#L15)

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

[core/helper/getErrorMessageForCode.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getErrorMessageForCode.impl.ts#L10)

___

### getNewCorrelationId

▸ **getNewCorrelationId**(): `string`

Create a new unique event bridge correlation id

#### Returns

`string`

EBMessageId

#### Defined in

[core/helper/getNewCorrelationId.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getNewCorrelationId.impl.ts#L10)

___

### getNewEBMessageId

▸ **getNewEBMessageId**(): `string`

Create a new unique event bridge message id

#### Returns

`string`

EBMessageId

#### Defined in

[core/helper/getNewEBMessageId.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getNewEBMessageId.impl.ts#L11)

___

### getNewInstanceId

▸ **getNewInstanceId**(): `string`

#### Returns

`string`

#### Defined in

[core/helper/getNewInstanceId.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getNewInstanceId.impl.ts#L9)

___

### getNewTraceId

▸ **getNewTraceId**(): `string`

#### Returns

`string`

#### Defined in

[core/helper/getNewTraceId.impl.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getNewTraceId.impl.ts#L9)

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

[core/helper/getSubscriptionQueueName.impl.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getSubscriptionQueueName.impl.ts#L10)

___

### getUniqueId

▸ **getUniqueId**(): `string`

#### Returns

`string`

#### Defined in

[core/helper/getUniqueId.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/getUniqueId.impl.ts#L11)

___

### gracefulShutdown

▸ **gracefulShutdown**(`logger`, `list`, `timeoutMs?`): `void`

Helps to gracefully shut down your application.
Provide in list objects. The objects contains a name and a promise function which should be executed.

The execution of array list functions is done sequential.

**`Example`**

```typescript
const shutDownList = [
 {
   name: `${serviceA.info.serviceName} version ${serviceA.info.serviceVersion}`,
   fn: serviceA.destroy
 },
 {
   name: `${serviceB.info.serviceName} version ${serviceB.info.serviceVersion}`,
   fn: serviceB.destroy
 },
{
   name: eventbridge.name,
   fn: eventbridge.destroy
 }
]
gracefulShutdown(logger, shutDownList)

// will shutdown ServiceA, then ServiceB, then the event bridge
```

**`Default`**

```ts
30000 milliseconds
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `logger` | [`Logger`](../classes/purista_core.Logger.md) | `undefined` | the logger object |
| `list` | [`ShutdownEntry`](purista_core.md#shutdownentry)[] | `undefined` | a object containing name and function |
| `timeoutMs` | `number` | `30000` | in ms to shut |

#### Returns

`void`

#### Defined in

[helper/gracefulShutdown.impl.ts:36](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/gracefulShutdown.impl.ts#L36)

___

### isDevelop

▸ **isDevelop**(): `boolean`

returns true if NODE_ENV is set to value starting with "develop"

#### Returns

`boolean`

#### Defined in

[core/helper/isDevelop.impl.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/isDevelop.impl.ts#L6)

___

### serializeOtp

▸ **serializeOtp**(): `string`

#### Returns

`string`

#### Defined in

[core/helper/serializeOtp.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/helper/serializeOtp.impl.ts#L11)

## Service

• **ServiceEventsNames**: `Object`

Events which can be emitted by a service.
Internal events are prefixed with `service-`

#### Defined in

[core/types/ServiceEvents.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L11)

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

[core/Service/Service.impl.ts:74](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L74)

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
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`Service`](../classes/purista_core.Service.md)<`ConfigType`\> |

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:38](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L38)

• **ServiceClass**<`ConfigType`\>: `Object`

The ServiceClass interface

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

#### Defined in

[core/types/ServiceClass.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceClass.ts#L11)

### ServiceConstructorInput

Ƭ **ServiceConstructorInput**<`ConfigType`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinitionList` | [`CommandDefinitionList`](purista_core.md#commanddefinitionlist)<`any`\> | The list of command definitions for this service |
| `config` | `ConfigType` | The service specific config |
| `configStore?` | [`ConfigStore`](../interfaces/purista_core.ConfigStore.md) | The config store instance |
| `eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) | The eventBridge instance |
| `info` | [`ServiceInfoType`](purista_core.md#serviceinfotype) | The service info with name, version and description of service |
| `logger` | [`Logger`](../classes/purista_core.Logger.md) | A logger instance |
| `secretStore?` | [`SecretStore`](../interfaces/purista_core.SecretStore.md) | The secret store instance |
| `spanProcessor?` | `SpanProcessor` | The opentelemetry span processor instance |
| `stateStore?` | [`StateStore`](../interfaces/purista_core.StateStore.md) | the state store instance |
| `subscriptionDefinitionList` | [`SubscriptionDefinitionList`](purista_core.md#subscriptiondefinitionlist)<`any`\> | The list of subscription definitions for this service |

#### Defined in

[core/types/ServiceConstructorInput.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L15)

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
| `service-handled-command-error` | { `commandName`: `string` ; `error`: [`HandledError`](../classes/purista_core.HandledError.md) ; `traceId`: [`TraceId`](purista_core.md#traceid)  } | emitted when a command throws a HandledError |
| `service-handled-command-error.commandName` | `string` | - |
| `service-handled-command-error.error` | [`HandledError`](../classes/purista_core.HandledError.md) | - |
| `service-handled-command-error.traceId` | [`TraceId`](purista_core.md#traceid) | - |
| `service-handled-subscription-error` | { `error`: [`HandledError`](../classes/purista_core.HandledError.md) ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_core.md#traceid)  } | emitted when a subscription throws a HandledError |
| `service-handled-subscription-error.error` | [`HandledError`](../classes/purista_core.HandledError.md) | - |
| `service-handled-subscription-error.subscriptionName` | `string` | - |
| `service-handled-subscription-error.traceId` | [`TraceId`](purista_core.md#traceid) | - |
| `service-not-available` | `undefined` \| `unknown` | emitted when the service is not available (for example database connection could not be established) |
| `service-started` | `undefined` | emitted when the service is started, but not fully initialized and not ready yet |
| `service-stopped` | `undefined` | emitted when the service has been stopped |
| `service-unhandled-command-error` | { `commandName`: `string` ; `error`: `unknown` ; `traceId`: [`TraceId`](purista_core.md#traceid)  } | emitted when a command throws an error other than a HandledError |
| `service-unhandled-command-error.commandName` | `string` | - |
| `service-unhandled-command-error.error` | `unknown` | - |
| `service-unhandled-command-error.traceId` | [`TraceId`](purista_core.md#traceid) | - |
| `service-unhandled-subscription-error` | { `error`: `unknown` ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_core.md#traceid)  } | emitted when a subscription throws an error other than a HandledError |
| `service-unhandled-subscription-error.error` | `unknown` | - |
| `service-unhandled-subscription-error.subscriptionName` | `string` | - |
| `service-unhandled-subscription-error.traceId` | [`TraceId`](purista_core.md#traceid) | - |

#### Defined in

[core/types/ServiceEvents.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L54)

## Store

• **ConfigStoreBaseClass**<`ConfigType`\>: `Object`

Base class for config store adapters

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

#### Defined in

[core/ConfigStore/ConfigStoreBaseClass.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/ConfigStoreBaseClass.impl.ts#L11)

• **DefaultConfigStore**: `Object`

The DefaultConfigStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.

For development and testing purpose, you can initiate the store with values.

**`Example`**

```typescript
const store = new DefaultConfigStore({
   enableGet: true,
   enableRemove: true,
   enableSet: true,
   config: {
     initialValue: 'initial',
   },
})

console.log(await store.getConfig('initialValue') // outputs: { initialValue: 'initial' }
```

#### Defined in

[DefaultConfigStore/DefaultConfigStore.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultConfigStore/DefaultConfigStore.impl.ts#L25)

• **DefaultSecretStore**: `Object`

The DefaultSecretStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Unauthorized`, when a disabled operation is called.

For development and testing purpose, you can initiate the store with values.

**`Example`**

```typescript
const store = new DefaultSecretStore({
 config: {
   secretOne: 'my_secret_one_value',
   secretTwo: 'my_secret_two_value',
 }
})
console.log(await store.getSecret('secretOne', 'secretTwo) // outputs: { secretOne: my_secret_one_value, secretTwo: 'my_secret_two_value' }
```
Per default, setting/changing and removal of values are disabled.
You can enable it on instance creation:

**`Example`**

```typescript
const store = new DefaultSecretStore({
 enableGet: true,
 enableRemove: true,
 enableSet: true,
})
```

#### Defined in

[DefaultSecretStore/DefaultSecretStore.impl.ts:33](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L33)

• **DefaultStateStore**: `Object`

The DefaultStateStore is a placeholder which offers all needed methods.
Getters and setters will throw a UnhandledError with status `Not implemented`

#### Defined in

[DefaultStateStore/DefaultStateStore.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultStateStore/DefaultStateStore.impl.ts#L11)

• **SecretStoreBaseClass**<`ConfigType`\>: `Object`

Base class for secret store adapters

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

#### Defined in

[core/SecretStore/SecretStoreBaseClass.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L11)

• **StateStoreBaseClass**<`ConfigType`\>: `Object`

Base class for config store implementations

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Record`<`string`, `unknown`\> = {} |

#### Defined in

[core/StateStore/StateStoreBaseClass.impl.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts#L11)

• **ConfigStore**: `Object`

Interface definition for config store adapters

#### Defined in

[core/ConfigStore/types/ConfigStore.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L10)

• **SecretStore**: `Object`

Interface definition for a secret store implementation

#### Defined in

[core/SecretStore/types/SecretStore.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L9)

• **StateStore**: `Object`

Interface definition for state store implementations

#### Defined in

[core/StateStore/types/StateStore.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateStore.ts#L10)

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

[core/ConfigStore/types/ConfigDeleteFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigDeleteFunction.ts#L2)

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

[core/ConfigStore/types/ConfigGetterFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigGetterFunction.ts#L2)

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

[core/ConfigStore/types/ConfigSetterFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigSetterFunction.ts#L2)

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

[core/SecretStore/types/SecretDeleteFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/types/SecretDeleteFunction.ts#L2)

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

[core/SecretStore/types/SecretGetterFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/types/SecretGetterFunction.ts#L2)

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

[core/SecretStore/types/SecretSetterFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/types/SecretSetterFunction.ts#L2)

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

[core/StateStore/types/StateDeleteFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateDeleteFunction.ts#L2)

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

[core/StateStore/types/StateGetterFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateGetterFunction.ts#L2)

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

[core/StateStore/types/StateSetterFunction.ts:2](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/StateStore/types/StateSetterFunction.ts#L2)

## Subscription

• **SubscriptionDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` \| `void` \| `undefined` |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:30](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L30)

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
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_core.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the event name to subscribe for |
| `messageType?` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) | the message type |
| `payload?` | { `parameter?`: `ParameterType` ; `payload?`: `PayloadType`  } | the message payload |
| `payload.parameter?` | `ParameterType` | - |
| `payload.payload?` | `PayloadType` | - |
| `principalId?` | [`PrincipalId`](purista_core.md#principalid) | the principal id |
| `receiver?` | { `instanceId?`: [`InstanceId`](purista_core.md#instanceid) ; `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the consumer address of the message |
| `receiver.instanceId?` | [`InstanceId`](purista_core.md#instanceid) | - |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `instanceId?`: [`InstanceId`](purista_core.md#instanceid) ; `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the producer address of the message |
| `sender.instanceId?` | [`InstanceId`](purista_core.md#instanceid) | - |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriber` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) | the address of the subscription (service name, version and subscription name) |

#### Defined in

[core/types/subscription/Subscription.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L12)

___

### SubscriptionAfterGuardHook

Ƭ **SubscriptionAfterGuardHook**<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadOutputType`, `FunctionParameterType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_core.md#subscriptionfunctioncontext), `result`: `Readonly`<`FunctionResultType`\>, `payload`: `Readonly`<`FunctionPayloadOutputType`\>, `parameter`: `Readonly`<`FunctionParameterType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
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
| `context` | [`SubscriptionFunctionContext`](purista_core.md#subscriptionfunctioncontext) |
| `result` | `Readonly`<`FunctionResultType`\> |
| `payload` | `Readonly`<`FunctionPayloadOutputType`\> |
| `parameter` | `Readonly`<`FunctionParameterType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/types/subscription/SubscriptionAfterGuardHook.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionAfterGuardHook.ts#L10)

___

### SubscriptionBeforeGuardHook

Ƭ **SubscriptionBeforeGuardHook**<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_core.md#subscriptionfunctioncontext), `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
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
| `context` | [`SubscriptionFunctionContext`](purista_core.md#subscriptionfunctioncontext) |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/types/subscription/SubscriptionBeforeGuardHook.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionBeforeGuardHook.ts#L11)

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

The definition for a subscription provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MetadataType` | [`SubscriptionDefinitionMetadataBase`](purista_core.md#subscriptiondefinitionmetadatabase) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`SubscriptionFunction`](purista_core.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | the subscription function |
| `emitEventName?` | `string` | event name to be used for custom message if the subscription functions returns value |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_core.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | filter forevent name |
| `hooks` | { `afterGuard?`: `Record`<`string`, [`SubscriptionAfterGuardHook`](purista_core.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `beforeGuard?`: `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_core.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `transformInput?`: { `transformFunction`: [`SubscriptionTransformInputHook`](purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`SubscriptionTransformOutputHook`](purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `z.ZodType`  }  } | hooks of subscription |
| `hooks.afterGuard?` | `Record`<`string`, [`SubscriptionAfterGuardHook`](purista_core.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.beforeGuard?` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_core.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.transformInput?` | { `transformFunction`: [`SubscriptionTransformInputHook`](purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } | - |
| `hooks.transformInput.transformFunction` | [`SubscriptionTransformInputHook`](purista_core.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> | - |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` | - |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` | - |
| `hooks.transformOutput?` | { `transformFunction`: [`SubscriptionTransformOutputHook`](purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `z.ZodType`  } | - |
| `hooks.transformOutput.transformFunction` | [`SubscriptionTransformOutputHook`](purista_core.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> | - |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` | - |
| `messageType?` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) | filter for message type |
| `metadata` | `MetadataType` | the metadata of the subscription |
| `principalId?` | [`PrincipalId`](purista_core.md#principalid) | filter for principal id |
| `receiver?` | { `instanceId?`: [`InstanceId`](purista_core.md#instanceid) ; `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | filter for messages consumed by given receiver |
| `receiver.instanceId?` | [`InstanceId`](purista_core.md#instanceid) | - |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `instanceId?`: [`InstanceId`](purista_core.md#instanceid) ; `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | filter for messages produced by given sender |
| `sender.instanceId?` | [`InstanceId`](purista_core.md#instanceid) | - |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriptionDescription` | `string` | the description of the subscription |
| `subscriptionName` | `string` | the name of the subscription |

#### Defined in

[core/types/subscription/SubscriptionDefinition.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L20)

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_core.md#subscriptionfunctioncontext), `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
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
| `context` | [`SubscriptionFunctionContext`](purista_core.md#subscriptionfunctioncontext) |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

[core/types/subscription/SubscriptionFunction.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunction.ts#L8)

___

### SubscriptionFunctionContext

Ƭ **SubscriptionFunctionContext**: [`Prettify`](purista_core.md#prettify)<[`ContextBase`](purista_core.md#contextbase) & [`SubscriptionFunctionContextEnhancements`](purista_core.md#subscriptionfunctioncontextenhancements)\>

The subscription function context which will be passed into subscription function.

#### Defined in

[core/types/subscription/SubscriptionFunctionContext.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L47)

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
| `emit` | [`EmitCustomMessageFunction`](purista_core.md#emitcustommessagefunction) | emit a custom message |
| `invoke` | [`InvokeFunction`](purista_core.md#invokefunction) | Invokes a command and returns the result. It is recommended to validate the result against a schema which only contains the data you actually need. **`Example`** ```typescript const address: EBMessageAddress = { serviceName: 'name-of-service-to-invoke', serviceVersion: '1', serviceTarget: 'command-name-to-invoke', } const inputPayload = { my: 'input' } const inputParameter = { search: 'for_me' } const result = await invoke<MyResultType>(address, inputPayload inputParameter ) ``` |
| `message` | `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\> | the original message |

#### Defined in

[core/types/subscription/SubscriptionFunctionContext.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts#L16)

___

### SubscriptionTransformFunctionContext

Ƭ **SubscriptionTransformFunctionContext**: [`Prettify`](purista_core.md#prettify)<[`ContextBase`](purista_core.md#contextbase) & { `message`: `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\>  }\>

#### Defined in

[core/types/subscription/SubscriptionTransformFunctionContext.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionTransformFunctionContext.ts#L8)

___

### SubscriptionTransformInputHook

Ƭ **SubscriptionTransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionTransformFunctionContext`](purista_core.md#subscriptiontransformfunctioncontext), `payload`: `Readonly`<`PayloadInput`\>, `parameter`: `Readonly`<`ParamsInput`\>) => `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

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
| `context` | [`SubscriptionTransformFunctionContext`](purista_core.md#subscriptiontransformfunctioncontext) |
| `payload` | `Readonly`<`PayloadInput`\> |
| `parameter` | `Readonly`<`ParamsInput`\> |

##### Returns

`Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Defined in

[core/types/subscription/SubscriptionTransformInputHook.ts:6](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionTransformInputHook.ts#L6)

___

### SubscriptionTransformOutputHook

Ƭ **SubscriptionTransformOutputHook**<`ServiceClassType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionTransformFunctionContext`](purista_core.md#subscriptiontransformfunctioncontext), `payload`: `Readonly`<`MessageResultType`\>, `parameter`: `Readonly`<`MessageParamsType`\>) => `Promise`<`ResponseOutput`\>

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
| `context` | [`SubscriptionTransformFunctionContext`](purista_core.md#subscriptiontransformfunctioncontext) |
| `payload` | `Readonly`<`MessageResultType`\> |
| `parameter` | `Readonly`<`MessageParamsType`\> |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

[core/types/subscription/SubscriptionTransformOutputHook.ts:8](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionTransformOutputHook.ts#L8)

## Unit test helper

### getCommandContextMock

▸ **getCommandContextMock**<`MessagePayloadType`, `MessageParamsType`\>(`payload`, `parameter`, `sandbox?`): `Object`

A function that returns a mock object for command function context

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
| `sandbox?` | `SinonSandbox` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mock` | { `configs`: { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } ; `emit`: [`EmitCustomMessageFunction`](purista_core.md#emitcustommessagefunction) ; `invoke`: [`InvokeFunction`](purista_core.md#invokefunction) ; `logger`: [`Logger`](../classes/purista_core.Logger.md) ; `message`: `Readonly`<{ messageType: EBMessageType.Command; correlationId: string; receiver: EBMessageAddress; payload: { parameter: MessageParamsType; payload: MessagePayloadType; }; ... 8 more ...; sender: { ...; }; }\> ; `secrets`: { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } ; `startActiveSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> ; `states`: { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } ; `wrapInSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\>  } |
| `mock.configs` | { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](purista_core.md#configsetterfunction) |
| `mock.emit` | [`EmitCustomMessageFunction`](purista_core.md#emitcustommessagefunction) |
| `mock.invoke` | [`InvokeFunction`](purista_core.md#invokefunction) |
| `mock.logger` | [`Logger`](../classes/purista_core.Logger.md) |
| `mock.message` | `Readonly`<{ messageType: EBMessageType.Command; correlationId: string; receiver: EBMessageAddress; payload: { parameter: MessageParamsType; payload: MessagePayloadType; }; ... 8 more ...; sender: { ...; }; }\> |
| `mock.secrets` | { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } |
| `mock.secrets.getSecret` | [`SecretGetterFunction`](purista_core.md#secretgetterfunction) |
| `mock.secrets.removeSecret` | [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) |
| `mock.secrets.setSecret` | [`SecretSetterFunction`](purista_core.md#secretsetterfunction) |
| `mock.startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> |
| `mock.states` | { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } |
| `mock.states.getState` | [`StateGetterFunction`](purista_core.md#stategetterfunction) |
| `mock.states.removeState` | [`StateDeleteFunction`](purista_core.md#statedeletefunction) |
| `mock.states.setState` | [`StateSetterFunction`](purista_core.md#statesetterfunction) |
| `mock.wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> |
| `stubs` | { `emit`: `SinonStub`<`any`[], `any`\> ; `getConfig`: `SinonStub`<`any`[], `any`\> ; `getSecret`: `SinonStub`<`any`[], `any`\> ; `getState`: `SinonStub`<`any`[], `any`\> ; `invoke`: `SinonStub`<`any`[], `any`\> ; `logger`: { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } = logger.stubs; `removeConfig`: `SinonStub`<`any`[], `any`\> ; `removeSecret`: `SinonStub`<`any`[], `any`\> ; `removeState`: `SinonStub`<`any`[], `any`\> ; `setConfig`: `SinonStub`<`any`[], `any`\> ; `setSecret`: `SinonStub`<`any`[], `any`\> ; `setState`: `SinonStub`<`any`[], `any`\> ; `startActiveSpan`: `SinonStub`<`any`[], `any`\> ; `wrapInSpan`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.emit` | `SinonStub`<`any`[], `any`\> |
| `stubs.getConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.getSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.getState` | `SinonStub`<`any`[], `any`\> |
| `stubs.invoke` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger` | { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.logger.debug` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.error` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.fatal` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.info` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.trace` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.warn` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeState` | `SinonStub`<`any`[], `any`\> |
| `stubs.setConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.setSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.setState` | `SinonStub`<`any`[], `any`\> |
| `stubs.startActiveSpan` | `SinonStub`<`any`[], `any`\> |
| `stubs.wrapInSpan` | `SinonStub`<`any`[], `any`\> |

#### Defined in

[mocks/getCommandContext.mock.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getCommandContext.mock.ts#L12)

___

### getCommandErrorMessageMock

▸ **getCommandErrorMessageMock**(`error?`, `input?`, `commandMessage?`): `Readonly`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

A function that returns a mocked command error response message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error?` | [`HandledError`](../classes/purista_core.HandledError.md) \| [`UnhandledError`](../classes/purista_core.UnhandledError.md) | - |
| `input?` | `Partial`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> | - |
| `commandMessage?` | `Object` | - |
| `commandMessage.contentEncoding` | `string` | content encoding of message payload |
| `commandMessage.contentType` | `string` | content type of message payload |
| `commandMessage.correlationId` | `string` | correlation id to know which command response referrs to which command |
| `commandMessage.eventName?` | `string` | event name for this message |
| `commandMessage.id` | `string` | global unique id of message |
| `commandMessage.messageType` | [`Command`](../enums/purista_core.EBMessageType.md#command) | - |
| `commandMessage.otp?` | `string` | stringified Opentelemetry parent trace id |
| `commandMessage.payload` | `Object` | - |
| `commandMessage.payload.parameter` | `unknown` | - |
| `commandMessage.payload.payload` | `unknown` | - |
| `commandMessage.principalId?` | `string` | principal id |
| `commandMessage.receiver` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) | - |
| `commandMessage.sender` | { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } | - |
| `commandMessage.timestamp` | `number` | timestamp of message creation time |
| `commandMessage.traceId?` | `string` | trace id of message |

#### Returns

`Readonly`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[mocks/messages/getCommandErrorMessage.mock.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/messages/getCommandErrorMessage.mock.ts#L16)

___

### getCommandMessageMock

▸ **getCommandMessageMock**<`Payload`, `Parameter`\>(`input?`): `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `Parameter` ; `payload`: `Payload`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

A function that returns a mocked command message.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |
| `Parameter` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input?` | `Partial`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `Parameter` ; `payload`: `Payload`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> & { `payload?`: { `parameter?`: `Parameter` ; `payload?`: `Payload`  }  } |

#### Returns

`Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `Parameter` ; `payload`: `Payload`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[mocks/messages/getCommandMessage.mock.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/messages/getCommandMessage.mock.ts#L15)

___

### getCommandSuccessMessageMock

▸ **getCommandSuccessMessageMock**<`PayloadType`\>(`payload`, `input?`, `commandMessage?`): `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `PayloadType` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

A function that returns a mocked command success response message.

#### Type parameters

| Name |
| :------ |
| `PayloadType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `PayloadType` | - |
| `input?` | `Partial`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `PayloadType` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> | - |
| `commandMessage?` | `Object` | - |
| `commandMessage.contentEncoding` | `string` | content encoding of message payload |
| `commandMessage.contentType` | `string` | content type of message payload |
| `commandMessage.correlationId` | `string` | correlation id to know which command response referrs to which command |
| `commandMessage.eventName?` | `string` | event name for this message |
| `commandMessage.id` | `string` | global unique id of message |
| `commandMessage.messageType` | [`Command`](../enums/purista_core.EBMessageType.md#command) | - |
| `commandMessage.otp?` | `string` | stringified Opentelemetry parent trace id |
| `commandMessage.payload` | `Object` | - |
| `commandMessage.payload.parameter` | `unknown` | - |
| `commandMessage.payload.payload` | `unknown` | - |
| `commandMessage.principalId?` | `string` | principal id |
| `commandMessage.receiver` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) | - |
| `commandMessage.sender` | { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } | - |
| `commandMessage.timestamp` | `number` | timestamp of message creation time |
| `commandMessage.traceId?` | `string` | trace id of message |

#### Returns

`Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `PayloadType` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[mocks/messages/getCommandSuccessMessage.mock.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/messages/getCommandSuccessMessage.mock.ts#L9)

___

### getCommandTransformContextMock

▸ **getCommandTransformContextMock**<`MessagePayloadType`, `MessageParamsType`\>(`payload`, `parameter`, `sandbox?`): `Object`

A function that returns a mock object for command transform function context

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
| `sandbox?` | `SinonSandbox` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mock` | { `configs`: { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } ; `logger`: [`Logger`](../classes/purista_core.Logger.md) ; `message`: `Readonly`<{ messageType: EBMessageType.Command; correlationId: string; receiver: EBMessageAddress; payload: { parameter: MessageParamsType; payload: MessagePayloadType; }; ... 8 more ...; sender: { ...; }; }\> ; `secrets`: { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } ; `startActiveSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> ; `states`: { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } ; `wrapInSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\>  } |
| `mock.configs` | { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](purista_core.md#configsetterfunction) |
| `mock.logger` | [`Logger`](../classes/purista_core.Logger.md) |
| `mock.message` | `Readonly`<{ messageType: EBMessageType.Command; correlationId: string; receiver: EBMessageAddress; payload: { parameter: MessageParamsType; payload: MessagePayloadType; }; ... 8 more ...; sender: { ...; }; }\> |
| `mock.secrets` | { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } |
| `mock.secrets.getSecret` | [`SecretGetterFunction`](purista_core.md#secretgetterfunction) |
| `mock.secrets.removeSecret` | [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) |
| `mock.secrets.setSecret` | [`SecretSetterFunction`](purista_core.md#secretsetterfunction) |
| `mock.startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> |
| `mock.states` | { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } |
| `mock.states.getState` | [`StateGetterFunction`](purista_core.md#stategetterfunction) |
| `mock.states.removeState` | [`StateDeleteFunction`](purista_core.md#statedeletefunction) |
| `mock.states.setState` | [`StateSetterFunction`](purista_core.md#statesetterfunction) |
| `mock.wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> |
| `stubs` | { `getConfig`: `SinonStub`<`any`[], `any`\> ; `getSecret`: `SinonStub`<`any`[], `any`\> ; `getState`: `SinonStub`<`any`[], `any`\> ; `logger`: { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } = logger.stubs; `removeConfig`: `SinonStub`<`any`[], `any`\> ; `removeSecret`: `SinonStub`<`any`[], `any`\> ; `removeState`: `SinonStub`<`any`[], `any`\> ; `setConfig`: `SinonStub`<`any`[], `any`\> ; `setSecret`: `SinonStub`<`any`[], `any`\> ; `setState`: `SinonStub`<`any`[], `any`\> ; `startActiveSpan`: `SinonStub`<`any`[], `any`\> ; `wrapInSpan`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.getConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.getSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.getState` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger` | { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.logger.debug` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.error` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.fatal` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.info` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.trace` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.warn` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeState` | `SinonStub`<`any`[], `any`\> |
| `stubs.setConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.setSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.setState` | `SinonStub`<`any`[], `any`\> |
| `stubs.startActiveSpan` | `SinonStub`<`any`[], `any`\> |
| `stubs.wrapInSpan` | `SinonStub`<`any`[], `any`\> |

#### Defined in

[mocks/getCommandTransformContext.mock.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getCommandTransformContext.mock.ts#L12)

___

### getCustomMessageMessageMock

▸ **getCustomMessageMessageMock**<`PayloadType`\>(`eventName`, `payload`, `input?`): `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `PayloadType` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

A function that returns a mocked custom message.

#### Type parameters

| Name |
| :------ |
| `PayloadType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `payload` | `PayloadType` |
| `input?` | `Partial`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `PayloadType` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> |

#### Returns

`Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `PayloadType` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[mocks/messages/getCustomMessage.mock.ts:15](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/messages/getCustomMessage.mock.ts#L15)

___

### getEventBridgeMock

▸ **getEventBridgeMock**(`sandbox?`): `Object`

Mocks the eventBridge and stubs the methods

#### Parameters

| Name | Type |
| :------ | :------ |
| `sandbox?` | `SinonSandbox` |

#### Returns

`Object`

EventBridge mocked

| Name | Type |
| :------ | :------ |
| `mock` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) |
| `stubs` | `Record`<`string`, `SinonStub`<`any`[], `any`\>\> |

#### Defined in

[mocks/getEventBridge.mock.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getEventBridge.mock.ts#L10)

___

### getLoggerMock

▸ **getLoggerMock**(`sandbox?`): `Object`

Mocks the logger and methods are stubs

#### Parameters

| Name | Type |
| :------ | :------ |
| `sandbox?` | `SinonSandbox` |

#### Returns

`Object`

logger mocked

| Name | Type |
| :------ | :------ |
| `mock` | [`Logger`](../classes/purista_core.Logger.md) |
| `stubs` | { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.debug` | `SinonStub`<`any`[], `any`\> |
| `stubs.error` | `SinonStub`<`any`[], `any`\> |
| `stubs.fatal` | `SinonStub`<`any`[], `any`\> |
| `stubs.info` | `SinonStub`<`any`[], `any`\> |
| `stubs.trace` | `SinonStub`<`any`[], `any`\> |
| `stubs.warn` | `SinonStub`<`any`[], `any`\> |

#### Defined in

[mocks/getLogger.mock.ts:10](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getLogger.mock.ts#L10)

___

### getSubscriptionContextMock

▸ **getSubscriptionContextMock**(`message`, `sandbox?`): `Object`

A function that returns a mock object for subscription function context

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |
| `sandbox?` | `SinonSandbox` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mock` | { `configs`: { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } ; `emit`: [`EmitCustomMessageFunction`](purista_core.md#emitcustommessagefunction) ; `invoke`: [`InvokeFunction`](purista_core.md#invokefunction) ; `logger`: [`Logger`](../classes/purista_core.Logger.md) ; `message`: `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\> ; `secrets`: { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } ; `startActiveSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> ; `states`: { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } ; `wrapInSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\>  } |
| `mock.configs` | { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](purista_core.md#configsetterfunction) |
| `mock.emit` | [`EmitCustomMessageFunction`](purista_core.md#emitcustommessagefunction) |
| `mock.invoke` | [`InvokeFunction`](purista_core.md#invokefunction) |
| `mock.logger` | [`Logger`](../classes/purista_core.Logger.md) |
| `mock.message` | `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\> |
| `mock.secrets` | { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } |
| `mock.secrets.getSecret` | [`SecretGetterFunction`](purista_core.md#secretgetterfunction) |
| `mock.secrets.removeSecret` | [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) |
| `mock.secrets.setSecret` | [`SecretSetterFunction`](purista_core.md#secretsetterfunction) |
| `mock.startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> |
| `mock.states` | { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } |
| `mock.states.getState` | [`StateGetterFunction`](purista_core.md#stategetterfunction) |
| `mock.states.removeState` | [`StateDeleteFunction`](purista_core.md#statedeletefunction) |
| `mock.states.setState` | [`StateSetterFunction`](purista_core.md#statesetterfunction) |
| `mock.wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> |
| `stubs` | { `emit`: `SinonStub`<`any`[], `any`\> ; `getConfig`: `SinonStub`<`any`[], `any`\> ; `getSecret`: `SinonStub`<`any`[], `any`\> ; `getState`: `SinonStub`<`any`[], `any`\> ; `invoke`: `SinonStub`<`any`[], `any`\> ; `logger`: { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } = logger.stubs; `removeConfig`: `SinonStub`<`any`[], `any`\> ; `removeSecret`: `SinonStub`<`any`[], `any`\> ; `removeState`: `SinonStub`<`any`[], `any`\> ; `setConfig`: `SinonStub`<`any`[], `any`\> ; `setSecret`: `SinonStub`<`any`[], `any`\> ; `setState`: `SinonStub`<`any`[], `any`\> ; `startActiveSpan`: `SinonStub`<`any`[], `any`\> ; `wrapInSpan`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.emit` | `SinonStub`<`any`[], `any`\> |
| `stubs.getConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.getSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.getState` | `SinonStub`<`any`[], `any`\> |
| `stubs.invoke` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger` | { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.logger.debug` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.error` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.fatal` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.info` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.trace` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.warn` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeState` | `SinonStub`<`any`[], `any`\> |
| `stubs.setConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.setSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.setState` | `SinonStub`<`any`[], `any`\> |
| `stubs.startActiveSpan` | `SinonStub`<`any`[], `any`\> |
| `stubs.wrapInSpan` | `SinonStub`<`any`[], `any`\> |

#### Defined in

[mocks/getSubscriptionContext.mock.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getSubscriptionContext.mock.ts#L11)

___

### getSubscriptionTransformContextMock

▸ **getSubscriptionTransformContextMock**(`message`, `sandbox?`): `Object`

A function that returns a mock object for subscription transform function context

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |
| `sandbox?` | `SinonSandbox` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `mock` | { `configs`: { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } ; `logger`: [`Logger`](../classes/purista_core.Logger.md) ; `message`: `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\> ; `secrets`: { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } ; `startActiveSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> ; `states`: { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } ; `wrapInSpan`: <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\>  } |
| `mock.configs` | { `getConfig`: [`ConfigGetterFunction`](purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](purista_core.md#configsetterfunction) |
| `mock.logger` | [`Logger`](../classes/purista_core.Logger.md) |
| `mock.message` | `Readonly`<[`EBMessage`](purista_core.md#ebmessage)\> |
| `mock.secrets` | { `getSecret`: [`SecretGetterFunction`](purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_core.md#secretsetterfunction)  } |
| `mock.secrets.getSecret` | [`SecretGetterFunction`](purista_core.md#secretgetterfunction) |
| `mock.secrets.removeSecret` | [`SecretDeleteFunction`](purista_core.md#secretdeletefunction) |
| `mock.secrets.setSecret` | [`SecretSetterFunction`](purista_core.md#secretsetterfunction) |
| `mock.startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> |
| `mock.states` | { `getState`: [`StateGetterFunction`](purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_core.md#statesetterfunction)  } |
| `mock.states.getState` | [`StateGetterFunction`](purista_core.md#stategetterfunction) |
| `mock.states.removeState` | [`StateDeleteFunction`](purista_core.md#statedeletefunction) |
| `mock.states.setState` | [`StateSetterFunction`](purista_core.md#statesetterfunction) |
| `mock.wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> |
| `stubs` | { `getConfig`: `SinonStub`<`any`[], `any`\> ; `getSecret`: `SinonStub`<`any`[], `any`\> ; `getState`: `SinonStub`<`any`[], `any`\> ; `logger`: { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } = logger.stubs; `removeConfig`: `SinonStub`<`any`[], `any`\> ; `removeSecret`: `SinonStub`<`any`[], `any`\> ; `removeState`: `SinonStub`<`any`[], `any`\> ; `setConfig`: `SinonStub`<`any`[], `any`\> ; `setSecret`: `SinonStub`<`any`[], `any`\> ; `setState`: `SinonStub`<`any`[], `any`\> ; `startActiveSpan`: `SinonStub`<`any`[], `any`\> ; `wrapInSpan`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.getConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.getSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.getState` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger` | { `debug`: `SinonStub`<`any`[], `any`\> ; `error`: `SinonStub`<`any`[], `any`\> ; `fatal`: `SinonStub`<`any`[], `any`\> ; `info`: `SinonStub`<`any`[], `any`\> ; `trace`: `SinonStub`<`any`[], `any`\> ; `warn`: `SinonStub`<`any`[], `any`\>  } |
| `stubs.logger.debug` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.error` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.fatal` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.info` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.trace` | `SinonStub`<`any`[], `any`\> |
| `stubs.logger.warn` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.removeState` | `SinonStub`<`any`[], `any`\> |
| `stubs.setConfig` | `SinonStub`<`any`[], `any`\> |
| `stubs.setSecret` | `SinonStub`<`any`[], `any`\> |
| `stubs.setState` | `SinonStub`<`any`[], `any`\> |
| `stubs.startActiveSpan` | `SinonStub`<`any`[], `any`\> |
| `stubs.wrapInSpan` | `SinonStub`<`any`[], `any`\> |

#### Defined in

[mocks/getSubscriptionTransformContext.mock.ts:11](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/mocks/getSubscriptionTransformContext.mock.ts#L11)
