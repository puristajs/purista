[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / HttpEventBridgeConfig

# Type Alias: HttpEventBridgeConfig

> **HttpEventBridgeConfig** = `object`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:4](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L4)

## Properties

### apiPrefix?

> `optional` **apiPrefix**: `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:49](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L49)

the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI definition
needs to `enableRestApiExpose` set to `true`

#### Default

```ts
/api
```

***

### commandPayloadAsCloudEvent?

> `optional` **commandPayloadAsCloudEvent**: `boolean`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:74](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L74)

command invocations are wrapped in CloudEvent

CloudEvents specification v1.0: https://github.com/cloudevents/spec/tree/v1.0

#### Default

```ts
false
```

***

### enableHttpCompression?

> `optional` **enableHttpCompression**: `boolean`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:79](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L79)

enable HTTP compression in web server

#### Default

```ts
true
```

***

### enableRestApiExpose?

> `optional` **enableRestApiExpose**: `boolean`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:56](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L56)

expose commands as regular REST endpoints when they are configured as endpoints

#### Default

```ts
true
```

***

### name?

> `optional` **name**: `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:5](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L5)

***

### pathPrefix?

> `optional` **pathPrefix**: `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:41](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L41)

the prefix to be used for exposing commands as endpoints expecting a event bus message

#### Default

```ts
purista
```

***

### serve()

> **serve**: (`options`) => `Server` \| `Http2Server` \| `Http2SecureServer`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:16](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L16)

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

***

### serverHost?

> `optional` **serverHost**: `string`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:27](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L27)

Host of the server.

#### Default

```ts
127.0.0.1
```

***

### serverPort?

> `optional` **serverPort**: `number`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:34](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L34)

Port of the server.

#### Default

```ts
8080
```

***

### subscriptionPayloadAsCloudEvent?

> `optional` **subscriptionPayloadAsCloudEvent**: `boolean`

Defined in: [base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts:65](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeConfig.ts#L65)

subscription invocations are wrapped in CloudEvent

CloudEvents specification v1.0: https://github.com/cloudevents/spec/tree/v1.0

#### Default

```ts
false
```
