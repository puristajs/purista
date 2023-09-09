[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/dapr-sdk](../modules/purista_dapr_sdk.md) / DaprEventBridge

# Class: DaprEventBridge

[@purista/dapr-sdk](../modules/purista_dapr_sdk.md).DaprEventBridge

The DaprEventBridge connects to the Dapr sidecar container.
It provides endpoints for invoking commands, triggering subscriptions and emitting event messages.
The sidecar container invokes commands and subscriptions of the service connected to the event bridge.
A DaprClient (http fetch) is used for communication from the service/event bridge to the sidecar container.

Names for services, commands, subscriptions and events are converted to kebab-case.
If the event bridge is configured to expose REST endpoints defined in command builder, the endpoints are generated as defined in the command builder.

The event bridge is using Hono under the hood. You need to provide a `serve` function.
Depending on your runtime (Node, Bun, Deno) an adapter might be needed.

**`See`**

[Hono website](https://hono.dev)

**`Example`**

```typescript
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'

const eventBridge = new DaprEventBridge({
   serve,
 })

// start the services first ...

await eventBridge.start()
```

## Hierarchy

- `HttpEventBridge`<[`DaprEventBridgeConfig`](../modules/purista_dapr_sdk.md#dapreventbridgeconfig)\>

  ↳ **`DaprEventBridge`**

## Implements

- `EventBridge`

## Table of contents

### Constructors

- [constructor](purista_dapr_sdk.DaprEventBridge.md#constructor)

### Properties

- [app](purista_dapr_sdk.DaprEventBridge.md#app)
- [client](purista_dapr_sdk.DaprEventBridge.md#client)
- [config](purista_dapr_sdk.DaprEventBridge.md#config)
- [defaultCommandTimeout](purista_dapr_sdk.DaprEventBridge.md#defaultcommandtimeout)
- [instanceId](purista_dapr_sdk.DaprEventBridge.md#instanceid)
- [isShuttingDown](purista_dapr_sdk.DaprEventBridge.md#isshuttingdown)
- [isStarted](purista_dapr_sdk.DaprEventBridge.md#isstarted)
- [logger](purista_dapr_sdk.DaprEventBridge.md#logger)
- [name](purista_dapr_sdk.DaprEventBridge.md#name)
- [pubSubSubscriptions](purista_dapr_sdk.DaprEventBridge.md#pubsubsubscriptions)
- [server](purista_dapr_sdk.DaprEventBridge.md#server)
- [traceProvider](purista_dapr_sdk.DaprEventBridge.md#traceprovider)

### Methods

- [destroy](purista_dapr_sdk.DaprEventBridge.md#destroy)
- [emit](purista_dapr_sdk.DaprEventBridge.md#emit)
- [emitMessage](purista_dapr_sdk.DaprEventBridge.md#emitmessage)
- [getTracer](purista_dapr_sdk.DaprEventBridge.md#gettracer)
- [invoke](purista_dapr_sdk.DaprEventBridge.md#invoke)
- [isHealthy](purista_dapr_sdk.DaprEventBridge.md#ishealthy)
- [isReady](purista_dapr_sdk.DaprEventBridge.md#isready)
- [off](purista_dapr_sdk.DaprEventBridge.md#off)
- [on](purista_dapr_sdk.DaprEventBridge.md#on)
- [registerCommand](purista_dapr_sdk.DaprEventBridge.md#registercommand)
- [registerSubscription](purista_dapr_sdk.DaprEventBridge.md#registersubscription)
- [removeAllListeners](purista_dapr_sdk.DaprEventBridge.md#removealllisteners)
- [start](purista_dapr_sdk.DaprEventBridge.md#start)
- [startActiveSpan](purista_dapr_sdk.DaprEventBridge.md#startactivespan)
- [unregisterCommand](purista_dapr_sdk.DaprEventBridge.md#unregistercommand)
- [unregisterSubscription](purista_dapr_sdk.DaprEventBridge.md#unregistersubscription)
- [wrapInSpan](purista_dapr_sdk.DaprEventBridge.md#wrapinspan)

## Constructors

### constructor

• **new DaprEventBridge**(`config`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | - |
| `config.commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | `LogLevelName` | If no logger instance is given, use this log level |
| `config.logger?` | `Logger` | A logger instance |
| `config.name?` | `string` | name of the bridge |
| `config.pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message |
| `config.serve` | (`options`: { `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`<typeof `IncomingMessage`, typeof `ServerResponse`\> | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `config.serverHost?` | `string` | Host of the server. |
| `config.serverPort?` | `number` | Port of the server. |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 |

#### Overrides

HttpEventBridge&lt;DaprEventBridgeConfig\&gt;.constructor

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L53)

## Properties

### app

• **app**: `Hono`<`Env`, {}, ``"/"``\>

#### Inherited from

HttpEventBridge.app

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:23

___

### client

• **client**: `HttpEventBridgeClient`

#### Inherited from

HttpEventBridge.client

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:26

___

### config

• **config**: `Complete`<{ `apiPrefix?`: `string` ; `clientConfig?`: [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) ; `commandPayloadAsCloudEvent?`: `boolean` ; `defaultCommandTimeout?`: `number` ; `enableRestApiExpose?`: `boolean` ; `instanceId?`: `string` ; `logLevel?`: `LogLevelName` ; `logger?`: `Logger` ; `name?`: `string` ; `pathPrefix?`: `string` ; `serve`: (`options`: { `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`<typeof `IncomingMessage`, typeof `ServerResponse`\> ; `serverHost?`: `string` ; `serverPort?`: `number` ; `spanProcessor?`: `SpanProcessor` ; `subscriptionPayloadAsCloudEvent?`: `boolean`  }\>

#### Inherited from

HttpEventBridge.config

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

#### Implementation of

EventBridge.defaultCommandTimeout

#### Inherited from

HttpEventBridge.defaultCommandTimeout

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### instanceId

• **instanceId**: `string`

#### Implementation of

EventBridge.instanceId

#### Inherited from

HttpEventBridge.instanceId

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### isShuttingDown

• **isShuttingDown**: `boolean`

#### Inherited from

HttpEventBridge.isShuttingDown

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:24

___

### isStarted

• **isStarted**: `boolean`

#### Inherited from

HttpEventBridge.isStarted

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:25

___

### logger

• **logger**: `Logger`

#### Inherited from

HttpEventBridge.logger

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:11

___

### name

• **name**: `string`

#### Implementation of

EventBridge.name

#### Inherited from

HttpEventBridge.name

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### pubSubSubscriptions

• `Private` **pubSubSubscriptions**: [`DaprPubSubType`](../modules/purista_dapr_sdk.md#daprpubsubtype)[] = `[]`

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L51)

___

### server

• **server**: `undefined` \| `Server`<typeof `IncomingMessage`, typeof `ServerResponse`\>

#### Inherited from

HttpEventBridge.server

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:22

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

HttpEventBridge.traceProvider

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.destroy

#### Inherited from

HttpEventBridge.destroy

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:40

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `EventKey`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | { `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`] |

#### Returns

`void`

#### Inherited from

HttpEventBridge.emit

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ **emitMessage**<`T`\>(`message`): `Promise`<`Readonly`<`EBMessage`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `EBMessage` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Omit`<`EBMessage`, ``"id"`` \| ``"timestamp"`` \| ``"correlationId"``\> |

#### Returns

`Promise`<`Readonly`<`EBMessage`\>\>

#### Implementation of

EventBridge.emitMessage

#### Inherited from

HttpEventBridge.emitMessage

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:29

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

HttpEventBridge.getTracer

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

___

### invoke

▸ **invoke**<`T`\>(`input`, `ttl?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"`` \| ``"correlationId"`` \| ``"messageType"``\> |
| `ttl?` | `number` |

#### Returns

`Promise`<`T`\>

#### Implementation of

EventBridge.invoke

#### Inherited from

HttpEventBridge.invoke

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:30

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isHealthy

#### Inherited from

HttpEventBridge.isHealthy

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:36

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isReady

#### Inherited from

HttpEventBridge.isReady

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:35

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `EventKey`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

HttpEventBridge.off

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `EventKey`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

HttpEventBridge.on

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<`Readonly`<`Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `CommandSuccessResponse` ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\> \| `Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: `CommandErrorResponse` ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: `StatusCode`  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\>\> |
| `metadata` | `Object` |
| `metadata.expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: `StatusCode`[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: `QueryParameter`<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `eventBridgeConfig` | `DefinitionEventBridgeConfig` |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerCommand

#### Inherited from

HttpEventBridge.registerCommand

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:31

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscription` | `Subscription` |
| `cb` | (`message`: `EBMessage`) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: `CustomMessage` ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerSubscription

#### Overrides

HttpEventBridge.registerSubscription

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:105](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L105)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

HttpEventBridge.removeAllListeners

#### Defined in

core/lib/types/core/types/GenericEventEmitter.d.ts:14

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.start

#### Overrides

HttpEventBridge.start

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:88](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L88)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `context` | `undefined` \| `Context` | optional context |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function to be executed within the span |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

HttpEventBridge.startActiveSpan

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:32

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.unregisterCommand

#### Inherited from

HttpEventBridge.unregisterCommand

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:32

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

#### Returns

`Promise`<`void`\>

#### Implementation of

EventBridge.unregisterSubscription

#### Inherited from

HttpEventBridge.unregisterSubscription

#### Defined in

base-http-bridge/lib/types/HttpEventBridge/HttpEventBridge.impl.d.ts:34

___

### wrapInSpan

▸ **wrapInSpan**<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`<`F`\>

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of span |
| `opts` | `SpanOptions` | span options |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | function te be executed in the span |
| `context?` | `Context` | span context |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

HttpEventBridge.wrapInSpan

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:48
