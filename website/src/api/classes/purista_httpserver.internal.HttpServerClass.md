[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / HttpServerClass

# Class: HttpServerClass<ConfigType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).HttpServerClass

A simple http server based on fastify.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends [`HttpServerServiceV1ConfigRaw`](../modules/purista_httpserver.internal.md#httpserverservicev1configraw) |

## Hierarchy

- [`Service`](purista_httpserver.internal.Service.md)<`ConfigType`\>

  ↳ **`HttpServerClass`**

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.HttpServerClass.md#constructor)

### Properties

- [beforeResponse](purista_httpserver.internal.HttpServerClass.md#beforeresponse)
- [commandDefinitionList](purista_httpserver.internal.HttpServerClass.md#commanddefinitionlist)
- [commands](purista_httpserver.internal.HttpServerClass.md#commands)
- [config](purista_httpserver.internal.HttpServerClass.md#config)
- [configStore](purista_httpserver.internal.HttpServerClass.md#configstore)
- [eventBridge](purista_httpserver.internal.HttpServerClass.md#eventbridge)
- [info](purista_httpserver.internal.HttpServerClass.md#info)
- [logger](purista_httpserver.internal.HttpServerClass.md#logger)
- [routeDefinitions](purista_httpserver.internal.HttpServerClass.md#routedefinitions)
- [routes](purista_httpserver.internal.HttpServerClass.md#routes)
- [secretStore](purista_httpserver.internal.HttpServerClass.md#secretstore)
- [server](purista_httpserver.internal.HttpServerClass.md#server)
- [spanProcessor](purista_httpserver.internal.HttpServerClass.md#spanprocessor)
- [stateStore](purista_httpserver.internal.HttpServerClass.md#statestore)
- [subscriptionDefinitionList](purista_httpserver.internal.HttpServerClass.md#subscriptiondefinitionlist)
- [subscriptions](purista_httpserver.internal.HttpServerClass.md#subscriptions)
- [traceProvider](purista_httpserver.internal.HttpServerClass.md#traceprovider)

### Accessors

- [name](purista_httpserver.internal.HttpServerClass.md#name)
- [serviceInfo](purista_httpserver.internal.HttpServerClass.md#serviceinfo)

### Methods

- [addBeforeResponse](purista_httpserver.internal.HttpServerClass.md#addbeforeresponse)
- [destroy](purista_httpserver.internal.HttpServerClass.md#destroy)
- [emit](purista_httpserver.internal.HttpServerClass.md#emit)
- [executeCommand](purista_httpserver.internal.HttpServerClass.md#executecommand)
- [executeSubscription](purista_httpserver.internal.HttpServerClass.md#executesubscription)
- [getContextFunctions](purista_httpserver.internal.HttpServerClass.md#getcontextfunctions)
- [getEmitFunction](purista_httpserver.internal.HttpServerClass.md#getemitfunction)
- [getInvokeFunction](purista_httpserver.internal.HttpServerClass.md#getinvokefunction)
- [getTracer](purista_httpserver.internal.HttpServerClass.md#gettracer)
- [initializeEventbridgeConnect](purista_httpserver.internal.HttpServerClass.md#initializeeventbridgeconnect)
- [invoke](purista_httpserver.internal.HttpServerClass.md#invoke)
- [off](purista_httpserver.internal.HttpServerClass.md#off)
- [on](purista_httpserver.internal.HttpServerClass.md#on)
- [registerCommand](purista_httpserver.internal.HttpServerClass.md#registercommand)
- [registerSubscription](purista_httpserver.internal.HttpServerClass.md#registersubscription)
- [removeAllListeners](purista_httpserver.internal.HttpServerClass.md#removealllisteners)
- [sendServiceInfo](purista_httpserver.internal.HttpServerClass.md#sendserviceinfo)
- [start](purista_httpserver.internal.HttpServerClass.md#start)
- [startActiveSpan](purista_httpserver.internal.HttpServerClass.md#startactivespan)
- [wrapInSpan](purista_httpserver.internal.HttpServerClass.md#wrapinspan)

## Constructors

### constructor

• **new HttpServerClass**<`ConfigType`\>(`config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ServiceConstructorInput`](../modules/purista_httpserver.internal.md#serviceconstructorinput)<`ConfigType`\> |

#### Overrides

[Service](purista_httpserver.internal.Service.md).[constructor](purista_httpserver.internal.Service.md#constructor)

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:42](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L42)

## Properties

### beforeResponse

• **beforeResponse**: `default`<[`BeforeResponseHook`](../modules/purista_httpserver.internal.md#beforeresponsehook)\>

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:40](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L40)

___

### commandDefinitionList

• **commandDefinitionList**: [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`any`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[commandDefinitionList](purista_httpserver.internal.Service.md#commanddefinitionlist)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:29

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[commands](purista_httpserver.internal.Service.md#commands)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:28

___

### config

• **config**: `ConfigType`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[config](purista_httpserver.internal.Service.md#config)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:31

___

### configStore

• **configStore**: [`ConfigStore`](../interfaces/purista_httpserver.internal.ConfigStore.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[configStore](purista_httpserver.internal.Service.md#configstore)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:24

___

### eventBridge

• **eventBridge**: [`EventBridge`](../interfaces/purista_httpserver.internal.EventBridge.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[eventBridge](purista_httpserver.internal.Service.md#eventbridge)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:19

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[info](purista_httpserver.internal.Service.md#info)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:18

___

### logger

• **logger**: [`Logger`](purista_httpserver.internal.Logger.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[logger](purista_httpserver.internal.Service.md#logger)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:20

___

### routeDefinitions

• **routeDefinitions**: [`HttpExposedServiceMeta`](../modules/purista_httpserver.internal.md#httpexposedservicemeta)<`Record`<`string`, `unknown`\>\>[] = `[]`

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:36](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L36)

___

### routes

• **routes**: `default`<`Function`\>

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:38](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L38)

___

### secretStore

• **secretStore**: [`SecretStore`](../interfaces/purista_httpserver.internal.SecretStore.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[secretStore](purista_httpserver.internal.Service.md#secretstore)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:23

___

### server

• `Optional` **server**: `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\>

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:34](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L34)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[spanProcessor](purista_httpserver.internal.Service.md#spanprocessor)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:21

___

### stateStore

• **stateStore**: [`StateStore`](../interfaces/purista_httpserver.internal.StateStore.md)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[stateStore](purista_httpserver.internal.Service.md#statestore)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:25

___

### subscriptionDefinitionList

• **subscriptionDefinitionList**: [`SubscriptionDefinitionList`](../modules/purista_httpserver.internal.md#subscriptiondefinitionlist)<`any`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[subscriptionDefinitionList](purista_httpserver.internal.Service.md#subscriptiondefinitionlist)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:30

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[subscriptions](purista_httpserver.internal.Service.md#subscriptions)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:27

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[traceProvider](purista_httpserver.internal.Service.md#traceprovider)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:22

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Service.name

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:33

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Inherited from

Service.serviceInfo

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:38

## Methods

### addBeforeResponse

▸ **addBeforeResponse**(`method`, `pattern`, `handler`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `HTTPMethods` |
| `pattern` | `string` |
| `handler` | [`BeforeResponseHook`](../modules/purista_httpserver.internal.md#beforeresponsehook) |

#### Returns

`void`

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:160](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L160)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Stop and destroy the current service

#### Returns

`Promise`<`void`\>

#### Overrides

[Service](purista_httpserver.internal.Service.md).[destroy](purista_httpserver.internal.Service.md#destroy)

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:242](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L242)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[emit](purista_httpserver.internal.Service.md#emit)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:13

___

### executeCommand

▸ **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_httpserver.internal.md#command-1)\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[executeCommand](purista_httpserver.internal.Service.md#executecommand)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:57

___

### executeSubscription

▸ **executeSubscription**(`message`, `subscriptionName`): `Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_httpserver.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\> |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_httpserver.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[executeSubscription](purista_httpserver.internal.Service.md#executesubscription)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:73

___

### getContextFunctions

▸ **getContextFunctions**(`logger`): [`ContextBase`](../modules/purista_httpserver.internal.md#contextbase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](purista_httpserver.internal.Logger.md) |

#### Returns

[`ContextBase`](../modules/purista_httpserver.internal.md#contextbase)

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getContextFunctions](purista_httpserver.internal.Service.md#getcontextfunctions)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:50

___

### getEmitFunction

▸ `Protected` **getEmitFunction**(`serviceTarget`, `traceId`, `principalId`): <Payload\>(`eventName`: `string`, `eventPayload?`: `Payload`, `contentType?`: `string`, `contentEncoding?`: `string`) => `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId` | `undefined` \| `string` |

#### Returns

`fn`

▸ <`Payload`\>(`eventName`, `eventPayload?`, `contentType?`, `contentEncoding?`): `Promise`<`void`\>

##### Type parameters

| Name |
| :------ |
| `Payload` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `eventPayload?` | `Payload` |
| `contentType?` | `string` |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getEmitFunction](purista_httpserver.internal.Service.md#getemitfunction)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:49

___

### getInvokeFunction

▸ `Protected` **getInvokeFunction**(`serviceTarget`, `traceId`, `principalId?`): (`receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress), `eventPayload`: `unknown`, `parameter`: `unknown`, `contentType?`: `string`, `contentEncoding?`: `string`) => `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId?` | `string` |

#### Returns

`fn`

▸ (`receiver`, `eventPayload`, `parameter`, `contentType?`, `contentEncoding?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) |
| `eventPayload` | `unknown` |
| `parameter` | `unknown` |
| `contentType?` | `string` |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`any`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getInvokeFunction](purista_httpserver.internal.Service.md#getinvokefunction)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:48

___

### getTracer

▸ **getTracer**(`name?`, `version?`): `Tracer`

Returns open telemetry tracer of this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |
| `version?` | `string` |

#### Returns

`Tracer`

Tracer

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[getTracer](purista_httpserver.internal.Service.md#gettracer)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:44

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandDefinitionList`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinitionList` | [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[initializeEventbridgeConnect](purista_httpserver.internal.Service.md#initializeeventbridgeconnect)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:41

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
| `input` | `Omit`<[`Command`](../modules/purista_httpserver.internal.md#command-1), ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"`` \| ``"sender"``\> |
| `endpoint` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:228](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L228)

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

packages/core/lib/core/types/GenericEventEmitter.d.ts:12

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

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Registers a new command for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition) | the service command definition |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[registerCommand](purista_httpserver.internal.Service.md#registercommand)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:72

___

### registerSubscription

▸ **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

Registers a new subscription for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition) | the subscription definition |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[registerSubscription](purista_httpserver.internal.Service.md#registersubscription)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:74

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[Service](purista_httpserver.internal.Service.md).[removeAllListeners](purista_httpserver.internal.Service.md#removealllisteners)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14

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

packages/core/lib/core/Service/Service.impl.d.ts:47

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Overrides

[Service](purista_httpserver.internal.Service.md).[start](purista_httpserver.internal.Service.md#start)

#### Defined in

[packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts:164](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/httpserver/src/service/httpServer/v1/HttpServerClass.impl.ts#L164)

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

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:53

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

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:69
