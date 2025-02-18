[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ConfigStore

# Interface: ConfigStore

Defined in: [packages/core/src/core/ConfigStore/types/ConfigStore.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L10)

Interface definition for config store adapters

## Properties

### getConfig

> **getConfig**: [`ConfigGetterFunction`](../type-aliases/ConfigGetterFunction.md)

Defined in: [packages/core/src/core/ConfigStore/types/ConfigStore.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L19)

get a config value

#### Param

name of config

#### Returns

the config

#### Throws

UnhandledError

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/ConfigStore/types/ConfigStore.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L12)

name of store

***

### removeConfig

> **removeConfig**: [`ConfigDeleteFunction`](../type-aliases/ConfigDeleteFunction.md)

Defined in: [packages/core/src/core/ConfigStore/types/ConfigStore.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L34)

delete a config value

#### Param

name of config

#### Throws

UnhandledError

***

### setConfig

> **setConfig**: [`ConfigSetterFunction`](../type-aliases/ConfigSetterFunction.md)

Defined in: [packages/core/src/core/ConfigStore/types/ConfigStore.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L27)

set a config value

#### Param

name of config

#### Param

value of config

#### Throws

UnhandledError

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/ConfigStore/types/ConfigStore.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/ConfigStore/types/ConfigStore.ts#L39)

disconnects and shuts down the config store

#### Returns

`Promise`\<`void`\>
