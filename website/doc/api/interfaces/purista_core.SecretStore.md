[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SecretStore

# Interface: SecretStore

[@purista/core](../modules/purista_core.md).SecretStore

Interface definition for a secret store implementation

## Implemented by

- [`DefaultSecretStore`](../classes/purista_core.DefaultSecretStore.md)

## Table of contents

### Properties

- [getSecret](purista_core.SecretStore.md#getsecret)
- [name](purista_core.SecretStore.md#name)
- [removeSecret](purista_core.SecretStore.md#removesecret)
- [setSecret](purista_core.SecretStore.md#setsecret)

### Methods

- [destroy](purista_core.SecretStore.md#destroy)

## Properties

### getSecret

• **getSecret**: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction)

get a secret

**`Param`**

name of secret

**`Throws`**

UnhandledError

#### Defined in

[core/SecretStore/types/SecretStore.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L18)

___

### name

• **name**: `string`

name of store

#### Defined in

[core/SecretStore/types/SecretStore.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L11)

___

### removeSecret

• **removeSecret**: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction)

delete a secret

**`Param`**

name of secret

**`Throws`**

UnhandledError

#### Defined in

[core/SecretStore/types/SecretStore.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L25)

___

### setSecret

• **setSecret**: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)

set a secret

**`Param`**

name of secret

**`Param`**

value of secret

**`Throws`**

UnhandledError

#### Defined in

[core/SecretStore/types/SecretStore.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L33)

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/SecretStore/types/SecretStore.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L38)
