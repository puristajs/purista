PURISTA API

# PURISTA API

## Table of contents

### Enumerations

- [EBMessageType](enums/EBMessageType.md)
- [StatusCode](enums/StatusCode.md)

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

### Type Aliases

- [AfterGuardHook](README.md#afterguardhook)
- [BeforeGuardHook](README.md#beforeguardhook)
- [Command](README.md#command)
- [CommandDefinition](README.md#commanddefinition)
- [CommandErrorResponse](README.md#commanderrorresponse)
- [CommandFunction](README.md#commandfunction)
- [CommandResponse](README.md#commandresponse)
- [CommandSuccessResponse](README.md#commandsuccessresponse)
- [CompressionMethod](README.md#compressionmethod)
- [CompressionMiddlewareOptions](README.md#compressionmiddlewareoptions)
- [ContentType](README.md#contenttype)
- [Context](README.md#context)
- [CorrelationId](README.md#correlationid)
- [EBMessage](README.md#ebmessage)
- [EBMessageAddress](README.md#ebmessageaddress)
- [EBMessageBase](README.md#ebmessagebase)
- [EBMessageId](README.md#ebmessageid)
- [ErrorResponse](README.md#errorresponse)
- [EventBridgeConfig](README.md#eventbridgeconfig)
- [ExtractPayloadMiddlewareOptions](README.md#extractpayloadmiddlewareoptions)
- [Handler](README.md#handler)
- [HelmetMiddlewareOptions](README.md#helmetmiddlewareoptions)
- [HttpExposedServiceMeta](README.md#httpexposedservicemeta)
- [HttpServerConfig](README.md#httpserverconfig)
- [HttpServiceSubscriptionCallBack](README.md#httpservicesubscriptioncallback)
- [InfoInvokeTimeout](README.md#infoinvoketimeout)
- [InfoInvokeTimeoutPayload](README.md#infoinvoketimeoutpayload)
- [InfoMessage](README.md#infomessage)
- [InfoMessageType](README.md#infomessagetype)
- [InfoServiceBase](README.md#infoservicebase)
- [InfoServiceDrain](README.md#infoservicedrain)
- [InfoServiceFunctionAdded](README.md#infoservicefunctionadded)
- [InfoServiceInit](README.md#infoserviceinit)
- [InfoServiceNotReady](README.md#infoservicenotready)
- [InfoServiceReady](README.md#infoserviceready)
- [InfoServiceShutdown](README.md#infoserviceshutdown)
- [InfoSubscriptionError](README.md#infosubscriptionerror)
- [InternalError500HandlerOptions](README.md#internalerror500handleroptions)
- [LogLevelName](README.md#loglevelname)
- [Logger](README.md#logger)
- [Middleware](README.md#middleware)
- [NotFound404HandlerOptions](README.md#notfound404handleroptions)
- [PrincipalId](README.md#principalid)
- [QueryParameter](README.md#queryparameter)
- [RequestBodyToJsonMiddlewareOptions](README.md#requestbodytojsonmiddlewareoptions)
- [ResponseToJsonMiddlewareOptions](README.md#responsetojsonmiddlewareoptions)
- [ServiceInfoType](README.md#serviceinfotype)
- [StaticFileHandlerOptions](README.md#staticfilehandleroptions)
- [Subscription](README.md#subscription)
- [SubscriptionCallback](README.md#subscriptioncallback)
- [SubscriptionDefinition](README.md#subscriptiondefinition)
- [SubscriptionFunction](README.md#subscriptionfunction)
- [SubscriptionId](README.md#subscriptionid)
- [SupportedHttpMethod](README.md#supportedhttpmethod)
- [TraceId](README.md#traceid)
- [TransformHook](README.md#transformhook)
- [ValidationDefinition](README.md#validationdefinition)

### Variables

- [MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION](README.md#min_content_size_for_compression)
- [OPENAPI\_DEFAULT\_INFO](README.md#openapi_default_info)
- [OPENAPI\_DEFAULT\_MOUNT\_PATH](README.md#openapi_default_mount_path)
- [ServiceInfo](README.md#serviceinfo)
- [infoMessageTypes](README.md#infomessagetypes)

### Functions

- [createCompressionMiddleware](README.md#createcompressionmiddleware)
- [createErrorResponse](README.md#createerrorresponse)
- [createExtractPayloadMiddleware](README.md#createextractpayloadmiddleware)
- [createHelmetMiddleware](README.md#createhelmetmiddleware)
- [createInfoMessage](README.md#createinfomessage)
- [createInternalError500Handler](README.md#createinternalerror500handler)
- [createNotFound404Handler](README.md#createnotfound404handler)
- [createRequestBodyToJsonMiddleware](README.md#createrequestbodytojsonmiddleware)
- [createResponseToJsonMiddleware](README.md#createresponsetojsonmiddleware)
- [createStaticFileHandler](README.md#createstaticfilehandler)
- [createSuccessResponse](README.md#createsuccessresponse)
- [getCleanedMessage](README.md#getcleanedmessage)
- [getCompressionMethod](README.md#getcompressionmethod)
- [getCompressionStream](README.md#getcompressionstream)
- [getDefaultCompressionMiddlewareOptions](README.md#getdefaultcompressionmiddlewareoptions)
- [getDefaultConfig](README.md#getdefaultconfig)
- [getDefaultExtractPayloadMiddlewareOptions](README.md#getdefaultextractpayloadmiddlewareoptions)
- [getDefaultHelmetMiddlewareOptions](README.md#getdefaulthelmetmiddlewareoptions)
- [getDefaultInternalError500HandlerOptions](README.md#getdefaultinternalerror500handleroptions)
- [getDefaultNotFound404HandlerOptions](README.md#getdefaultnotfound404handleroptions)
- [getDefaultRequestBodyToJsonMiddlewareOptions](README.md#getdefaultrequestbodytojsonmiddlewareoptions)
- [getDefaultResponseToJsonMiddlewareOptions](README.md#getdefaultresponsetojsonmiddlewareoptions)
- [getDefaultStaticFileHandlerOptions](README.md#getdefaultstaticfilehandleroptions)
- [getErrorMessageForCode](README.md#geterrormessageforcode)
- [getFunctionWithValidation](README.md#getfunctionwithvalidation)
- [getNewCorrelationId](README.md#getnewcorrelationid)
- [getNewEBMessageId](README.md#getnewebmessageid)
- [getNewSubscriptionId](README.md#getnewsubscriptionid)
- [getNewTraceId](README.md#getnewtraceid)
- [getTimeoutPromise](README.md#gettimeoutpromise)
- [getUniqueId](README.md#getuniqueid)
- [initLogger](README.md#initlogger)
- [isCommand](README.md#iscommand)
- [isCommandErrorResponse](README.md#iscommanderrorresponse)
- [isCommandResponse](README.md#iscommandresponse)
- [isCommandSuccessResponse](README.md#iscommandsuccessresponse)
- [isHttpExposedServiceMeta](README.md#ishttpexposedservicemeta)
- [isInfoMessage](README.md#isinfomessage)
- [isInfoServiceFunctionAdded](README.md#isinfoservicefunctionadded)
- [openApiDocuIndex](README.md#openapidocuindex)
- [openApiDocuJsInit](README.md#openapidocujsinit)
- [openApiHandler](README.md#openapihandler)

## Type Aliases

### AfterGuardHook

Ƭ **AfterGuardHook**<`ServiceClassType`, `ResultType`\>: (`this`: `ServiceClassType`, `log`: [`Logger`](README.md#logger), `result`: `ResultType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `ResultType` | `unknown` |

#### Type declaration

▸ (`this`, `log`, `result`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `log` | [`Logger`](README.md#logger) |
| `result` | `ResultType` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/commandType/AfterGuardHook.ts:4

___

### BeforeGuardHook

Ƭ **BeforeGuardHook**<`ServiceClassType`, `PayloadType`, `ParamsType`\>: (`this`: `ServiceClassType`, `log`: [`Logger`](README.md#logger), `payload`: `PayloadType`, `params`: `ParamsType`, `message`: [`Command`](README.md#command)<`PayloadType`, `ParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |

#### Type declaration

▸ (`this`, `log`, `payload`, `params`, `message`): `Promise`<`void`\>

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `log` | [`Logger`](README.md#logger) |
| `payload` | `PayloadType` |
| `params` | `ParamsType` |
| `message` | [`Command`](README.md#command)<`PayloadType`, `ParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/commandType/BeforeGuardHook.ts:10

___

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `command`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `correlationId`: [`CorrelationId`](README.md#correlationid) ; `messageType`: [`Command`](enums/EBMessageType.md#command) ; `receiver`: [`EBMessageAddress`](README.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](README.md#ebmessageaddress)  } & [`EBMessageBase`](README.md#ebmessagebase)

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

packages/core/src/core/types/commandType/Command.ts:18

___

### CommandDefinition

Ƭ **CommandDefinition**<`MetadataType`, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MetadataType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |
| `ResultType` | `unknown` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `call` | [`CommandFunction`](README.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |
| `commandDescription` | `string` |
| `commandName` | `string` |
| `hooks` | { `afterGuard?`: [`AfterGuardHook`](README.md#afterguardhook)<`ServiceClassType`, `ResultType`\> ; `beforeGuard?`: [`BeforeGuardHook`](README.md#beforeguardhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> ; `transformInput?`: [`TransformHook`](README.md#transformhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\>  } |
| `hooks.afterGuard?` | [`AfterGuardHook`](README.md#afterguardhook)<`ServiceClassType`, `ResultType`\> |
| `hooks.beforeGuard?` | [`BeforeGuardHook`](README.md#beforeguardhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |
| `hooks.transformInput?` | [`TransformHook`](README.md#transformhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |
| `metadata` | `MetadataType` |

#### Defined in

packages/core/src/core/types/commandType/CommandDefinition.ts:10

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `correlationId`: [`CorrelationId`](README.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](enums/EBMessageType.md#commanderrorresponse) ; `receiver`: [`EBMessageAddress`](README.md#ebmessageaddress) ; `response`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](enums/StatusCode.md)  } ; `sender`: [`EBMessageAddress`](README.md#ebmessageaddress)  } & [`EBMessageBase`](README.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

packages/core/src/core/types/commandType/CommandErrorResponse.ts:11

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>: (`this`: `ServiceClassType`, `log`: [`Logger`](README.md#logger), `payload`: `PayloadType`, `params`: `ParamsType`, `message`: [`Command`](README.md#command)<`PayloadType`, `ParamsType`\>) => `Promise`<`ResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |
| `ResultType` | `unknown` |

#### Type declaration

▸ (`this`, `log`, `payload`, `params`, `message`): `Promise`<`ResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `log` | [`Logger`](README.md#logger) |
| `payload` | `PayloadType` |
| `params` | `ParamsType` |
| `message` | [`Command`](README.md#command)<`PayloadType`, `ParamsType`\> |

##### Returns

`Promise`<`ResultType`\>

#### Defined in

packages/core/src/core/types/commandType/CommandFunction.ts:8

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](README.md#commandsuccessresponse)<`T`\> \| [`CommandErrorResponse`](README.md#commanderrorresponse)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

packages/core/src/core/types/commandType/CommandResponse.ts:9

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](README.md#correlationid) ; `isMultipart?`: `boolean` ; `messageType`: [`CommandSuccessResponse`](enums/EBMessageType.md#commandsuccessresponse) ; `receiver`: [`EBMessageAddress`](README.md#ebmessageaddress) ; `response`: `PayloadType` ; `sender`: [`EBMessageAddress`](README.md#ebmessageaddress)  } & [`EBMessageBase`](README.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

packages/core/src/core/types/commandType/CommandSuccessResponse.ts:11

___

### CompressionMethod

Ƭ **CompressionMethod**: ``"gzip"`` \| ``"deflat"`` \| ``"br"`` \| `undefined`

#### Defined in

packages/core/src/helper/types/CompressionMethod.ts:1

___

### CompressionMiddlewareOptions

Ƭ **CompressionMiddlewareOptions**: `Object`

#### Defined in

packages/core/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:4

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| `string`

#### Defined in

packages/core/src/http-server/types/ContentType.ts:1

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
| `headers` | `Record`<`string`, `string` \| `string`[]\> |
| `isResponseSend` | `boolean` |
| `parameter` | `ParameterType` |
| `payload` | `PayloadType` |
| `statusCode` | [`StatusCode`](enums/StatusCode.md) |
| `traceId?` | [`TraceId`](README.md#traceid) |

#### Defined in

packages/core/src/http-server/types/Context.ts:3

___

### CorrelationId

Ƭ **CorrelationId**: `string`

#### Defined in

packages/core/src/core/types/CorrelationId.ts:1

___

### EBMessage

Ƭ **EBMessage**: [`Command`](README.md#command) \| [`CommandResponse`](README.md#commandresponse) \| [`InfoMessage`](README.md#infomessage)

EBMessage is some message which is handled by the event bridge.

#### Defined in

packages/core/src/core/types/EBMessage.ts:7

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

packages/core/src/core/types/EBMessageAddress.ts:4

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId?` | [`CorrelationId`](README.md#correlationid) |
| `id` | [`EBMessageId`](README.md#ebmessageid) |
| `principalId?` | [`PrincipalId`](README.md#principalid) |
| `timestamp` | `number` |
| `traceId?` | [`TraceId`](README.md#traceid) |

#### Defined in

packages/core/src/core/types/EBMessageBase.ts:6

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

packages/core/src/core/types/EBMessageId.ts:4

___

### ErrorResponse

Ƭ **ErrorResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | `unknown` |
| `message` | `string` |
| `status` | [`StatusCode`](enums/StatusCode.md) |
| `traceId?` | [`TraceId`](README.md#traceid) |

#### Defined in

packages/core/src/core/types/ErrorResponse.ts:4

___

### EventBridgeConfig

Ƭ **EventBridgeConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultTtl` | `number` |

#### Defined in

packages/core/src/core/types/EventBridgeConfig.ts:1

___

### ExtractPayloadMiddlewareOptions

Ƭ **ExtractPayloadMiddlewareOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `uploadDir?` | `string` |

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:6

___

### Handler

Ƭ **Handler**: (`this`: [`HttpServerService`](classes/HttpServerService.md), `log`: [`Logger`](README.md#logger), `request`: `Http2ServerRequest`, `response`: `Http2ServerResponse`, `context`: [`Context`](README.md#context)) => `Promise`<[`Context`](README.md#context)\>

#### Type declaration

▸ (`this`, `log`, `request`, `response`, `context`): `Promise`<[`Context`](README.md#context)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `log` | [`Logger`](README.md#logger) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](README.md#context) |

##### Returns

`Promise`<[`Context`](README.md#context)\>

#### Defined in

packages/core/src/http-server/types/Handler.ts:7

___

### HelmetMiddlewareOptions

Ƭ **HelmetMiddlewareOptions**: `Object`

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:6

___

### HttpExposedServiceMeta

Ƭ **HttpExposedServiceMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `http`: { `contentType?`: [`ContentType`](README.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](enums/StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](README.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `expose.http` | { `contentType?`: [`ContentType`](README.md#contenttype) ; `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](enums/StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](README.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  } |
| `expose.http.contentType?` | [`ContentType`](README.md#contenttype) |
| `expose.http.method` | ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` |
| `expose.http.openApi?` | { `additionalStatusCodes?`: [`StatusCode`](enums/StatusCode.md)[] ; `description`: `string` ; `inputPayload?`: `SchemaObject` ; `isSecure`: `boolean` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject` ; `query?`: [`QueryParameter`](README.md#queryparameter)[] ; `summary`: `string` ; `tags?`: `string`[]  } |
| `expose.http.openApi.additionalStatusCodes?` | [`StatusCode`](enums/StatusCode.md)[] |
| `expose.http.openApi.description` | `string` |
| `expose.http.openApi.inputPayload?` | `SchemaObject` |
| `expose.http.openApi.isSecure` | `boolean` |
| `expose.http.openApi.outputPayload?` | `SchemaObject` |
| `expose.http.openApi.parameter?` | `SchemaObject` |
| `expose.http.openApi.query?` | [`QueryParameter`](README.md#queryparameter)[] |
| `expose.http.openApi.summary` | `string` |
| `expose.http.openApi.tags?` | `string`[] |
| `expose.http.path` | `string` |

#### Defined in

packages/core/src/http-server/types/HttpExposedServiceMeta.ts:7

___

### HttpServerConfig

Ƭ **HttpServerConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiMountPath?` | `string` |
| `cookieSecret?` | `string` |
| `domain` | `string` |
| `logLevel?` | [`LogLevelName`](README.md#loglevelname) |
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
| `uploadDir?` | `string` |

#### Defined in

packages/core/src/http-server/types/HttpServerConfig.ts:13

___

### HttpServiceSubscriptionCallBack

Ƭ **HttpServiceSubscriptionCallBack**<`MessageType`\>: [`SubscriptionCallback`](README.md#subscriptioncallback)<[`HttpServerService`](classes/HttpServerService.md), `MessageType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](README.md#ebmessage) |

#### Defined in

packages/core/src/http-server/types/HttpServiceSubscriptionCallBack.ts:4

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](enums/EBMessageType.md#infoinvoketimeout)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoInvokeTimeout.ts:22

___

### InfoInvokeTimeoutPayload

Ƭ **InfoInvokeTimeoutPayload**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `correlationId` | [`CorrelationId`](README.md#correlationid) |
| `receiver` | { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } |
| `receiver.serviceName` | `string` |
| `receiver.serviceTarget` | `string` |
| `receiver.serviceVersion` | `string` |
| `sender` | { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } |
| `sender.serviceName` | `string` |
| `sender.serviceTarget` | `string` |
| `sender.serviceVersion` | `string` |
| `timestamp` | `number` |
| `traceId` | [`TraceId`](README.md#traceid) |

#### Defined in

packages/core/src/core/types/infoType/InfoInvokeTimeout.ts:6

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](README.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](README.md#infoservicefunctionadded) \| [`InfoServiceInit`](README.md#infoserviceinit) \| [`InfoServiceNotReady`](README.md#infoservicenotready) \| [`InfoServiceReady`](README.md#infoserviceready) \| [`InfoServiceShutdown`](README.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](README.md#infoinvoketimeout) \| [`InfoSubscriptionError`](README.md#infosubscriptionerror)

#### Defined in

packages/core/src/core/types/infoType/InfoMessage.ts:12

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](enums/EBMessageType.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](enums/EBMessageType.md#infoservicefunctionadded) \| [`InfoServiceInit`](enums/EBMessageType.md#infoserviceinit) \| [`InfoServiceNotReady`](enums/EBMessageType.md#infoservicenotready) \| [`InfoServiceReady`](enums/EBMessageType.md#infoserviceready) \| [`InfoServiceShutdown`](enums/EBMessageType.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](enums/EBMessageType.md#infoinvoketimeout) \| [`InfoSubscriptionError`](enums/EBMessageType.md#infosubscriptionerror)

#### Defined in

packages/core/src/core/types/infoType/InfoMessage.ts:22

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `data?`: `Record`<`string`, `unknown`\> ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](README.md#ebmessagebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceBase.ts:3

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](enums/EBMessageType.md#infoservicedrain)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceDrain.ts:4

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](enums/EBMessageType.md#infoservicefunctionadded)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceFunctionAdded.ts:5

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](enums/EBMessageType.md#infoserviceinit)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceInit.ts:4

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](enums/EBMessageType.md#infoservicenotready)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceNotReady.ts:4

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](enums/EBMessageType.md#infoserviceready)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceReady.ts:4

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](enums/EBMessageType.md#infoserviceshutdown)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoServiceShutdown.ts:4

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](enums/EBMessageType.md#infosubscriptionerror)  } & [`InfoServiceBase`](README.md#infoservicebase)

#### Defined in

packages/core/src/core/types/infoType/InfoSubscriptionError.ts:4

___

### InternalError500HandlerOptions

Ƭ **InternalError500HandlerOptions**: `Object`

#### Defined in

packages/core/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:4

___

### LogLevelName

Ƭ **LogLevelName**: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"``

#### Defined in

packages/core/src/core/types/LogLevelName.ts:1

___

### Logger

Ƭ **Logger**: `Pick`<`TsLogger`, ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"getChildLogger"``\>

#### Defined in

packages/core/src/core/types/Logger.ts:3

___

### Middleware

Ƭ **Middleware**: (`this`: [`HttpServerService`](classes/HttpServerService.md), `log`: [`Logger`](README.md#logger), `request`: `Http2ServerRequest`, `response`: `Http2ServerResponse`, `context`: [`Context`](README.md#context)) => `Promise`<[`Context`](README.md#context)\>

#### Type declaration

▸ (`this`, `log`, `request`, `response`, `context`): `Promise`<[`Context`](README.md#context)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `log` | [`Logger`](README.md#logger) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](README.md#context) |

##### Returns

`Promise`<[`Context`](README.md#context)\>

#### Defined in

packages/core/src/http-server/types/Middleware.ts:7

___

### NotFound404HandlerOptions

Ƭ **NotFound404HandlerOptions**: `Object`

#### Defined in

packages/core/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:4

___

### PrincipalId

Ƭ **PrincipalId**: `string`

#### Defined in

packages/core/src/core/types/PrincipalId.ts:1

___

### QueryParameter

Ƭ **QueryParameter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `required` | `boolean` |

#### Defined in

packages/core/src/http-server/types/QueryParameter.ts:1

___

### RequestBodyToJsonMiddlewareOptions

Ƭ **RequestBodyToJsonMiddlewareOptions**: `Object`

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:4

___

### ResponseToJsonMiddlewareOptions

Ƭ **ResponseToJsonMiddlewareOptions**: `Object`

#### Defined in

packages/core/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:3

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

packages/core/src/core/types/infoType/ServiceInfoType.ts:4

___

### StaticFileHandlerOptions

Ƭ **StaticFileHandlerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gzipMimeTypes?` | [`ContentType`](README.md#contenttype)[] |
| `path` | `string` |
| `removeStartingPath?` | `string` |

#### Defined in

packages/core/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:10

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
| `subscriber` | [`EBMessageAddress`](README.md#ebmessageaddress) |
| `callback` | (`subscriptionId`: `string`, `message`: [`EBMessage`](README.md#ebmessage)) => `Promise`<`void`\> |

#### Defined in

packages/core/src/core/types/Subscription/Subscription.ts:9

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`ServiceClassType`, `MessageType`\>: (`this`: `ServiceClassType`, `log`: [`Logger`](README.md#logger), `subscriptionId`: [`SubscriptionId`](README.md#subscriptionid), `message`: `MessageType`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `MessageType` | [`EBMessage`](README.md#ebmessage) |

#### Type declaration

▸ (`this`, `log`, `subscriptionId`, `message`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `log` | [`Logger`](README.md#logger) |
| `subscriptionId` | [`SubscriptionId`](README.md#subscriptionid) |
| `message` | `MessageType` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/Subscription/SubscriptionCallback.ts:6

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`MessageType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageType` | [`EBMessage`](README.md#ebmessage) |

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
| `call` | (`log`: [`Logger`](README.md#logger), `id`: `string`, `message`: `MessageType`) => `Promise`<`void`\> |

#### Defined in

packages/core/src/core/types/Subscription/SubscriptionDefinition.ts:6

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`\>: (`this`: `ServiceClassType`, `log`: [`Logger`](README.md#logger), `message`: [`EBMessage`](README.md#ebmessage), `subscriptionId`: [`SubscriptionId`](README.md#subscriptionid)) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |

#### Type declaration

▸ (`this`, `log`, `message`, `subscriptionId`): `Promise`<`void`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `log` | [`Logger`](README.md#logger) |
| `message` | [`EBMessage`](README.md#ebmessage) |
| `subscriptionId` | [`SubscriptionId`](README.md#subscriptionid) |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/Subscription/SubscriptionFunction.ts:9

___

### SubscriptionId

Ƭ **SubscriptionId**: `string`

Unique id of the subscription

#### Defined in

packages/core/src/core/types/Subscription/SubscriptionId.ts:4

___

### SupportedHttpMethod

Ƭ **SupportedHttpMethod**: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"``

Supported HTTP-Methods for defining endpoints

#### Defined in

packages/core/src/helper/types/SupportedHttpMethod.ts:2

___

### TraceId

Ƭ **TraceId**: `string`

#### Defined in

packages/core/src/core/types/TraceId.ts:1

___

### TransformHook

Ƭ **TransformHook**<`ServiceClassType`, `PayloadType`, `ParamsType`\>: (`this`: `ServiceClassType`, `log`: [`Logger`](README.md#logger), `payload`: `unknown`, `params`: `unknown`, `message`: [`Command`](README.md#command)<`PayloadType`, `ParamsType`\>) => `Promise`<{ `message`: [`Command`](README.md#command)<`PayloadType`, `ParamsType`\> ; `params`: `ParamsType` ; `payload`: `PayloadType`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`Service`](classes/Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |

#### Type declaration

▸ (`this`, `log`, `payload`, `params`, `message`): `Promise`<{ `message`: [`Command`](README.md#command)<`PayloadType`, `ParamsType`\> ; `params`: `ParamsType` ; `payload`: `PayloadType`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `log` | [`Logger`](README.md#logger) |
| `payload` | `unknown` |
| `params` | `unknown` |
| `message` | [`Command`](README.md#command)<`PayloadType`, `ParamsType`\> |

##### Returns

`Promise`<{ `message`: [`Command`](README.md#command)<`PayloadType`, `ParamsType`\> ; `params`: `ParamsType` ; `payload`: `PayloadType`  }\>

#### Defined in

packages/core/src/core/types/commandType/TransformHook.ts:5

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

packages/core/src/helper/types/ValidationDefinition.ts:3

## Variables

### MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION

• `Const` **MIN\_CONTENT\_SIZE\_FOR\_COMPRESSION**: ``1024``

#### Defined in

packages/core/src/helper/types/MinContentSizeForCompression.const.ts:1

___

### OPENAPI\_DEFAULT\_INFO

• `Const` **OPENAPI\_DEFAULT\_INFO**: `InfoObject`

#### Defined in

packages/core/src/http-server/config/defaults.config.ts:7

___

### OPENAPI\_DEFAULT\_MOUNT\_PATH

• `Const` **OPENAPI\_DEFAULT\_MOUNT\_PATH**: `string`

#### Defined in

packages/core/src/http-server/config/defaults.config.ts:5

___

### ServiceInfo

• `Const` **ServiceInfo**: [`ServiceInfoType`](README.md#serviceinfotype)

#### Defined in

packages/core/src/http-server/config/ServiceInfo.ts:3

___

### infoMessageTypes

• `Const` **infoMessageTypes**: [`EBMessageType`](enums/EBMessageType.md)[]

#### Defined in

packages/core/src/core/types/infoType/InfoMessage.ts:31

## Functions

### createCompressionMiddleware

▸ **createCompressionMiddleware**(`options?`): [`Middleware`](README.md#middleware)

If the request method is HEAD, then the response is ended. Otherwise, the compression method is
determined and the compression stream is created. If the compression method is not null, then the
content-encoding header is set and the compression stream is piped to the response. Otherwise, the
response is returned

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`CompressionMiddlewareOptions`](README.md#compressionmiddlewareoptions) | An object that contains the following properties: |

#### Returns

[`Middleware`](README.md#middleware)

A middleware function.

#### Defined in

packages/core/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:23

___

### createErrorResponse

▸ **createErrorResponse**(`originalEBMessage`, `statusCode?`, `error?`): [`CommandErrorResponse`](README.md#commanderrorresponse)

Creates a error response object based on original command
Toggles sender and receiver

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `originalEBMessage` | [`Command`](README.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> | `undefined` |
| `statusCode` | [`StatusCode`](enums/StatusCode.md) | `StatusCode.InternalServerError` |
| `error?` | `unknown` | `undefined` |

#### Returns

[`CommandErrorResponse`](README.md#commanderrorresponse)

CommandErrorResponse message object

#### Defined in

packages/core/src/core/helper/createErrorResponse.impl.ts:15

___

### createExtractPayloadMiddleware

▸ **createExtractPayloadMiddleware**(`options?`): [`Middleware`](README.md#middleware)

It takes in an object with options and returns a middleware function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ExtractPayloadMiddlewareOptions`](README.md#extractpayloadmiddlewareoptions) | An object with the following keys: |

#### Returns

[`Middleware`](README.md#middleware)

A middleware function that will extract the payload from the request.

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:26

___

### createHelmetMiddleware

▸ **createHelmetMiddleware**(`options?`): [`Middleware`](README.md#middleware)

It creates a middleware function that runs the given middleware function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`HelmetMiddlewareOptions`](README.md#helmetmiddlewareoptions) | The options passed to the middleware. |

#### Returns

[`Middleware`](README.md#middleware)

A function that can be used to perform the action `apply`
         in the context of the library.

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:23

___

### createInfoMessage

▸ **createInfoMessage**(`messageType`, `serviceName`, `serviceVersion`, `serviceTarget?`, `data?`): [`InfoMessage`](README.md#infomessage)

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageType` | [`InfoMessageType`](README.md#infomessagetype) |
| `serviceName` | `string` |
| `serviceVersion` | `string` |
| `serviceTarget?` | `string` |
| `data?` | `Record`<`string`, `unknown`\> |

#### Returns

[`InfoMessage`](README.md#infomessage)

#### Defined in

packages/core/src/core/helper/createInfoMessage.impl.ts:5

___

### createInternalError500Handler

▸ **createInternalError500Handler**(`options?`): [`Handler`](README.md#handler)

Creates a handler that returns a 500 Internal Server Error response

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`InternalError500HandlerOptions`](README.md#internalerror500handleroptions) | An object that contains the following properties: |

#### Returns

[`Handler`](README.md#handler)

A handler function that returns a context object.

#### Defined in

packages/core/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:20

___

### createNotFound404Handler

▸ **createNotFound404Handler**(`options?`): [`Handler`](README.md#handler)

Creates a handler that returns a 404 Not Found response

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`NotFound404HandlerOptions`](README.md#notfound404handleroptions) | An object that contains the following properties: |

#### Returns

[`Handler`](README.md#handler)

A function that returns a function.

#### Defined in

packages/core/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:21

___

### createRequestBodyToJsonMiddleware

▸ **createRequestBodyToJsonMiddleware**(`options?`): [`Middleware`](README.md#middleware)

The function takes in a configuration object and returns a middleware

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`RequestBodyToJsonMiddlewareOptions`](README.md#requestbodytojsonmiddlewareoptions) | An object containing the following properties: |

#### Returns

[`Middleware`](README.md#middleware)

The return value of the function is the return value of the function.

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:20

___

### createResponseToJsonMiddleware

▸ **createResponseToJsonMiddleware**(`options?`): [`Middleware`](README.md#middleware)

If the response is not a JSON string, then convert it to a JSON string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ResponseToJsonMiddlewareOptions`](README.md#responsetojsonmiddlewareoptions) | An object that contains the following properties: |

#### Returns

[`Middleware`](README.md#middleware)

A middleware function.

#### Defined in

packages/core/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:19

___

### createStaticFileHandler

▸ **createStaticFileHandler**(`options?`): [`Middleware`](README.md#middleware)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`StaticFileHandlerOptions`](README.md#staticfilehandleroptions) |

#### Returns

[`Middleware`](README.md#middleware)

#### Defined in

packages/core/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:36

___

### createSuccessResponse

▸ **createSuccessResponse**<`T`\>(`originalEBMessage`, `payload`): [`CommandSuccessResponse`](README.md#commandsuccessresponse)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalEBMessage` | [`Command`](README.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> |
| `payload` | `T` |

#### Returns

[`CommandSuccessResponse`](README.md#commandsuccessresponse)<`T`\>

#### Defined in

packages/core/src/core/helper/createSuccessResponse.impl.ts:4

___

### getCleanedMessage

▸ **getCleanedMessage**(`message`): `Record`<`string`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](README.md#ebmessage) |

#### Returns

`Record`<`string`, `unknown`\>

#### Defined in

packages/core/src/core/helper/getCleanedMessage.impl.ts:3

___

### getCompressionMethod

▸ **getCompressionMethod**(`input`, `size?`): [`CompressionMethod`](README.md#compressionmethod)

If the client accepts gzip, deflate, or br encoding, return the best one that's available

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `IncomingHttpHeaders` | IncomingHttpHeaders |
| `size?` | `number` | - |

#### Returns

[`CompressionMethod`](README.md#compressionmethod)

A compression method.

#### Defined in

packages/core/src/helper/getCompressionMethod.impl.ts:11

___

### getCompressionStream

▸ **getCompressionStream**(`compressionMethod`): `undefined` \| `BrotliCompress`

Given a compression method, return a stream that compresses data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compressionMethod` | [`CompressionMethod`](README.md#compressionmethod) | The compression method to use. |

#### Returns

`undefined` \| `BrotliCompress`

A function that accepts a stream and returns a stream.

#### Defined in

packages/core/src/helper/getCompressionStream.impl.ts:10

___

### getDefaultCompressionMiddlewareOptions

▸ **getDefaultCompressionMiddlewareOptions**(): [`CompressionMiddlewareOptions`](README.md#compressionmiddlewareoptions)

It returns an object with default values for the compression middleware options.

#### Returns

[`CompressionMiddlewareOptions`](README.md#compressionmiddlewareoptions)

A CompressionMiddlewareOptions object.

#### Defined in

packages/core/src/http-server/onAfterMiddleware/compressionMiddleware/compressionMiddleware.impl.ts:10

___

### getDefaultConfig

▸ **getDefaultConfig**(): [`HttpServerConfig`](README.md#httpserverconfig)

#### Returns

[`HttpServerConfig`](README.md#httpserverconfig)

#### Defined in

packages/core/src/http-server/config/getDefaultConfig.ts:4

___

### getDefaultExtractPayloadMiddlewareOptions

▸ **getDefaultExtractPayloadMiddlewareOptions**(): [`ExtractPayloadMiddlewareOptions`](README.md#extractpayloadmiddlewareoptions)

It returns an object with default values for the ExtractPayloadMiddlewareOptions.

#### Returns

[`ExtractPayloadMiddlewareOptions`](README.md#extractpayloadmiddlewareoptions)

An object with the default configuration for the extract payload middleware.

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/extractPayloadMiddleware/extractPayloadMiddleware.impl.ts:14

___

### getDefaultHelmetMiddlewareOptions

▸ **getDefaultHelmetMiddlewareOptions**(): [`HelmetMiddlewareOptions`](README.md#helmetmiddlewareoptions)

It returns an object with the default values for the HelmetMiddlewareOptions

#### Returns

[`HelmetMiddlewareOptions`](README.md#helmetmiddlewareoptions)

A HelmetMiddlewareOptions object.

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/helmetMiddleware/helmetMiddleware.impl.ts:12

___

### getDefaultInternalError500HandlerOptions

▸ **getDefaultInternalError500HandlerOptions**(): [`InternalError500HandlerOptions`](README.md#internalerror500handleroptions)

It returns an object with default values for the InternalError500HandlerOptions.

#### Returns

[`InternalError500HandlerOptions`](README.md#internalerror500handleroptions)

An object with the following properties:

#### Defined in

packages/core/src/http-server/handler/internalError500Handler/internalError500Handler.impl.ts:10

___

### getDefaultNotFound404HandlerOptions

▸ **getDefaultNotFound404HandlerOptions**(): [`NotFound404HandlerOptions`](README.md#notfound404handleroptions)

It returns the default not found handler options.
"""

#### Returns

[`NotFound404HandlerOptions`](README.md#notfound404handleroptions)

A configuration object.

#### Defined in

packages/core/src/http-server/handler/notFound404Handler/notFound404Handler.impl.ts:11

___

### getDefaultRequestBodyToJsonMiddlewareOptions

▸ **getDefaultRequestBodyToJsonMiddlewareOptions**(): [`RequestBodyToJsonMiddlewareOptions`](README.md#requestbodytojsonmiddlewareoptions)

It returns a default configuration for the RequestBodyToJsonMiddlewareOptions.

#### Returns

[`RequestBodyToJsonMiddlewareOptions`](README.md#requestbodytojsonmiddlewareoptions)

A RequestBodyToJsonMiddlewareOptions object.

#### Defined in

packages/core/src/http-server/onBeforeMiddleware/requestBodyToJson/requestBodyToJsonMiddleware.impl.ts:10

___

### getDefaultResponseToJsonMiddlewareOptions

▸ **getDefaultResponseToJsonMiddlewareOptions**(): [`ResponseToJsonMiddlewareOptions`](README.md#responsetojsonmiddlewareoptions)

It returns a default configuration for the ResponseToJsonMiddlewareOptions.

#### Returns

[`ResponseToJsonMiddlewareOptions`](README.md#responsetojsonmiddlewareoptions)

A middleware function.

#### Defined in

packages/core/src/http-server/onAfterMiddleware/responseToJsonMiddleware/responseToJsonMiddleware.impl.ts:9

___

### getDefaultStaticFileHandlerOptions

▸ **getDefaultStaticFileHandlerOptions**(): [`StaticFileHandlerOptions`](README.md#staticfilehandleroptions)

It returns a default configuration for the static file middleware.

#### Returns

[`StaticFileHandlerOptions`](README.md#staticfilehandleroptions)

A middleware function that can be used in the http server.

#### Defined in

packages/core/src/http-server/handler/staticFileHandler/staticFileMiddleware.impl.ts:20

___

### getErrorMessageForCode

▸ **getErrorMessageForCode**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`StatusCode`](enums/StatusCode.md) |

#### Returns

`string`

#### Defined in

packages/core/src/core/helper/getErrorMessageForCode.impl.ts:3

___

### getFunctionWithValidation

▸ **getFunctionWithValidation**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`fn`, `inputPayloadSchema`, `inputParameterSchema`, `outputPayloadSchema`): [`CommandFunction`](README.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

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
| `fn` | [`CommandFunction`](README.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |
| `inputPayloadSchema` | `undefined` \| `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\> |
| `inputParameterSchema` | `undefined` \| `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\> |
| `outputPayloadSchema` | `undefined` \| `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\> |

#### Returns

[`CommandFunction`](README.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/getFunctionWithValidation.ts:5

___

### getNewCorrelationId

▸ **getNewCorrelationId**(): `string`

Create a new unique event bridge correlation id

#### Returns

`string`

EBMessageId

#### Defined in

packages/core/src/core/helper/getNewCorrelationId.ts:8

___

### getNewEBMessageId

▸ **getNewEBMessageId**(): `string`

Create a new unique event bridge message id

#### Returns

`string`

EBMessageId

#### Defined in

packages/core/src/core/helper/getNewEBMessageId.impl.ts:8

___

### getNewSubscriptionId

▸ **getNewSubscriptionId**(): `string`

#### Returns

`string`

#### Defined in

packages/core/src/core/helper/getNewSubscriptionId.impl.ts:4

___

### getNewTraceId

▸ **getNewTraceId**(): `string`

#### Returns

`string`

#### Defined in

packages/core/src/core/helper/getNewTraceId.impl.ts:3

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

packages/core/src/core/helper/getTimeoutPromise.impl.ts:4

___

### getUniqueId

▸ **getUniqueId**(): `string`

#### Returns

`string`

#### Defined in

packages/core/src/core/helper/getUniqueId.impl.ts:3

___

### initLogger

▸ **initLogger**(`minLevel`, `opt?`): [`Logger`](README.md#logger)

Create a new logger with the given minimum log level

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minLevel` | `undefined` \| [`LogLevelName`](README.md#loglevelname) | The minimum level of log messages to display. |
| `opt?` | `Record`<`string`, `unknown`\> | - |

#### Returns

[`Logger`](README.md#logger)

#### Defined in

packages/core/src/core/initLogger.impl.ts:9

___

### isCommand

▸ **isCommand**(`message`): message is Command<unknown, Record<string, unknown\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](README.md#ebmessage) |

#### Returns

message is Command<unknown, Record<string, unknown\>\>

#### Defined in

packages/core/src/core/types/commandType/Command.ts:29

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

packages/core/src/core/types/commandType/CommandErrorResponse.ts:24

___

### isCommandResponse

▸ **isCommandResponse**(`message`): message is CommandResponse<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](README.md#ebmessage) |

#### Returns

message is CommandResponse<unknown\>

#### Defined in

packages/core/src/core/types/commandType/CommandResponse.ts:11

___

### isCommandSuccessResponse

▸ **isCommandSuccessResponse**(`message`): message is CommandSuccessResponse<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](README.md#ebmessage) |

#### Returns

message is CommandSuccessResponse<unknown\>

#### Defined in

packages/core/src/core/types/commandType/CommandSuccessResponse.ts:20

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

packages/core/src/http-server/types/HttpExposedServiceMeta.ts:28

___

### isInfoMessage

▸ **isInfoMessage**(`message`): message is InfoMessage

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](README.md#ebmessage) |

#### Returns

message is InfoMessage

#### Defined in

packages/core/src/core/types/infoType/InfoMessage.ts:42

___

### isInfoServiceFunctionAdded

▸ **isInfoServiceFunctionAdded**(`message`): message is InfoServiceFunctionAdded

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](README.md#ebmessage) |

#### Returns

message is InfoServiceFunctionAdded

#### Defined in

packages/core/src/core/types/infoType/InfoServiceFunctionAdded.ts:9

___

### openApiDocuIndex

▸ **openApiDocuIndex**(`this`, `log`, `request`, `response`, `context`): `Promise`<[`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `log` | [`Logger`](README.md#logger) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

packages/core/src/http-server/handler/openApiHandler/openApiDocuIndex.impl.ts:3

___

### openApiDocuJsInit

▸ **openApiDocuJsInit**(`this`, `log`, `request`, `response`, `context`): `Promise`<[`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `log` | [`Logger`](README.md#logger) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

packages/core/src/http-server/handler/openApiHandler/openApiDocuJsInit.impl.ts:3

___

### openApiHandler

▸ **openApiHandler**(`this`, `log`, `request`, `response`, `context`): `Promise`<[`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`HttpServerService`](classes/HttpServerService.md) |
| `log` | [`Logger`](README.md#logger) |
| `request` | `Http2ServerRequest` |
| `response` | `Http2ServerResponse` |
| `context` | [`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<[`Context`](README.md#context)<`unknown`, `Record`<`string`, `unknown`\>\>\>

#### Defined in

packages/core/src/http-server/handler/openApiHandler/openApiHandler.impl.ts:8
