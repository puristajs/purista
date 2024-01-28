[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/base-http-bridge](../modules/purista_base_http_bridge.md) / HttpEventBridge

# Class: HttpEventBridge\<CustomConfig\>

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

- [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)\<`CustomConfig`\>

  ↳ **`HttpEventBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

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

• **new HttpEventBridge**\<`CustomConfig`\>(`config`, `client`): [`HttpEventBridge`](purista_base_http_bridge.HttpEventBridge.md)\<`CustomConfig`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends [`HttpEventBridgeConfig`](../modules/purista_base_http_bridge.md#httpeventbridgeconfig) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | \{ [K in string \| number \| symbol]: (Object & CustomConfig)[K] } |
| `client` | [`HttpEventBridgeClient`](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md) |

#### Returns

[`HttpEventBridge`](purista_base_http_bridge.HttpEventBridge.md)\<`CustomConfig`\>

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[constructor](purista_core.EventBridgeBaseClass.md#constructor)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:75](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L75)

## Properties

### app

• **app**: `Hono`\<`Env`, {}, ``"/"``\>

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L69)

___

### client

• **client**: [`HttpEventBridgeClient`](../interfaces/purista_base_http_bridge.HttpEventBridgeClient.md)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:73](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L73)

___

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)\<\{ [K in string \| number \| symbol]: (Object & CustomConfig)[K] }\>

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[config](purista_core.EventBridgeBaseClass.md#config)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[defaultCommandTimeout](../interfaces/purista_core.EventBridge.md#defaultcommandtimeout)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[defaultCommandTimeout](purista_core.EventBridgeBaseClass.md#defaultcommandtimeout)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:17

___

### instanceId

• **instanceId**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[instanceId](../interfaces/purista_core.EventBridge.md#instanceid)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[instanceId](purista_core.EventBridgeBaseClass.md#instanceid)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### isShuttingDown

• **isShuttingDown**: `boolean` = `false`

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L70)

___

### isStarted

• **isStarted**: `boolean` = `false`

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L71)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[logger](purista_core.EventBridgeBaseClass.md#logger)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

___

### name

• **name**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[name](../interfaces/purista_core.EventBridge.md#name)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[name](purista_core.EventBridgeBaseClass.md#name)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### server

• **server**: `undefined` \| `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> \| `Http2Server` \| `Http2SecureServer`

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L68)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[traceProvider](purista_core.EventBridgeBaseClass.md#traceprovider)

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

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[destroy](purista_core.EventBridgeBaseClass.md#destroy)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:354](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L354)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[emit](purista_core.EventBridgeBaseClass.md#emit)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:147](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L147)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[getTracer](purista_core.EventBridgeBaseClass.md#gettracer)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:207](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L207)

___

### isHealthy

▸ **isHealthy**(): `Promise`\<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:344](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L344)

___

### isReady

▸ **isReady**(): `Promise`\<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:340](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L340)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[off](purista_core.EventBridgeBaseClass.md#off)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[on](purista_core.EventBridgeBaseClass.md#on)

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
| `metadata.expose` | \{ `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & \{ `http`: \{ `method`: ``"DELETE"`` \| ``"GET"`` \| ``"PATCH"`` \| ``"POST"`` \| ``"PUT"`` ; `openApi?`: \{ `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)\<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_core.md#definitioneventbridgeconfig) |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerCommand](../interfaces/purista_core.EventBridge.md#registercommand)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:261](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L261)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:315](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L315)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[removeAllListeners](purista_core.EventBridgeBaseClass.md#removealllisteners)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[start](purista_core.EventBridgeBaseClass.md#start)

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:89](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L89)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[startActiveSpan](purista_core.EventBridgeBaseClass.md#startactivespan)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:311](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L311)

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

#### Defined in

[base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts:336](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/HttpEventBridge.impl.ts#L336)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[wrapInSpan](purista_core.EventBridgeBaseClass.md#wrapinspan)

#### Defined in

core/dist/commonjs/core/EventBridge/EventBridgeBaseClass.impl.d.ts:49
