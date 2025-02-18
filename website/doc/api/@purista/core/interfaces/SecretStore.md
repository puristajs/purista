[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SecretStore

# Interface: SecretStore

Defined in: [packages/core/src/core/SecretStore/types/SecretStore.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L9)

Interface definition for a secret store implementation

## Properties

### getSecret

> **getSecret**: [`SecretGetterFunction`](../type-aliases/SecretGetterFunction.md)

Defined in: [packages/core/src/core/SecretStore/types/SecretStore.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L18)

get a secret

#### Param

name of secret

#### Returns

the secret

#### Throws

UnhandledError

***

### name

> **name**: `string`

Defined in: [packages/core/src/core/SecretStore/types/SecretStore.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L11)

name of store

***

### removeSecret

> **removeSecret**: [`SecretDeleteFunction`](../type-aliases/SecretDeleteFunction.md)

Defined in: [packages/core/src/core/SecretStore/types/SecretStore.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L25)

delete a secret

#### Param

name of secret

#### Throws

UnhandledError

***

### setSecret

> **setSecret**: [`SecretSetterFunction`](../type-aliases/SecretSetterFunction.md)

Defined in: [packages/core/src/core/SecretStore/types/SecretStore.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L33)

set a secret

#### Param

name of secret

#### Param

value of secret

#### Throws

UnhandledError

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/SecretStore/types/SecretStore.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretStore.ts#L38)

disconnects and shuts down the secret store

#### Returns

`Promise`\<`void`\>
