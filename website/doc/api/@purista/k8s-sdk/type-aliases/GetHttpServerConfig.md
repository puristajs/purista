[**@purista/k8s-sdk v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/k8s-sdk](../README.md) / GetHttpServerConfig

# Type Alias: GetHttpServerConfig

> **GetHttpServerConfig**: `object`

Defined in: [types.ts:6](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/types.ts#L6)

The configuration object for creating the k8s http server

## Type declaration

### apiMountPath?

> `optional` **apiMountPath**: `string`

the api mount path

#### Default

```ts
/api
```

### disableEndpointExposing?

> `optional` **disableEndpointExposing**: `boolean`

disables adding of all  endpoints for commands which are marked to be exposed as http endpoints

### enableHttpCompression?

> `optional` **enableHttpCompression**: `boolean`

enable HTTP compression in web server

#### Default

```ts
true
```

### healthFn()

> **healthFn**: () => `Promise`\<`boolean`\>

health function to be executed on health check

#### Returns

`Promise`\<`boolean`\>

### hostname?

> `optional` **hostname**: `string`

hostname used in tracing and logging

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

a logger instance

### services?

> `optional` **services**: [`Service`](../../core/classes/Service.md) \| [`Service`](../../core/classes/Service.md)[]

service or array of services which should expose their commands as endpoints if defined
