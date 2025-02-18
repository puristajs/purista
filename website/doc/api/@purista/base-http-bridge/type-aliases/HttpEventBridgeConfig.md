[**@purista/base-http-bridge v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / HttpEventBridgeConfig

# Type Alias: HttpEventBridgeConfig

> **HttpEventBridgeConfig**: `object`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:4](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L4)

## Type declaration

### apiPrefix?

> `optional` **apiPrefix**: `string`

the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion
needs to `enableRestApiExpose` set to `true`

#### Default

```ts
/api
```

### commandPayloadAsCloudEvent?

> `optional` **commandPayloadAsCloudEvent**: `boolean`

command invocations are wrapped in CloudEvent

#### Link

https://github.com/cloudevents/spec/tree/v1.0

#### Default

```ts
false
```

### enableHttpCompression?

> `optional` **enableHttpCompression**: `boolean`

enable HTTP compression in web server

#### Default

```ts
true
```

### enableRestApiExpose?

> `optional` **enableRestApiExpose**: `boolean`

expose commands as regular REST endpoints when they are configured as endpoints

#### Default

```ts
true
```

### name?

> `optional` **name**: `string`

name of the bridge

#### Default

```ts
HttpEventBridge
```

### pathPrefix?

> `optional` **pathPrefix**: `string`

the prefix to be used for exposing commands as endpoints expecting a event bus message

#### Default

```ts
purista
```

### serve()

> **serve**: (`options`) => `Server` \| `Http2Server` \| `Http2SecureServer`

The serve function is depending on the runtime.

- Bun: `Bun.serve`
- Node.js: `serve` function from additional package `@hono/hono-node-server`
- Deno: `serve` function from package `https://deno.land/std/http/server.ts`

#### Parameters

##### options

###### fetch

(`request`) => `Promise`\<`unknown`\> \| `unknown`

###### hostname?

`string`

###### port?

`number`

#### Returns

`Server` \| `Http2Server` \| `Http2SecureServer`

#### See

https://hono.dev

### serverHost?

> `optional` **serverHost**: `string`

Host of the server.

#### Default

```ts
127.0.0.1
```

### serverPort?

> `optional` **serverPort**: `number`

Port of the server.

#### Default

```ts
8080
```

### subscriptionPayloadAsCloudEvent?

> `optional` **subscriptionPayloadAsCloudEvent**: `boolean`

subscription invocations are wrapped in CloudEvent

#### Link

https://github.com/cloudevents/spec/tree/v1.0

#### Default

```ts
false
```
