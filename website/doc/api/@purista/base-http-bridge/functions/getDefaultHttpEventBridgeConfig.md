[**@purista/base-http-bridge v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / getDefaultHttpEventBridgeConfig

# Function: getDefaultHttpEventBridgeConfig()

> **getDefaultHttpEventBridgeConfig**(): `object`

Defined in: [base-http-bridge/src/HttpEventBridge/getDefaultHttpEventBridgeConfig.impl.ts:5](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/getDefaultHttpEventBridgeConfig.impl.ts#L5)

## Returns

`object`

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

### defaultCommandTimeout?

> `optional` **defaultCommandTimeout**: `number`

Overwrite the hardcoded default timeout of command invocations

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

### instanceId?

> `optional` **instanceId**: `string`

The instance id of the event bridge.
If not set, a id will generated each time a instance is created.
Use this if there is a need to always have the same instance id.

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

A logger instance

### logLevel?

> `optional` **logLevel**: [`LogLevelName`](../../core/type-aliases/LogLevelName.md)

If no logger instance is given, use this log level

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

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

A OpenTelemetry span processor

### subscriptionPayloadAsCloudEvent?

> `optional` **subscriptionPayloadAsCloudEvent**: `boolean`

subscription invocations are wrapped in CloudEvent

#### Link

https://github.com/cloudevents/spec/tree/v1.0

#### Default

```ts
false
```
