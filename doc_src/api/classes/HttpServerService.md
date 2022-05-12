[@purista/core](../README.md) / [Exports](../modules.md) / HttpServerService

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
- [log](HttpServerService.md#log)
- [mainSubscriptionId](HttpServerService.md#mainsubscriptionid)
- [notFoundHandlers](HttpServerService.md#notfoundhandlers)
- [onAfterMiddleware](HttpServerService.md#onaftermiddleware)
- [onBeforeMiddleware](HttpServerService.md#onbeforemiddleware)
- [pendingInvocations](HttpServerService.md#pendinginvocations)
- [routeDefinitions](HttpServerService.md#routedefinitions)
- [router](HttpServerService.md#router)
- [server](HttpServerService.md#server)
- [subscriptions](HttpServerService.md#subscriptions)
- [ttlInterval](HttpServerService.md#ttlinterval)

### Accessors

- [config](HttpServerService.md#config)
- [serviceInfo](HttpServerService.md#serviceinfo)

### Methods

- [addAllRoute](HttpServerService.md#addallroute)
- [addOnAfterMiddleware](HttpServerService.md#addonaftermiddleware)
- [addOnBeforeMiddleware](HttpServerService.md#addonbeforemiddleware)
- [addRoute](HttpServerService.md#addroute)
- [connectToEventBridge](HttpServerService.md#connecttoeventbridge)
- [defaultMessageHandler](HttpServerService.md#defaultmessagehandler)
- [destroy](HttpServerService.md#destroy)
- [executeCommand](HttpServerService.md#executecommand)
- [handleSubscriptionMessage](HttpServerService.md#handlesubscriptionmessage)
- [invoke](HttpServerService.md#invoke)
- [registerCommand](HttpServerService.md#registercommand)
- [rejectExpiredInvocations](HttpServerService.md#rejectexpiredinvocations)
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
| `baseLogger` | [`Logger`](../modules.md#logger) | The logger that the server will use. |
| `eventBridge` | [`EventBridge`](../interfaces/EventBridge.md) | EventBridge |
| `conf` | [`HttpServerConfig`](../modules.md#httpserverconfig) | HttpServerConfig |

#### Overrides

[Service](Service.md).[constructor](Service.md#constructor)

#### Defined in

[src/http-server/HttpServerService.impl.ts:47](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L47)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules.md#commandfunction)<[`Service`](Service.md), `unknown`, `unknown`, `unknown`\>\>\>

#### Inherited from

[Service](Service.md).[commands](Service.md#commands)

#### Defined in

[src/core/Service/Service.impl.ts:72](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L72)

___

### compressionMiddleware

• `Private` **compressionMiddleware**: [`Middleware`](../modules.md#middleware)

#### Defined in

[src/http-server/HttpServerService.impl.ts:38](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L38)

___

### conf

• `Private` **conf**: [`HttpServerConfig`](../modules.md#httpserverconfig)

#### Defined in

[src/http-server/HttpServerService.impl.ts:31](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L31)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

The event bridge instance

#### Inherited from

[Service](Service.md).[eventBridge](Service.md#eventbridge)

#### Defined in

[src/core/Service/Service.impl.ts:64](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L64)

___

### info

• **info**: [`ServiceInfoType`](../modules.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Inherited from

[Service](Service.md).[info](Service.md#info)

#### Defined in

[src/core/Service/Service.impl.ts:61](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L61)

___

### internalServerErrorHandler

• `Private` **internalServerErrorHandler**: [`Handler`](../modules.md#handler)

#### Defined in

[src/http-server/HttpServerService.impl.ts:29](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L29)

___

### jsonResponseMiddleware

• `Private` **jsonResponseMiddleware**: [`Middleware`](../modules.md#middleware)

#### Defined in

[src/http-server/HttpServerService.impl.ts:39](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L39)

___

### log

• **log**: [`Logger`](../modules.md#logger)

#### Inherited from

[Service](Service.md).[log](Service.md#log)

#### Defined in

[src/core/Service/Service.impl.ts:62](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L62)

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Inherited from

[Service](Service.md).[mainSubscriptionId](Service.md#mainsubscriptionid)

#### Defined in

[src/core/Service/Service.impl.ts:74](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L74)

___

### notFoundHandlers

• `Private` **notFoundHandlers**: [`Handler`](../modules.md#handler)[] = `[]`

#### Defined in

[src/http-server/HttpServerService.impl.ts:28](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L28)

___

### onAfterMiddleware

• `Private` **onAfterMiddleware**: [`Middleware`](../modules.md#middleware)[] = `[]`

#### Defined in

[src/http-server/HttpServerService.impl.ts:34](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L34)

___

### onBeforeMiddleware

• `Private` **onBeforeMiddleware**: [`Middleware`](../modules.md#middleware)[] = `[]`

#### Defined in

[src/http-server/HttpServerService.impl.ts:33](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L33)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Inherited from

[Service](Service.md).[pendingInvocations](Service.md#pendinginvocations)

#### Defined in

[src/core/Service/Service.impl.ts:66](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L66)

___

### routeDefinitions

• **routeDefinitions**: [`HttpExposedServiceMeta`](../modules.md#httpexposedservicemeta)[] = `[]`

#### Defined in

[src/http-server/HttpServerService.impl.ts:36](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L36)

___

### router

• `Private` **router**: `default`<[`Handler`](../modules.md#handler)\>

#### Defined in

[src/http-server/HttpServerService.impl.ts:27](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L27)

___

### server

• `Private` **server**: ``null`` \| `Http2SecureServer` = `null`

#### Defined in

[src/http-server/HttpServerService.impl.ts:25](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L25)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<[`EBMessage`](../modules.md#ebmessage)\>\>

#### Inherited from

[Service](Service.md).[subscriptions](Service.md#subscriptions)

#### Defined in

[src/core/Service/Service.impl.ts:70](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L70)

___

### ttlInterval

• `Protected` **ttlInterval**: `Timer`

#### Inherited from

[Service](Service.md).[ttlInterval](Service.md#ttlinterval)

#### Defined in

[src/core/Service/Service.impl.ts:68](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L68)

## Accessors

### config

• `get` **config**(): [`HttpServerConfig`](../modules.md#httpserverconfig)

It returns the config object

#### Returns

[`HttpServerConfig`](../modules.md#httpserverconfig)

The value of the `conf` property.

#### Defined in

[src/http-server/HttpServerService.impl.ts:90](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L90)

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules.md#serviceinfotype)

#### Inherited from

Service.serviceInfo

#### Defined in

[src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/types/ServiceClass.ts#L32)

## Methods

### addAllRoute

▸ **addAllRoute**(`pattern`, ...`handlers`): [`HttpServerService`](HttpServerService.md)

Add a route that matches all HTTP methods

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern` | `string` | The pattern to match against. |
| `...handlers` | [`Handler`](../modules.md#handler)[] | An array of handlers to be called when the route is matched. |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

[src/http-server/HttpServerService.impl.ts:109](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L109)

___

### addOnAfterMiddleware

▸ **addOnAfterMiddleware**(`middleware`): [`HttpServerService`](HttpServerService.md)

Add a middleware to the list of middlewares that will be called after the request is processed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`Middleware`](../modules.md#middleware) | Middleware |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

[src/http-server/HttpServerService.impl.ts:141](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L141)

___

### addOnBeforeMiddleware

▸ **addOnBeforeMiddleware**(`middleware`): [`HttpServerService`](HttpServerService.md)

Add a middleware function to the list of middleware functions that will be called before the route
handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`Middleware`](../modules.md#middleware) | Middleware |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

[src/http-server/HttpServerService.impl.ts:132](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L132)

___

### addRoute

▸ **addRoute**(`method`, `pattern`, ...`handlers`): [`HttpServerService`](HttpServerService.md)

Add a route to the router

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `Methods` | HTTP method |
| `pattern` | `string` | The pattern to match against. |
| `...handlers` | [`Handler`](../modules.md#handler)[] | An array of functions that will be called when the route is matched. |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

[src/http-server/HttpServerService.impl.ts:121](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L121)

___

### connectToEventBridge

▸ `Protected` **connectToEventBridge**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinition`](../modules.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules.md#commandfunction)<[`Service`](Service.md), `unknown`, `unknown`, `unknown`\>\>[] |
| `subscriptions` | [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<[`EBMessage`](../modules.md#ebmessage)\>[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[connectToEventBridge](Service.md#connecttoeventbridge)

#### Defined in

[src/core/Service/Service.impl.ts:103](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L103)

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
| `message` | [`EBMessage`](../modules.md#ebmessage) | event bridge message |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[defaultMessageHandler](Service.md#defaultmessagehandler)

#### Defined in

[src/core/Service/Service.impl.ts:156](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L156)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[destroy](Service.md#destroy)

#### Defined in

[src/core/Service/Service.impl.ts:311](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L311)

___

### executeCommand

▸ `Protected` **executeCommand**(`_subscriptionId`, `message`): `Promise`<`void`\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `_subscriptionId` | `string` |
| `message` | [`Command`](../modules.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[executeCommand](Service.md#executecommand)

#### Defined in

[src/core/Service/Service.impl.ts:238](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L238)

___

### handleSubscriptionMessage

▸ `Protected` **handleSubscriptionMessage**(`subscriptionId`, `message`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `message` | [`EBMessage`](../modules.md#ebmessage) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[handleSubscriptionMessage](Service.md#handlesubscriptionmessage)

#### Defined in

[src/core/Service/Service.impl.ts:264](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L264)

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
| `input` | `Omit`<[`Command`](../modules.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"sender"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"correlationId"``\> |
| `ttl` | `number` |
| `originalCommand?` | `Partial`<[`Command`](../modules.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>\> |

#### Returns

`Promise`<`T`\>

#### Inherited from

[Service](Service.md).[invoke](Service.md#invoke)

#### Defined in

[src/core/Service/Service.impl.ts:186](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L186)

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules.md#commandfunction)<[`Service`](Service.md), `unknown`, `unknown`, `unknown`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[registerCommand](Service.md#registercommand)

#### Defined in

[src/core/Service/Service.impl.ts:298](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L298)

___

### rejectExpiredInvocations

▸ `Protected` **rejectExpiredInvocations**(): `void`

Function which runs in internval to reject all invocations which are timed out

#### Returns

`void`

#### Inherited from

[Service](Service.md).[rejectExpiredInvocations](Service.md#rejectexpiredinvocations)

#### Defined in

[src/core/Service/Service.impl.ts:284](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L284)

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

[src/http-server/HttpServerService.impl.ts:172](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L172)

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `data?`): `Promise`<`void`\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `data?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](Service.md).[sendServiceInfo](Service.md#sendserviceinfo)

#### Defined in

[src/core/Service/Service.impl.ts:140](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L140)

___

### setErrorHandler

▸ **setErrorHandler**(`handler`): [`HttpServerService`](HttpServerService.md)

Set the error handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`Handler`](../modules.md#handler) | A function that takes a `Request` and `Response` object and returns |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

[src/http-server/HttpServerService.impl.ts:159](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L159)

___

### setNotFoundHandlers

▸ **setNotFoundHandlers**(`handlers`): [`HttpServerService`](HttpServerService.md)

Set the not found handlers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handlers` | [`Handler`](../modules.md#handler)[] | An array of handlers to be called when the request is not found. |

#### Returns

[`HttpServerService`](HttpServerService.md)

#### Defined in

[src/http-server/HttpServerService.impl.ts:150](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L150)

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

[src/http-server/HttpServerService.impl.ts:98](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L98)

___

### subscribe

▸ `Protected` **subscribe**(`subscription`): `Promise`<`string`\>

Send subscription request to event bridge
Creates a new subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<[`EBMessage`](../modules.md#ebmessage)\> |

#### Returns

`Promise`<`string`\>

#### Inherited from

[Service](Service.md).[subscribe](Service.md#subscribe)

#### Defined in

[src/core/Service/Service.impl.ts:215](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/core/Service/Service.impl.ts#L215)

___

### createInstance

▸ `Static` **createInstance**(`baseLogger`, `eventBridge`, `conf?`): `Promise`<[`HttpServerService`](HttpServerService.md)\>

It creates an instance of the HttpServerService class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](../modules.md#logger) | The logger instance that the service will use. |
| `eventBridge` | [`EventBridge`](../interfaces/EventBridge.md) | EventBridge |
| `conf` | [`HttpServerConfig`](../modules.md#httpserverconfig) | HttpServerConfig |

#### Returns

`Promise`<[`HttpServerService`](HttpServerService.md)\>

A promise that resolves to an instance of the class.

#### Defined in

[src/http-server/HttpServerService.impl.ts:77](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/http-server/HttpServerService.impl.ts#L77)
