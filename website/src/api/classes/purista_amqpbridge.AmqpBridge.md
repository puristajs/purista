[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / AmqpBridge

# Class: AmqpBridge

[@purista/amqpbridge](../modules/purista_amqpbridge.md).AmqpBridge

A adapter to use rabbitMQ as event bridge.

## Hierarchy

- [`EventBridgeBaseClass`](purista_amqpbridge.internal.EventBridgeBaseClass.md)<[`AmqpBridgeConfig`](../modules/purista_amqpbridge.md#amqpbridgeconfig)\>

  ↳ **`AmqpBridge`**

## Implements

- [`EventBridge`](../interfaces/purista_amqpbridge.internal.EventBridge.md)

## Table of contents

### Constructors

- [constructor](purista_amqpbridge.AmqpBridge.md#constructor)

### Properties

- [channel](purista_amqpbridge.AmqpBridge.md#channel)
- [config](purista_amqpbridge.AmqpBridge.md#config)
- [connection](purista_amqpbridge.AmqpBridge.md#connection)
- [consumerTags](purista_amqpbridge.AmqpBridge.md#consumertags)
- [defaultCommandTimeout](purista_amqpbridge.AmqpBridge.md#defaultcommandtimeout)
- [encoder](purista_amqpbridge.AmqpBridge.md#encoder)
- [encrypter](purista_amqpbridge.AmqpBridge.md#encrypter)
- [healthy](purista_amqpbridge.AmqpBridge.md#healthy)
- [instanceId](purista_amqpbridge.AmqpBridge.md#instanceid)
- [logger](purista_amqpbridge.AmqpBridge.md#logger)
- [name](purista_amqpbridge.AmqpBridge.md#name)
- [pendingInvocations](purista_amqpbridge.AmqpBridge.md#pendinginvocations)
- [ready](purista_amqpbridge.AmqpBridge.md#ready)
- [replyQueueName](purista_amqpbridge.AmqpBridge.md#replyqueuename)
- [runningSubscriptionCount](purista_amqpbridge.AmqpBridge.md#runningsubscriptioncount)
- [serviceFunctions](purista_amqpbridge.AmqpBridge.md#servicefunctions)
- [subscriptions](purista_amqpbridge.AmqpBridge.md#subscriptions)
- [traceProvider](purista_amqpbridge.AmqpBridge.md#traceprovider)

### Methods

- [decodeContent](purista_amqpbridge.AmqpBridge.md#decodecontent)
- [destroy](purista_amqpbridge.AmqpBridge.md#destroy)
- [emit](purista_amqpbridge.AmqpBridge.md#emit)
- [emitMessage](purista_amqpbridge.AmqpBridge.md#emitmessage)
- [encodeContent](purista_amqpbridge.AmqpBridge.md#encodecontent)
- [getTracer](purista_amqpbridge.AmqpBridge.md#gettracer)
- [invoke](purista_amqpbridge.AmqpBridge.md#invoke)
- [isHealthy](purista_amqpbridge.AmqpBridge.md#ishealthy)
- [isReady](purista_amqpbridge.AmqpBridge.md#isready)
- [off](purista_amqpbridge.AmqpBridge.md#off)
- [on](purista_amqpbridge.AmqpBridge.md#on)
- [registerCommand](purista_amqpbridge.AmqpBridge.md#registercommand)
- [registerSubscription](purista_amqpbridge.AmqpBridge.md#registersubscription)
- [removeAllListeners](purista_amqpbridge.AmqpBridge.md#removealllisteners)
- [start](purista_amqpbridge.AmqpBridge.md#start)
- [startActiveSpan](purista_amqpbridge.AmqpBridge.md#startactivespan)
- [unregisterCommand](purista_amqpbridge.AmqpBridge.md#unregistercommand)
- [unregisterSubscription](purista_amqpbridge.AmqpBridge.md#unregistersubscription)
- [wrapInSpan](purista_amqpbridge.AmqpBridge.md#wrapinspan)

## Constructors

### constructor

• **new AmqpBridge**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`EventBridgeConfig`](../modules/purista_amqpbridge.internal.md#eventbridgeconfig)<[`AmqpBridgeConfig`](../modules/purista_amqpbridge.md#amqpbridgeconfig)\> |

#### Overrides

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[constructor](purista_amqpbridge.internal.EventBridgeBaseClass.md#constructor)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:86](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L86)

## Properties

### channel

• `Protected` `Optional` **channel**: `Channel`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:50](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L50)

___

### config

• **config**: [`Complete`](../modules/purista_amqpbridge.internal.md#complete)<[`EventBridgeConfig`](../modules/purista_amqpbridge.internal.md#eventbridgeconfig)<[`Complete`](../modules/purista_amqpbridge.internal.md#complete)<[`AmqpBridgeConfig`](../modules/purista_amqpbridge.md#amqpbridgeconfig)\>\>\>

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[config](purista_amqpbridge.internal.EventBridgeBaseClass.md#config)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:13

___

### connection

• `Protected` `Optional` **connection**: `Connection`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:49](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L49)

___

### consumerTags

• `Protected` **consumerTags**: `string`[] = `[]`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:55](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L55)

___

### defaultCommandTimeout

• **defaultCommandTimeout**: `number`

The default time until when a command invocation automatically returns a time out error

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[defaultCommandTimeout](../interfaces/purista_amqpbridge.internal.EventBridge.md#defaultcommandtimeout)

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[defaultCommandTimeout](purista_amqpbridge.internal.EventBridgeBaseClass.md#defaultcommandtimeout)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:16

___

### encoder

• `Protected` **encoder**: [`Encoder`](../modules/purista_amqpbridge.md#encoder)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:78](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L78)

___

### encrypter

• `Protected` **encrypter**: [`Encrypter`](../modules/purista_amqpbridge.md#encrypter)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:82](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L82)

___

### healthy

• `Protected` **healthy**: `boolean` = `false`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:52](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L52)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[instanceId](purista_amqpbridge.internal.EventBridgeBaseClass.md#instanceid)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:15

___

### logger

• **logger**: [`Logger`](purista_amqpbridge.internal.Logger.md)

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[logger](purista_amqpbridge.internal.EventBridgeBaseClass.md#logger)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:11

___

### name

• **name**: `string`

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[name](../interfaces/purista_amqpbridge.internal.EventBridge.md#name)

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[name](purista_amqpbridge.internal.EventBridgeBaseClass.md#name)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:14

___

### pendingInvocations

• `Protected` **pendingInvocations**: `Map`<`string`, [`PendigInvocation`](../modules/purista_amqpbridge.internal.md#pendiginvocation)\>

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:66](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L66)

___

### ready

• `Protected` **ready**: `boolean` = `false`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:53](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L53)

___

### replyQueueName

• `Protected` `Optional` **replyQueueName**: `string`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:57](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L57)

___

### runningSubscriptionCount

• `Protected` **runningSubscriptionCount**: `number` = `0`

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:68](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L68)

___

### serviceFunctions

• `Protected` **serviceFunctions**: `Map`<`string`, { `cb`: (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)) => `Promise`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1) \| [`CommandSuccessResponse`](../modules/purista_amqpbridge.internal.md#commandsuccessresponse-1)\> ; `channel`: `Channel`  }\>

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:58](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L58)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, { `cb`: (`message`: [`CustomMessage`](../modules/purista_amqpbridge.internal.md#custommessage-1)) => `Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_amqpbridge.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\> ; `channel`: `Channel`  }\>

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:70](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L70)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[traceProvider](purista_amqpbridge.internal.EventBridgeBaseClass.md#traceprovider)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:12

## Methods

### decodeContent

▸ `Protected` **decodeContent**<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`<`T`\>

Decode buffer into given type

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Buffer` | the input buffer |
| `contentType` | `string` | the content type of buffer content |
| `contentEncoding` | `string` | the encoding type of buffer content |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:782](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L782)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Shut down event bridge as gracefully as possible

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[destroy](../interfaces/purista_amqpbridge.internal.EventBridge.md#destroy)

#### Overrides

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[destroy](purista_amqpbridge.internal.EventBridgeBaseClass.md#destroy)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:797](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L797)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`] |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[emit](purista_amqpbridge.internal.EventBridgeBaseClass.md#emit)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:13

___

### emitMessage

▸ **emitMessage**<`T`\>(`message`, `contentType?`, `contentEncoding?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

Emit a message to the eventbridge without awaiting a result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage) |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `Omit`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | `undefined` | the message |
| `contentType` | `string` | `'application/json'` | - |
| `contentEncoding` | `string` | `'utf-8'` | - |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)\>\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[emitMessage](../interfaces/purista_amqpbridge.internal.EventBridge.md#emitmessage)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:266](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L266)

___

### encodeContent

▸ `Protected` **encodeContent**<`T`\>(`input`, `contentType`, `contentEncoding`): `Promise`<`Buffer`\>

Encode given payload to buffer

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `T` |
| `contentType` | `string` |
| `contentEncoding` | `string` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:761](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L761)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[getTracer](purista_amqpbridge.internal.EventBridgeBaseClass.md#gettracer)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:23

___

### invoke

▸ **invoke**<`T`\>(`input`, `commandTimeout?`): `Promise`<`T`\>

Call a command of a service and return the result of this command

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Omit`<[`Command`](../modules/purista_amqpbridge.internal.md#command-1), ``"id"`` \| ``"messageType"`` \| ``"timestamp"`` \| ``"instanceId"`` \| ``"correlationId"``\> | a partial command message |
| `commandTimeout` | `number` | the time to live (timeout) of the invocation |

#### Returns

`Promise`<`T`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[invoke](../interfaces/purista_amqpbridge.internal.EventBridge.md#invoke)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:337](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L337)

___

### isHealthy

▸ **isHealthy**(): `Promise`<`boolean`\>

Indicates if the eventbridge is running and works correctly

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[isHealthy](../interfaces/purista_amqpbridge.internal.EventBridge.md#ishealthy)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:109](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L109)

___

### isReady

▸ **isReady**(): `Promise`<`boolean`\>

Indicates if the eventbridge has been started and is connected to underlaying message broker

#### Returns

`Promise`<`boolean`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[isReady](../interfaces/purista_amqpbridge.internal.EventBridge.md#isready)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:105](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L105)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[off](purista_amqpbridge.internal.EventBridgeBaseClass.md#off)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_amqpbridge.internal.md#eventkey)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_amqpbridge.internal.md#eventreceiver)<[`EventBridgeEvents`](../modules/purista_amqpbridge.internal.md#eventbridgeevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[on](purista_amqpbridge.internal.EventBridgeBaseClass.md#on)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`address`, `cb`, `metadata`, `eventBridgeConfig`): `Promise`<`string`\>

Register a service function and ensure that there is a queue for all incoming command requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) | The service function address |
| `cb` | (`message`: [`Command`](../modules/purista_amqpbridge.internal.md#command-1)) => `Promise`<[`CommandErrorResponse`](../modules/purista_amqpbridge.internal.md#commanderrorresponse-1) \| [`CommandSuccessResponse`](../modules/purista_amqpbridge.internal.md#commandsuccessresponse-1)\> | the function to call if a matching command message arrives |
| `metadata` | [`CommandDefinitionMetadataBase`](../modules/purista_amqpbridge.internal.md#commanddefinitionmetadatabase) | - |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](../modules/purista_amqpbridge.internal.md#definitioneventbridgeconfig) | - |

#### Returns

`Promise`<`string`\>

the id of command function queue

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[registerCommand](../interfaces/purista_amqpbridge.internal.EventBridge.md#registercommand)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:441](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L441)

___

### registerSubscription

▸ **registerSubscription**(`subscription`, `cb`): `Promise`<`string`\>

Register a new subscription

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../modules/purista_amqpbridge.internal.md#subscription) | the subscription definition |
| `cb` | (`message`: [`EBMessage`](../modules/purista_amqpbridge.internal.md#ebmessage)) => `Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_amqpbridge.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\> | the function to be called if a matching message arrives |

#### Returns

`Promise`<`string`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[registerSubscription](../interfaces/purista_amqpbridge.internal.EventBridge.md#registersubscription)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:617](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L617)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[removeAllListeners](purista_amqpbridge.internal.EventBridgeBaseClass.md#removealllisteners)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14

___

### start

▸ **start**(): `Promise`<`void`\>

Connect to RabbitMQ broker, ensure exchange, call back queue

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[start](../interfaces/purista_amqpbridge.internal.EventBridge.md#start)

#### Overrides

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[start](purista_amqpbridge.internal.EventBridgeBaseClass.md#start)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:116](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L116)

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

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[startActiveSpan](purista_amqpbridge.internal.EventBridgeBaseClass.md#startactivespan)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:32

___

### unregisterCommand

▸ **unregisterCommand**(`address`): `Promise`<`void`\>

Unregister a service command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) | The address (service name, version and command name) of the command to be de-registered |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[unregisterCommand](../interfaces/purista_amqpbridge.internal.EventBridge.md#unregistercommand)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:598](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L598)

___

### unregisterSubscription

▸ **unregisterSubscription**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_amqpbridge.internal.md#ebmessageaddress) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[EventBridge](../interfaces/purista_amqpbridge.internal.EventBridge.md).[unregisterSubscription](../interfaces/purista_amqpbridge.internal.EventBridge.md#unregistersubscription)

#### Defined in

[packages/amqpbridge/src/AmqpBridge.impl.ts:735](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/amqpbridge/src/AmqpBridge.impl.ts#L735)

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

[EventBridgeBaseClass](purista_amqpbridge.internal.EventBridgeBaseClass.md).[wrapInSpan](purista_amqpbridge.internal.EventBridgeBaseClass.md#wrapinspan)

#### Defined in

packages/core/lib/core/EventBridge/EventBridgeBaseClass.impl.d.ts:48
