[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / SecretStore

# Interface: SecretStore

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).SecretStore

Interface definition for a secret store implementation

## Table of contents

### Properties

- [getSecret](purista_httpserver.internal.SecretStore.md#getsecret)
- [name](purista_httpserver.internal.SecretStore.md#name)
- [removeSecret](purista_httpserver.internal.SecretStore.md#removesecret)
- [setSecret](purista_httpserver.internal.SecretStore.md#setsecret)

### Methods

- [destroy](purista_httpserver.internal.SecretStore.md#destroy)

## Properties

### getSecret

• **getSecret**: [`SecretGetterFunction`](../modules/purista_httpserver.internal.md#secretgetterfunction)

get a secret

**`Param`**

name of secret

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:17

___

### name

• **name**: `string`

name of store

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:10

___

### removeSecret

• **removeSecret**: [`SecretDeleteFunction`](../modules/purista_httpserver.internal.md#secretdeletefunction)

delete a secret

**`Param`**

name of secret

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:23

___

### setSecret

• **setSecret**: [`SecretSetterFunction`](../modules/purista_httpserver.internal.md#secretsetterfunction)

set a secret

**`Param`**

name of secret

**`Param`**

value of secret

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:30

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

disconnects and shuts down the secret store

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:34
