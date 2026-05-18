[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/k8s-sdk](../README.md) / addServiceEndpoints

# Function: addServiceEndpoints()

> **addServiceEndpoints**(`services`, `app`, `logger`, `apiMountPath?`): `void`

Defined in: [addServiceEndpoints.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/addServiceEndpoints.impl.ts#L42)

Add HTTP endpoints for all commands that expose HTTP metadata.

This helper registers the routes on the provided Hono application and
connects them with the corresponding service commands.

## Parameters

### services

[`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\> \| [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\>[] \| `undefined`

Instance or array of services whose commands should be exposed.

### app

`Hono`

The Hono application instance.

### logger

[`Logger`](../../core/classes/Logger.md)

Logger used for debug output.

### apiMountPath?

`string` = `'/api'`

Base path for all generated endpoints. Defaults to `/api`.

## Returns

`void`

## Example

```ts
const app = new Hono()
addServiceEndpoints(myService, app, logger)
```
