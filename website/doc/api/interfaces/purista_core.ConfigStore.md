[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ConfigStore

# Interface: ConfigStore

[@purista/core](../modules/purista_core.md).ConfigStore

Interface definition for config store adapters

## Implemented by

- [`DefaultConfigStore`](../classes/purista_core.DefaultConfigStore.md)

## Table of contents

### Properties

- [getConfig](purista_core.ConfigStore.md#getconfig)
- [name](purista_core.ConfigStore.md#name)
- [removeConfig](purista_core.ConfigStore.md#removeconfig)
- [setConfig](purista_core.ConfigStore.md#setconfig)

### Methods

- [destroy](purista_core.ConfigStore.md#destroy)

## Properties

### getConfig

• **getConfig**: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction)

get a config value

**`Param`**

name of config

**`Throws`**

UnhandledError

#### Defined in

[core/ConfigStore/types/ConfigStore.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L19)

___

### name

• **name**: `string`

name of store

#### Defined in

[core/ConfigStore/types/ConfigStore.ts:12](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L12)

___

### removeConfig

• **removeConfig**: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction)

delete a config value

**`Param`**

name of config

**`Throws`**

UnhandledError

#### Defined in

[core/ConfigStore/types/ConfigStore.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L34)

___

### setConfig

• **setConfig**: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)

set a config value

**`Param`**

name of config

**`Param`**

value of config

**`Throws`**

UnhandledError

#### Defined in

[core/ConfigStore/types/ConfigStore.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L27)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/ConfigStore/types/ConfigStore.ts:39](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L39)
