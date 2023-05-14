[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / HttpEventBridge

# Class: HttpEventBridge<CustomConfig\>

[@purista/core](../modules/purista_core.md).HttpEventBridge

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
| `CustomConfig` | extends [`HttpEventBridgeConfig`](../modules/purista_core.md#httpeventbridgeconfig) |

## Hierarchy

- [`EventBridgeBaseClass`](purista_core.EventBridgeBaseClass.md)<`CustomConfig`\>

  ↳ **`HttpEventBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_core.EventBridge.md)

## Table of contents

### Constructors

- [constructor](purista_core.HttpEventBridge.md#constructor)

### Properties

- [app](purista_core.HttpEventBridge.md#app)
- [client](purista_core.HttpEventBridge.md#client)
- [config](purista_core.HttpEventBridge.md#config)
- [defaultCommandTimeout](purista_core.HttpEventBridge.md#defaultcommandtimeout)
- [instanceId](purista_core.HttpEventBridge.md#instanceid)
- [isShuttingDown](purista_core.HttpEventBridge.md#isshuttingdown)
- [isStarted](purista_core.HttpEventBridge.md#isstarted)
- [logger](purista_core.HttpEventBridge.md#logger)
- [name](purista_core.HttpEventBridge.md#name)
- [server](purista_core.HttpEventBridge.md#server)
- [traceProvider](purista_core.HttpEventBridge.md#traceprovider)

### Methods

- [destroy](purista_core.HttpEventBridge.md#destroy)
- [emit](purista_core.HttpEventBridge.md#emit)
- [emitMessage](purista_core.HttpEventBridge.md#emitmessage)
- [getTracer](purista_core.HttpEventBridge.md#gettracer)
- [invoke](purista_core.HttpEventBridge.md#invoke)
- [isHealthy](purista_core.HttpEventBridge.md#ishealthy)
- [isReady](purista_core.HttpEventBridge.md#isready)
- [off](purista_core.HttpEventBridge.md#off)
- [on](purista_core.HttpEventBridge.md#on)
- [registerCommand](purista_core.HttpEventBridge.md#registercommand)
- [registerSubscription](purista_core.HttpEventBridge.md#registersubscription)
- [removeAllListeners](purista_core.HttpEventBridge.md#removealllisteners)
- [start](purista_core.HttpEventBridge.md#start)
- [startActiveSpan](purista_core.HttpEventBridge.md#startactivespan)
- [unregisterCommand](purista_core.HttpEventBridge.md#unregistercommand)
- [unregisterSubscription](purista_core.HttpEventBridge.md#unregistersubscription)
- [wrapInSpan](purista_core.HttpEventBridge.md#wrapinspan)

## Constructors

### constructor

• **new HttpEventBridge**<`CustomConfig`\>(`config`, `client`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomConfig` | extends [`HttpEventBridgeConfig`](../modules/purista_core.md#httpeventbridgeconfig) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | { [K in string \| number \| symbol]: (Object & CustomConfig)[K] } |
| `client` | [`HttpEventBridgeClient`](../interfaces/purista_core.HttpEventBridgeClient.md) |

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[constructor](purista_core.EventBridgeBaseClass.md#constructor)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:73](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L73)

## Properties

### app

• **app**: `Hono`<`Env`, {}, ``""``\>

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:67](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L67)

___

### client

• **client**: [`HttpEventBridgeClient`](../interfaces/purista_core.HttpEventBridgeClient.md)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:71](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L71)

___

### config

• **config**: [`Complete`](../modules/purista_core.md#complete)<{ [K in string \| number \| symbol]: (Object & CustomConfig)[K] }\>

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[config](purista_core.EventBridgeBaseClass.md#config)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:21](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L21)

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[defaultCommandTimeout](../interfaces/purista_core.EventBridge.md#defaultcommandtimeout)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[defaultCommandTimeout](purista_core.EventBridgeBaseClass.md#defaultcommandtimeout)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:27](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L27)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[instanceId](purista_core.EventBridgeBaseClass.md#instanceid)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:25](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L25)

___

### isShuttingDown

• **isShuttingDown**: `boolean` = `false`

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L68)

___

### isStarted

• **isStarted**: `boolean` = `false`

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L69)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[logger](purista_core.EventBridgeBaseClass.md#logger)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L18)

___

### name

• **name**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[name](../interfaces/purista_core.EventBridge.md#name)

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[name](purista_core.EventBridgeBaseClass.md#name)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:23](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L23)

___

### server

• **server**: `undefined` \| `Server`<typeof `IncomingMessage`, typeof `ServerResponse`\>

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:66](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L66)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[traceProvider](purista_core.EventBridgeBaseClass.md#traceprovider)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:19](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L19)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[destroy](../interfaces/purista_core.EventBridge.md#destroy)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[destroy](purista_core.EventBridgeBaseClass.md#destroy)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:344](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L344)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | { `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`] |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[emit](purista_core.EventBridgeBaseClass.md#emit)

#### Defined in

[core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### emitMessage

▸ **emitMessage**<`T`\>(`message`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Emit a message to the eventbridge without awaiting a result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EBMessage`](../modules/purista_core.md#ebmessage) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_core.md#ebmessage), ``"id"`` \| ``"instanceId"`` \| ``"correlationId"`` \| ``"timestamp"``\> | the message |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[emitMessage](../interfaces/purista_core.EventBridge.md#emitmessage)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:143](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L143)

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

[core/EventBridge/EventBridgeBaseClass.impl.ts:68](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L68)

___

### invoke

▸ **invoke**<`T`\>(`input`, `ttl?`): `Promise`<`T`\>

Call a command of a service and return the result of this command

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"messageType"`` \| ``"instanceId"`` \| ``"correlationId"`` \| ``"timestamp"``\> | a partial command message |
| `ttl?` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`<`T`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[invoke](../interfaces/purista_core.EventBridge.md#invoke)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:200](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L200)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isHealthy](../interfaces/purista_core.EventBridge.md#ishealthy)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:334](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L334)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[isReady](../interfaces/purista_core.EventBridge.md#isready)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:330](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L330)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[off](purista_core.EventBridgeBaseClass.md#off)

#### Defined in

[core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | `EventReceiver`<{ `eventbridge-connected`: `never` ; `eventbridge-connection-error`: `unknown` ; `eventbridge-disconnected`: `never` ; `eventbridge-error`: `unknown` ; `eventbridge-reconnecting`: `never`  }[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[on](purista_core.EventBridgeBaseClass.md#on)

#### Defined in

[core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | the address of the service command (service name, version and command name) |
| `cb` | (`message`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }) => `Promise`<`Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\> \| `Readonly`<`Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp?`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\>\> | the function to be called if a matching command arrives |
| `metadata` | `Object` | - |
| `metadata.expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"DELETE"`` \| ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } | - |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_core.md#definitioneventbridgeconfig) | - |

#### Returns

`Promise`<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerCommand](../interfaces/purista_core.EventBridge.md#registercommand)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:251](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L251)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

Register a new subscription

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_core.md#subscription) | the subscription definition |
| `cb` | (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage)) => `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\> | the function to be called if a matching message arrives |

#### Returns

`Promise`<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[registerSubscription](../interfaces/purista_core.EventBridge.md#registersubscription)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:305](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L305)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[removeAllListeners](purista_core.EventBridgeBaseClass.md#removealllisteners)

#### Defined in

[core/types/GenericEventEmitter.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

___

### start

▸ **start**(): `Promise`<`void`\>

Start the eventbridge and connect to the underlaying message broker

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[start](../interfaces/purista_core.EventBridge.md#start)

#### Overrides

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[start](purista_core.EventBridgeBaseClass.md#start)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:87](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L87)

___

### startActiveSpan

▸ **startActiveSpan**<`F`\>(`name`, `opts`, `context?`, `fn`): `Promise`<`F`\>

Start a child span for opentelemetry tracking

#### Type parameters

| Name |
| :------ |
| `F` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | name of span |
| `opts` | `SpanOptions` | `undefined` | span options |
| `context` | `undefined` \| `Context` | `undefined` | optional context |
| `fn` | (`span`: `Span`) => `Promise`<`F`\> | `undefined` | function to be executed within the span |

#### Returns

`Promise`<`F`\>

return value of fn

#### Inherited from

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[startActiveSpan](purista_core.EventBridgeBaseClass.md#startactivespan)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L80)

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`<`void`\>

Unregister a service command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | The address (service name, version and command name) of the command to be de-registered |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterCommand](../interfaces/purista_core.EventBridge.md#unregistercommand)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:301](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L301)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_core.EventBridge.md).[unregisterSubscription](../interfaces/purista_core.EventBridge.md#unregistersubscription)

#### Defined in

[HttpEventBridge/HttpEventBridge.impl.ts:326](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/HttpEventBridge.impl.ts#L326)

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

[EventBridgeBaseClass](purista_core.EventBridgeBaseClass.md).[wrapInSpan](purista_core.EventBridgeBaseClass.md#wrapinspan)

#### Defined in

[core/EventBridge/EventBridgeBaseClass.impl.ts:130](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/EventBridge/EventBridgeBaseClass.impl.ts#L130)
