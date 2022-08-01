[PURISTA API - v1.4.3](../README.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / ServiceClass

# Class: ServiceClass<ConfigType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).ServiceClass

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

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

## Hierarchy

- [`GenericEventEmitter`](purista_httpserver.internal.GenericEventEmitter.md)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\>

  ↳ **`ServiceClass`**

  ↳↳ [`Service`](purista_httpserver.internal.Service.md)

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.ServiceClass.md#constructor)

### Properties

- [config](purista_httpserver.internal.ServiceClass.md#config)
- [eventBridge](purista_httpserver.internal.ServiceClass.md#eventbridge)
- [info](purista_httpserver.internal.ServiceClass.md#info)

### Methods

- [destroy](purista_httpserver.internal.ServiceClass.md#destroy)
- [emit](purista_httpserver.internal.ServiceClass.md#emit)
- [off](purista_httpserver.internal.ServiceClass.md#off)
- [on](purista_httpserver.internal.ServiceClass.md#on)
- [registerCommand](purista_httpserver.internal.ServiceClass.md#registercommand)
- [start](purista_httpserver.internal.ServiceClass.md#start)

## Constructors

### constructor

• **new ServiceClass**<`ConfigType`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` |

#### Inherited from

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[constructor](purista_httpserver.internal.GenericEventEmitter.md#constructor)

## Properties

### config

• `Abstract` **config**: `ConfigType`

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:29

___

### eventBridge

• `Protected` `Abstract` **eventBridge**: [`EventBridge`](purista_httpserver.internal.EventBridge.md)

The event bridge instance

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:33

___

### info

• `Protected` `Readonly` `Abstract` **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

General service info
Service name, service version and some human readable description

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:28

## Methods

### destroy

▸ `Abstract` **destroy**(): `Promise`<`void`\>

Shut down the service

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:44

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

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[emit](purista_httpserver.internal.GenericEventEmitter.md#emit)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

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

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[off](purista_httpserver.internal.GenericEventEmitter.md#off)

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

[GenericEventEmitter](purista_httpserver.internal.GenericEventEmitter.md).[on](purista_httpserver.internal.GenericEventEmitter.md#on)

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ `Protected` `Abstract` **registerCommand**(`command`): `void`

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)<[`ServiceClass`](purista_httpserver.internal.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\> |

#### Returns

`void`

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:40

___

### start

▸ `Abstract` **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

core/lib/types/core/types/ServiceClass.d.ts:34
