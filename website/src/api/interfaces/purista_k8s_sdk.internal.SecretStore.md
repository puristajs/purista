[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / SecretStore

# Interface: SecretStore

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).SecretStore

Interface definition for a secret store implementation

## Table of contents

### Properties

- [getSecret](purista_k8s_sdk.internal.SecretStore.md#getsecret)
- [name](purista_k8s_sdk.internal.SecretStore.md#name)
- [removeSecret](purista_k8s_sdk.internal.SecretStore.md#removesecret)
- [setSecret](purista_k8s_sdk.internal.SecretStore.md#setsecret)

### Methods

- [destroy](purista_k8s_sdk.internal.SecretStore.md#destroy)

## Properties

### getSecret

• **getSecret**: [`SecretGetterFunction`](../modules/purista_k8s_sdk.internal.md#secretgetterfunction)

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

• **removeSecret**: [`SecretDeleteFunction`](../modules/purista_k8s_sdk.internal.md#secretdeletefunction)

delete a secret

**`Param`**

name of secret

**`Throws`**

UnhandledError

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:23

___

### setSecret

• **setSecret**: [`SecretSetterFunction`](../modules/purista_k8s_sdk.internal.md#secretsetterfunction)

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
