[PURISTA API](../README.md) / HttpServerService

# Class: HttpServerService

## Hierarchy

- [`Service`](Service.md)

  ↳ **`HttpServerService`**

## Table of contents

### Constructors

- [constructor](HttpServerService.md#constructor)

### Properties

- [commands](HttpServerService.md#commands)
- [compressionMiddleware](HttpServerService.md#compressionmiddleware)
- [conf](HttpServerService.md#conf)
- [eventBridge](HttpServerService.md#eventbridge)
- [info](HttpServerService.md#info)
- [internalServerErrorHandler](HttpServerService.md#internalservererrorhandler)
- [jsonResponseMiddleware](HttpServerService.md#jsonresponsemiddleware)
- [mainSubscriptionId](HttpServerService.md#mainsubscriptionid)
- [notFoundHandlers](HttpServerService.md#notfoundhandlers)
- [onAfterMiddleware](HttpServerService.md#onaftermiddleware)
- [onBeforeMiddleware](HttpServerService.md#onbeforemiddleware)
- [pendingInvocations](HttpServerService.md#pendinginvocations)
- [routeDefinitions](HttpServerService.md#routedefinitions)
- [router](HttpServerService.md#router)
- [server](HttpServerService.md#server)
- [serviceLogger](HttpServerService.md#servicelogger)
- [subscriptions](HttpServerService.md#subscriptions)

### Accessors

- [config](HttpServerService.md#config)
- [serviceInfo](HttpServerService.md#serviceinfo)

### Methods

- [addAllRoute](HttpServerService.md#addallroute)
- [addOnAfterMiddleware](HttpServerService.md#addonaftermiddleware)
- [addOnBeforeMiddleware](HttpServerService.md#addonbeforemiddleware)
- [addRoute](HttpServerService.md#addroute)
- [defaultMessageHandler](HttpServerService.md#defaultmessagehandler)
- [destroy](HttpServerService.md#destroy)
- [executeCommand](HttpServerService.md#executecommand)
- [handleSubscriptionMessage](HttpServerService.md#handlesubscriptionmessage)
- [initializeEventbridgeConnect](HttpServerService.md#initializeeventbridgeconnect)
- [invoke](HttpServerService.md#invoke)
- [registerCommand](HttpServerService.md#registercommand)
- [routerHandler](HttpServerService.md#routerhandler)
- [sendServiceInfo](HttpServerService.md#sendserviceinfo)
- [setErrorHandler](HttpServerService.md#seterrorhandler)
- [setNotFoundHandlers](HttpServerService.md#setnotfoundhandlers)
- [start](HttpServerService.md#start)
- [subscribe](HttpServerService.md#subscribe)
- [createInstance](HttpServerService.md#createinstance)

## Constructors

### constructor

• **new HttpServerService**(`baseLogger`, `eventBridge`, `conf?`)

Create a new instance of the HttpServer class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](../README.md#logger) | The logger that the server will use. |
| `eventBridge` | [`EventBridge`](../interfaces/EventBridge.md) | EventBridge |
| `conf` | [`HttpServerConfig`](../README.md#httpserverconfig) | HttpServerConfig |

#### Overrides

[Service](Service.md).[constructor](Service.md#constructor)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:47

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>\>

#### Inherited from

[Service](Service.md).[commands](Service.md#commands)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:69

___

### compressionMiddleware

• `Private` **compressionMiddleware**: [`Middleware`](../README.md#middleware)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:38

___

### conf

• `Private` **conf**: [`HttpServerConfig`](../README.md#httpserverconfig)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:31

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

The event bridge instance

#### Inherited from

[Service](Service.md).[eventBridge](Service.md#eventbridge)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:63

___

### info

• **info**: [`ServiceInfoType`](../README.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Inherited from

[Service](Service.md).[info](Service.md#info)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:60

___

### internalServerErrorHandler

• `Private` **internalServerErrorHandler**: [`Handler`](../README.md#handler)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:29

___

### jsonResponseMiddleware

• `Private` **jsonResponseMiddleware**: [`Middleware`](../README.md#middleware)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:39

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Inherited from

[Service](Service.md).[mainSubscriptionId](Service.md#mainsubscriptionid)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:71

___

### notFoundHandlers

• `Private` **notFoundHandlers**: [`Handler`](../README.md#handler)[] = `[]`

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:28

___

### onAfterMiddleware

• `Private` **onAfterMiddleware**: [`Middleware`](../README.md#middleware)[] = `[]`

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:34

___

### onBeforeMiddleware

• `Private` **onBeforeMiddleware**: [`Middleware`](../README.md#middleware)[] = `[]`

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:33

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Inherited from

[Service](Service.md).[pendingInvocations](Service.md#pendinginvocations)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:65

___

### routeDefinitions

• **routeDefinitions**: [`HttpExposedServiceMeta`](../README.md#httpexposedservicemeta)[] = `[]`

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:36

___

### router

• `Private` **router**: `default`<[`Handler`](../README.md#handler)\>

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:27

___

### server

• `Private` **server**: ``null`` \| `Http2SecureServer` = `null`

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:25

___

### serviceLogger

• `Protected` **serviceLogger**: [`Logger`](../README.md#logger)

#### Inherited from

[Service](Service.md).[serviceLogger](Service.md#servicelogger)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:61

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<[`EBMessage`](../README.md#ebmessage)\>\>

#### Inherited from

[Service](Service.md).[subscriptions](Service.md#subscriptions)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:67

## Accessors

### config

• `get` **config**(): `Object`

It returns the config object

#### Returns

`Object`

The value of the `conf` property.

| Name | Type |
| :------ | :------ |
| `apiMountPath?` | `string` |
| `cookieSecret?` | `string` |
| `domain` | `string` |
| `logLevel?` | [`LogLevelName`](../README.md#loglevelname) |
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

packages/core/src/http-server/HttpServerService.impl.ts:90

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../README.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../README.md#serviceinfotype)

#### Inherited from

Service.serviceInfo

#### Defined in

packages/core/src/core/types/ServiceClass.ts:32

## Methods

### addAllRoute

▸ **addAllRoute**(`pattern`, ...`handlers`): [`HttpServerService`](HttpServerService.md)

Add a route that matches all HTTP methods

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern` | `string` | The pattern to match against. |
| `...handlers` | [`Handler`](../README.md#handler)[] | An array of handlers to be called when the route is matched. |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:109

___

### addOnAfterMiddleware

▸ **addOnAfterMiddleware**(`middleware`): [`HttpServerService`](HttpServerService.md)

Add a middleware to the list of middlewares that will be called after the request is processed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`Middleware`](../README.md#middleware) | Middleware |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:141

___

### addOnBeforeMiddleware

▸ **addOnBeforeMiddleware**(`middleware`): [`HttpServerService`](HttpServerService.md)

Add a middleware function to the list of middleware functions that will be called before the route
handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`Middleware`](../README.md#middleware) | Middleware |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:132

___

### addRoute

▸ **addRoute**(`method`, `pattern`, ...`handlers`): [`HttpServerService`](HttpServerService.md)

Add a route to the router

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `Methods` | HTTP method |
| `pattern` | `string` | The pattern to match against. |
| `...handlers` | [`Handler`](../README.md#handler)[] | An array of functions that will be called when the route is matched. |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:121

___

### defaultMessageHandler

▸ `Protected` **defaultMessageHandler**(`subscriptionId`, `message`): `Promise`<`void`\>

There is one subscription with a specific id which set during init.
This subscriptions handles all incoming commands and invoke responses.

If the handler receives a message for a subscription with different id,
the message relates to a regular subscription (passiv listener)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionId` | `string` | id of subscription |
| `message` | [`EBMessage`](../README.md#ebmessage) | event bridge message |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[defaultMessageHandler](Service.md#defaultmessagehandler)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:164

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[destroy](Service.md#destroy)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:389

___

### executeCommand

▸ `Protected` **executeCommand**(`_subscriptionId`, `message`): `Promise`<`void`\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `_subscriptionId` | `string` |
| `message` | [`Command`](../README.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[executeCommand](Service.md#executecommand)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:281

___

### handleSubscriptionMessage

▸ `Protected` **handleSubscriptionMessage**(`subscriptionId`, `message`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `message` | [`EBMessage`](../README.md#ebmessage) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[handleSubscriptionMessage](Service.md#handlesubscriptionmessage)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:337

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>[] |
| `subscriptions` | [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<[`EBMessage`](../README.md#ebmessage)\>[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[initializeEventbridgeConnect](Service.md#initializeeventbridgeconnect)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:108

___

### invoke

▸ **invoke**<`T`\>(`input`, `ttl?`, `originalCommand?`): `Promise`<`T`\>

Invoke a service over event bridge and expect some result from called service
Used for service(-function) to service(-function) communication

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Omit`<[`Command`](../README.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"sender"`` \| ``"correlationId"``\> |
| `ttl` | `number` |
| `originalCommand?` | `Partial`<[`Command`](../README.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>\> |

#### Returns

`Promise`<`T`\>

#### Inherited from

[Service](Service.md).[invoke](Service.md#invoke)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:195

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[registerCommand](Service.md#registercommand)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:376

___

### routerHandler

▸ **routerHandler**(`request`, `response`): `Promise`<`void`\>

It takes a request, a response, and a context object. It then tries to find a matching route, and
if it finds one, it runs the middleware for that route. If it doesn't find a matching route, it
runs the middleware for the 404 handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `Http2ServerRequest` | The incoming request object. |
| `response` | `Http2ServerResponse` | The response object. |

#### Returns

`Promise`<`void`\>

Nothing.

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:172

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `data?`): `Promise`<`void`\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../README.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `data?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[sendServiceInfo](Service.md#sendserviceinfo)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:148

___

### setErrorHandler

▸ **setErrorHandler**(`handler`): [`HttpServerService`](HttpServerService.md)

Set the error handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`Handler`](../README.md#handler) | A function that takes a `Request` and `Response` object and returns |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:159

___

### setNotFoundHandlers

▸ **setNotFoundHandlers**(`handlers`): [`HttpServerService`](HttpServerService.md)

Set the not found handlers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handlers` | [`Handler`](../README.md#handler)[] | An array of handlers to be called when the request is not found. |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:150

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.
It creates an HTTP server, and then attaches the router to the server

#### Returns

`Promise`<`void`\>

#### Overrides

[Service](Service.md).[start](Service.md#start)

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:98

___

### subscribe

▸ `Protected` **subscribe**(`subscription`): `Promise`<`string`\>

Send subscription request to event bridge
Creates a new subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<[`EBMessage`](../README.md#ebmessage)\> |

#### Returns

`Promise`<`string`\>

#### Inherited from

[Service](Service.md).[subscribe](Service.md#subscribe)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:258

___

### createInstance

▸ `Static` **createInstance**(`baseLogger`, `eventBridge`, `conf?`): `Promise`<[`HttpServerService`](HttpServerService.md)\>

It creates an instance of the HttpServerService class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](../README.md#logger) | The logger instance that the service will use. |
| `eventBridge` | [`EventBridge`](../interfaces/EventBridge.md) | EventBridge |
| `conf` | [`HttpServerConfig`](../README.md#httpserverconfig) | HttpServerConfig |

#### Returns

`Promise`<[`HttpServerService`](HttpServerService.md)\>

A promise that resolves to an instance of the class.

#### Defined in

packages/core/src/http-server/HttpServerService.impl.ts:77
