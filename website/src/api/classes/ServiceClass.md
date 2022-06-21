[PURISTA API](../README.md) / ServiceClass

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

packages/core/src/core/types/ServiceClass.ts:39

___

### info

• `Protected` `Readonly` `Abstract` **info**: [`ServiceInfoType`](../README.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Defined in

packages/core/src/core/types/ServiceClass.ts:27

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../README.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../README.md#serviceinfotype)

#### Defined in

packages/core/src/core/types/ServiceClass.ts:32

## Methods

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/src/core/types/ServiceClass.ts:71

___

### invoke

▸ `Protected` `Abstract` **invoke**(`input`, `ttl`): `Promise`<[`CommandResponse`](../README.md#commandresponse)<`unknown`\>\>

Invoke a service over event bridge and expect some result from called service
Used for service(-function) to service(-function) communication

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../README.md#command)<`unknown`, `Record`<`string`, `unknown`\>\>, ``"id"`` \| ``"messageType"`` \| ``"sender"``\> |  |
| `ttl` | `number` | timeout in ms |

#### Returns

`Promise`<[`CommandResponse`](../README.md#commandresponse)<`unknown`\>\>

Promise<CommandErrorResponse | CommandSuccessResponse>

#### Defined in

packages/core/src/core/types/ServiceClass.ts:48

___

### registerCommand

▸ `Protected` `Abstract` **registerCommand**(`command`): `void`

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, [`Service`](Service.md), `unknown`, `Record`<`string`, `unknown`\>, `unknown`\> |

#### Returns

`void`

#### Defined in

packages/core/src/core/types/ServiceClass.ts:66

___

### subscribe

▸ `Protected` `Abstract` **subscribe**(`subscription`): `Promise`<`string`\>

Send subscription request to event bridge
Creates a new subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | [`SubscriptionDefinition`](../README.md#subscriptiondefinition)<[`EBMessage`](../README.md#ebmessage)\> |

#### Returns

`Promise`<`string`\>

Promise SubscriptionId

#### Defined in

packages/core/src/core/types/ServiceClass.ts:59
