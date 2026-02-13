[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Service

# Class: Service\<S\>

Defined in: [core/Service/Service.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L83)

Base class for all services.
This class provides base functions to work with the event bridge, logging and so on

Every service should extend this class and should not directly access the eventbridge or other service

```typescript
class MyService extends Service {

  async start() {
    await super.start()
    // your custom implementation
  }

  async destroy() {
    // your custom implementation
   await super.destroy()
  }
}
```

## Extends

- `ServiceBaseClass`

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Implements

- [`ServiceClass`](../interfaces/ServiceClass.md)\<`S`\>

## Constructors

### Constructor

> **new Service**\<`S`\>(`config`): `Service`\<`S`\>

Defined in: [core/Service/Service.impl.ts:104](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L104)

#### Parameters

##### config

[`ServiceConstructorInput`](../type-aliases/ServiceConstructorInput.md)\<`S`\>

#### Returns

`Service`\<`S`\>

#### Overrides

`ServiceBaseClass.constructor`

## Properties

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:96](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L96)

***

### commands

> `protected` **commands**: `Map`\<`string`, [`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L91)

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/Service/Service.impl.ts:98](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L98)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`config`](../interfaces/ServiceClass.md#config)

***

### configSchema

> `protected` **configSchema**: [`Schema`](../type-aliases/Schema.md) \| `undefined`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L45)

#### Inherited from

`ServiceBaseClass.configSchema`

***

### configStore

> `protected` **configStore**: [`ConfigStore`](../interfaces/ConfigStore.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L42)

#### Inherited from

`ServiceBaseClass.configStore`

***

### eventBridge

> `protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L33)

#### Inherited from

`ServiceBaseClass.eventBridge`

***

### info

> `readonly` **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L31)

#### Inherited from

`ServiceBaseClass.info`

***

### isStarted

> **isStarted**: `boolean` = `false`

Defined in: [core/Service/Service.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L102)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L35)

#### Inherited from

`ServiceBaseClass.logger`

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/Service/Service.impl.ts:100](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L100)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`resources`](../interfaces/ServiceClass.md#resources)

***

### secretStore

> `protected` **secretStore**: [`SecretStore`](../interfaces/SecretStore.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L41)

#### Inherited from

`ServiceBaseClass.secretStore`

***

### spanProcessor

> **spanProcessor**: `SpanProcessor` \| `undefined`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L37)

#### Inherited from

`ServiceBaseClass.spanProcessor`

***

### stateStore

> `protected` **stateStore**: [`StateStore`](../interfaces/StateStore.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L43)

#### Inherited from

`ServiceBaseClass.stateStore`

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:97](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L97)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L87)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L39)

#### Inherited from

`ServiceBaseClass.traceProvider`

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [core/Service/Service.impl.ts:122](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L122)

##### Returns

`string`

***

### serviceInfo

#### Get Signature

> **get** **serviceInfo**(): [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L103)

Get service info

##### Returns

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Inherited from

`ServiceBaseClass.serviceInfo`

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:1103](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1103)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`destroy`](../interfaces/ServiceClass.md#destroy)

#### Overrides

`ServiceBaseClass.destroy`

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/types/GenericEventEmitter.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L27)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\>

#### Parameters

##### eventName

`K`

##### parameter?

[`ServiceEvents`](../type-aliases/ServiceEvents.md)\[`K`\]

#### Returns

`void`

#### Inherited from

`ServiceBaseClass.emit`

***

### executeCommand()

> **executeCommand**(`message`): `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

Defined in: [core/Service/Service.impl.ts:608](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L608)

Called when a command is received by the service

#### Parameters

##### message

`Readonly`\<[`Command`](../type-aliases/Command.md)\>

#### Returns

`Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

***

### executeSubscription()

> **executeSubscription**(`message`, `subscriptionName`): `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

Defined in: [core/Service/Service.impl.ts:847](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L847)

#### Parameters

##### message

`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

##### subscriptionName

`string`

#### Returns

`Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

***

### getContextFunctions()

> **getContextFunctions**(`logger`): [`ContextBase`](../type-aliases/ContextBase.md)

Defined in: [core/Service/Service.impl.ts:435](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L435)

Registers a new subscription for the service

#### Parameters

##### logger

[`Logger`](Logger.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getContextFunctions`](../interfaces/ServiceClass.md#getcontextfunctions)

***

### getEmitFunction()

> `protected` **getEmitFunction**\<`EmitList`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `emitList?`): \<`K`, `Payload`\>(`eventName`, `eventPayload?`, `contentType`, `contentEncoding`) => `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:357](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L357)

#### Type Parameters

##### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

#### Parameters

##### serviceTarget

`string`

##### traceId?

`string`

##### principalId?

`string`

##### tenantId?

`string`

##### emitList?

`EmitList`

#### Returns

> \<`K`, `Payload`\>(`eventName`, `eventPayload?`, `contentType?`, `contentEncoding?`): `Promise`\<`void`\>

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Payload

`Payload` = `EmitList`\[`K`\]

##### Parameters

###### eventName

`K`

###### eventPayload?

`Payload`

###### contentType?

`string` = `'application/json'`

###### contentEncoding?

`string` = `'utf-8'`

##### Returns

`Promise`\<`void`\>

***

### getInvokeFunction()

> `protected` **getInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `invokes?`): \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType`, `contentEncoding`) => `Promise`\<`any`\>

Defined in: [core/Service/Service.impl.ts:222](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L222)

#### Type Parameters

##### Invokes

`Invokes` *extends* [`InvokeList`](../type-aliases/InvokeList.md)

#### Parameters

##### serviceTarget

`string`

##### traceId?

`string`

##### principalId?

`string`

##### tenantId?

`string`

##### invokes?

`Invokes`

#### Returns

> \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType?`, `contentEncoding?`): `Promise`\<`any`\>

##### Type Parameters

###### Payload

`Payload`

###### Parameter

`Parameter` *extends* [`EmptyObject`](../type-aliases/EmptyObject.md)

##### Parameters

###### receiver

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

###### invokePayload

`Payload`

###### invokeparameter

`Parameter`

###### contentType?

`string` = `'application/json'`

###### contentEncoding?

`string` = `'utf-8'`

##### Returns

`Promise`\<`any`\>

***

### getTracer()

> **getTracer**(`name?`, `version?`): `Tracer`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:112](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L112)

Returns open telemetry tracer of this service

#### Parameters

##### name?

`string`

##### version?

`string`

#### Returns

`Tracer`

Tracer

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getTracer`](../interfaces/ServiceClass.md#gettracer)

#### Inherited from

`ServiceBaseClass.getTracer`

***

### initializeEventbridgeConnect()

> `protected` **initializeEventbridgeConnect**(`commandDefinitionList`, `subscriptions`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:168](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L168)

Connect service to event bridge to receive commands and command responses

#### Parameters

##### commandDefinitionList

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

##### subscriptions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`Promise`\<`void`\>

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L23)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

`ServiceBaseClass.off`

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L19)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

`ServiceBaseClass.on`

***

### registerCommand()

> **registerCommand**(`commandDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:803](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L803)

#### Parameters

##### commandDefinition

[`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:1052](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1052)

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`

#### Inherited from

`ServiceBaseClass.removeAllListeners`

***

### sendServiceInfo()

> `protected` **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [core/Service/Service.impl.ts:202](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L202)

Broadcast service info message

#### Parameters

##### infoType

[`InfoMessageType`](../type-aliases/InfoMessageType.md)

type of info message

##### target?

`string`

function name is need in messages like InfoServiceFunctionAdded

##### payload?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:129](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L129)

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`start`](../interfaces/ServiceClass.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:127](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L127)

Start a child span for opentelemetry tracking

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

optional context

`Context` | `undefined`

##### fn

(`span`) => `Promise`\<`F`\>

function to be executed within the span

#### Returns

`Promise`\<`F`\>

return value of fn

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`startActiveSpan`](../interfaces/ServiceClass.md#startactivespan)

#### Inherited from

`ServiceBaseClass.startActiveSpan`

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:177](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L177)

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### fn

(`span`) => `Promise`\<`F`\>

function te be executed in the span

##### context?

`Context`

span context

#### Returns

`Promise`\<`F`\>

return value of fn

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`wrapInSpan`](../interfaces/ServiceClass.md#wrapinspan)

#### Inherited from

`ServiceBaseClass.wrapInSpan`
