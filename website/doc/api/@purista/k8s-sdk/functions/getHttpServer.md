[**@purista/k8s-sdk v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/k8s-sdk](../README.md) / getHttpServer

# Function: getHttpServer()

> **getHttpServer**(`input`, `name`): `Hono`\<`BlankEnv`, `BlankSchema`, `"/"`\>

Defined in: [getHttpServer.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/k8s-sdk/src/getHttpServer.impl.ts#L21)

Create a Hono web server.
It adds per default the /healthz endpoint
If services is set in options, all commands, which have defined http endpoints, will also be added as endpoints

The returned server is not started. You need to do it manually.

## Parameters

### input

[`GetHttpServerConfig`](../type-aliases/GetHttpServerConfig.md)

the config

### name

`string` = `'K8sHttpHelperServer'`

## Returns

`Hono`\<`BlankEnv`, `BlankSchema`, `"/"`\>

a object with server, router, start and destroy functions and name var
