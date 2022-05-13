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
- [log](purista_core.Service.md#log)
- [mainSubscriptionId](purista_core.Service.md#mainsubscriptionid)
- [pendingInvocations](purista_core.Service.md#pendinginvocations)
- [subscriptions](purista_core.Service.md#subscriptions)
- [ttlInterval](purista_core.Service.md#ttlinterval)

### Accessors

- [serviceInfo](purista_core.Service.md#serviceinfo)

### Methods

- [connectToEventBridge](purista_core.Service.md#connecttoeventbridge)
- [defaultMessageHandler](purista_core.Service.md#defaultmessagehandler)
- [destroy](purista_core.Service.md#destroy)
- [executeCommand](purista_core.Service.md#executecommand)
- [handleSubscriptionMessage](purista_core.Service.md#handlesubscriptionmessage)
- [invoke](purista_core.Service.md#invoke)
- [registerCommand](purista_core.Service.md#registercommand)
- [rejectExpiredInvocations](purista_core.Service.md#rejectexpiredinvocations)
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
| `commandFunctions` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules/purista_core.md#commandfunction)<[`Service`](purista_core.Service.md), `unknown`, `unknown`, `unknown`\>\>[] |
| `subscriptionList` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>[] |

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[constructor](purista_core.ServiceClass.md#constructor)

#### Defined in

[core/src/core/Service/Service.impl.ts:76](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L76)

## Properties

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules/purista_core.md#commandfunction)<[`Service`](purista_core.Service.md), `unknown`, `unknown`, `unknown`\>\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:72](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L72)

___

### eventBridge

• `Protected` **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

The event bridge instance

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[eventBridge](purista_core.ServiceClass.md#eventbridge)

#### Defined in

[core/src/core/Service/Service.impl.ts:64](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L64)

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[info](purista_core.ServiceClass.md#info)

#### Defined in

[core/src/core/Service/Service.impl.ts:61](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L61)

___

### log

• **log**: [`Logger`](../modules/purista_core.md#logger)

#### Defined in

[core/src/core/Service/Service.impl.ts:62](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L62)

___

### mainSubscriptionId

• `Protected` **mainSubscriptionId**: `undefined` \| `string`

#### Defined in

[core/src/core/Service/Service.impl.ts:74](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L74)

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, `PendigInvocation`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:66](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L66)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:70](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L70)

___

### ttlInterval

• `Protected` **ttlInterval**: `Timer`

#### Defined in

[core/src/core/Service/Service.impl.ts:68](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L68)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

ServiceClass.serviceInfo

#### Defined in

[core/src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/types/ServiceClass.ts#L32)

## Methods

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

#### Defined in

[core/src/core/Service/Service.impl.ts:156](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L156)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[destroy](purista_core.ServiceClass.md#destroy)

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

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[invoke](purista_core.ServiceClass.md#invoke)

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

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[registerCommand](purista_core.ServiceClass.md#registercommand)

#### Defined in

[core/src/core/Service/Service.impl.ts:298](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L298)

___

### rejectExpiredInvocations

▸ `Protected` **rejectExpiredInvocations**(): `void`

Function which runs in internval to reject all invocations which are timed out

#### Returns

`void`

#### Defined in

[core/src/core/Service/Service.impl.ts:284](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L284)

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

[core/src/core/Service/Service.impl.ts:140](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L140)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:96](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L96)

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

[core/src/core/Service/Service.impl.ts:215](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/core/Service/Service.impl.ts#L215)
