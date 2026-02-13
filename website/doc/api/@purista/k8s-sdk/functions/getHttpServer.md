[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/k8s-sdk](../README.md) / getHttpServer

# Function: getHttpServer()

> **getHttpServer**(`input`, `name?`): `Hono`\<`BlankEnv`, `BlankSchema`, `"/"`\>

Defined in: [getHttpServer.impl.ts:26](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/getHttpServer.impl.ts#L26)

Create a Hono based web server.

The server exposes a `/healthz` endpoint and, if configured, adds all HTTP
enabled command routes from the given services.
The returned `Hono` instance is not started automatically.

## Parameters

### input

[`GetHttpServerConfig`](../type-aliases/GetHttpServerConfig.md)

Server configuration.

### name?

`string` = `'K8sHttpHelperServer'`

## Returns

`Hono`\<`BlankEnv`, `BlankSchema`, `"/"`\>

The configured `Hono` application instance.

## Example

```ts
const app = getHttpServer({ logger, services: [svc], healthFn: async () => true })
serve({ fetch: app.fetch, port: 3000 })
```
