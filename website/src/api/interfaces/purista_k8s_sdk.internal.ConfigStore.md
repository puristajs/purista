[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / ConfigStore

# Interface: ConfigStore

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).ConfigStore

Interface definition for config store adapters

## Table of contents

### Properties

- [getConfig](purista_k8s_sdk.internal.ConfigStore.md#getconfig)
- [name](purista_k8s_sdk.internal.ConfigStore.md#name)
- [removeConfig](purista_k8s_sdk.internal.ConfigStore.md#removeconfig)
- [setConfig](purista_k8s_sdk.internal.ConfigStore.md#setconfig)

### Methods

- [destroy](purista_k8s_sdk.internal.ConfigStore.md#destroy)

## Properties

### getConfig

• **getConfig**: [`ConfigGetterFunction`](../modules/purista_k8s_sdk.internal.md#configgetterfunction)

get a config value

**`Param`**

name of config

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:18

___

### name

• **name**: `string`

name of store

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:11

___

### removeConfig

• **removeConfig**: [`ConfigDeleteFunction`](../modules/purista_k8s_sdk.internal.md#configdeletefunction)

delete a config value

**`Param`**

name of config

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:31

___

### setConfig

• **setConfig**: [`ConfigSetterFunction`](../modules/purista_k8s_sdk.internal.md#configsetterfunction)

set a config value

**`Param`**

name of config

**`Param`**

value of config

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:25

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:35
