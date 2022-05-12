[@purista/core](../README.md) / [Exports](../modules.md) / Service

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
- [log](Service.md#log)
- [mainSubscriptionId](Service.md#mainsubscriptionid)
- [pendingInvocations](Service.md#pendinginvocations)
- [subscriptions](Service.md#subscriptions)
- [ttlInterval](Service.md#ttlinterval)

### Accessors

- [serviceInfo](Service.md#serviceinfo)

### Methods

- [connectToEventBridge](Service.md#connecttoeventbridge)
- [defaultMessageHandler](Service.md#defaultmessagehandler)
- [destroy](Service.md#destroy)
- [executeCommand](Service.md#executecommand)
- [handleSubscriptionMessage](Service.md#handlesubscriptionmessage)
- [invoke](Service.md#invoke)
- [registerCommand](Service.md#registercommand)
- [rejectExpiredInvocations](Service.md#rejectexpiredinvocations)
- [sendServiceInfo](Service.md#sendserviceinfo)
- [start](Service.md#start)
- [subscribe](Service.md#subscribe)

## Constructors

### constructor

• **new Service**(`baseLogger`, `info`, `eventBridge`, `commandFunctions`, `subscriptionList`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](../modules.md#logger) |
| `info` | [`ServiceInfoType`](../modules.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](../interfaces/EventBridge.md) |
| `commandFunctions` | [`CommandDefinition`](../modules.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules.md#commandfunction)<[`Service`](Service.md), `unknown`, `unknown`, `unknown`\>\>[] |
| `subscriptionList` | [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<[`EBMessage`](../modules.md#ebmessage)\>[] |

#### Overrides

[ServiceClass](ServiceClass.md).[constructor](ServiceClass.md#constructor)

#### Defined in

[src/core/Service/Service.impl.ts:75](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L75)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules.md#commandfunction)<[`Service`](Service.md), `unknown`, `unknown`, `unknown`\>\>\>

#### Defined in

[src/core/Service/Service.impl.ts:71](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L71)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

The event bridge instance

#### Overrides

[ServiceClass](ServiceClass.md).[eventBridge](ServiceClass.md#eventbridge)

#### Defined in

[src/core/Service/Service.impl.ts:63](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L63)

___

### info

• **info**: [`ServiceInfoType`](../modules.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Overrides

[ServiceClass](ServiceClass.md).[info](ServiceClass.md#info)

#### Defined in

[src/core/Service/Service.impl.ts:60](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L60)

___

### log

• **log**: [`Logger`](../modules.md#logger)

#### Defined in

[src/core/Service/Service.impl.ts:61](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L61)

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Defined in

[src/core/Service/Service.impl.ts:73](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L73)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Defined in

[src/core/Service/Service.impl.ts:65](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L65)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<[`EBMessage`](../modules.md#ebmessage)\>\>

#### Defined in

[src/core/Service/Service.impl.ts:69](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L69)

___

### ttlInterval

• `Protected` **ttlInterval**: `Timer`

#### Defined in

[src/core/Service/Service.impl.ts:67](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L67)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules.md#serviceinfotype)

#### Inherited from

ServiceClass.serviceInfo

#### Defined in

[src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/774b686/src/core/types/ServiceClass.ts#L32)

## Methods

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

#### Defined in

[src/core/Service/Service.impl.ts:102](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L102)

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

#### Defined in

[src/core/Service/Service.impl.ts:155](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L155)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](ServiceClass.md).[destroy](ServiceClass.md#destroy)

#### Defined in

[src/core/Service/Service.impl.ts:310](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L310)

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

#### Defined in

[src/core/Service/Service.impl.ts:237](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L237)

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

#### Defined in

[src/core/Service/Service.impl.ts:263](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L263)

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

#### Overrides

[ServiceClass](ServiceClass.md).[invoke](ServiceClass.md#invoke)

#### Defined in

[src/core/Service/Service.impl.ts:185](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L185)

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

#### Overrides

[ServiceClass](ServiceClass.md).[registerCommand](ServiceClass.md#registercommand)

#### Defined in

[src/core/Service/Service.impl.ts:297](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L297)

___

### rejectExpiredInvocations

▸ `Protected` **rejectExpiredInvocations**(): `void`

Function which runs in internval to reject all invocations which are timed out

#### Returns

`void`

#### Defined in

[src/core/Service/Service.impl.ts:283](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L283)

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

#### Defined in

[src/core/Service/Service.impl.ts:139](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L139)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Defined in

[src/core/Service/Service.impl.ts:95](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L95)

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

#### Overrides

[ServiceClass](ServiceClass.md).[subscribe](ServiceClass.md#subscribe)

#### Defined in

[src/core/Service/Service.impl.ts:214](https://github.com/sebastianwessel/purista/blob/774b686/src/core/Service/Service.impl.ts#L214)
