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

- [`HttpEventBridge`](purista_base_http_bridge.HttpEventBridge.md)\<[`DaprEventBridgeConfig`](../modules/purista_dapr_sdk.md#dapreventbridgeconfig)\>

  ↳ **`DaprEventBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

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

• **new DaprEventBridge**(`config`): [`DaprEventBridge`](purista_dapr_sdk.DaprEventBridge.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | - |
| `config.apiPrefix?` | `string` | the prefix to be used if the command is configured as REST api endpoint according to the OpenAPI defintion needs to `enableRestApiExpose` set to `true` **`Default`** ```ts /api ``` |
| `config.clientConfig?` | [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) | - |
| `config.commandPayloadAsCloudEvent?` | `boolean` | command invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |
| `config.defaultCommandTimeout?` | `number` | Overwrite the hardcoded default timeout of command invocations |
| `config.enableHttpCompression?` | `boolean` | enable HTTP compression in web server **`Default`** ```ts true ``` |
| `config.enableRestApiExpose?` | `boolean` | expose commands as regular REST endpoints when they are configured as endpoints **`Default`** ```ts true ``` |
| `config.instanceId?` | `string` | The instance id of the event bridge. If not set, a id will generated each time a instance is created. Use this if there is a need to always have the same instance id. |
| `config.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | If no logger instance is given, use this log level |
| `config.logger?` | [`Logger`](purista_core.Logger.md) | A logger instance |
| `config.name?` | `string` | name of the bridge **`Default`** ```ts HttpEventBridge ``` |
| `config.pathPrefix?` | `string` | the prefix to be used for exposing commands as endpoints expecting a event bus message **`Default`** ```ts purista ``` |
| `config.serve` | (`options`: \{ `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> \| `Http2Server` \| `Http2SecureServer` | The serve function is depending on the runtime. - Bun: `Bun.serve` - Node.js: `serve` function from additional package `@hono/hono-node-server` - Deno: `serve` function from package `https://deno.land/std/http/server.ts` **`See`** https://hono.dev |
| `config.serverHost?` | `string` | Host of the server. **`Default`** ```ts 127.0.0.1 ``` |
| `config.serverPort?` | `number` | Port of the server. **`Default`** ```ts 8080 ``` |
| `config.spanProcessor?` | `SpanProcessor` | A OpenTelemetry span processor |
| `config.subscriptionPayloadAsCloudEvent?` | `boolean` | subscription invocations are wrapped in CloudEvent **`Link`** https://github.com/cloudevents/spec/tree/v1.0 **`Default`** ```ts false ``` |

#### Returns

[`DaprEventBridge`](purista_dapr_sdk.DaprEventBridge.md)

#### Overrides

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[constructor](purista_base_http_bridge.HttpEventBridge.md#constructor)

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:45](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L45)

## Properties

### app

• **app**: `Hono`\<`Env`, `BlankSchema`, ``"/"``\>

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[app](purista_base_http_bridge.HttpEventBridge.md#app)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:26

___

### client

• **client**: [`HttpEventBridgeClient`](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[client](purista_base_http_bridge.HttpEventBridge.md#client)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:29

___

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)\<\{ `apiPrefix?`: `string` ; `clientConfig?`: [`DaprClientConfig`](../modules/purista_dapr_sdk.md#daprclientconfig) ; `commandPayloadAsCloudEvent?`: `boolean` ; `defaultCommandTimeout?`: `number` ; `enableHttpCompression?`: `boolean` ; `enableRestApiExpose?`: `boolean` ; `instanceId?`: `string` ; `logLevel?`: [`LogLevelName`](../modules/purista_core.md#loglevelname) ; `logger?`: [`Logger`](purista_core.Logger.md) ; `name?`: `string` ; `pathPrefix?`: `string` ; `serve`: (`options`: \{ `fetch`: (`request`: `Request`) => `unknown` ; `hostname?`: `string` ; `port?`: `number`  }) => `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> \| `Http2Server` \| `Http2SecureServer` ; `serverHost?`: `string` ; `serverPort?`: `number` ; `spanProcessor?`: `SpanProcessor` ; `subscriptionPayloadAsCloudEvent?`: `boolean`  }\>

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[config](purista_base_http_bridge.HttpEventBridge.md#config)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[defaultCommandTimeout](../interfaces/purista_core.EventBridge.md#defaultcommandtimeout)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[defaultCommandTimeout](purista_base_http_bridge.HttpEventBridge.md#defaultcommandtimeout)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

___

### instanceId

• **instanceId**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[instanceId](../interfaces/purista_core.EventBridge.md#instanceid)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[instanceId](purista_base_http_bridge.HttpEventBridge.md#instanceid)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### isShuttingDown

• **isShuttingDown**: `boolean`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[isShuttingDown](purista_base_http_bridge.HttpEventBridge.md#isshuttingdown)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:27

___

### isStarted

• **isStarted**: `boolean`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[isStarted](purista_base_http_bridge.HttpEventBridge.md#isstarted)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:28

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[logger](purista_base_http_bridge.HttpEventBridge.md#logger)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

___

### name

• **name**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[name](../interfaces/purista_core.EventBridge.md#name)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[name](purista_base_http_bridge.HttpEventBridge.md#name)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### pubSubSubscriptions

• `Private` **pubSubSubscriptions**: [`DaprPubSubType`](../modules/purista_dapr_sdk.md#daprpubsubtype)[] = `[]`

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L43)

___

### server

• **server**: `undefined` \| `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> \| `Http2Server` \| `Http2SecureServer`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[server](purista_base_http_bridge.HttpEventBridge.md#server)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:25

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[traceProvider](purista_base_http_bridge.HttpEventBridge.md#traceprovider)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

## Methods

### destroy

▸ **destroy**(): `Promise`\<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[destroy](../interfaces/purista_core.EventBridge.md#destroy)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[destroy](purista_base_http_bridge.HttpEventBridge.md#destroy)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:43

___

### emit

▸ **emit**\<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | \{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`] |

#### Returns

`void`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[emit](purista_base_http_bridge.HttpEventBridge.md#emit)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ **emitMessage**\<`T`\>(`message`): `Promise`\<`Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a message to the eventbridge without awaiting a result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EBMessage`](../modules/purista_core.md#ebmessage) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`\<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"correlationId"``\> | the message |

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[emitMessage](../interfaces/purista_core.EventBridge.md#emitmessage)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[emitMessage](purista_base_http_bridge.HttpEventBridge.md#emitmessage)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:32

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[getTracer](purista_base_http_bridge.HttpEventBridge.md#gettracer)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:24

___

### invoke

▸ **invoke**\<`T`\>(`input`, `ttl?`): `Promise`\<`T`\>

Call a command of a service and return the result of this command

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"`` \| ``"correlationId"`` \| ``"messageType"``\> | a partial command message |
| `ttl?` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[invoke](../interfaces/purista_core.EventBridge.md#invoke)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[invoke](purista_base_http_bridge.HttpEventBridge.md#invoke)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:33

___

### isHealthy

▸ **isHealthy**(): `Promise`\<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[isHealthy](purista_base_http_bridge.HttpEventBridge.md#ishealthy)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:39

___

### isReady

▸ **isReady**(): `Promise`\<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[isReady](purista_base_http_bridge.HttpEventBridge.md#isready)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:38

___

### off

▸ **off**\<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[off](purista_base_http_bridge.HttpEventBridge.md#off)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**\<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`\<\{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[on](purista_base_http_bridge.HttpEventBridge.md#on)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `cb` | (`message`: \{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\> \| `Readonly`\<`Omit`\<\{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: \{ `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\>\> |
| `metadata` | `Object` |
| `metadata.expose` | \{ `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & \{ `http`: \{ `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: \{ `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)\<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_core.md#definitioneventbridgeconfig) |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerCommand](../interfaces/purista_core.EventBridge.md#registercommand)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[registerCommand](purista_base_http_bridge.HttpEventBridge.md#registercommand)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:34

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`\<`string`\>

Register a new subscription

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) | the subscription definition |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\> | the function to be called if a matching message arrives |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerSubscription](../interfaces/purista_core.EventBridge.md#registersubscription)

#### Overrides

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[registerSubscription](purista_base_http_bridge.HttpEventBridge.md#registersubscription)

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:97](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L97)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[removeAllListeners](purista_base_http_bridge.HttpEventBridge.md#removealllisteners)

#### Defined in

core/dist/commonjs/core/types/GenericEventEmitter.d.ts:14

___

### start

▸ **start**(): `Promise`\<`void`\>

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[start](../interfaces/purista_core.EventBridge.md#start)

#### Overrides

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[start](purista_base_http_bridge.HttpEventBridge.md#start)

#### Defined in

[dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprEventBridge/DaprEventBridge.impl.ts#L80)

___

### startActiveSpan

▸ **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

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
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | function to be executed within the span |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[startActiveSpan](purista_base_http_bridge.HttpEventBridge.md#startactivespan)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:33

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`\<`void`\>

Unregister a service command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The address (service name, version and command name) of the command to be de-registered |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterCommand](../interfaces/purista_core.EventBridge.md#unregistercommand)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[unregisterCommand](purista_base_http_bridge.HttpEventBridge.md#unregistercommand)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:35

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterSubscription](../interfaces/purista_core.EventBridge.md#unregistersubscription)

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[unregisterSubscription](purista_base_http_bridge.HttpEventBridge.md#unregistersubscription)

#### Defined in

base-http-bridge/dist/commonjs/HttpEventBridge/HttpEventBridge.impl.d.ts:37

___

### wrapInSpan

▸ **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

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
| `fn` | (`span`: `Span`) => `Promise`\<`F`\> | function te be executed in the span |
| `context?` | `Context` | span context |

#### Returns

`Promise`\<`F`\>

return value of fn

#### Inherited from

[HttpEventBridge](purista_base_http_bridge.HttpEventBridge.md).[wrapInSpan](purista_base_http_bridge.HttpEventBridge.md#wrapinspan)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:49
