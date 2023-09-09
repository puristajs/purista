[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/base-http-bridge](../modules/purista_base_http_bridge.md) / HttpEventBridge

# Class: HttpEventBridge<CustomConfig\>

[@purista/base-http-bridge](../modules/purista_base_http_bridge.md).HttpEventBridge

The HTTP event bridge is a generic event bridge.
In environments like Dapr or Knative, the communication is done via sidecar containers and via HTTP.

In these cases, it is expected, that the current instance is a HTTP server, which provides REST endpoints for commands and subscriptions.
The communication from the current instance to the sidecar is also done via REST endpoints.

HTTP calls from the sidecar to the current instance might be done via CloudEvent schema, which wraps the payload into a defined structure.
The HttpEventBridge can be configured to respect this, and to extract the information from CloudEvents.

To use the HttpEventBridge, you will need following peer-dependencies installed:

- hono
- trouter

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends [`HttpEventBridgeConfig`](../modules/purista_base_http_bridge.md#httpeventbridgeconfig) |

## Hierarchy

- `EventBridgeBaseClass`<`CustomConfig`\>

  ↳ **`HttpEventBridge`**

## Implements

- `EventBridge`

## Table of contents

### Constructors

- [constructor](purista_base_http_bridge.HttpEventBridge.md#constructor)

### Properties

- [app](purista_base_http_bridge.HttpEventBridge.md#app)
- [client](purista_base_http_bridge.HttpEventBridge.md#client)
- [config](purista_base_http_bridge.HttpEventBridge.md#config)
- [defaultCommandTimeout](purista_base_http_bridge.HttpEventBridge.md#defaultcommandtimeout)
- [instanceId](purista_base_http_bridge.HttpEventBridge.md#instanceid)
- [isShuttingDown](purista_base_http_bridge.HttpEventBridge.md#isshuttingdown)
- [isStarted](purista_base_http_bridge.HttpEventBridge.md#isstarted)
- [logger](purista_base_http_bridge.HttpEventBridge.md#logger)
- [name](purista_base_http_bridge.HttpEventBridge.md#name)
- [server](purista_base_http_bridge.HttpEventBridge.md#server)
- [traceProvider](purista_base_http_bridge.HttpEventBridge.md#traceprovider)

### Methods

- [destroy](purista_base_http_bridge.HttpEventBridge.md#destroy)
- [emit](purista_base_http_bridge.HttpEventBridge.md#emit)
- [emitMessage](purista_base_http_bridge.HttpEventBridge.md#emitmessage)
- [getTracer](purista_base_http_bridge.HttpEventBridge.md#gettracer)
- [invoke](purista_base_http_bridge.HttpEventBridge.md#invoke)
- [isHealthy](purista_base_http_bridge.HttpEventBridge.md#ishealthy)
- [isReady](purista_base_http_bridge.HttpEventBridge.md#isready)
- [off](purista_base_http_bridge.HttpEventBridge.md#off)
- [on](purista_base_http_bridge.HttpEventBridge.md#on)
- [registerCommand](purista_base_http_bridge.HttpEventBridge.md#registercommand)
- [registerSubscription](purista_base_http_bridge.HttpEventBridge.md#registersubscription)
- [removeAllListeners](purista_base_http_bridge.HttpEventBridge.md#removealllisteners)
- [start](purista_base_http_bridge.HttpEventBridge.md#start)
- [startActiveSpan](purista_base_http_bridge.HttpEventBridge.md#startactivespan)
- [unregisterCommand](purista_base_http_bridge.HttpEventBridge.md#unregistercommand)
- [unregisterSubscription](purista_base_http_bridge.HttpEventBridge.md#unregistersubscription)
- [wrapInSpan](purista_base_http_bridge.HttpEventBridge.md#wrapinspan)

## Constructors

### constructor

• **new HttpEventBridge**<`CustomConfig`\>(`config`, `client`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends [`HttpEventBridgeConfig`](../modules/purista_base_http_bridge.md#httpeventbridgeconfig) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | { [K in string \| number \| symbol]: (Object & CustomConfig)[K] } |
| `client` | [`HttpEventBridgeClient`](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md) |

#### Overrides

EventBridgeBaseClass&lt;CustomConfig\&gt;.constructor

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:73](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L73)

## Properties

### app

• **app**: `Hono`<`Env`, {}, ``"/"``\>

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:67](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L67)

___

### client

• **client**: [`HttpEventBridgeClient`](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L71)

___

### config

• **config**: `Complete`<{ [K in string \| number \| symbol]: (Object & CustomConfig)[K] }\>

#### Inherited from

EventBridgeBaseClass.config

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

#### Implementation of

EventBridge.defaultCommandTimeout

#### Inherited from

EventBridgeBaseClass.defaultCommandTimeout

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### instanceId

• **instanceId**: `string`

#### Implementation of

EventBridge.instanceId

#### Inherited from

EventBridgeBaseClass.instanceId

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### isShuttingDown

• **isShuttingDown**: `boolean` = `false`

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L68)

___

### isStarted

• **isStarted**: `boolean` = `false`

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L69)

___

### logger

• **logger**: `Logger`

#### Inherited from

EventBridgeBaseClass.logger

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:11

___

### name

• **name**: `string`

#### Implementation of

EventBridge.name

#### Inherited from

EventBridgeBaseClass.name

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### server

• **server**: `undefined` \| `Server`<typeof `IncomingMessage`, typeof `ServerResponse`\>

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L66)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

EventBridgeBaseClass.traceProvider

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

#### Overrides

EventBridgeBaseClass.destroy

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:350](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L350)

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

EventBridgeBaseClass.emit

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:143](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L143)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

EventBridgeBaseClass.getTracer

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:203](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L203)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isHealthy

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:340](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L340)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

EventBridge.isReady

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:336](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L336)

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

EventBridgeBaseClass.off

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

EventBridgeBaseClass.on

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
| `metadata.expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"DELETE"`` \| ``"GET"`` \| ``"PATCH"`` \| ``"POST"`` \| ``"PUT"`` ; `openApi?`: { `additionalStatusCodes?`: `StatusCode`[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: `QueryParameter`<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `eventBridgeConfig` | `DefinitionEventBridgeConfig` |

#### Returns

`Promise`<`string`\>

#### Implementation of

EventBridge.registerCommand

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:257](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L257)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:311](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L311)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

EventBridgeBaseClass.removeAllListeners

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

EventBridgeBaseClass.start

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:87](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L87)

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

EventBridgeBaseClass.startActiveSpan

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:307](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L307)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:332](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L332)

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

EventBridgeBaseClass.wrapInSpan

#### Defined in

core/lib/types/core/EventBridge/EventBridgeBaseClass.impl.d.ts:48
