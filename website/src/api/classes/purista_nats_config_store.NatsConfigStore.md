[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/nats-config-store](../modules/purista_nats_config_store.md) / NatsConfigStore

# Class: NatsConfigStore

[@purista/nats-config-store](../modules/purista_nats_config_store.md).NatsConfigStore

A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

**`Example`**

```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore({ config })

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```

## Hierarchy

- `ConfigStoreBaseClass`<[`NatsConfigStoreConfig`](../modules/purista_nats_config_store.md#natsconfigstoreconfig)\>

  ↳ **`NatsConfigStore`**

## Table of contents

### Constructors

- [constructor](purista_nats_config_store.NatsConfigStore.md#constructor)

### Properties

- [config](purista_nats_config_store.NatsConfigStore.md#config)
- [connection](purista_nats_config_store.NatsConfigStore.md#connection)
- [kv](purista_nats_config_store.NatsConfigStore.md#kv)
- [logger](purista_nats_config_store.NatsConfigStore.md#logger)
- [name](purista_nats_config_store.NatsConfigStore.md#name)
- [sc](purista_nats_config_store.NatsConfigStore.md#sc)

### Methods

- [destroy](purista_nats_config_store.NatsConfigStore.md#destroy)
- [getConfig](purista_nats_config_store.NatsConfigStore.md#getconfig)
- [getStore](purista_nats_config_store.NatsConfigStore.md#getstore)
- [removeConfig](purista_nats_config_store.NatsConfigStore.md#removeconfig)
- [setConfig](purista_nats_config_store.NatsConfigStore.md#setconfig)

## Constructors

### constructor

• **new NatsConfigStore**(`config?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | - |
| `config.enableGet?` | `boolean` | Enable generally get method |
| `config.enableRemove?` | `boolean` | Enable generally remove method |
| `config.enableSet?` | `boolean` | Enable generally set method |
| `config.keyValueStoreName?` | `string` | - |
| `config.logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `config.logger?` | `Logger` | A logger instance |

#### Overrides

ConfigStoreBaseClass&lt;NatsConfigStoreConfig\&gt;.constructor

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L34)

## Properties

### config

• **config**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `enableGet?` | `boolean` | Enable generally get method |
| `enableRemove?` | `boolean` | Enable generally remove method |
| `enableSet?` | `boolean` | Enable generally set method |
| `keyValueStoreName` | `string` | - |
| `logLevel?` | `LogLevelName` | A log level for new logger if logger is not set |
| `logger?` | `Logger` | A logger instance |

#### Inherited from

ConfigStoreBaseClass.config

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:10

___

### connection

• **connection**: `undefined` \| `NatsConnection`

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:29](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L29)

___

### kv

• **kv**: `undefined` \| `KV`

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:32](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L32)

___

### logger

• **logger**: `Logger`

#### Inherited from

ConfigStoreBaseClass.logger

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:9

___

### name

• **name**: `string`

#### Inherited from

ConfigStoreBaseClass.name

#### Defined in

core/lib/types/core/ConfigStore/ConfigStoreBaseClass.impl.d.ts:11

___

### sc

• **sc**: `Codec`<`unknown`\>

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L31)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

ConfigStoreBaseClass.destroy

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:123](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L123)

___

### getConfig

▸ **getConfig**(`...stateNames`): `Promise`<`Record`<`string`, `unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

#### Returns

`Promise`<`Record`<`string`, `unknown`\>\>

#### Overrides

ConfigStoreBaseClass.getConfig

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L70)

___

### getStore

▸ **getStore**(): `Promise`<`KV`\>

#### Returns

`Promise`<`KV`\>

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:42](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L42)

___

### removeConfig

▸ **removeConfig**(`stateName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

ConfigStoreBaseClass.removeConfig

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:91](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L91)

___

### setConfig

▸ **setConfig**(`stateName`, `stateValue`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |
| `stateValue` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Overrides

ConfigStoreBaseClass.setConfig

#### Defined in

[nats-config-store/src/NatsConfigStore.impl.ts:107](https://github.com/sebastianwessel/purista/blob/master/packages/nats-config-store/src/NatsConfigStore.impl.ts#L107)
