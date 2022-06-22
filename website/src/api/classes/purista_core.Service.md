[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / Service

# Class: Service

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

## Hierarchy

- [`ServiceClass`](purista_core.ServiceClass.md)

  ↳ **`Service`**

  ↳↳ [`HttpServerService`](purista_core.HttpServerService.md)

## Table of contents

### Constructors

- [constructor](purista_core.Service.md#constructor)

### Properties

- [commands](purista_core.Service.md#commands)
- [eventBridge](purista_core.Service.md#eventbridge)
- [info](purista_core.Service.md#info)
- [mainSubscriptionId](purista_core.Service.md#mainsubscriptionid)
- [pendingInvocations](purista_core.Service.md#pendinginvocations)
- [serviceLogger](purista_core.Service.md#servicelogger)
- [subscriptions](purista_core.Service.md#subscriptions)

### Accessors

- [serviceInfo](purista_core.Service.md#serviceinfo)

### Methods

- [defaultMessageHandler](purista_core.Service.md#defaultmessagehandler)
- [destroy](purista_core.Service.md#destroy)
- [executeCommand](purista_core.Service.md#executecommand)
- [handleSubscriptionMessage](purista_core.Service.md#handlesubscriptionmessage)
- [initializeEventbridgeConnect](purista_core.Service.md#initializeeventbridgeconnect)
- [invoke](purista_core.Service.md#invoke)
- [registerCommand](purista_core.Service.md#registercommand)
- [sendServiceInfo](purista_core.Service.md#sendserviceinfo)
- [start](purista_core.Service.md#start)
- [subscribe](purista_core.Service.md#subscribe)

## Constructors

### constructor

• **new Service**(`baseLogger`, `info`, `eventBridge`, `commandFunctions`, `subscriptionList`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](../modules/purista_core.md#logger) |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) |
| `commandFunctions` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](purista_core.Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>[] |
| `subscriptionList` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>[] |

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[constructor](purista_core.ServiceClass.md#constructor)

#### Defined in

[core/src/core/Service/Service.impl.ts:73](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L73)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](purista_core.Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:69](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L69)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

The event bridge instance

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[eventBridge](purista_core.ServiceClass.md#eventbridge)

#### Defined in

[core/src/core/Service/Service.impl.ts:63](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L63)

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[info](purista_core.ServiceClass.md#info)

#### Defined in

[core/src/core/Service/Service.impl.ts:60](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L60)

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Defined in

[core/src/core/Service/Service.impl.ts:71](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L71)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, [`PendigInvocation`](../modules/purista_core.internal.md#pendiginvocation)\>

#### Defined in

[core/src/core/Service/Service.impl.ts:65](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L65)

___

### serviceLogger

• `Protected` **serviceLogger**: [`Logger`](../modules/purista_core.md#logger)

#### Defined in

[core/src/core/Service/Service.impl.ts:61](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L61)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:67](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L67)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

ServiceClass.serviceInfo

#### Defined in

[core/src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L32)

## Methods

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

#### Defined in

[core/src/core/Service/Service.impl.ts:164](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L164)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[destroy](purista_core.ServiceClass.md#destroy)

#### Defined in

[core/src/core/Service/Service.impl.ts:389](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L389)

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

#### Defined in

[core/src/core/Service/Service.impl.ts:281](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L281)

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

#### Defined in

[core/src/core/Service/Service.impl.ts:337](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L337)

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](purista_core.Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>[] |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:108](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L108)

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
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"messageType"`` \| ``"sender"`` \| ``"timestamp"`` \| ``"correlationId"``\> |
| `ttl` | `number` |
| `originalCommand?` | `Partial`<[`Command`](../modules/purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>\> |

#### Returns

`Promise`<`T`\>

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[invoke](purista_core.ServiceClass.md#invoke)

#### Defined in

[core/src/core/Service/Service.impl.ts:195](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L195)

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](purista_core.Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[registerCommand](purista_core.ServiceClass.md#registercommand)

#### Defined in

[core/src/core/Service/Service.impl.ts:376](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L376)

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

#### Defined in

[core/src/core/Service/Service.impl.ts:148](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L148)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:95](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L95)

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

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[subscribe](purista_core.ServiceClass.md#subscribe)

#### Defined in

[core/src/core/Service/Service.impl.ts:258](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L258)
