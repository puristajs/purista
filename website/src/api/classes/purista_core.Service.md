[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / Service

# Class: Service<ConfigType\>

[@purista/core](../modules/purista_core.md).Service

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

- [`ServiceClass`](purista_core.ServiceClass.md)<`ConfigType`\>

  ↳ **`Service`**

## Implements

- [`IServiceClass`](../interfaces/purista_core.IServiceClass.md)

## Table of contents

### Constructors

- [constructor](purista_core.Service.md#constructor)

### Properties

- [commands](purista_core.Service.md#commands)
- [config](purista_core.Service.md#config)
- [eventBridge](purista_core.Service.md#eventbridge)
- [info](purista_core.Service.md#info)
- [serviceLogger](purista_core.Service.md#servicelogger)
- [subscriptions](purista_core.Service.md#subscriptions)

### Accessors

- [serviceInfo](purista_core.Service.md#serviceinfo)

### Methods

- [destroy](purista_core.Service.md#destroy)
- [emit](purista_core.Service.md#emit)
- [executeCommand](purista_core.Service.md#executecommand)
- [executeSubscription](purista_core.Service.md#executesubscription)
- [getEmitFunction](purista_core.Service.md#getemitfunction)
- [getInvokeFunction](purista_core.Service.md#getinvokefunction)
- [initializeEventbridgeConnect](purista_core.Service.md#initializeeventbridgeconnect)
- [off](purista_core.Service.md#off)
- [on](purista_core.Service.md#on)
- [registerCommand](purista_core.Service.md#registercommand)
- [registerSubscription](purista_core.Service.md#registersubscription)
- [sendServiceInfo](purista_core.Service.md#sendserviceinfo)
- [start](purista_core.Service.md#start)

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
| `baseLogger` | [`Logger`](purista_core.Logger.md) |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](purista_core.EventBridge.md) |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\> |
| `subscriptionList` | [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`any`\> |
| `config` | `ConfigType` |

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[constructor](purista_core.ServiceClass.md#constructor)

#### Defined in

[core/src/core/Service/Service.impl.ts:61](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L61)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:59](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L59)

___

### config

• **config**: `ConfigType`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[config](purista_core.ServiceClass.md#config)

#### Defined in

[core/src/core/Service/Service.impl.ts:67](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L67)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](purista_core.EventBridge.md)

The event bridge instance

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[eventBridge](purista_core.ServiceClass.md#eventbridge)

#### Defined in

[core/src/core/Service/Service.impl.ts:57](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L57)

___

### info

• `Protected` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[info](purista_core.ServiceClass.md#info)

#### Defined in

[core/src/core/Service/Service.impl.ts:55](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L55)

___

### serviceLogger

• `Protected` **serviceLogger**: [`Logger`](purista_core.Logger.md)

#### Defined in

[core/src/core/Service/Service.impl.ts:56](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L56)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:58](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L58)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Implementation of

IServiceClass.serviceInfo

#### Defined in

[core/src/core/Service/Service.impl.ts:110](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L110)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Implementation of

[IServiceClass](../interfaces/purista_core.IServiceClass.md).[destroy](../interfaces/purista_core.IServiceClass.md#destroy)

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[destroy](purista_core.ServiceClass.md#destroy)

#### Defined in

[core/src/core/Service/Service.impl.ts:442](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L442)

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

[ServiceClass](purista_core.ServiceClass.md).[emit](purista_core.ServiceClass.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### executeCommand

▸ `Protected` **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>, ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\>\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandSuccessResponse`](../modules/purista_core.md#commandsuccessresponse)<`unknown`\>, ``"instanceId"``\>\> \| `Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:206](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L206)

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

#### Defined in

[core/src/core/Service/Service.impl.ts:347](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L347)

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

[core/src/core/Service/Service.impl.ts:177](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L177)

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

#### Defined in

[core/src/core/Service/Service.impl.ts:147](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L147)

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:117](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L117)

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
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[off](purista_core.ServiceClass.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[on](purista_core.ServiceClass.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[registerCommand](purista_core.ServiceClass.md#registercommand)

#### Defined in

[core/src/core/Service/Service.impl.ts:326](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L326)

___

### registerSubscription

▸ `Protected` **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:416](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L416)

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

#### Implementation of

[IServiceClass](../interfaces/purista_core.IServiceClass.md).[sendServiceInfo](../interfaces/purista_core.IServiceClass.md#sendserviceinfo)

#### Defined in

[core/src/core/Service/Service.impl.ts:141](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L141)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Implementation of

[IServiceClass](../interfaces/purista_core.IServiceClass.md).[start](../interfaces/purista_core.IServiceClass.md#start)

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[start](purista_core.ServiceClass.md#start)

#### Defined in

[core/src/core/Service/Service.impl.ts:95](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/core/Service/Service.impl.ts#L95)
