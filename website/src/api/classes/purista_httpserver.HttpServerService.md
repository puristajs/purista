[PURISTA API - v1.4.9](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / HttpServerService

# Class: HttpServerService

[@purista/httpserver](../modules/purista_httpserver.md).HttpServerService

A simple http server based on fastify.

## Hierarchy

- [`Service`](purista_httpserver.internal.Service.md)<[`HttpServerConfig`](../modules/purista_httpserver.md#httpserverconfig)\>

  ↳ **`HttpServerService`**

## Table of contents

### Constructors

- [constructor](purista_httpserver.HttpServerService.md#constructor)

### Properties

- [beforeResponse](purista_httpserver.HttpServerService.md#beforeresponse)
- [commands](purista_httpserver.HttpServerService.md#commands)
- [config](purista_httpserver.HttpServerService.md#config)
- [eventBridge](purista_httpserver.HttpServerService.md#eventbridge)
- [info](purista_httpserver.HttpServerService.md#info)
- [routeDefinitions](purista_httpserver.HttpServerService.md#routedefinitions)
- [routes](purista_httpserver.HttpServerService.md#routes)
- [server](purista_httpserver.HttpServerService.md#server)
- [serviceLogger](purista_httpserver.HttpServerService.md#servicelogger)
- [spanProcessor](purista_httpserver.HttpServerService.md#spanprocessor)
- [subscriptions](purista_httpserver.HttpServerService.md#subscriptions)
- [traceProvider](purista_httpserver.HttpServerService.md#traceprovider)

### Accessors

- [serviceInfo](purista_httpserver.HttpServerService.md#serviceinfo)

### Methods

- [addBeforeResponse](purista_httpserver.HttpServerService.md#addbeforeresponse)
- [destroy](purista_httpserver.HttpServerService.md#destroy)
- [emit](purista_httpserver.HttpServerService.md#emit)
- [executeCommand](purista_httpserver.HttpServerService.md#executecommand)
- [executeSubscription](purista_httpserver.HttpServerService.md#executesubscription)
- [getEmitFunction](purista_httpserver.HttpServerService.md#getemitfunction)
- [getInvokeFunction](purista_httpserver.HttpServerService.md#getinvokefunction)
- [getTracer](purista_httpserver.HttpServerService.md#gettracer)
- [initializeEventbridgeConnect](purista_httpserver.HttpServerService.md#initializeeventbridgeconnect)
- [invoke](purista_httpserver.HttpServerService.md#invoke)
- [off](purista_httpserver.HttpServerService.md#off)
- [on](purista_httpserver.HttpServerService.md#on)
- [registerCommand](purista_httpserver.HttpServerService.md#registercommand)
- [registerSubscription](purista_httpserver.HttpServerService.md#registersubscription)
- [sendServiceInfo](purista_httpserver.HttpServerService.md#sendserviceinfo)
- [start](purista_httpserver.HttpServerService.md#start)
- [startActiveSpan](purista_httpserver.HttpServerService.md#startactivespan)
- [wrapInSpan](purista_httpserver.HttpServerService.md#wrapinspan)

## Constructors

### constructor

• **new HttpServerService**(`baseLogger`, `eventBridge`, `config?`, `spanProcessor?`)

Create a new instance of the HttpServer class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](purista_httpserver.internal.Logger.md) | The logger that the server will use. |
| `eventBridge` | [`EventBridge`](purista_httpserver.internal.EventBridge.md) | EventBridge |
| `config` | [`HttpServerConfig`](../modules/purista_httpserver.md#httpserverconfig) | - |
| `spanProcessor?` | `SpanProcessor` | - |

#### Overrides

[Service](purista_httpserver.internal.Service.md).[constructor](purista_httpserver.internal.Service.md#constructor)

#### Defined in

[httpserver/src/HttpServerService.impl.ts:55](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L55)

## Properties

### beforeResponse

• **beforeResponse**: `default`<[`BeforeResponseHook`](../modules/purista_httpserver.md#beforeresponsehook)\>

#### Defined in

[httpserver/src/HttpServerService.impl.ts:47](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L47)

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[commands](purista_httpserver.internal.Service.md#commands)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:25

___

### config

• **config**: [`HttpServerConfig`](../modules/purista_httpserver.md#httpserverconfig)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[config](purista_httpserver.internal.Service.md#config)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:23

___

### eventBridge

• **eventBridge**: [`EventBridge`](purista_httpserver.internal.EventBridge.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[eventBridge](purista_httpserver.internal.Service.md#eventbridge)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:14

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[info](purista_httpserver.internal.Service.md#info)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:13

___

### routeDefinitions

• **routeDefinitions**: [`HttpExposedServiceMeta`](../modules/purista_httpserver.internal.md#httpexposedservicemeta)[] = `[]`

#### Defined in

[httpserver/src/HttpServerService.impl.ts:43](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L43)

___

### routes

• **routes**: `default`<`Function`\>

#### Defined in

[httpserver/src/HttpServerService.impl.ts:45](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L45)

___

### server

• `Optional` **server**: `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\>

#### Defined in

[httpserver/src/HttpServerService.impl.ts:41](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L41)

___

### serviceLogger

• **serviceLogger**: [`Logger`](purista_httpserver.internal.Logger.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[serviceLogger](purista_httpserver.internal.Service.md#servicelogger)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:15

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[spanProcessor](purista_httpserver.internal.Service.md#spanprocessor)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:16

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage), `unknown`\>\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[subscriptions](purista_httpserver.internal.Service.md#subscriptions)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:24

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[traceProvider](purista_httpserver.internal.Service.md#traceprovider)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:17

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Inherited from

Service.serviceInfo

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:22

## Methods

### addBeforeResponse

▸ **addBeforeResponse**(`method`, `pattern`, `handler`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `HTTPMethods` |
| `pattern` | `string` |
| `handler` | [`BeforeResponseHook`](../modules/purista_httpserver.md#beforeresponsehook) |

#### Returns

`void`

#### Defined in

[httpserver/src/HttpServerService.impl.ts:162](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L162)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[destroy](purista_httpserver.internal.Service.md#destroy)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:65

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[emit](purista_httpserver.internal.Service.md#emit)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:13

___

### executeCommand

▸ `Protected` **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\> \| { `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_httpserver.internal.md#command-1)<`unknown`, `unknown`\>\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\> \| { `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[executeCommand](purista_httpserver.internal.Service.md#executecommand)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:49

___

### executeSubscription

▸ `Protected` **executeSubscription**(`message`, `subscriptionName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage) |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[executeSubscription](purista_httpserver.internal.Service.md#executesubscription)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:63

___

### getEmitFunction

▸ `Protected` **getEmitFunction**(`serviceTarget`, `traceId`, `principalId?`): <Payload\>(`eventName`: `string`, `eventPayload?`: `Payload`) => `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId?` | `string` |

#### Returns

`fn`

▸ <`Payload`\>(`eventName`, `eventPayload?`): `Promise`<`void`\>

##### Type parameters

| Name |
| :------ |
| `Payload` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `eventPayload?` | `Payload` |

##### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getEmitFunction](purista_httpserver.internal.Service.md#getemitfunction)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:42

___

### getInvokeFunction

▸ `Protected` **getInvokeFunction**(`serviceTarget`, `traceId`, `principalId?`): (`receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress), `eventPayload`: `unknown`, `parameter`: `unknown`) => `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId?` | `string` |

#### Returns

`fn`

▸ (`receiver`, `eventPayload`, `parameter`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) |
| `eventPayload` | `unknown` |
| `parameter` | `unknown` |

##### Returns

`Promise`<`any`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getInvokeFunction](purista_httpserver.internal.Service.md#getinvokefunction)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:41

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getTracer](purista_httpserver.internal.Service.md#gettracer)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:28

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage), `unknown`\>[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[initializeEventbridgeConnect](purista_httpserver.internal.Service.md#initializeeventbridgeconnect)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:34

___

### invoke

▸ **invoke**<`T`\>(`input`, `endpoint`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.payload` | `Object` |
| `input.payload.parameter` | `unknown` |
| `input.payload.payload` | `unknown` |
| `input.principalId?` | `string` |
| `input.receiver` | [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) |
| `input.traceId` | `string` |
| `endpoint` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[httpserver/src/HttpServerService.impl.ts:230](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L230)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[off](purista_httpserver.internal.Service.md#off)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[on](purista_httpserver.internal.Service.md#on)

#### Defined in

core/lib/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[registerCommand](purista_httpserver.internal.Service.md#registercommand)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:62

___

### registerSubscription

▸ `Protected` **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage), `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[registerSubscription](purista_httpserver.internal.Service.md#registersubscription)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:64

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\>\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_httpserver.internal.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `payload?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\>\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[sendServiceInfo](purista_httpserver.internal.Service.md#sendserviceinfo)

#### Defined in

core/lib/core/Service/Service.impl.d.ts:40

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Overrides

[Service](purista_httpserver.internal.Service.md).[start](purista_httpserver.internal.Service.md#start)

#### Defined in

[httpserver/src/HttpServerService.impl.ts:166](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/HttpServerService.impl.ts#L166)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `context` | `undefined` \| `Context` | optional context |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function to be executed within the span |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[startActiveSpan](purista_httpserver.internal.Service.md#startactivespan)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:37

___

### wrapInSpan

▸ **wrapInSpan**<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`<`F`\>

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function te be executed in the span |
| `context?` | `Context` | span context |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[wrapInSpan](purista_httpserver.internal.Service.md#wrapinspan)

#### Defined in

core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:53
