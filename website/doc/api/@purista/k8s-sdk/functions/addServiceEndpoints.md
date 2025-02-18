[**@purista/k8s-sdk v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/k8s-sdk](../README.md) / addServiceEndpoints

# Function: addServiceEndpoints()

> **addServiceEndpoints**(`services`, `app`, `logger`, `apiMountPath`): `void`

Defined in: [addServiceEndpoints.impl.ts:34](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/addServiceEndpoints.impl.ts#L34)

## Parameters

### services

instance of the service to add

`undefined` | [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\> | [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\>[]

### app

`Hono`

### logger

[`Logger`](../../core/classes/Logger.md)

the logger used for logging the addition

### apiMountPath

`string` = `'/api'`

## Returns

`void`

## Default

```ts
/api
```
