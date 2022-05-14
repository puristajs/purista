[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / HttpServerService

# Class: HttpServerService

[@purista/core](../modules/purista_core.md).HttpServerService

## Hierarchy

- [`Service`](purista_core.Service.md)

  ↳ **`HttpServerService`**

## Table of contents

### Constructors

- [constructor](purista_core.HttpServerService.md#constructor)

### Properties

- [commands](purista_core.HttpServerService.md#commands)
- [compressionMiddleware](purista_core.HttpServerService.md#compressionmiddleware)
- [conf](purista_core.HttpServerService.md#conf)
- [eventBridge](purista_core.HttpServerService.md#eventbridge)
- [info](purista_core.HttpServerService.md#info)
- [internalServerErrorHandler](purista_core.HttpServerService.md#internalservererrorhandler)
- [jsonResponseMiddleware](purista_core.HttpServerService.md#jsonresponsemiddleware)
- [log](purista_core.HttpServerService.md#log)
- [mainSubscriptionId](purista_core.HttpServerService.md#mainsubscriptionid)
- [notFoundHandlers](purista_core.HttpServerService.md#notfoundhandlers)
- [onAfterMiddleware](purista_core.HttpServerService.md#onaftermiddleware)
- [onBeforeMiddleware](purista_core.HttpServerService.md#onbeforemiddleware)
- [pendingInvocations](purista_core.HttpServerService.md#pendinginvocations)
- [routeDefinitions](purista_core.HttpServerService.md#routedefinitions)
- [router](purista_core.HttpServerService.md#router)
- [server](purista_core.HttpServerService.md#server)
- [subscriptions](purista_core.HttpServerService.md#subscriptions)
- [ttlInterval](purista_core.HttpServerService.md#ttlinterval)

### Accessors

- [config](purista_core.HttpServerService.md#config)
- [serviceInfo](purista_core.HttpServerService.md#serviceinfo)

### Methods

- [addAllRoute](purista_core.HttpServerService.md#addallroute)
- [addOnAfterMiddleware](purista_core.HttpServerService.md#addonaftermiddleware)
- [addOnBeforeMiddleware](purista_core.HttpServerService.md#addonbeforemiddleware)
- [addRoute](purista_core.HttpServerService.md#addroute)
- [connectToEventBridge](purista_core.HttpServerService.md#connecttoeventbridge)
- [defaultMessageHandler](purista_core.HttpServerService.md#defaultmessagehandler)
- [destroy](purista_core.HttpServerService.md#destroy)
- [executeCommand](purista_core.HttpServerService.md#executecommand)
- [handleSubscriptionMessage](purista_core.HttpServerService.md#handlesubscriptionmessage)
- [invoke](purista_core.HttpServerService.md#invoke)
- [registerCommand](purista_core.HttpServerService.md#registercommand)
- [rejectExpiredInvocations](purista_core.HttpServerService.md#rejectexpiredinvocations)
- [routerHandler](purista_core.HttpServerService.md#routerhandler)
- [sendServiceInfo](purista_core.HttpServerService.md#sendserviceinfo)
- [setErrorHandler](purista_core.HttpServerService.md#seterrorhandler)
- [setNotFoundHandlers](purista_core.HttpServerService.md#setnotfoundhandlers)
- [start](purista_core.HttpServerService.md#start)
- [subscribe](purista_core.HttpServerService.md#subscribe)
- [createInstance](purista_core.HttpServerService.md#createinstance)

## Constructors

### constructor

• **new HttpServerService**(`baseLogger`, `eventBridge`, `conf?`)

Create a new instance of the HttpServer class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](../modules/purista_core.md#logger) | The logger that the server will use. |
| `eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) | EventBridge |
| `conf` | [`HttpServerConfig`](../modules/purista_core.md#httpserverconfig) | HttpServerConfig |

#### Overrides

[Service](purista_core.Service.md).[constructor](purista_core.Service.md#constructor)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:47](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L47)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules/purista_core.md#commandfunction)<[`Service`](purista_core.Service.md), `unknown`, `unknown`, `unknown`\>\>\>

#### Inherited from

[Service](purista_core.Service.md).[commands](purista_core.Service.md#commands)

#### Defined in

[core/src/core/Service/Service.impl.ts:72](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L72)

___

### compressionMiddleware

• `Private` **compressionMiddleware**: [`Middleware`](../modules/purista_core.md#middleware)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:38](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L38)

___

### conf

• `Private` **conf**: [`HttpServerConfig`](../modules/purista_core.md#httpserverconfig)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:31](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L31)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

The event bridge instance

#### Inherited from

[Service](purista_core.Service.md).[eventBridge](purista_core.Service.md#eventbridge)

#### Defined in

[core/src/core/Service/Service.impl.ts:64](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L64)

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Inherited from

[Service](purista_core.Service.md).[info](purista_core.Service.md#info)

#### Defined in

[core/src/core/Service/Service.impl.ts:61](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L61)

___

### internalServerErrorHandler

• `Private` **internalServerErrorHandler**: [`Handler`](../modules/purista_core.md#handler)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:29](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L29)

___

### jsonResponseMiddleware

• `Private` **jsonResponseMiddleware**: [`Middleware`](../modules/purista_core.md#middleware)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:39](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L39)

___

### log

• **log**: [`Logger`](../modules/purista_core.md#logger)

#### Inherited from

[Service](purista_core.Service.md).[log](purista_core.Service.md#log)

#### Defined in

[core/src/core/Service/Service.impl.ts:62](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L62)

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Inherited from

[Service](purista_core.Service.md).[mainSubscriptionId](purista_core.Service.md#mainsubscriptionid)

#### Defined in

[core/src/core/Service/Service.impl.ts:74](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L74)

___

### notFoundHandlers

• `Private` **notFoundHandlers**: [`Handler`](../modules/purista_core.md#handler)[] = `[]`

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:28](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L28)

___

### onAfterMiddleware

• `Private` **onAfterMiddleware**: [`Middleware`](../modules/purista_core.md#middleware)[] = `[]`

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:34](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L34)

___

### onBeforeMiddleware

• `Private` **onBeforeMiddleware**: [`Middleware`](../modules/purista_core.md#middleware)[] = `[]`

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:33](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L33)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Inherited from

[Service](purista_core.Service.md).[pendingInvocations](purista_core.Service.md#pendinginvocations)

#### Defined in

[core/src/core/Service/Service.impl.ts:66](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L66)

___

### routeDefinitions

• **routeDefinitions**: [`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta)[] = `[]`

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:36](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L36)

___

### router

• `Private` **router**: `default`<[`Handler`](../modules/purista_core.md#handler)\>

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:27](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L27)

___

### server

• `Private` **server**: ``null`` \| `Http2SecureServer` = `null`

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:25](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L25)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Inherited from

[Service](purista_core.Service.md).[subscriptions](purista_core.Service.md#subscriptions)

#### Defined in

[core/src/core/Service/Service.impl.ts:70](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L70)

___

### ttlInterval

• `Protected` **ttlInterval**: `Timer`

#### Inherited from

[Service](purista_core.Service.md).[ttlInterval](purista_core.Service.md#ttlinterval)

#### Defined in

[core/src/core/Service/Service.impl.ts:68](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L68)

## Accessors

### config

• `get` **config**(): [`HttpServerConfig`](../modules/purista_core.md#httpserverconfig)

It returns the config object

#### Returns

[`HttpServerConfig`](../modules/purista_core.md#httpserverconfig)

The value of the `conf` property.

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:90](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L90)

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

Service.serviceInfo

#### Defined in

[core/src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/ServiceClass.ts#L32)

## Methods

### addAllRoute

▸ **addAllRoute**(`pattern`, ...`handlers`): [`HttpServerService`](purista_core.HttpServerService.md)

Add a route that matches all HTTP methods

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern` | `string` | The pattern to match against. |
| `...handlers` | [`Handler`](../modules/purista_core.md#handler)[] | An array of handlers to be called when the route is matched. |

#### Returns

[`HttpServerService`](purista_core.HttpServerService.md)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:109](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L109)

___

### addOnAfterMiddleware

▸ **addOnAfterMiddleware**(`middleware`): [`HttpServerService`](purista_core.HttpServerService.md)

Add a middleware to the list of middlewares that will be called after the request is processed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`Middleware`](../modules/purista_core.md#middleware) | Middleware |

#### Returns

[`HttpServerService`](purista_core.HttpServerService.md)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:141](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L141)

___

### addOnBeforeMiddleware

▸ **addOnBeforeMiddleware**(`middleware`): [`HttpServerService`](purista_core.HttpServerService.md)

Add a middleware function to the list of middleware functions that will be called before the route
handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`Middleware`](../modules/purista_core.md#middleware) | Middleware |

#### Returns

[`HttpServerService`](purista_core.HttpServerService.md)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:132](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L132)

___

### addRoute

▸ **addRoute**(`method`, `pattern`, ...`handlers`): [`HttpServerService`](purista_core.HttpServerService.md)

Add a route to the router

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `Methods` | HTTP method |
| `pattern` | `string` | The pattern to match against. |
| `...handlers` | [`Handler`](../modules/purista_core.md#handler)[] | An array of functions that will be called when the route is matched. |

#### Returns

[`HttpServerService`](purista_core.HttpServerService.md)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:121](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L121)

___

### connectToEventBridge

▸ `Protected` **connectToEventBridge**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules/purista_core.md#commandfunction)<[`Service`](purista_core.Service.md), `unknown`, `unknown`, `unknown`\>\>[] |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[connectToEventBridge](purista_core.Service.md#connecttoeventbridge)

#### Defined in

[core/src/core/Service/Service.impl.ts:103](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L103)

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
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) | event bridge message |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[defaultMessageHandler](purista_core.Service.md#defaultmessagehandler)

#### Defined in

[core/src/core/Service/Service.impl.ts:156](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L156)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[destroy](purista_core.Service.md#destroy)

#### Defined in

[core/src/core/Service/Service.impl.ts:311](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L311)

___

### executeCommand

▸ `Protected` **executeCommand**(`_subscriptionId`, `message`): `Promise`<`void`\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `_subscriptionId` | `string` |
| `message` | [`Command`](../modules/purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[executeCommand](purista_core.Service.md#executecommand)

#### Defined in

[core/src/core/Service/Service.impl.ts:238](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L238)

___

### handleSubscriptionMessage

▸ `Protected` **handleSubscriptionMessage**(`subscriptionId`, `message`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[handleSubscriptionMessage](purista_core.Service.md#handlesubscriptionmessage)

#### Defined in

[core/src/core/Service/Service.impl.ts:264](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L264)

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
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"sender"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"correlationId"``\> |
| `ttl` | `number` |
| `originalCommand?` | `Partial`<[`Command`](../modules/purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>\> |

#### Returns

`Promise`<`T`\>

#### Inherited from

[Service](purista_core.Service.md).[invoke](purista_core.Service.md#invoke)

#### Defined in

[core/src/core/Service/Service.impl.ts:186](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L186)

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules/purista_core.md#commandfunction)<[`Service`](purista_core.Service.md), `unknown`, `unknown`, `unknown`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[registerCommand](purista_core.Service.md#registercommand)

#### Defined in

[core/src/core/Service/Service.impl.ts:298](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L298)

___

### rejectExpiredInvocations

▸ `Protected` **rejectExpiredInvocations**(): `void`

Function which runs in internval to reject all invocations which are timed out

#### Returns

`void`

#### Inherited from

[Service](purista_core.Service.md).[rejectExpiredInvocations](purista_core.Service.md#rejectexpiredinvocations)

#### Defined in

[core/src/core/Service/Service.impl.ts:284](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L284)

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

[core/src/http-server/HttpServerService.impl.ts:172](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L172)

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `data?`): `Promise`<`void`\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_core.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `data?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[sendServiceInfo](purista_core.Service.md#sendserviceinfo)

#### Defined in

[core/src/core/Service/Service.impl.ts:140](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L140)

___

### setErrorHandler

▸ **setErrorHandler**(`handler`): [`HttpServerService`](purista_core.HttpServerService.md)

Set the error handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`Handler`](../modules/purista_core.md#handler) | A function that takes a `Request` and `Response` object and returns |

#### Returns

[`HttpServerService`](purista_core.HttpServerService.md)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:159](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L159)

___

### setNotFoundHandlers

▸ **setNotFoundHandlers**(`handlers`): [`HttpServerService`](purista_core.HttpServerService.md)

Set the not found handlers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handlers` | [`Handler`](../modules/purista_core.md#handler)[] | An array of handlers to be called when the request is not found. |

#### Returns

[`HttpServerService`](purista_core.HttpServerService.md)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:150](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L150)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.
It creates an HTTP server, and then attaches the router to the server

#### Returns

`Promise`<`void`\>

#### Overrides

[Service](purista_core.Service.md).[start](purista_core.Service.md#start)

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:98](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L98)

___

### subscribe

▸ `Protected` **subscribe**(`subscription`): `Promise`<`string`\>

Send subscription request to event bridge
Creates a new subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\> |

#### Returns

`Promise`<`string`\>

#### Inherited from

[Service](purista_core.Service.md).[subscribe](purista_core.Service.md#subscribe)

#### Defined in

[core/src/core/Service/Service.impl.ts:215](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L215)

___

### createInstance

▸ `Static` **createInstance**(`baseLogger`, `eventBridge`, `conf?`): `Promise`<[`HttpServerService`](purista_core.HttpServerService.md)\>

It creates an instance of the HttpServerService class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](../modules/purista_core.md#logger) | The logger instance that the service will use. |
| `eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) | EventBridge |
| `conf` | [`HttpServerConfig`](../modules/purista_core.md#httpserverconfig) | HttpServerConfig |

#### Returns

`Promise`<[`HttpServerService`](purista_core.HttpServerService.md)\>

A promise that resolves to an instance of the class.

#### Defined in

[core/src/http-server/HttpServerService.impl.ts:77](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/http-server/HttpServerService.impl.ts#L77)