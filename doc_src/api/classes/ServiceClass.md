[@purista/core](../README.md) / [Exports](../modules.md) / ServiceClass

# Class: ServiceClass

Abstract base service class which should be extended by the base service class.
The base class should provide basic functions to use the event bridge.

Every service should extends the base class and only implement logic used in this service.

```typescript
class MyBaseService extends Service {

  constructor() {
    super()
  }
  ...
}
```

## Hierarchy

- **`ServiceClass`**

  ↳ [`Service`](Service.md)

## Table of contents

### Constructors

- [constructor](ServiceClass.md#constructor)

### Properties

- [eventBridge](ServiceClass.md#eventbridge)
- [info](ServiceClass.md#info)

### Accessors

- [serviceInfo](ServiceClass.md#serviceinfo)

### Methods

- [destroy](ServiceClass.md#destroy)
- [invoke](ServiceClass.md#invoke)
- [registerCommand](ServiceClass.md#registercommand)
- [subscribe](ServiceClass.md#subscribe)

## Constructors

### constructor

• **new ServiceClass**()

## Properties

### eventBridge

• `Protected` `Abstract` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

The event bridge instance

#### Defined in

[src/core/types/ServiceClass.ts:39](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L39)

___

### info

• `Protected` `Readonly` `Abstract` **info**: [`ServiceInfoType`](../modules.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Defined in

[src/core/types/ServiceClass.ts:27](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L27)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules.md#serviceinfotype)

#### Defined in

[src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L32)

## Methods

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Defined in

[src/core/types/ServiceClass.ts:71](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L71)

___

### invoke

▸ `Protected` `Abstract` **invoke**(`input`, `ttl`): `Promise`<[`CommandResponse`](../modules.md#commandresponse)<`unknown`\>\>

Invoke a service over event bridge and expect some result from called service
Used for service(-function) to service(-function) communication

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../modules.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"sender"`` \| ``"messageType"``\> |  |
| `ttl` | `number` | timeout in ms |

#### Returns

`Promise`<[`CommandResponse`](../modules.md#commandresponse)<`unknown`\>\>

Promise<CommandErrorResponse | CommandSuccessResponse>

#### Defined in

[src/core/types/ServiceClass.ts:48](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L48)

___

### registerCommand

▸ `Protected` `Abstract` **registerCommand**(`command`): `void`

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandDefinition`](../modules.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`CommandFunction`](../modules.md#commandfunction)<[`Service`](Service.md), `unknown`, `unknown`, `unknown`\>\> |

#### Returns

`void`

#### Defined in

[src/core/types/ServiceClass.ts:66](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L66)

___

### subscribe

▸ `Protected` `Abstract` **subscribe**(`subscription`): `Promise`<`string`\>

Send subscription request to event bridge
Creates a new subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`SubscriptionDefinition`](../modules.md#subscriptiondefinition)<[`EBMessage`](../modules.md#ebmessage)\> |

#### Returns

`Promise`<`string`\>

Promise<SubscriptionId>

#### Defined in

[src/core/types/ServiceClass.ts:59](https://github.com/sebastianwessel/purista/blob/59536dd/src/core/types/ServiceClass.ts#L59)
