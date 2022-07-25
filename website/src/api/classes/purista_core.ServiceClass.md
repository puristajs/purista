[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / ServiceClass

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

- [`GenericEventEmitter`](purista_core.GenericEventEmitter.md)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\>

  ↳ **`ServiceClass`**

  ↳↳ [`Service`](purista_core.Service.md)

## Table of contents

### Constructors

- [constructor](purista_core.ServiceClass.md#constructor)

### Properties

- [eventBridge](purista_core.ServiceClass.md#eventbridge)
- [info](purista_core.ServiceClass.md#info)

### Methods

- [destroy](purista_core.ServiceClass.md#destroy)
- [emit](purista_core.ServiceClass.md#emit)
- [off](purista_core.ServiceClass.md#off)
- [on](purista_core.ServiceClass.md#on)
- [registerCommand](purista_core.ServiceClass.md#registercommand)
- [start](purista_core.ServiceClass.md#start)

## Constructors

### constructor

• **new ServiceClass**()

#### Inherited from

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[constructor](purista_core.GenericEventEmitter.md#constructor)

## Properties

### eventBridge

• `Protected` `Abstract` **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

The event bridge instance

#### Defined in

[core/src/core/types/ServiceClass.ts:33](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L33)

___

### info

• `Protected` `Readonly` `Abstract` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Defined in

[core/src/core/types/ServiceClass.ts:28](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L28)

## Methods

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:47](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L47)

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

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[emit](purista_core.GenericEventEmitter.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/GenericEventEmitter.ts#L24)

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

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[off](purista_core.GenericEventEmitter.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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

[GenericEventEmitter](purista_core.GenericEventEmitter.md).[on](purista_core.GenericEventEmitter.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerCommand

▸ `Protected` `Abstract` **registerCommand**(`command`): `void`

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md), `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\> |

#### Returns

`void`

#### Defined in

[core/src/core/types/ServiceClass.ts:42](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L42)

___

### start

▸ `Abstract` **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/types/ServiceClass.ts:35](https://github.com/sebastianwessel/purista/blob/78eb3f1/packages/core/src/core/types/ServiceClass.ts#L35)
