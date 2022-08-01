[PURISTA API - v1.4.3](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / Service

# Class: Service<ConfigType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).Service

Base class for all services.
This class provides base functions to work with the event bridge, logging and so on

Every service should extend this class and should not directly access the eventbridge or other service

```typescript
class MyService extends Service {

  constructor(baseLogger: Logger, info: ServiceInfoType, eventBridge: EventBridge) {
    super( baseLogger, info, eventBridge )
    // ... initial service logic
  }
  // ... service methods, functions and logic
}
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

## Hierarchy

- [`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`ConfigType`\>

  ↳ **`Service`**

  ↳↳ [`HttpServerService`](purista_httpserver.HttpServerService.md)

## Implements

- [`IServiceClass`](../interfaces/purista_httpserver.internal.IServiceClass.md)

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.Service.md#constructor)

### Properties

- [commandFunctions](purista_httpserver.internal.Service.md#commandfunctions)
- [commands](purista_httpserver.internal.Service.md#commands)
- [config](purista_httpserver.internal.Service.md#config)
- [eventBridge](purista_httpserver.internal.Service.md#eventbridge)
- [info](purista_httpserver.internal.Service.md#info)
- [serviceLogger](purista_httpserver.internal.Service.md#servicelogger)
- [subscriptionList](purista_httpserver.internal.Service.md#subscriptionlist)
- [subscriptions](purista_httpserver.internal.Service.md#subscriptions)

### Accessors

- [serviceInfo](purista_httpserver.internal.Service.md#serviceinfo)

### Methods

- [destroy](purista_httpserver.internal.Service.md#destroy)
- [emit](purista_httpserver.internal.Service.md#emit)
- [executeCommand](purista_httpserver.internal.Service.md#executecommand)
- [executeSubscription](purista_httpserver.internal.Service.md#executesubscription)
- [getEmitFunction](purista_httpserver.internal.Service.md#getemitfunction)
- [getInvokeFunction](purista_httpserver.internal.Service.md#getinvokefunction)
- [initializeEventbridgeConnect](purista_httpserver.internal.Service.md#initializeeventbridgeconnect)
- [off](purista_httpserver.internal.Service.md#off)
- [on](purista_httpserver.internal.Service.md#on)
- [registerCommand](purista_httpserver.internal.Service.md#registercommand)
- [registerSubscription](purista_httpserver.internal.Service.md#registersubscription)
- [sendServiceInfo](purista_httpserver.internal.Service.md#sendserviceinfo)
- [start](purista_httpserver.internal.Service.md#start)

## Constructors

### constructor

• **new Service**<`ConfigType`\>(`baseLogger`, `info`, `eventBridge`, `commandFunctions`, `subscriptionList`, `config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_httpserver.internal.Logger.md) |
| `info` | [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](purista_httpserver.internal.EventBridge.md) |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`any`\> |
| `subscriptionList` | [`SubscriptionDefinitionList`](../modules/purista_httpserver.internal.md#subscriptiondefinitionlist)<`any`\> |
| `config` | `ConfigType` |

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[constructor](purista_httpserver.internal.ServiceClass.md#constructor)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:28

## Properties

### commandFunctions

• `Private` **commandFunctions**: `any`

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:20

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>\>

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:27

___

### config

• **config**: `ConfigType`

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[config](purista_httpserver.internal.ServiceClass.md#config)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:22

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](purista_httpserver.internal.EventBridge.md)

The event bridge instance

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[eventBridge](purista_httpserver.internal.ServiceClass.md#eventbridge)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:25

___

### info

• `Protected` **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[info](purista_httpserver.internal.ServiceClass.md#info)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:23

___

### serviceLogger

• `Protected` **serviceLogger**: [`Logger`](purista_httpserver.internal.Logger.md)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:24

___

### subscriptionList

• `Private` **subscriptionList**: `any`

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:21

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage), `unknown`\>\>

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:26

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Implementation of

IServiceClass.serviceInfo

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:36

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Implementation of

[IServiceClass](../interfaces/purista_httpserver.internal.IServiceClass.md).[destroy](../interfaces/purista_httpserver.internal.IServiceClass.md#destroy)

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[destroy](purista_httpserver.internal.ServiceClass.md#destroy)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:59

___

### emit

▸ **emit**<`K`\>(`eventName`, `params`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `params` | [`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[emit](purista_httpserver.internal.ServiceClass.md#emit)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

___

### executeCommand

▸ `Protected` **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse-1)<`unknown`\>, ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\>\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_httpserver.internal.md#command-1)<`unknown`, `unknown`\>\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse-1)<`unknown`\>, ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\>\>

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:55

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

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:57

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

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:48

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

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:47

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

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:40

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

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[off](purista_httpserver.internal.ServiceClass.md#off)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:12

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

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[on](purista_httpserver.internal.ServiceClass.md#on)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11

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

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[registerCommand](purista_httpserver.internal.ServiceClass.md#registercommand)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:56

___

### registerSubscription

▸ `Protected` **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage), `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:58

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

#### Implementation of

[IServiceClass](../interfaces/purista_httpserver.internal.IServiceClass.md).[sendServiceInfo](../interfaces/purista_httpserver.internal.IServiceClass.md#sendserviceinfo)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:46

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Implementation of

[IServiceClass](../interfaces/purista_httpserver.internal.IServiceClass.md).[start](../interfaces/purista_httpserver.internal.IServiceClass.md#start)

#### Overrides

[ServiceClass](purista_httpserver.internal.ServiceClass.md).[start](purista_httpserver.internal.ServiceClass.md#start)

#### Defined in

core/lib/types/core/Service/Service.impl.d.ts:32
