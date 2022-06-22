[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / ServiceClass

# Class: ServiceClass

[@purista/core](../modules/purista_core.md).ServiceClass

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

  ↳ [`Service`](purista_core.Service.md)

## Table of contents

### Constructors

- [constructor](purista_core.ServiceClass.md#constructor)

### Properties

- [eventBridge](purista_core.ServiceClass.md#eventbridge)
- [info](purista_core.ServiceClass.md#info)

### Accessors

- [serviceInfo](purista_core.ServiceClass.md#serviceinfo)

### Methods

- [destroy](purista_core.ServiceClass.md#destroy)
- [invoke](purista_core.ServiceClass.md#invoke)
- [registerCommand](purista_core.ServiceClass.md#registercommand)
- [subscribe](purista_core.ServiceClass.md#subscribe)

## Constructors

### constructor

• **new ServiceClass**()

## Properties

### eventBridge

• `Protected` `Abstract` **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

The event bridge instance

#### Defined in

[core/src/core/types/ServiceClass.ts:39](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L39)

___

### info

• `Protected` `Readonly` `Abstract` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Defined in

[core/src/core/types/ServiceClass.ts:27](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L27)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[core/src/core/types/ServiceClass.ts:32](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L32)

## Methods

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:71](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L71)

___

### invoke

▸ `Protected` `Abstract` **invoke**(`input`, `ttl`): `Promise`<[`CommandResponse`](../modules/purista_core.md#commandresponse)<`unknown`\>\>

Invoke a service over event bridge and expect some result from called service
Used for service(-function) to service(-function) communication

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_core.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"messageType"`` \| ``"sender"``\> |  |
| `ttl` | `number` | timeout in ms |

#### Returns

`Promise`<[`CommandResponse`](../modules/purista_core.md#commandresponse)<`unknown`\>\>

Promise<CommandErrorResponse | CommandSuccessResponse>

#### Defined in

[core/src/core/types/ServiceClass.ts:48](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L48)

___

### registerCommand

▸ `Protected` `Abstract` **registerCommand**(`command`): `void`

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](purista_core.Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\> |

#### Returns

`void`

#### Defined in

[core/src/core/types/ServiceClass.ts:66](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L66)

___

### subscribe

▸ `Protected` `Abstract` **subscribe**(`subscription`): `Promise`<`string`\>

Send subscription request to event bridge
Creates a new subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`EBMessage`](../modules/purista_core.md#ebmessage)\> |

#### Returns

`Promise`<`string`\>

Promise SubscriptionId

#### Defined in

[core/src/core/types/ServiceClass.ts:59](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L59)
