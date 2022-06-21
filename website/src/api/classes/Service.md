[PURISTA API](../README.md) / Service

# Class: Service

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

- [`ServiceClass`](ServiceClass.md)

  ↳ **`Service`**

  ↳↳ [`HttpServerService`](HttpServerService.md)

## Table of contents

### Constructors

- [constructor](Service.md#constructor)

### Properties

- [commands](Service.md#commands)
- [eventBridge](Service.md#eventbridge)
- [info](Service.md#info)
- [mainSubscriptionId](Service.md#mainsubscriptionid)
- [pendingInvocations](Service.md#pendinginvocations)
- [serviceLogger](Service.md#servicelogger)
- [subscriptions](Service.md#subscriptions)

### Accessors

- [serviceInfo](Service.md#serviceinfo)

### Methods

- [defaultMessageHandler](Service.md#defaultmessagehandler)
- [destroy](Service.md#destroy)
- [executeCommand](Service.md#executecommand)
- [handleSubscriptionMessage](Service.md#handlesubscriptionmessage)
- [initializeEventbridgeConnect](Service.md#initializeeventbridgeconnect)
- [invoke](Service.md#invoke)
- [registerCommand](Service.md#registercommand)
- [sendServiceInfo](Service.md#sendserviceinfo)
- [start](Service.md#start)
- [subscribe](Service.md#subscribe)

## Constructors

### constructor

• **new Service**(`baseLogger`, `info`, `eventBridge`, `commandFunctions`, `subscriptionList`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](../README.md#logger) |
| `info` | [`ServiceInfoType`](../README.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](../interfaces/EventBridge.md) |
| `commandFunctions` | [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>[] |
| `subscriptionList` | [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<[`EBMessage`](../README.md#ebmessage)\>[] |

#### Overrides

[ServiceClass](ServiceClass.md).[constructor](ServiceClass.md#constructor)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:73

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\>\>

#### Defined in

packages/core/src/core/Service/Service.impl.ts:69

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

The event bridge instance

#### Overrides

[ServiceClass](ServiceClass.md).[eventBridge](ServiceClass.md#eventbridge)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:63

___

### info

• **info**: [`ServiceInfoType`](../README.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Overrides

[ServiceClass](ServiceClass.md).[info](ServiceClass.md#info)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:60

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Defined in

packages/core/src/core/Service/Service.impl.ts:71

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Defined in

packages/core/src/core/Service/Service.impl.ts:65

___

### serviceLogger

• `Protected` **serviceLogger**: [`Logger`](../README.md#logger)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:61

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<[`EBMessage`](../README.md#ebmessage)\>\>

#### Defined in

packages/core/src/core/Service/Service.impl.ts:67

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../README.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../README.md#serviceinfotype)

#### Inherited from

ServiceClass.serviceInfo

#### Defined in

packages/core/src/core/types/ServiceClass.ts:32

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
| `message` | [`EBMessage`](../README.md#ebmessage) | event bridge message |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/Service/Service.impl.ts:164

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](ServiceClass.md).[destroy](ServiceClass.md#destroy)

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

#### Overrides

[ServiceClass](ServiceClass.md).[invoke](ServiceClass.md#invoke)

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

#### Overrides

[ServiceClass](ServiceClass.md).[registerCommand](ServiceClass.md#registercommand)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:376

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

#### Defined in

packages/core/src/core/Service/Service.impl.ts:148

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/Service/Service.impl.ts:95

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

#### Overrides

[ServiceClass](ServiceClass.md).[subscribe](ServiceClass.md#subscribe)

#### Defined in

packages/core/src/core/Service/Service.impl.ts:258
