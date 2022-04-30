# @purista/core

## Table of contents

### Enumerations

- [EBMessageType](enums/EBMessageType.md)
- [ErrorCode](enums/ErrorCode.md)
- [SuccessStatusCode](enums/SuccessStatusCode.md)

### Classes

- [DefaultEventBridge](classes/DefaultEventBridge.md)
- [FunctionDefinitionBuilder](classes/FunctionDefinitionBuilder.md)
- [HandledError](classes/HandledError.md)
- [HttpServerService](classes/HttpServerService.md)
- [Service](classes/Service.md)
- [ServiceClass](classes/ServiceClass.md)
- [SubscriptionDefinitionBuilder](classes/SubscriptionDefinitionBuilder.md)
- [UnhandledError](classes/UnhandledError.md)

### Interfaces

- [EventBridge](interfaces/EventBridge.md)

### Type aliases

- [Command](modules.md#command)
- [CommandDefinition](modules.md#commanddefinition)
- [CommandErrorResponse](modules.md#commanderrorresponse)
- [CommandFunction](modules.md#commandfunction)
- [CommandResponse](modules.md#commandresponse)
- [CommandSuccessResponse](modules.md#commandsuccessresponse)
- [CompressionMethod](modules.md#compressionmethod)
- [CompressionMiddlewareOptions](modules.md#compressionmiddlewareoptions)
- [ContentType](modules.md#contenttype)
- [Context](modules.md#context)
- [CorrelationId](modules.md#correlationid)
- [EBMessage](modules.md#ebmessage)
- [EBMessageAddress](modules.md#ebmessageaddress)
- [EBMessageBase](modules.md#ebmessagebase)
- [EBMessageId](modules.md#ebmessageid)
- [ErrorResponse](modules.md#errorresponse)
- [EventBridgeConfig](modules.md#eventbridgeconfig)
- [ExtractPayloadMiddlewareOptions](modules.md#extractpayloadmiddlewareoptions)
- [Handler](modules.md#handler)
- [HelmetMiddlewareOptions](modules.md#helmetmiddlewareoptions)
- [HttpExposedServiceMeta](modules.md#httpexposedservicemeta)
- [HttpServerConfig](modules.md#httpserverconfig)
- [HttpServiceSubscriptionCallBack](modules.md#httpservicesubscriptioncallback)
- [InfoMessage](modules.md#infomessage)
- [InfoMessageType](modules.md#infomessagetype)
- [InfoServiceBase](modules.md#infoservicebase)
- [InfoServiceDrain](modules.md#infoservicedrain)
- [InfoServiceFunctionAdded](modules.md#infoservicefunctionadded)
- [InfoServiceInit](modules.md#infoserviceinit)
- [InfoServiceNotReady](modules.md#infoservicenotready)
- [InfoServiceReady](modules.md#infoserviceready)
- [InfoServiceShutdown](modules.md#infoserviceshutdown)
- [InternalError500HandlerOptions](modules.md#internalerror500handleroptions)
- [LogLevelName](modules.md#loglevelname)
- [Logger](modules.md#logger)
- [Middleware](modules.md#middleware)
- [NotFound404HandlerOptions](modules.md#notfound404handleroptions)
- [PrincipalId](modules.md#principalid)
- [QueryParameter](modules.md#queryparameter)
- [RequestBodyToJsonMiddlewareOptions](modules.md#requestbodytojsonmiddlewareoptions)
- [ResponseToJsonMiddlewareOptions](modules.md#responsetojsonmiddlewareoptions)
- [ServiceInfoType](modules.md#serviceinfotype)
- [StaticFileHandlerOptions](modules.md#staticfilehandleroptions)
- [StatusCode](modules.md#statuscode)
- [Subscription](modules.md#subscription)
- [SubscriptionCallback](modules.md#subscriptioncallback)
- [SubscriptionDefinition](modules.md#subscriptiondefinition)
- [SubscriptionFunction](modules.md#subscriptionfunction)
- [SubscriptionId](modules.md#subscriptionid)
- [TraceId](modules.md#traceid)
- [ValidationDefinition](modules.md#validationdefinition)

### Variables

- [MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION](modules.md#min_content_size_for_compression)
- [OPENAPI\_DEFAULT\_INFO](modules.md#openapi_default_info)
- [OPENAPI\_DEFAULT\_MOUNT\_PATH](modules.md#openapi_default_mount_path)
- [ServiceInfo](modules.md#serviceinfo)
- [infoMessageTypes](modules.md#infomessagetypes)

### Functions

- [createCompressionMiddleware](modules.md#createcompressionmiddleware)
- [createErrorResponse](modules.md#createerrorresponse)
- [createExtractPayloadMiddleware](modules.md#createextractpayloadmiddleware)
- [createHelmetMiddleware](modules.md#createhelmetmiddleware)
- [createInfoMessage](modules.md#createinfomessage)
- [createInternalError500Handler](modules.md#createinternalerror500handler)
- [createNotFound404Handler](modules.md#createnotfound404handler)
- [createRequestBodyToJsonMiddleware](modules.md#createrequestbodytojsonmiddleware)
- [createResponseToJsonMiddleware](modules.md#createresponsetojsonmiddleware)
- [createStaticFileHandler](modules.md#createstaticfilehandler)
- [createSuccessResponse](modules.md#createsuccessresponse)
- [getCleanedMessage](modules.md#getcleanedmessage)
- [getCompressionMethod](modules.md#getcompressionmethod)
- [getCompressionStream](modules.md#getcompressionstream)
- [getDefaultCompressionMiddlewareOptions](modules.md#getdefaultcompressionmiddlewareoptions)
- [getDefaultConfig](modules.md#getdefaultconfig)
- [getDefaultExtractPayloadMiddlewareOptions](modules.md#getdefaultextractpayloadmiddlewareoptions)
- [getDefaultHelmetMiddlewareOptions](modules.md#getdefaulthelmetmiddlewareoptions)
- [getDefaultInternalError500HandlerOptions](modules.md#getdefaultinternalerror500handleroptions)
- [getDefaultNotFound404HandlerOptions](modules.md#getdefaultnotfound404handleroptions)
- [getDefaultRequestBodyToJsonMiddlewareOptions](modules.md#getdefaultrequestbodytojsonmiddlewareoptions)
- [getDefaultResponseToJsonMiddlewareOptions](modules.md#getdefaultresponsetojsonmiddlewareoptions)
- [getDefaultStaticFileHandlerOptions](modules.md#getdefaultstaticfilehandleroptions)
- [getErrorMessageForCode](modules.md#geterrormessageforcode)
- [getEventBridgeMock](modules.md#geteventbridgemock)
- [getFunctionWithValidation](modules.md#getfunctionwithvalidation)
- [getLoggerMock](modules.md#getloggermock)
- [getNewCorrelationId](modules.md#getnewcorrelationid)
- [getNewEBMessageId](modules.md#getnewebmessageid)
- [getNewSubscriptionId](modules.md#getnewsubscriptionid)
- [getNewTraceId](modules.md#getnewtraceid)
- [getUniqueId](modules.md#getuniqueid)
- [initLogger](modules.md#initlogger)
- [isCommand](modules.md#iscommand)
- [isCommandErrorResponse](modules.md#iscommanderrorresponse)
- [isCommandResponse](modules.md#iscommandresponse)
- [isCommandSuccessResponse](modules.md#iscommandsuccessresponse)
- [isHttpExposedServiceMeta](modules.md#ishttpexposedservicemeta)
- [isInfoMessage](modules.md#isinfomessage)
- [isInfoServiceFunctionAdded](modules.md#isinfoservicefunctionadded)
- [openApiDocuIndex](modules.md#openapidocuindex)
- [openApiDocuJsInit](modules.md#openapidocujsinit)
- [openApiHandler](modules.md#openapihandler)

## Type aliases

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `command`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `correlationId`: [`CorrelationId`](modules.md#correlationid) ; `messageType`: [`Command`](enums/EBMessageType.md#command) ; `receiver`: [`EBMessageAddress`](modules.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](modules.md#ebmessageaddress)  } & [`EBMessageBase`](modules.md#ebmessagebase)

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

[src/core/types/commandType/Command.ts:18](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/Command.ts#L18)

___

### CommandDefinition

Ƭ **CommandDefinition**<`MetadataType`, `CommandFunctionType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MetadataType` | `Record`<`string`, `unknown`\> |
| `CommandFunctionType` | [`CommandFunction`](modules.md#commandfunction) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | `CommandFunctionType` |
| `commandDescription` | `string` |
| `commandName` | `string` |
| `metadata` | `MetadataType` |

#### Defined in

[src/core/types/commandType/CommandDefinition.ts:6](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandDefinition.ts#L6)

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `correlationId`: [`CorrelationId`](modules.md#correlationid) ; `messageType`: [`CommandErrorResponse`](enums/EBMessageType.md#commanderrorresponse) ; `receiver`: [`EBMessageAddress`](modules.md#ebmessageaddress) ; `response`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`ErrorCode`](enums/ErrorCode.md)  } ; `sender`: [`EBMessageAddress`](modules.md#ebmessageaddress)  } & [`EBMessageBase`](modules.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

[src/core/types/commandType/CommandErrorResponse.ts:11](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandErrorResponse.ts#L11)

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>: (`this`: `ServiceClassType`, `payload`: `PayloadType`, `params`: `ParamsType`, `message`: [`Command`](modules.md#command)<`PayloadType`, `ParamsType`\>) => `Promise`<`ResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
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
| `message` | [`Command`](modules.md#command)<`PayloadType`, `ParamsType`\> |

##### Returns

`Promise`<`ResultType`\>

#### Defined in

[src/core/types/commandType/CommandFunction.ts:7](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandFunction.ts#L7)

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](modules.md#commandsuccessresponse)<`T`\> \| [`CommandErrorResponse`](modules.md#commanderrorresponse)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

[src/core/types/commandType/CommandResponse.ts:9](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandResponse.ts#L9)

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](modules.md#correlationid) ; `isMultipart?`: `boolean` ; `messageType`: [`CommandSuccessResponse`](enums/EBMessageType.md#commandsuccessresponse) ; `receiver`: [`EBMessageAddress`](modules.md#ebmessageaddress) ; `response`: `PayloadType` ; `sender`: [`EBMessageAddress`](modules.md#ebmessageaddress)  } & [`EBMessageBase`](modules.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

[src/core/types/commandType/CommandSuccessResponse.ts:11](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandSuccessResponse.ts#L11)

___

### CompressionMethod

Ƭ **CompressionMethod**: ``"gzip"`` \| ``"deflat"`` \| ``"br"`` \| `undefined`

#### Defined in

[src/helper/types/CompressionMethod.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/helper/types/CompressionMethod.ts#L1)

___

### CompressionMiddlewareOptions

Ƭ **CompressionMiddlewareOptions**: `Object`

#### Defined in

[src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts#L4)

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| `string`

#### Defined in

[src/http-server/types/ContentType.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/ContentType.ts#L1)

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
| `statusCode` | [`StatusCode`](modules.md#statuscode) |
| `traceId?` | [`TraceId`](modules.md#traceid) |

#### Defined in

[src/http-server/types/Context.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/Context.ts#L4)

___

### CorrelationId

Ƭ **CorrelationId**: `string`

#### Defined in

[src/core/types/CorrelationId.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/CorrelationId.ts#L1)

___

### EBMessage

Ƭ **EBMessage**: [`Command`](modules.md#command) \| [`CommandResponse`](modules.md#commandresponse) \| [`InfoMessage`](modules.md#infomessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

[src/core/types/EBMessage.ts:7](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/EBMessage.ts#L7)

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

[src/core/types/EBMessageAddress.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/EBMessageAddress.ts#L4)

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId?` | [`CorrelationId`](modules.md#correlationid) |
| `id` | [`EBMessageId`](modules.md#ebmessageid) |
| `principalId?` | [`PrincipalId`](modules.md#principalid) |
| `timestamp` | `number` |
| `traceId?` | [`TraceId`](modules.md#traceid) |

#### Defined in

[src/core/types/EBMessageBase.ts:6](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/EBMessageBase.ts#L6)

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

[src/core/types/EBMessageId.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/EBMessageId.ts#L4)

___

### ErrorResponse

Ƭ **ErrorResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |
| `message` | `string` |
| `status` | [`ErrorCode`](enums/ErrorCode.md) |

#### Defined in

[src/core/types/ErrorResponse.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/ErrorResponse.ts#L3)

___

### EventBridgeConfig

Ƭ **EventBridgeConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultTtl` | `number` |

#### Defined in

[src/core/types/EventBridgeConfig.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/EventBridgeConfig.ts#L1)

___

### ExtractPayloadMiddlewareOptions

Ƭ **ExtractPayloadMiddlewareOptions**: `Object`

#### Defined in

[src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts#L3)

___

### Handler

Ƭ **Handler**: (`this`: [`HttpServerService`](classes/HttpServerService.md), `request`: `Http2ServerRequest`, `response`: `Http2ServerResponse`, `context`: [`Context`](modules.md#context)) => `Promise`<[`Context`](modules.md#context)\>

#### Type declaration

▸ (`this`, `request`, `response`, `context`): `Promise`<[`Context`](modules.md#context)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](modules.md#context) |

##### Returns

`Promise`<[`Context`](modules.md#context)\>

#### Defined in

[src/http-server/types/Handler.ts:6](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/Handler.ts#L6)

___

### HelmetMiddlewareOptions

Ƭ **HelmetMiddlewareOptions**: `Object`

#### Defined in

[src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:6](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts#L6)

___

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `http`: { `contentType?`: [`ContentType`](modules.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalErrorCodes?`: [`ErrorCode`](enums/ErrorCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](modules.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `expose.http` | { `contentType?`: [`ContentType`](modules.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalErrorCodes?`: [`ErrorCode`](enums/ErrorCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](modules.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  } |
| `expose.http.contentType?` | [`ContentType`](modules.md#contenttype) |
| `expose.http.method` | ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` |
| `expose.http.openApi?` | { `additionalErrorCodes?`: [`ErrorCode`](enums/ErrorCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](modules.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } |
| `expose.http.openApi.additionalErrorCodes?` | [`ErrorCode`](enums/ErrorCode.md)[] |
| `expose.http.openApi.description` | `string` |
| `expose.http.openApi.inputPayload?` | `SchemaObject` |
| `expose.http.openApi.outputPayload?` | `SchemaObject` |
| `expose.http.openApi.parameter?` | `SchemaObject` |
| `expose.http.openApi.query?` | [`QueryParameter`](modules.md#queryparameter)[] |
| `expose.http.openApi.summary` | `string` |
| `expose.http.openApi.tags?` | `string`[] |
| `expose.http.path` | `string` |

#### Defined in

[src/http-server/types/HttpExposedServiceMeta.ts:7](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/HttpExposedServiceMeta.ts#L7)

___

### HttpServerConfig

Ƭ **HttpServerConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiMountPath?` | `string` |
| `logLevel?` | [`LogLevelName`](modules.md#loglevelname) |
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

[src/http-server/types/HttpServerConfig.ts:13](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/HttpServerConfig.ts#L13)

___

### HttpServiceSubscriptionCallBack

Ƭ **HttpServiceSubscriptionCallBack**<`MessageType`\>: [`SubscriptionCallback`](modules.md#subscriptioncallback)<[`HttpServerService`](classes/HttpServerService.md), `MessageType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](modules.md#ebmessage) |

#### Defined in

[src/http-server/types/HttpServiceSubscriptionCallBack.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/HttpServiceSubscriptionCallBack.ts#L4)

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](modules.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](modules.md#infoservicefunctionadded) \| [`InfoServiceInit`](modules.md#infoserviceinit) \| [`InfoServiceNotReady`](modules.md#infoservicenotready) \| [`InfoServiceReady`](modules.md#infoserviceready) \| [`InfoServiceShutdown`](modules.md#infoserviceshutdown)

#### Defined in

[src/core/types/infoType/InfoMessage.ts:10](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoMessage.ts#L10)

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](enums/EBMessageType.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](enums/EBMessageType.md#infoservicefunctionadded) \| [`InfoServiceInit`](enums/EBMessageType.md#infoserviceinit) \| [`InfoServiceNotReady`](enums/EBMessageType.md#infoservicenotready) \| [`InfoServiceReady`](enums/EBMessageType.md#infoserviceready) \| [`InfoServiceShutdown`](enums/EBMessageType.md#infoserviceshutdown)

#### Defined in

[src/core/types/infoType/InfoMessage.ts:18](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoMessage.ts#L18)

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `data?`: `Record`<`string`, `unknown`\> ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](modules.md#ebmessagebase)

#### Defined in

[src/core/types/infoType/InfoServiceBase.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceBase.ts#L3)

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](enums/EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](modules.md#infoservicebase)

#### Defined in

[src/core/types/infoType/InfoServiceDrain.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceDrain.ts#L4)

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](enums/EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](modules.md#infoservicebase)

#### Defined in

[src/core/types/infoType/InfoServiceFunctionAdded.ts:5](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceFunctionAdded.ts#L5)

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](enums/EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](modules.md#infoservicebase)

#### Defined in

[src/core/types/infoType/InfoServiceInit.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceInit.ts#L4)

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](enums/EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](modules.md#infoservicebase)

#### Defined in

[src/core/types/infoType/InfoServiceNotReady.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceNotReady.ts#L4)

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](enums/EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](modules.md#infoservicebase)

#### Defined in

[src/core/types/infoType/InfoServiceReady.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceReady.ts#L4)

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](enums/EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](modules.md#infoservicebase)

#### Defined in

[src/core/types/infoType/InfoServiceShutdown.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceShutdown.ts#L4)

___

### InternalError500HandlerOptions

Ƭ **InternalError500HandlerOptions**: `Object`

#### Defined in

[src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts#L4)

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"``

#### Defined in

[src/core/types/LogLevelName.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/LogLevelName.ts#L1)

___

### Logger

Ƭ **Logger**: `Pick`<`TsLogger`, ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"getChildLogger"``\>

#### Defined in

[src/core/types/Logger.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/Logger.ts#L3)

___

### Middleware

Ƭ **Middleware**: (`this`: [`HttpServerService`](classes/HttpServerService.md), `request`: `Http2ServerRequest`, `response`: `Http2ServerResponse`, `context`: [`Context`](modules.md#context)) => `Promise`<[`Context`](modules.md#context)\>

#### Type declaration

▸ (`this`, `request`, `response`, `context`): `Promise`<[`Context`](modules.md#context)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](modules.md#context) |

##### Returns

`Promise`<[`Context`](modules.md#context)\>

#### Defined in

[src/http-server/types/Middleware.ts:6](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/Middleware.ts#L6)

___

### NotFound404HandlerOptions

Ƭ **NotFound404HandlerOptions**: `Object`

#### Defined in

[src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts#L4)

___

### PrincipalId

Ƭ **PrincipalId**: `string`

#### Defined in

[src/core/types/PrincipalId.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/PrincipalId.ts#L1)

___

### QueryParameter

Ƭ **QueryParameter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `required` | `boolean` |

#### Defined in

[src/http-server/types/QueryParameter.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/QueryParameter.ts#L1)

___

### RequestBodyToJsonMiddlewareOptions

Ƭ **RequestBodyToJsonMiddlewareOptions**: `Object`

#### Defined in

[src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts#L3)

___

### ResponseToJsonMiddlewareOptions

Ƭ **ResponseToJsonMiddlewareOptions**: `Object`

#### Defined in

[src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts#L3)

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

[src/core/types/infoType/ServiceInfoType.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/ServiceInfoType.ts#L4)

___

### StaticFileHandlerOptions

Ƭ **StaticFileHandlerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gzipMimeTypes?` | [`ContentType`](modules.md#contenttype)[] |
| `path` | `string` |
| `removeStartingPath?` | `string` |

#### Defined in

[src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:10](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts#L10)

___

### StatusCode

Ƭ **StatusCode**: [`ErrorCode`](enums/ErrorCode.md) \| [`SuccessStatusCode`](enums/SuccessStatusCode.md)

#### Defined in

[src/http-server/types/StatusCode.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/StatusCode.ts#L4)

___

### Subscription

Ƭ **Subscription**: `Object`

A subscription managed by the event bridge

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageTypes?` | [`EBMessageType`](enums/EBMessageType.md)[] |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `receiver.serviceName?` | `string` |
| `receiver.serviceTarget?` | `string` |
| `receiver.serviceVersion?` | `string` |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } |
| `sender.serviceName?` | `string` |
| `sender.serviceTarget?` | `string` |
| `sender.serviceVersion?` | `string` |
| `subscriber` | [`EBMessageAddress`](modules.md#ebmessageaddress) |
| `callback` | (`subscriptionId`: `string`, `message`: [`EBMessage`](modules.md#ebmessage)) => `Promise`<`void`\> |

#### Defined in

src/core/types/Subscription/Subscription.ts:9

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`ServiceClassType`, `MessageType`\>: (`this`: `ServiceClassType`, `subscriptionId`: [`SubscriptionId`](modules.md#subscriptionid), `message`: `MessageType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `MessageType` | [`EBMessage`](modules.md#ebmessage) |

#### Type declaration

▸ (`this`, `subscriptionId`, `message`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `subscriptionId` | [`SubscriptionId`](modules.md#subscriptionid) |
| `message` | `MessageType` |

##### Returns

`Promise`<`void`\>

#### Defined in

src/core/types/Subscription/SubscriptionCallback.ts:5

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`MessageType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](modules.md#ebmessage) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageTypes?` | [`EBMessageType`](enums/EBMessageType.md)[] |
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

src/core/types/Subscription/SubscriptionDefinition.ts:5

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`\>: (`this`: `ServiceClassType`, `message`: [`EBMessage`](modules.md#ebmessage), `subscriptionId`: [`SubscriptionId`](modules.md#subscriptionid)) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |

#### Type declaration

▸ (`this`, `message`, `subscriptionId`): `Promise`<`void`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `message` | [`EBMessage`](modules.md#ebmessage) |
| `subscriptionId` | [`SubscriptionId`](modules.md#subscriptionid) |

##### Returns

`Promise`<`void`\>

#### Defined in

src/core/types/Subscription/SubscriptionFunction.ts:8

___

### SubscriptionId

Ƭ **SubscriptionId**: `string`

Unique id of the subscription

#### Defined in

src/core/types/Subscription/SubscriptionId.ts:4

___

### TraceId

Ƭ **TraceId**: `string`

#### Defined in

[src/core/types/TraceId.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/TraceId.ts#L1)

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

[src/helper/types/ValidationDefinition.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/helper/types/ValidationDefinition.ts#L3)

## Variables

### MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION

• `Const` **MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION**: ``1024``

#### Defined in

[src/helper/types/MinContentSizeForCompression.const.ts:1](https://github.com/sebastianwessel/purista/blob/1a178c8/src/helper/types/MinContentSizeForCompression.const.ts#L1)

___

### OPENAPI\_DEFAULT\_INFO

• `Const` **OPENAPI\_DEFAULT\_INFO**: `InfoObject`

#### Defined in

[src/http-server/config/defaults.config.ts:5](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/config/defaults.config.ts#L5)

___

### OPENAPI\_DEFAULT\_MOUNT\_PATH

• `Const` **OPENAPI\_DEFAULT\_MOUNT\_PATH**: ``"/api"``

#### Defined in

[src/http-server/config/defaults.config.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/config/defaults.config.ts#L3)

___

### ServiceInfo

• `Const` **ServiceInfo**: [`ServiceInfoType`](modules.md#serviceinfotype)

#### Defined in

[src/http-server/config/ServiceInfo.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/config/ServiceInfo.ts#L3)

___

### infoMessageTypes

• `Const` **infoMessageTypes**: [`EBMessageType`](enums/EBMessageType.md)[]

#### Defined in

[src/core/types/infoType/InfoMessage.ts:25](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoMessage.ts#L25)

## Functions

### createCompressionMiddleware

▸ **createCompressionMiddleware**(`options?`): [`Middleware`](modules.md#middleware)

If the request method is HEAD, then the response is ended. Otherwise, the compression method is
determined and the compression stream is created. If the compression method is not null, then the
content-encoding header is set and the compression stream is piped to the response. Otherwise, the
response is returned

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`CompressionMiddlewareOptions`](modules.md#compressionmiddlewareoptions) | An object that contains the following properties: |

#### Returns

[`Middleware`](modules.md#middleware)

A middleware function.

#### Defined in

[src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:23](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts#L23)

___

### createErrorResponse

▸ **createErrorResponse**(`originalEBMessage`, `statusCode?`, `error?`): [`CommandErrorResponse`](modules.md#commanderrorresponse)

Creates a error response object based on original command
Toggles sender and receiver

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `originalEBMessage` | [`Command`](modules.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> | `undefined` |
| `statusCode` | [`ErrorCode`](enums/ErrorCode.md) | `ErrorCode.InternalServerError` |
| `error?` | `unknown` | `undefined` |

#### Returns

[`CommandErrorResponse`](modules.md#commanderrorresponse)

CommandErrorResponse message object

#### Defined in

[src/core/helper/createErrorResponse.impl.ts:15](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/createErrorResponse.impl.ts#L15)

___

### createExtractPayloadMiddleware

▸ **createExtractPayloadMiddleware**(`options?`): [`Middleware`](modules.md#middleware)

It takes in an object with options and returns a middleware function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ExtractPayloadMiddlewareOptions`](modules.md#extractpayloadmiddlewareoptions) | An object with the following keys: |

#### Returns

[`Middleware`](modules.md#middleware)

A middleware function that will extract the payload from the request.

#### Defined in

[src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:19](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts#L19)

___

### createHelmetMiddleware

▸ **createHelmetMiddleware**(`options?`): [`Middleware`](modules.md#middleware)

It creates a middleware function that runs the given middleware function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`HelmetMiddlewareOptions`](modules.md#helmetmiddlewareoptions) | The options passed to the middleware. |

#### Returns

[`Middleware`](modules.md#middleware)

A function that can be used to perform the action `apply`
         in the context of the library.

#### Defined in

[src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:23](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts#L23)

___

### createInfoMessage

▸ **createInfoMessage**(`messageType`, `serviceName`, `serviceVersion`, `serviceTarget?`, `data?`): [`InfoMessage`](modules.md#infomessage)

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageType` | [`InfoMessageType`](modules.md#infomessagetype) |
| `serviceName` | `string` |
| `serviceVersion` | `string` |
| `serviceTarget?` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |

#### Returns

[`InfoMessage`](modules.md#infomessage)

#### Defined in

[src/core/helper/createInfoMessage.impl.ts:5](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/createInfoMessage.impl.ts#L5)

___

### createInternalError500Handler

▸ **createInternalError500Handler**(`options?`): [`Handler`](modules.md#handler)

Creates a handler that returns a 500 Internal Server Error response

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`InternalError500HandlerOptions`](modules.md#internalerror500handleroptions) | An object that contains the following properties: |

#### Returns

[`Handler`](modules.md#handler)

A handler function that returns a context object.

#### Defined in

[src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:20](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts#L20)

___

### createNotFound404Handler

▸ **createNotFound404Handler**(`options?`): [`Handler`](modules.md#handler)

Creates a handler that returns a 404 Not Found response

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`NotFound404HandlerOptions`](modules.md#notfound404handleroptions) | An object that contains the following properties: |

#### Returns

[`Handler`](modules.md#handler)

A function that returns a function.

#### Defined in

[src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:21](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts#L21)

___

### createRequestBodyToJsonMiddleware

▸ **createRequestBodyToJsonMiddleware**(`options?`): [`Middleware`](modules.md#middleware)

The function takes in a configuration object and returns a middleware

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`RequestBodyToJsonMiddlewareOptions`](modules.md#requestbodytojsonmiddlewareoptions) | An object containing the following properties: |

#### Returns

[`Middleware`](modules.md#middleware)

The return value of the function is the return value of the function.

#### Defined in

[src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:19](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts#L19)

___

### createResponseToJsonMiddleware

▸ **createResponseToJsonMiddleware**(`options?`): [`Middleware`](modules.md#middleware)

If the response is not a JSON string, then convert it to a JSON string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ResponseToJsonMiddlewareOptions`](modules.md#responsetojsonmiddlewareoptions) | An object that contains the following properties: |

#### Returns

[`Middleware`](modules.md#middleware)

A middleware function.

#### Defined in

[src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:19](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts#L19)

___

### createStaticFileHandler

▸ **createStaticFileHandler**(`options?`): [`Middleware`](modules.md#middleware)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`StaticFileHandlerOptions`](modules.md#staticfilehandleroptions) |

#### Returns

[`Middleware`](modules.md#middleware)

#### Defined in

[src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:36](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts#L36)

___

### createSuccessResponse

▸ **createSuccessResponse**<`T`\>(`originalEBMessage`, `payload`): [`CommandSuccessResponse`](modules.md#commandsuccessresponse)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalEBMessage` | [`Command`](modules.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> |
| `payload` | `T` |

#### Returns

[`CommandSuccessResponse`](modules.md#commandsuccessresponse)<`T`\>

#### Defined in

[src/core/helper/createSuccessResponse.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/createSuccessResponse.impl.ts#L3)

___

### getCleanedMessage

▸ **getCleanedMessage**(`message`): `Record`<`string`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](modules.md#ebmessage) |

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

[src/core/helper/getCleanedMessage.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getCleanedMessage.impl.ts#L3)

___

### getCompressionMethod

▸ **getCompressionMethod**(`input`, `size?`): [`CompressionMethod`](modules.md#compressionmethod)

If the client accepts gzip, deflate, or br encoding, return the best one that's available

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `IncomingHttpHeaders` | IncomingHttpHeaders |
| `size?` | `number` | - |

#### Returns

[`CompressionMethod`](modules.md#compressionmethod)

A compression method.

#### Defined in

[src/helper/getCompressionMethod.impl.ts:11](https://github.com/sebastianwessel/purista/blob/1a178c8/src/helper/getCompressionMethod.impl.ts#L11)

___

### getCompressionStream

▸ **getCompressionStream**(`compressionMethod`): `undefined` \| `BrotliCompress`

Given a compression method, return a stream that compresses data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compressionMethod` | [`CompressionMethod`](modules.md#compressionmethod) | The compression method to use. |

#### Returns

`undefined` \| `BrotliCompress`

A function that accepts a stream and returns a stream.

#### Defined in

[src/helper/getCompressionStream.impl.ts:10](https://github.com/sebastianwessel/purista/blob/1a178c8/src/helper/getCompressionStream.impl.ts#L10)

___

### getDefaultCompressionMiddlewareOptions

▸ **getDefaultCompressionMiddlewareOptions**(): [`CompressionMiddlewareOptions`](modules.md#compressionmiddlewareoptions)

It returns an object with default values for the compression middleware options.

#### Returns

[`CompressionMiddlewareOptions`](modules.md#compressionmiddlewareoptions)

A CompressionMiddlewareOptions object.

#### Defined in

[src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:10](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts#L10)

___

### getDefaultConfig

▸ **getDefaultConfig**(): [`HttpServerConfig`](modules.md#httpserverconfig)

#### Returns

[`HttpServerConfig`](modules.md#httpserverconfig)

#### Defined in

[src/http-server/config/getDefaultConfig.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/config/getDefaultConfig.ts#L4)

___

### getDefaultExtractPayloadMiddlewareOptions

▸ **getDefaultExtractPayloadMiddlewareOptions**(): [`ExtractPayloadMiddlewareOptions`](modules.md#extractpayloadmiddlewareoptions)

It returns an object with default values for the ExtractPayloadMiddlewareOptions.

#### Returns

[`ExtractPayloadMiddlewareOptions`](modules.md#extractpayloadmiddlewareoptions)

An object with the default configuration for the extract payload middleware.

#### Defined in

[src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:9](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts#L9)

___

### getDefaultHelmetMiddlewareOptions

▸ **getDefaultHelmetMiddlewareOptions**(): [`HelmetMiddlewareOptions`](modules.md#helmetmiddlewareoptions)

It returns an object with the default values for the HelmetMiddlewareOptions

#### Returns

[`HelmetMiddlewareOptions`](modules.md#helmetmiddlewareoptions)

A HelmetMiddlewareOptions object.

#### Defined in

[src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:12](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts#L12)

___

### getDefaultInternalError500HandlerOptions

▸ **getDefaultInternalError500HandlerOptions**(): [`InternalError500HandlerOptions`](modules.md#internalerror500handleroptions)

It returns an object with default values for the InternalError500HandlerOptions.

#### Returns

[`InternalError500HandlerOptions`](modules.md#internalerror500handleroptions)

An object with the following properties:

#### Defined in

[src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:10](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts#L10)

___

### getDefaultNotFound404HandlerOptions

▸ **getDefaultNotFound404HandlerOptions**(): [`NotFound404HandlerOptions`](modules.md#notfound404handleroptions)

It returns the default not found handler options.
"""

#### Returns

[`NotFound404HandlerOptions`](modules.md#notfound404handleroptions)

A configuration object.

#### Defined in

[src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:11](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts#L11)

___

### getDefaultRequestBodyToJsonMiddlewareOptions

▸ **getDefaultRequestBodyToJsonMiddlewareOptions**(): [`RequestBodyToJsonMiddlewareOptions`](modules.md#requestbodytojsonmiddlewareoptions)

It returns a default configuration for the RequestBodyToJsonMiddlewareOptions.

#### Returns

[`RequestBodyToJsonMiddlewareOptions`](modules.md#requestbodytojsonmiddlewareoptions)

A RequestBodyToJsonMiddlewareOptions object.

#### Defined in

[src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:9](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts#L9)

___

### getDefaultResponseToJsonMiddlewareOptions

▸ **getDefaultResponseToJsonMiddlewareOptions**(): [`ResponseToJsonMiddlewareOptions`](modules.md#responsetojsonmiddlewareoptions)

It returns a default configuration for the ResponseToJsonMiddlewareOptions.

#### Returns

[`ResponseToJsonMiddlewareOptions`](modules.md#responsetojsonmiddlewareoptions)

A middleware function.

#### Defined in

[src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:9](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts#L9)

___

### getDefaultStaticFileHandlerOptions

▸ **getDefaultStaticFileHandlerOptions**(): [`StaticFileHandlerOptions`](modules.md#staticfilehandleroptions)

It returns a default configuration for the static file middleware.

#### Returns

[`StaticFileHandlerOptions`](modules.md#staticfilehandleroptions)

A middleware function that can be used in the http server.

#### Defined in

[src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:20](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts#L20)

___

### getErrorMessageForCode

▸ **getErrorMessageForCode**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`ErrorCode`](enums/ErrorCode.md) |

#### Returns

`string`

#### Defined in

[src/core/helper/getErrorMessageForCode.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getErrorMessageForCode.impl.ts#L3)

___

### getEventBridgeMock

▸ **getEventBridgeMock**(): `ReturnType`

#### Returns

`ReturnType`

#### Defined in

[src/core/testhelper/getEventBridge.mock.ts:13](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/testhelper/getEventBridge.mock.ts#L13)

___

### getFunctionWithValidation

▸ **getFunctionWithValidation**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`): [`CommandFunction`](modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](classes/Service.md)<`ServiceClassType`\> |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`CommandFunction`](modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |
| `inputPayloadSchema` | `undefined` \| `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\> |
| `inputParameterSchema` | `undefined` \| `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\> |
| `outputPayloadSchema` | `undefined` \| `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\> |

#### Returns

[`CommandFunction`](modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/getFunctionWithValidation.ts:5](https://github.com/sebastianwessel/purista/blob/1a178c8/src/helper/getFunctionWithValidation.ts#L5)

___

### getLoggerMock

▸ **getLoggerMock**(): [`Logger`](modules.md#logger)

#### Returns

[`Logger`](modules.md#logger)

#### Defined in

[src/core/testhelper/getLogger.mock.ts:5](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/testhelper/getLogger.mock.ts#L5)

___

### getNewCorrelationId

▸ **getNewCorrelationId**(): `string`

Create a new unique event bridge correlation id

#### Returns

`string`

EBMessageId

#### Defined in

[src/core/helper/getNewCorrelationId.ts:8](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getNewCorrelationId.ts#L8)

___

### getNewEBMessageId

▸ **getNewEBMessageId**(): `string`

Create a new unique event bridge message id

#### Returns

`string`

EBMessageId

#### Defined in

[src/core/helper/getNewEBMessageId.impl.ts:8](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getNewEBMessageId.impl.ts#L8)

___

### getNewSubscriptionId

▸ **getNewSubscriptionId**(): `string`

#### Returns

`string`

#### Defined in

[src/core/helper/getNewSubscriptionId.impl.ts:4](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getNewSubscriptionId.impl.ts#L4)

___

### getNewTraceId

▸ **getNewTraceId**(): `string`

#### Returns

`string`

#### Defined in

[src/core/helper/getNewTraceId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getNewTraceId.impl.ts#L3)

___

### getUniqueId

▸ **getUniqueId**(): `string`

#### Returns

`string`

#### Defined in

[src/core/helper/getUniqueId.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/helper/getUniqueId.impl.ts#L3)

___

### initLogger

▸ **initLogger**(`minLevel`): [`Logger`](modules.md#logger)

Create a new logger with the given minimum log level

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minLevel` | `undefined` \| [`LogLevelName`](modules.md#loglevelname) | The minimum level of log messages to display. |

#### Returns

[`Logger`](modules.md#logger)

#### Defined in

[src/core/initLogger.impl.ts:9](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/initLogger.impl.ts#L9)

___

### isCommand

▸ **isCommand**(`message`): message is Command<unknown, Record<string, unknown\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](modules.md#ebmessage) |

#### Returns

message is Command<unknown, Record<string, unknown\>\>

#### Defined in

[src/core/types/commandType/Command.ts:29](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/Command.ts#L29)

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

[src/core/types/commandType/CommandErrorResponse.ts:23](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandErrorResponse.ts#L23)

___

### isCommandResponse

▸ **isCommandResponse**(`message`): message is CommandResponse<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](modules.md#ebmessage) |

#### Returns

message is CommandResponse<unknown\>

#### Defined in

[src/core/types/commandType/CommandResponse.ts:11](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandResponse.ts#L11)

___

### isCommandSuccessResponse

▸ **isCommandSuccessResponse**(`message`): message is CommandSuccessResponse<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](modules.md#ebmessage) |

#### Returns

message is CommandSuccessResponse<unknown\>

#### Defined in

[src/core/types/commandType/CommandSuccessResponse.ts:20](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/commandType/CommandSuccessResponse.ts#L20)

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

[src/http-server/types/HttpExposedServiceMeta.ts:27](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/types/HttpExposedServiceMeta.ts#L27)

___

### isInfoMessage

▸ **isInfoMessage**(`message`): message is InfoMessage

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](modules.md#ebmessage) |

#### Returns

message is InfoMessage

#### Defined in

[src/core/types/infoType/InfoMessage.ts:34](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoMessage.ts#L34)

___

### isInfoServiceFunctionAdded

▸ **isInfoServiceFunctionAdded**(`message`): message is InfoServiceFunctionAdded

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](modules.md#ebmessage) |

#### Returns

message is InfoServiceFunctionAdded

#### Defined in

[src/core/types/infoType/InfoServiceFunctionAdded.ts:9](https://github.com/sebastianwessel/purista/blob/1a178c8/src/core/types/infoType/InfoServiceFunctionAdded.ts#L9)

___

### openApiDocuIndex

▸ **openApiDocuIndex**(`this`, `request`, `response`, `context`): `Promise`<[`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[src/http-server/handler/openApiHandler/openApiDocuIndex.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/openApiHandler/openApiDocuIndex.impl.ts#L3)

___

### openApiDocuJsInit

▸ **openApiDocuJsInit**(`this`, `request`, `response`, `context`): `Promise`<[`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[src/http-server/handler/openApiHandler/openApiDocuJsInit.impl.ts:3](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/openApiHandler/openApiDocuJsInit.impl.ts#L3)

___

### openApiHandler

▸ **openApiHandler**(`this`, `request`, `response`, `context`): `Promise`<[`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](modules.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

[src/http-server/handler/openApiHandler/openApiHandler.impl.ts:8](https://github.com/sebastianwessel/purista/blob/1a178c8/src/http-server/handler/openApiHandler/openApiHandler.impl.ts#L8)
