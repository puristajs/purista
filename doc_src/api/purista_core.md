---
# This control sidebar index
index: 1
# This is the title of the article
title: "@purista/core"
---

[PURISTA API](README.md) / @purista/core

# Module: @purista/core

## Table of contents

### Enumerations

- [EBMessageType](enums/purista_core.EBMessageType.md)
- [StatusCode](enums/purista_core.StatusCode.md)

### Classes

- [DefaultEventBridge](classes/purista_core.DefaultEventBridge.md)
- [FunctionDefinitionBuilder](classes/purista_core.FunctionDefinitionBuilder.md)
- [HandledError](classes/purista_core.HandledError.md)
- [HttpServerService](classes/purista_core.HttpServerService.md)
- [Service](classes/purista_core.Service.md)
- [ServiceClass](classes/purista_core.ServiceClass.md)
- [SubscriptionDefinitionBuilder](classes/purista_core.SubscriptionDefinitionBuilder.md)
- [UnhandledError](classes/purista_core.UnhandledError.md)

### Interfaces

- [EventBridge](interfaces/purista_core.EventBridge.md)

### Type aliases

- [Command](purista_core.md#command)
- [CommandDefinition](purista_core.md#commanddefinition)
- [CommandErrorResponse](purista_core.md#commanderrorresponse)
- [CommandFunction](purista_core.md#commandfunction)
- [CommandResponse](purista_core.md#commandresponse)
- [CommandSuccessResponse](purista_core.md#commandsuccessresponse)
- [CompressionMethod](purista_core.md#compressionmethod)
- [CompressionMiddlewareOptions](purista_core.md#compressionmiddlewareoptions)
- [ContentType](purista_core.md#contenttype)
- [Context](purista_core.md#context)
- [CorrelationId](purista_core.md#correlationid)
- [EBMessage](purista_core.md#ebmessage)
- [EBMessageAddress](purista_core.md#ebmessageaddress)
- [EBMessageBase](purista_core.md#ebmessagebase)
- [EBMessageId](purista_core.md#ebmessageid)
- [ErrorResponse](purista_core.md#errorresponse)
- [EventBridgeConfig](purista_core.md#eventbridgeconfig)
- [ExtractPayloadMiddlewareOptions](purista_core.md#extractpayloadmiddlewareoptions)
- [Handler](purista_core.md#handler)
- [HelmetMiddlewareOptions](purista_core.md#helmetmiddlewareoptions)
- [HttpExposedServiceMeta](purista_core.md#httpexposedservicemeta)
- [HttpServerConfig](purista_core.md#httpserverconfig)
- [HttpServiceSubscriptionCallBack](purista_core.md#httpservicesubscriptioncallback)
- [InfoMessage](purista_core.md#infomessage)
- [InfoMessageType](purista_core.md#infomessagetype)
- [InfoServiceBase](purista_core.md#infoservicebase)
- [InfoServiceDrain](purista_core.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_core.md#infoservicefunctionadded)
- [InfoServiceInit](purista_core.md#infoserviceinit)
- [InfoServiceNotReady](purista_core.md#infoservicenotready)
- [InfoServiceReady](purista_core.md#infoserviceready)
- [InfoServiceShutdown](purista_core.md#infoserviceshutdown)
- [InternalError500HandlerOptions](purista_core.md#internalerror500handleroptions)
- [LogLevelName](purista_core.md#loglevelname)
- [Logger](purista_core.md#logger)
- [Middleware](purista_core.md#middleware)
- [NotFound404HandlerOptions](purista_core.md#notfound404handleroptions)
- [PrincipalId](purista_core.md#principalid)
- [QueryParameter](purista_core.md#queryparameter)
- [RequestBodyToJsonMiddlewareOptions](purista_core.md#requestbodytojsonmiddlewareoptions)
- [ResponseToJsonMiddlewareOptions](purista_core.md#responsetojsonmiddlewareoptions)
- [ServiceInfoType](purista_core.md#serviceinfotype)
- [StaticFileHandlerOptions](purista_core.md#staticfilehandleroptions)
- [Subscription](purista_core.md#subscription)
- [SubscriptionCallback](purista_core.md#subscriptioncallback)
- [SubscriptionDefinition](purista_core.md#subscriptiondefinition)
- [SubscriptionFunction](purista_core.md#subscriptionfunction)
- [SubscriptionId](purista_core.md#subscriptionid)
- [SupportedHttpMethod](purista_core.md#supportedhttpmethod)
- [TraceId](purista_core.md#traceid)
- [ValidationDefinition](purista_core.md#validationdefinition)

### Variables

- [MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION](purista_core.md#min_content_size_for_compression)
- [OPENAPI\_DEFAULT\_INFO](purista_core.md#openapi_default_info)
- [OPENAPI\_DEFAULT\_MOUNT\_PATH](purista_core.md#openapi_default_mount_path)
- [ServiceInfo](purista_core.md#serviceinfo)
- [infoMessageTypes](purista_core.md#infomessagetypes)

### Functions

- [createCompressionMiddleware](purista_core.md#createcompressionmiddleware)
- [createErrorResponse](purista_core.md#createerrorresponse)
- [createExtractPayloadMiddleware](purista_core.md#createextractpayloadmiddleware)
- [createHelmetMiddleware](purista_core.md#createhelmetmiddleware)
- [createInfoMessage](purista_core.md#createinfomessage)
- [createInternalError500Handler](purista_core.md#createinternalerror500handler)
- [createNotFound404Handler](purista_core.md#createnotfound404handler)
- [createRequestBodyToJsonMiddleware](purista_core.md#createrequestbodytojsonmiddleware)
- [createResponseToJsonMiddleware](purista_core.md#createresponsetojsonmiddleware)
- [createStaticFileHandler](purista_core.md#createstaticfilehandler)
- [createSuccessResponse](purista_core.md#createsuccessresponse)
- [getCleanedMessage](purista_core.md#getcleanedmessage)
- [getCompressionMethod](purista_core.md#getcompressionmethod)
- [getCompressionStream](purista_core.md#getcompressionstream)
- [getDefaultCompressionMiddlewareOptions](purista_core.md#getdefaultcompressionmiddlewareoptions)
- [getDefaultConfig](purista_core.md#getdefaultconfig)
- [getDefaultExtractPayloadMiddlewareOptions](purista_core.md#getdefaultextractpayloadmiddlewareoptions)
- [getDefaultHelmetMiddlewareOptions](purista_core.md#getdefaulthelmetmiddlewareoptions)
- [getDefaultInternalError500HandlerOptions](purista_core.md#getdefaultinternalerror500handleroptions)
- [getDefaultNotFound404HandlerOptions](purista_core.md#getdefaultnotfound404handleroptions)
- [getDefaultRequestBodyToJsonMiddlewareOptions](purista_core.md#getdefaultrequestbodytojsonmiddlewareoptions)
- [getDefaultResponseToJsonMiddlewareOptions](purista_core.md#getdefaultresponsetojsonmiddlewareoptions)
- [getDefaultStaticFileHandlerOptions](purista_core.md#getdefaultstaticfilehandleroptions)
- [getErrorMessageForCode](purista_core.md#geterrormessageforcode)
- [getEventBridgeMock](purista_core.md#geteventbridgemock)
- [getFunctionWithValidation](purista_core.md#getfunctionwithvalidation)
- [getLoggerMock](purista_core.md#getloggermock)
- [getNewCorrelationId](purista_core.md#getnewcorrelationid)
- [getNewEBMessageId](purista_core.md#getnewebmessageid)
- [getNewSubscriptionId](purista_core.md#getnewsubscriptionid)
- [getNewTraceId](purista_core.md#getnewtraceid)
- [getUniqueId](purista_core.md#getuniqueid)
- [initLogger](purista_core.md#initlogger)
- [isCommand](purista_core.md#iscommand)
- [isCommandErrorResponse](purista_core.md#iscommanderrorresponse)
- [isCommandResponse](purista_core.md#iscommandresponse)
- [isCommandSuccessResponse](purista_core.md#iscommandsuccessresponse)
- [isHttpExposedServiceMeta](purista_core.md#ishttpexposedservicemeta)
- [isInfoMessage](purista_core.md#isinfomessage)
- [isInfoServiceFunctionAdded](purista_core.md#isinfoservicefunctionadded)
- [openApiDocuIndex](purista_core.md#openapidocuindex)
- [openApiDocuJsInit](purista_core.md#openapidocujsinit)
- [openApiHandler](purista_core.md#openapihandler)

## Type aliases

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `command`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `messageType`: [`Command`](enums/purista_core.EBMessageType.md#command) ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

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
| `ParameterType` | `Record`<`string`, `unknown`\> |

#### Defined in

[core/src/core/types/commandType/Command.ts:18](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/Command.ts#L18)

___

### CommandDefinition

Ƭ **CommandDefinition**<`MetadataType`, `CommandFunctionType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MetadataType` | `Record`<`string`, `unknown`\> |
| `CommandFunctionType` | [`CommandFunction`](purista_core.md#commandfunction) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | `CommandFunctionType` |
| `commandDescription` | `string` |
| `commandName` | `string` |
| `metadata` | `MetadataType` |

#### Defined in

[core/src/core/types/commandType/CommandDefinition.ts:6](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandDefinition.ts#L6)

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `messageType`: [`CommandErrorResponse`](enums/purista_core.EBMessageType.md#commanderrorresponse) ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `response`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](enums/purista_core.StatusCode.md)  } ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

[core/src/core/types/commandType/CommandErrorResponse.ts:11](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandErrorResponse.ts#L11)

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>: (`this`: `ServiceClassType`, `payload`: `PayloadType`, `params`: `ParamsType`, `message`: [`Command`](purista_core.md#command)<`PayloadType`, `ParamsType`\>) => `Promise`<`ResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/purista_core.Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

#### Type declaration

▸ (`this`, `payload`, `params`, `message`): `Promise`<`ResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `payload` | `PayloadType` |
| `params` | `ParamsType` |
| `message` | [`Command`](purista_core.md#command)<`PayloadType`, `ParamsType`\> |

##### Returns

`Promise`<`ResultType`\>

#### Defined in

[core/src/core/types/commandType/CommandFunction.ts:7](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandFunction.ts#L7)

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\> \| [`CommandErrorResponse`](purista_core.md#commanderrorresponse)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

[core/src/core/types/commandType/CommandResponse.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandResponse.ts#L9)

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](purista_core.md#correlationid) ; `isMultipart?`: `boolean` ; `messageType`: [`CommandSuccessResponse`](enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `receiver`: [`EBMessageAddress`](purista_core.md#ebmessageaddress) ; `response`: `PayloadType` ; `sender`: [`EBMessageAddress`](purista_core.md#ebmessageaddress)  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

[core/src/core/types/commandType/CommandSuccessResponse.ts:11](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandSuccessResponse.ts#L11)

___

### CompressionMethod

Ƭ **CompressionMethod**: ``"gzip"`` \| ``"deflat"`` \| ``"br"`` \| `undefined`

#### Defined in

[core/src/helper/types/CompressionMethod.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/types/CompressionMethod.ts#L1)

___

### CompressionMiddlewareOptions

Ƭ **CompressionMiddlewareOptions**: `Object`

#### Defined in

[core/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts#L4)

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| `string`

#### Defined in

[core/src/http-server/types/ContentType.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/ContentType.ts#L1)

___

### Context

Ƭ **Context**<`PayloadType`, `ParameterType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |
| `ParameterType` | `Record`<`string`, `unknown`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `headers` | `Record`<`string`, `string`\> |
| `isResponseSend` | `boolean` |
| `parameter` | `ParameterType` |
| `payload` | `PayloadType` |
| `statusCode` | [`StatusCode`](enums/purista_core.StatusCode.md) |
| `traceId?` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/src/http-server/types/Context.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/Context.ts#L3)

___

### CorrelationId

Ƭ **CorrelationId**: `string`

#### Defined in

[core/src/core/types/CorrelationId.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/CorrelationId.ts#L1)

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_core.md#command) \| [`CommandResponse`](purista_core.md#commandresponse) \| [`InfoMessage`](purista_core.md#infomessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

[core/src/core/types/EBMessage.ts:7](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EBMessage.ts#L7)

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

[core/src/core/types/EBMessageAddress.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EBMessageAddress.ts#L4)

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId?` | [`CorrelationId`](purista_core.md#correlationid) |
| `id` | [`EBMessageId`](purista_core.md#ebmessageid) |
| `principalId?` | [`PrincipalId`](purista_core.md#principalid) |
| `timestamp` | `number` |
| `traceId?` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/src/core/types/EBMessageBase.ts:6](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EBMessageBase.ts#L6)

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

[core/src/core/types/EBMessageId.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EBMessageId.ts#L4)

___

### ErrorResponse

Ƭ **ErrorResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |
| `message` | `string` |
| `status` | [`StatusCode`](enums/purista_core.StatusCode.md) |
| `traceId?` | [`TraceId`](purista_core.md#traceid) |

#### Defined in

[core/src/core/types/ErrorResponse.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/ErrorResponse.ts#L4)

___

### EventBridgeConfig

Ƭ **EventBridgeConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultTtl` | `number` |

#### Defined in

[core/src/core/types/EventBridgeConfig.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/EventBridgeConfig.ts#L1)

___

### ExtractPayloadMiddlewareOptions

Ƭ **ExtractPayloadMiddlewareOptions**: `Object`

#### Defined in

[core/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts#L3)

___

### Handler

Ƭ **Handler**: (`this`: [`HttpServerService`](classes/purista_core.HttpServerService.md), `request`: `Http2ServerRequest`, `response`: `Http2ServerResponse`, `context`: [`Context`](purista_core.md#context)) => `Promise`<[`Context`](purista_core.md#context)\>

#### Type declaration

▸ (`this`, `request`, `response`, `context`): `Promise`<[`Context`](purista_core.md#context)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/purista_core.HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](purista_core.md#context) |

##### Returns

`Promise`<[`Context`](purista_core.md#context)\>

#### Defined in

[core/src/http-server/types/Handler.ts:6](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/Handler.ts#L6)

___

### HelmetMiddlewareOptions

Ƭ **HelmetMiddlewareOptions**: `Object`

#### Defined in

[core/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:6](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts#L6)

___

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `http`: { `contentType?`: [`ContentType`](purista_core.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `expose.http` | { `contentType?`: [`ContentType`](purista_core.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  } |
| `expose.http.contentType?` | [`ContentType`](purista_core.md#contenttype) |
| `expose.http.method` | ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` |
| `expose.http.openApi?` | { `additionalStatusCodes?`: [`StatusCode`](enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } |
| `expose.http.openApi.additionalStatusCodes?` | [`StatusCode`](enums/purista_core.StatusCode.md)[] |
| `expose.http.openApi.description` | `string` |
| `expose.http.openApi.inputPayload?` | `SchemaObject` |
| `expose.http.openApi.outputPayload?` | `SchemaObject` |
| `expose.http.openApi.parameter?` | `SchemaObject` |
| `expose.http.openApi.query?` | [`QueryParameter`](purista_core.md#queryparameter)[] |
| `expose.http.openApi.summary` | `string` |
| `expose.http.openApi.tags?` | `string`[] |
| `expose.http.path` | `string` |

#### Defined in

[core/src/http-server/types/HttpExposedServiceMeta.ts:7](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/HttpExposedServiceMeta.ts#L7)

___

### HttpServerConfig

Ƭ **HttpServerConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiMountPath?` | `string` |
| `cookieSecret?` | `string` |
| `domain` | `string` |
| `logLevel?` | [`LogLevelName`](purista_core.md#loglevelname) |
| `openApi?` | { `components?`: `ComponentsObject` ; `enabled?`: `boolean` ; `externalDocs?`: `ExternalDocumentationObject` ; `info`: `InfoObject` ; `path?`: `string` ; `security?`: `SecurityRequirementObject`[] ; `servers?`: `ServerObject`[] ; `tags?`: `TagObject`[]  } |
| `openApi.components?` | `ComponentsObject` |
| `openApi.enabled?` | `boolean` |
| `openApi.externalDocs?` | `ExternalDocumentationObject` |
| `openApi.info` | `InfoObject` |
| `openApi.path?` | `string` |
| `openApi.security?` | `SecurityRequirementObject`[] |
| `openApi.servers?` | `ServerObject`[] |
| `openApi.tags?` | `TagObject`[] |
| `options` | `SecureServerOptions` |
| `port` | `number` |

#### Defined in

[core/src/http-server/types/HttpServerConfig.ts:13](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/HttpServerConfig.ts#L13)

___

### HttpServiceSubscriptionCallBack

Ƭ **HttpServiceSubscriptionCallBack**<`MessageType`\>: [`SubscriptionCallback`](purista_core.md#subscriptioncallback)<[`HttpServerService`](classes/purista_core.HttpServerService.md), `MessageType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](purista_core.md#ebmessage) |

#### Defined in

[core/src/http-server/types/HttpServiceSubscriptionCallBack.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/HttpServiceSubscriptionCallBack.ts#L4)

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_core.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_core.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_core.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_core.md#infoservicenotready) \| [`InfoServiceReady`](purista_core.md#infoserviceready) \| [`InfoServiceShutdown`](purista_core.md#infoserviceshutdown)

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoMessage.ts#L10)

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](enums/purista_core.EBMessageType.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](enums/purista_core.EBMessageType.md#infoservicefunctionadded) \| [`InfoServiceInit`](enums/purista_core.EBMessageType.md#infoserviceinit) \| [`InfoServiceNotReady`](enums/purista_core.EBMessageType.md#infoservicenotready) \| [`InfoServiceReady`](enums/purista_core.EBMessageType.md#infoserviceready) \| [`InfoServiceShutdown`](enums/purista_core.EBMessageType.md#infoserviceshutdown)

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:18](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoMessage.ts#L18)

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `data?`: `Record`<`string`, `unknown`\> ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_core.md#ebmessagebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceBase.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceBase.ts#L3)

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](enums/purista_core.EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceDrain.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceDrain.ts#L4)

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](enums/purista_core.EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceFunctionAdded.ts:5](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceFunctionAdded.ts#L5)

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](enums/purista_core.EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceInit.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceInit.ts#L4)

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](enums/purista_core.EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceNotReady.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceNotReady.ts#L4)

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](enums/purista_core.EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceReady.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceReady.ts#L4)

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](enums/purista_core.EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_core.md#infoservicebase)

#### Defined in

[core/src/core/types/infoType/InfoServiceShutdown.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceShutdown.ts#L4)

___

### InternalError500HandlerOptions

Ƭ **InternalError500HandlerOptions**: `Object`

#### Defined in

[core/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts#L4)

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"``

#### Defined in

[core/src/core/types/LogLevelName.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/LogLevelName.ts#L1)

___

### Logger

Ƭ **Logger**: `Pick`<`TsLogger`, ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"getChildLogger"``\>

#### Defined in

[core/src/core/types/Logger.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/Logger.ts#L3)

___

### Middleware

Ƭ **Middleware**: (`this`: [`HttpServerService`](classes/purista_core.HttpServerService.md), `request`: `Http2ServerRequest`, `response`: `Http2ServerResponse`, `context`: [`Context`](purista_core.md#context)) => `Promise`<[`Context`](purista_core.md#context)\>

#### Type declaration

▸ (`this`, `request`, `response`, `context`): `Promise`<[`Context`](purista_core.md#context)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/purista_core.HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](purista_core.md#context) |

##### Returns

`Promise`<[`Context`](purista_core.md#context)\>

#### Defined in

[core/src/http-server/types/Middleware.ts:6](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/Middleware.ts#L6)

___

### NotFound404HandlerOptions

Ƭ **NotFound404HandlerOptions**: `Object`

#### Defined in

[core/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts#L4)

___

### PrincipalId

Ƭ **PrincipalId**: `string`

#### Defined in

[core/src/core/types/PrincipalId.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/PrincipalId.ts#L1)

___

### QueryParameter

Ƭ **QueryParameter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `required` | `boolean` |

#### Defined in

[core/src/http-server/types/QueryParameter.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/QueryParameter.ts#L1)

___

### RequestBodyToJsonMiddlewareOptions

Ƭ **RequestBodyToJsonMiddlewareOptions**: `Object`

#### Defined in

[core/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts#L3)

___

### ResponseToJsonMiddlewareOptions

Ƭ **ResponseToJsonMiddlewareOptions**: `Object`

#### Defined in

[core/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts#L3)

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

[core/src/core/types/infoType/ServiceInfoType.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/ServiceInfoType.ts#L4)

___

### StaticFileHandlerOptions

Ƭ **StaticFileHandlerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gzipMimeTypes?` | [`ContentType`](purista_core.md#contenttype)[] |
| `path` | `string` |
| `removeStartingPath?` | `string` |

#### Defined in

[core/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts#L10)

___

### Subscription

Ƭ **Subscription**: `Object`

A subscription managed by the event bridge

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageTypes?` | [`EBMessageType`](enums/purista_core.EBMessageType.md)[] |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `subscriber` | [`EBMessageAddress`](purista_core.md#ebmessageaddress) |
| `callback` | (`subscriptionId`: `string`, `message`: [`EBMessage`](purista_core.md#ebmessage)) => `Promise`<`void`\> |

#### Defined in

core/src/core/types/Subscription/Subscription.ts:9

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`ServiceClassType`, `MessageType`\>: (`this`: `ServiceClassType`, `subscriptionId`: [`SubscriptionId`](purista_core.md#subscriptionid), `message`: `MessageType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/purista_core.Service.md) |
| `MessageType` | [`EBMessage`](purista_core.md#ebmessage) |

#### Type declaration

▸ (`this`, `subscriptionId`, `message`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `subscriptionId` | [`SubscriptionId`](purista_core.md#subscriptionid) |
| `message` | `MessageType` |

##### Returns

`Promise`<`void`\>

#### Defined in

core/src/core/types/Subscription/SubscriptionCallback.ts:5

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`MessageType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](purista_core.md#ebmessage) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageTypes?` | [`EBMessageType`](enums/purista_core.EBMessageType.md)[] |
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
| `call` | (`id`: `string`, `message`: `MessageType`) => `Promise`<`void`\> |

#### Defined in

core/src/core/types/Subscription/SubscriptionDefinition.ts:5

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`\>: (`this`: `ServiceClassType`, `message`: [`EBMessage`](purista_core.md#ebmessage), `subscriptionId`: [`SubscriptionId`](purista_core.md#subscriptionid)) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/purista_core.Service.md) |

#### Type declaration

▸ (`this`, `message`, `subscriptionId`): `Promise`<`void`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |
| `subscriptionId` | [`SubscriptionId`](purista_core.md#subscriptionid) |

##### Returns

`Promise`<`void`\>

#### Defined in

core/src/core/types/Subscription/SubscriptionFunction.ts:8

___

### SubscriptionId

Ƭ **SubscriptionId**: `string`

Unique id of the subscription

#### Defined in

core/src/core/types/Subscription/SubscriptionId.ts:4

___

### SupportedHttpMethod

Ƭ **SupportedHttpMethod**: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"``

Supported HTTP-Methods for defining endpoints

#### Defined in

[core/src/helper/types/SupportedHttpMethod.ts:2](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/types/SupportedHttpMethod.ts#L2)

___

### TraceId

Ƭ **TraceId**: `string`

#### Defined in

[core/src/core/types/TraceId.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/TraceId.ts#L1)

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

[core/src/helper/types/ValidationDefinition.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/types/ValidationDefinition.ts#L3)

## Variables

### MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION

• `Const` **MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION**: ``1024``

#### Defined in

[core/src/helper/types/MinContentSizeForCompression.const.ts:1](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/types/MinContentSizeForCompression.const.ts#L1)

___

### OPENAPI\_DEFAULT\_INFO

• `Const` **OPENAPI\_DEFAULT\_INFO**: `InfoObject`

#### Defined in

[core/src/http-server/config/defaults.config.ts:7](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/config/defaults.config.ts#L7)

___

### OPENAPI\_DEFAULT\_MOUNT\_PATH

• `Const` **OPENAPI\_DEFAULT\_MOUNT\_PATH**: `string`

#### Defined in

[core/src/http-server/config/defaults.config.ts:5](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/config/defaults.config.ts#L5)

___

### ServiceInfo

• `Const` **ServiceInfo**: [`ServiceInfoType`](purista_core.md#serviceinfotype)

#### Defined in

[core/src/http-server/config/ServiceInfo.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/config/ServiceInfo.ts#L3)

___

### infoMessageTypes

• `Const` **infoMessageTypes**: [`EBMessageType`](enums/purista_core.EBMessageType.md)[]

#### Defined in

[core/src/core/types/infoType/InfoMessage.ts:25](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoMessage.ts#L25)

## Functions

### createCompressionMiddleware

▸ **createCompressionMiddleware**(`options?`): [`Middleware`](purista_core.md#middleware)

If the request method is HEAD, then the response is ended. Otherwise, the compression method is
determined and the compression stream is created. If the compression method is not null, then the
content-encoding header is set and the compression stream is piped to the response. Otherwise, the
response is returned

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`CompressionMiddlewareOptions`](purista_core.md#compressionmiddlewareoptions) | An object that contains the following properties: |

#### Returns

[`Middleware`](purista_core.md#middleware)

A middleware function.

#### Defined in

[core/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:23](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts#L23)

___

### createErrorResponse

▸ **createErrorResponse**(`originalEBMessage`, `statusCode?`, `error?`): [`CommandErrorResponse`](purista_core.md#commanderrorresponse)

Creates a error response object based on original command
Toggles sender and receiver

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `originalEBMessage` | [`Command`](purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> | `undefined` |
| `statusCode` | [`StatusCode`](enums/purista_core.StatusCode.md) | `StatusCode.InternalServerError` |
| `error?` | `unknown` | `undefined` |

#### Returns

[`CommandErrorResponse`](purista_core.md#commanderrorresponse)

CommandErrorResponse message object

#### Defined in

[core/src/core/helper/createErrorResponse.impl.ts:15](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/createErrorResponse.impl.ts#L15)

___

### createExtractPayloadMiddleware

▸ **createExtractPayloadMiddleware**(`options?`): [`Middleware`](purista_core.md#middleware)

It takes in an object with options and returns a middleware function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ExtractPayloadMiddlewareOptions`](purista_core.md#extractpayloadmiddlewareoptions) | An object with the following keys: |

#### Returns

[`Middleware`](purista_core.md#middleware)

A middleware function that will extract the payload from the request.

#### Defined in

[core/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:19](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts#L19)

___

### createHelmetMiddleware

▸ **createHelmetMiddleware**(`options?`): [`Middleware`](purista_core.md#middleware)

It creates a middleware function that runs the given middleware function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`HelmetMiddlewareOptions`](purista_core.md#helmetmiddlewareoptions) | The options passed to the middleware. |

#### Returns

[`Middleware`](purista_core.md#middleware)

A function that can be used to perform the action `apply`
         in the context of the library.

#### Defined in

[core/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:23](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts#L23)

___

### createInfoMessage

▸ **createInfoMessage**(`messageType`, `serviceName`, `serviceVersion`, `serviceTarget?`, `data?`): [`InfoMessage`](purista_core.md#infomessage)

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageType` | [`InfoMessageType`](purista_core.md#infomessagetype) |
| `serviceName` | `string` |
| `serviceVersion` | `string` |
| `serviceTarget?` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |

#### Returns

[`InfoMessage`](purista_core.md#infomessage)

#### Defined in

[core/src/core/helper/createInfoMessage.impl.ts:5](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/createInfoMessage.impl.ts#L5)

___

### createInternalError500Handler

▸ **createInternalError500Handler**(`options?`): [`Handler`](purista_core.md#handler)

Creates a handler that returns a 500 Internal Server Error response

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`InternalError500HandlerOptions`](purista_core.md#internalerror500handleroptions) | An object that contains the following properties: |

#### Returns

[`Handler`](purista_core.md#handler)

A handler function that returns a context object.

#### Defined in

[core/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:20](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts#L20)

___

### createNotFound404Handler

▸ **createNotFound404Handler**(`options?`): [`Handler`](purista_core.md#handler)

Creates a handler that returns a 404 Not Found response

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`NotFound404HandlerOptions`](purista_core.md#notfound404handleroptions) | An object that contains the following properties: |

#### Returns

[`Handler`](purista_core.md#handler)

A function that returns a function.

#### Defined in

[core/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:21](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts#L21)

___

### createRequestBodyToJsonMiddleware

▸ **createRequestBodyToJsonMiddleware**(`options?`): [`Middleware`](purista_core.md#middleware)

The function takes in a configuration object and returns a middleware

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`RequestBodyToJsonMiddlewareOptions`](purista_core.md#requestbodytojsonmiddlewareoptions) | An object containing the following properties: |

#### Returns

[`Middleware`](purista_core.md#middleware)

The return value of the function is the return value of the function.

#### Defined in

[core/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:19](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts#L19)

___

### createResponseToJsonMiddleware

▸ **createResponseToJsonMiddleware**(`options?`): [`Middleware`](purista_core.md#middleware)

If the response is not a JSON string, then convert it to a JSON string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ResponseToJsonMiddlewareOptions`](purista_core.md#responsetojsonmiddlewareoptions) | An object that contains the following properties: |

#### Returns

[`Middleware`](purista_core.md#middleware)

A middleware function.

#### Defined in

[core/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:19](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts#L19)

___

### createStaticFileHandler

▸ **createStaticFileHandler**(`options?`): [`Middleware`](purista_core.md#middleware)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`StaticFileHandlerOptions`](purista_core.md#staticfilehandleroptions) |

#### Returns

[`Middleware`](purista_core.md#middleware)

#### Defined in

[core/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:36](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts#L36)

___

### createSuccessResponse

▸ **createSuccessResponse**<`T`\>(`originalEBMessage`, `payload`): [`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalEBMessage` | [`Command`](purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> |
| `payload` | `T` |

#### Returns

[`CommandSuccessResponse`](purista_core.md#commandsuccessresponse)<`T`\>

#### Defined in

[core/src/core/helper/createSuccessResponse.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/createSuccessResponse.impl.ts#L3)

___

### getCleanedMessage

▸ **getCleanedMessage**(`message`): `Record`<`string`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[core/src/core/helper/getCleanedMessage.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getCleanedMessage.impl.ts#L3)

___

### getCompressionMethod

▸ **getCompressionMethod**(`input`, `size?`): [`CompressionMethod`](purista_core.md#compressionmethod)

If the client accepts gzip, deflate, or br encoding, return the best one that's available

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `IncomingHttpHeaders` | IncomingHttpHeaders |
| `size?` | `number` | - |

#### Returns

[`CompressionMethod`](purista_core.md#compressionmethod)

A compression method.

#### Defined in

[core/src/helper/getCompressionMethod.impl.ts:11](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/getCompressionMethod.impl.ts#L11)

___

### getCompressionStream

▸ **getCompressionStream**(`compressionMethod`): `undefined` \| `BrotliCompress`

Given a compression method, return a stream that compresses data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compressionMethod` | [`CompressionMethod`](purista_core.md#compressionmethod) | The compression method to use. |

#### Returns

`undefined` \| `BrotliCompress`

A function that accepts a stream and returns a stream.

#### Defined in

[core/src/helper/getCompressionStream.impl.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/getCompressionStream.impl.ts#L10)

___

### getDefaultCompressionMiddlewareOptions

▸ **getDefaultCompressionMiddlewareOptions**(): [`CompressionMiddlewareOptions`](purista_core.md#compressionmiddlewareoptions)

It returns an object with default values for the compression middleware options.

#### Returns

[`CompressionMiddlewareOptions`](purista_core.md#compressionmiddlewareoptions)

A CompressionMiddlewareOptions object.

#### Defined in

[core/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts#L10)

___

### getDefaultConfig

▸ **getDefaultConfig**(): [`HttpServerConfig`](purista_core.md#httpserverconfig)

#### Returns

[`HttpServerConfig`](purista_core.md#httpserverconfig)

#### Defined in

[core/src/http-server/config/getDefaultConfig.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/config/getDefaultConfig.ts#L4)

___

### getDefaultExtractPayloadMiddlewareOptions

▸ **getDefaultExtractPayloadMiddlewareOptions**(): [`ExtractPayloadMiddlewareOptions`](purista_core.md#extractpayloadmiddlewareoptions)

It returns an object with default values for the ExtractPayloadMiddlewareOptions.

#### Returns

[`ExtractPayloadMiddlewareOptions`](purista_core.md#extractpayloadmiddlewareoptions)

An object with the default configuration for the extract payload middleware.

#### Defined in

[core/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts#L9)

___

### getDefaultHelmetMiddlewareOptions

▸ **getDefaultHelmetMiddlewareOptions**(): [`HelmetMiddlewareOptions`](purista_core.md#helmetmiddlewareoptions)

It returns an object with the default values for the HelmetMiddlewareOptions

#### Returns

[`HelmetMiddlewareOptions`](purista_core.md#helmetmiddlewareoptions)

A HelmetMiddlewareOptions object.

#### Defined in

[core/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:12](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts#L12)

___

### getDefaultInternalError500HandlerOptions

▸ **getDefaultInternalError500HandlerOptions**(): [`InternalError500HandlerOptions`](purista_core.md#internalerror500handleroptions)

It returns an object with default values for the InternalError500HandlerOptions.

#### Returns

[`InternalError500HandlerOptions`](purista_core.md#internalerror500handleroptions)

An object with the following properties:

#### Defined in

[core/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:10](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts#L10)

___

### getDefaultNotFound404HandlerOptions

▸ **getDefaultNotFound404HandlerOptions**(): [`NotFound404HandlerOptions`](purista_core.md#notfound404handleroptions)

It returns the default not found handler options.
"""

#### Returns

[`NotFound404HandlerOptions`](purista_core.md#notfound404handleroptions)

A configuration object.

#### Defined in

[core/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:11](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts#L11)

___

### getDefaultRequestBodyToJsonMiddlewareOptions

▸ **getDefaultRequestBodyToJsonMiddlewareOptions**(): [`RequestBodyToJsonMiddlewareOptions`](purista_core.md#requestbodytojsonmiddlewareoptions)

It returns a default configuration for the RequestBodyToJsonMiddlewareOptions.

#### Returns

[`RequestBodyToJsonMiddlewareOptions`](purista_core.md#requestbodytojsonmiddlewareoptions)

A RequestBodyToJsonMiddlewareOptions object.

#### Defined in

[core/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts#L9)

___

### getDefaultResponseToJsonMiddlewareOptions

▸ **getDefaultResponseToJsonMiddlewareOptions**(): [`ResponseToJsonMiddlewareOptions`](purista_core.md#responsetojsonmiddlewareoptions)

It returns a default configuration for the ResponseToJsonMiddlewareOptions.

#### Returns

[`ResponseToJsonMiddlewareOptions`](purista_core.md#responsetojsonmiddlewareoptions)

A middleware function.

#### Defined in

[core/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts#L9)

___

### getDefaultStaticFileHandlerOptions

▸ **getDefaultStaticFileHandlerOptions**(): [`StaticFileHandlerOptions`](purista_core.md#staticfilehandleroptions)

It returns a default configuration for the static file middleware.

#### Returns

[`StaticFileHandlerOptions`](purista_core.md#staticfilehandleroptions)

A middleware function that can be used in the http server.

#### Defined in

[core/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:20](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts#L20)

___

### getErrorMessageForCode

▸ **getErrorMessageForCode**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`StatusCode`](enums/purista_core.StatusCode.md) |

#### Returns

`string`

#### Defined in

[core/src/core/helper/getErrorMessageForCode.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getErrorMessageForCode.impl.ts#L3)

___

### getEventBridgeMock

▸ **getEventBridgeMock**(): [`EventBridge`](interfaces/purista_core.EventBridge.md)

Mocks the eventbridge and methods are stubs

#### Returns

[`EventBridge`](interfaces/purista_core.EventBridge.md)

EventBridge mocked

#### Defined in

[core/src/core/testhelper/getEventBridge.mock.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/testhelper/getEventBridge.mock.ts#L9)

___

### getFunctionWithValidation

▸ **getFunctionWithValidation**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`): [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](classes/purista_core.Service.md)<`ServiceClassType`\> |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |
| `inputPayloadSchema` | `undefined` \| `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\> |
| `inputParameterSchema` | `undefined` \| `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\> |
| `outputPayloadSchema` | `undefined` \| `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\> |

#### Returns

[`CommandFunction`](purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/getFunctionWithValidation.ts:5](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/getFunctionWithValidation.ts#L5)

___

### getLoggerMock

▸ **getLoggerMock**(): [`Logger`](purista_core.md#logger)

#### Returns

[`Logger`](purista_core.md#logger)

#### Defined in

[core/src/core/testhelper/getLogger.mock.ts:5](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/testhelper/getLogger.mock.ts#L5)

___

### getNewCorrelationId

▸ **getNewCorrelationId**(): `string`

Create a new unique event bridge correlation id

#### Returns

`string`

EBMessageId

#### Defined in

[core/src/core/helper/getNewCorrelationId.ts:8](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getNewCorrelationId.ts#L8)

___

### getNewEBMessageId

▸ **getNewEBMessageId**(): `string`

Create a new unique event bridge message id

#### Returns

`string`

EBMessageId

#### Defined in

[core/src/core/helper/getNewEBMessageId.impl.ts:8](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getNewEBMessageId.impl.ts#L8)

___

### getNewSubscriptionId

▸ **getNewSubscriptionId**(): `string`

#### Returns

`string`

#### Defined in

[core/src/core/helper/getNewSubscriptionId.impl.ts:4](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getNewSubscriptionId.impl.ts#L4)

___

### getNewTraceId

▸ **getNewTraceId**(): `string`

#### Returns

`string`

#### Defined in

[core/src/core/helper/getNewTraceId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getNewTraceId.impl.ts#L3)

___

### getUniqueId

▸ **getUniqueId**(): `string`

#### Returns

`string`

#### Defined in

[core/src/core/helper/getUniqueId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/helper/getUniqueId.impl.ts#L3)

___

### initLogger

▸ **initLogger**(`minLevel`): [`Logger`](purista_core.md#logger)

Create a new logger with the given minimum log level

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minLevel` | `undefined` \| [`LogLevelName`](purista_core.md#loglevelname) | The minimum level of log messages to display. |

#### Returns

[`Logger`](purista_core.md#logger)

#### Defined in

[core/src/core/initLogger.impl.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/initLogger.impl.ts#L9)

___

### isCommand

▸ **isCommand**(`message`): message is Command<unknown, Record<string, unknown\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](purista_core.md#ebmessage) |

#### Returns

message is Command<unknown, Record<string, unknown\>\>

#### Defined in

[core/src/core/types/commandType/Command.ts:29](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/Command.ts#L29)

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

[core/src/core/types/commandType/CommandErrorResponse.ts:23](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandErrorResponse.ts#L23)

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

[core/src/core/types/commandType/CommandResponse.ts:11](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandResponse.ts#L11)

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

[core/src/core/types/commandType/CommandSuccessResponse.ts:20](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/commandType/CommandSuccessResponse.ts#L20)

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

[core/src/http-server/types/HttpExposedServiceMeta.ts:27](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/types/HttpExposedServiceMeta.ts#L27)

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

[core/src/core/types/infoType/InfoMessage.ts:34](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoMessage.ts#L34)

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

[core/src/core/types/infoType/InfoServiceFunctionAdded.ts:9](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/infoType/InfoServiceFunctionAdded.ts#L9)

___

### openApiDocuIndex

▸ **openApiDocuIndex**(`this`, `request`, `response`, `context`): `Promise`<[`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/purista_core.HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[core/src/http-server/handler/openApiHandler/openApiDocuIndex.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/openApiHandler/openApiDocuIndex.impl.ts#L3)

___

### openApiDocuJsInit

▸ **openApiDocuJsInit**(`this`, `request`, `response`, `context`): `Promise`<[`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/purista_core.HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[core/src/http-server/handler/openApiHandler/openApiDocuJsInit.impl.ts:3](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/openApiHandler/openApiDocuJsInit.impl.ts#L3)

___

### openApiHandler

▸ **openApiHandler**(`this`, `request`, `response`, `context`): `Promise`<[`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/purista_core.HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](purista_core.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[core/src/http-server/handler/openApiHandler/openApiHandler.impl.ts:8](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/handler/openApiHandler/openApiHandler.impl.ts#L8)
