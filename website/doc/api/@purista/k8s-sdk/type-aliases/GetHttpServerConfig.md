[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/k8s-sdk](../README.md) / GetHttpServerConfig

# Type Alias: GetHttpServerConfig

> **GetHttpServerConfig** = `object`

Defined in: [types.ts:6](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L6)

The configuration object for creating the k8s http server

## Properties

### apiMountPath?

> `optional` **apiMountPath?**: `string`

Defined in: [types.ts:18](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L18)

the api mount path

#### Default

```ts
/api
```

***

### disableEndpointExposing?

> `optional` **disableEndpointExposing?**: `boolean`

Defined in: [types.ts:16](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L16)

disables adding of all  endpoints for commands which are marked to be exposed as http endpoints

***

### enableHttpCompression?

> `optional` **enableHttpCompression?**: `boolean`

Defined in: [types.ts:20](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L20)

enable HTTP compression in web server

#### Default

```ts
true
```

***

### healthFn

> **healthFn**: () => `Promise`\<`boolean`\>

Defined in: [types.ts:12](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L12)

health function to be executed on health check

#### Returns

`Promise`\<`boolean`\>

***

### hostname?

> `optional` **hostname?**: `string`

Defined in: [types.ts:10](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L10)

hostname used in tracing and logging

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [types.ts:8](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L8)

a logger instance

***

### services?

> `optional` **services?**: [`Service`](../../core/classes/Service.md) \| [`Service`](../../core/classes/Service.md)[]

Defined in: [types.ts:14](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L14)

service or array of services which should expose their commands as endpoints if defined
