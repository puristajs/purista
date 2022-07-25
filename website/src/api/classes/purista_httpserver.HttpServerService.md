[PURISTA API - v1.3.1](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / HttpServerService

# Class: HttpServerService

[@purista/httpserver](../modules/purista_httpserver.md).HttpServerService

## Hierarchy

- [`Service`](purista_core.Service.md)

  ↳ **`HttpServerService`**

## Table of contents

### Constructors

- [constructor](purista_httpserver.HttpServerService.md#constructor)

### Properties

- [commands](purista_httpserver.HttpServerService.md#commands)
- [config](purista_httpserver.HttpServerService.md#config)
- [eventBridge](purista_httpserver.HttpServerService.md#eventbridge)
- [info](purista_httpserver.HttpServerService.md#info)
- [routeDefinitions](purista_httpserver.HttpServerService.md#routedefinitions)
- [server](purista_httpserver.HttpServerService.md#server)
- [serviceLogger](purista_httpserver.HttpServerService.md#servicelogger)
- [subscriptions](purista_httpserver.HttpServerService.md#subscriptions)

### Accessors

- [serviceInfo](purista_httpserver.HttpServerService.md#serviceinfo)

### Methods

- [destroy](purista_httpserver.HttpServerService.md#destroy)
- [emit](purista_httpserver.HttpServerService.md#emit)
- [executeCommand](purista_httpserver.HttpServerService.md#executecommand)
- [executeSubscription](purista_httpserver.HttpServerService.md#executesubscription)
- [getEmitFunction](purista_httpserver.HttpServerService.md#getemitfunction)
- [getInvokeFunction](purista_httpserver.HttpServerService.md#getinvokefunction)
- [initializeEventbridgeConnect](purista_httpserver.HttpServerService.md#initializeeventbridgeconnect)
- [invoke](purista_httpserver.HttpServerService.md#invoke)
- [off](purista_httpserver.HttpServerService.md#off)
- [on](purista_httpserver.HttpServerService.md#on)
- [registerCommand](purista_httpserver.HttpServerService.md#registercommand)
- [registerSubscription](purista_httpserver.HttpServerService.md#registersubscription)
- [sendServiceInfo](purista_httpserver.HttpServerService.md#sendserviceinfo)
- [start](purista_httpserver.HttpServerService.md#start)

## Constructors

### constructor

• **new HttpServerService**(`baseLogger`, `eventBridge`, `config?`)

Create a new instance of the HttpServer class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseLogger` | [`Logger`](../modules/purista_core.md#logger) | The logger that the server will use. |
| `eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) | EventBridge |
| `config` | [`HttpServerConfig`](../modules/purista_httpserver.md#httpserverconfig) | - |

#### Overrides

[Service](purista_core.Service.md).[constructor](purista_core.Service.md#constructor)

#### Defined in

[httpserver/src/HttpServerService.impl.ts:40](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/httpserver/src/HttpServerService.impl.ts#L40)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md), `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>\>

#### Inherited from

[Service](purista_core.Service.md).[commands](purista_core.Service.md#commands)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:26

___

### config

• **config**: [`HttpServerConfig`](../modules/purista_httpserver.md#httpserverconfig)

#### Defined in

[httpserver/src/HttpServerService.impl.ts:30](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/httpserver/src/HttpServerService.impl.ts#L30)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

The event bridge instance

#### Inherited from

[Service](purista_core.Service.md).[eventBridge](purista_core.Service.md#eventbridge)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:24

___

### info

• `Protected` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Inherited from

[Service](purista_core.Service.md).[info](purista_core.Service.md#info)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:22

___

### routeDefinitions

• **routeDefinitions**: [`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta)[] = `[]`

#### Defined in

[httpserver/src/HttpServerService.impl.ts:32](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/httpserver/src/HttpServerService.impl.ts#L32)

___

### server

• `Optional` **server**: `FastifyInstance`<`Server`, `IncomingMessage`, `ServerResponse`, `FastifyLoggerInstance`, `FastifyTypeProviderDefault`\>

#### Defined in

[httpserver/src/HttpServerService.impl.ts:28](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/httpserver/src/HttpServerService.impl.ts#L28)

___

### serviceLogger

• `Protected` **serviceLogger**: [`Logger`](../modules/purista_core.md#logger)

#### Inherited from

[Service](purista_core.Service.md).[serviceLogger](purista_core.Service.md#servicelogger)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:23

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md), [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>\>

#### Inherited from

[Service](purista_core.Service.md).[subscriptions](purista_core.Service.md#subscriptions)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:25

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

Service.serviceInfo

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:35

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[destroy](purista_core.Service.md#destroy)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:58

___

### emit

▸ **emit**<`K`\>(`eventName`, `params`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `params` | [`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[Service](purista_core.Service.md).[emit](purista_core.Service.md#emit)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

___

### executeCommand

▸ `Protected` **executeCommand**(`message`): `Promise`<`void`\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[executeCommand](purista_core.Service.md#executecommand)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:54

___

### executeSubscription

▸ `Protected` **executeSubscription**(`message`, `subscriptionName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[executeSubscription](purista_core.Service.md#executesubscription)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:56

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

[Service](purista_core.Service.md).[getEmitFunction](purista_core.Service.md#getemitfunction)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:47

___

### getInvokeFunction

▸ `Protected` **getInvokeFunction**(`serviceTarget`, `traceId`, `principalId?`): (`receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress), `eventPayload`: `unknown`, `parameter`: `unknown`) => `Promise`<`any`\>

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
| `receiver` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `eventPayload` | `unknown` |
| `parameter` | `unknown` |

##### Returns

`Promise`<`any`\>

#### Inherited from

[Service](purista_core.Service.md).[getInvokeFunction](purista_core.Service.md#getinvokefunction)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:46

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md), [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>[] |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[initializeEventbridgeConnect](purista_core.Service.md#initializeeventbridgeconnect)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:39

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
| `input.receiver` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `input.traceId` | `string` |
| `endpoint` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[httpserver/src/HttpServerService.impl.ts:95](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/httpserver/src/HttpServerService.impl.ts#L95)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[Service](purista_core.Service.md).[off](purista_core.Service.md#off)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[Service](purista_core.Service.md).[on](purista_core.Service.md#on)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md), `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[registerCommand](purista_core.Service.md#registercommand)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:55

___

### registerSubscription

▸ `Protected` **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md), [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Service](purista_core.Service.md).[registerSubscription](purista_core.Service.md#registersubscription)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:57

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_core.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `payload?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Inherited from

[Service](purista_core.Service.md).[sendServiceInfo](purista_core.Service.md#sendserviceinfo)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:45

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Overrides

[Service](purista_core.Service.md).[start](purista_core.Service.md#start)

#### Defined in

[httpserver/src/HttpServerService.impl.ts:66](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/httpserver/src/HttpServerService.impl.ts#L66)
