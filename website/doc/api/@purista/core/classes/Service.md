[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Service

# Class: Service\<S\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L84)

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

• **S** *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Implements

- [`ServiceClass`](../interfaces/ServiceClass.md)\<`S`\>

## Constructors

### new Service()

> **new Service**\<`S`\>(`config`): [`Service`](Service.md)\<`S`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:105](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L105)

#### Parameters

##### config

[`ServiceConstructorInput`](../type-aliases/ServiceConstructorInput.md)\<`S`\>

#### Returns

[`Service`](Service.md)\<`S`\>

#### Overrides

`ServiceBaseClass.constructor`

## Properties

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:97](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L97)

***

### commands

> `protected` **commands**: `Map`\<`string`, [`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L92)

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [packages/core/src/core/Service/Service.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L99)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`config`](../interfaces/ServiceClass.md#config)

***

### configSchema

> `protected` **configSchema**: `undefined` \| `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L43)

#### Inherited from

`ServiceBaseClass.configSchema`

***

### configStore

> `protected` **configStore**: [`ConfigStore`](../interfaces/ConfigStore.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L40)

#### Inherited from

`ServiceBaseClass.configStore`

***

### eventBridge

> `protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L31)

#### Inherited from

`ServiceBaseClass.eventBridge`

***

### info

> `readonly` **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L29)

#### Inherited from

`ServiceBaseClass.info`

***

### isStarted

> **isStarted**: `boolean` = `false`

Defined in: [packages/core/src/core/Service/Service.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L103)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L33)

#### Inherited from

`ServiceBaseClass.logger`

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [packages/core/src/core/Service/Service.impl.ts:101](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L101)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`resources`](../interfaces/ServiceClass.md#resources)

***

### secretStore

> `protected` **secretStore**: [`SecretStore`](../interfaces/SecretStore.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L39)

#### Inherited from

`ServiceBaseClass.secretStore`

***

### spanProcessor

> **spanProcessor**: `undefined` \| `SpanProcessor`

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L35)

#### Inherited from

`ServiceBaseClass.spanProcessor`

***

### stateStore

> `protected` **stateStore**: [`StateStore`](../interfaces/StateStore.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L41)

#### Inherited from

`ServiceBaseClass.stateStore`

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:98](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L98)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:88](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L88)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L37)

#### Inherited from

`ServiceBaseClass.traceProvider`

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [packages/core/src/core/Service/Service.impl.ts:123](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L123)

##### Returns

`string`

***

### serviceInfo

#### Get Signature

> **get** **serviceInfo**(): [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L103)

Get service info

##### Returns

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Inherited from

`ServiceBaseClass.serviceInfo`

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:1103](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1103)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`destroy`](../interfaces/ServiceClass.md#destroy)

#### Overrides

`ServiceBaseClass.destroy`

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\>

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

> **executeCommand**(`message`): `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:609](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L609)

Called when a command is received by the service

#### Parameters

##### message

`Readonly`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`Command`](../enumerations/EBMessageType.md#command); `otp`: `string`; `payload`: \{ `parameter`: `unknown`; `payload`: `unknown`; \}; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

#### Returns

`Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

***

### executeSubscription()

> **executeSubscription**(`message`, `subscriptionName`): `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:848](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L848)

#### Parameters

##### message

`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

##### subscriptionName

`string`

#### Returns

`Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

***

### getContextFunctions()

> **getContextFunctions**(`logger`): [`ContextBase`](../type-aliases/ContextBase.md)

Defined in: [packages/core/src/core/Service/Service.impl.ts:436](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L436)

#### Parameters

##### logger

[`Logger`](Logger.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)

***

### getEmitFunction()

> `protected` **getEmitFunction**\<`EmitList`\>(`serviceTarget`, `traceId`?, `principalId`?, `tenantId`?, `emitList`?): \<`K`, `Payload`\>(`eventName`, `eventPayload`?, `contentType`, `contentEncoding`) => `Promise`\<`void`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:358](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L358)

#### Type Parameters

• **EmitList** *extends* `Record`\<`string`, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>\> = [`EmptyObject`](../type-aliases/EmptyObject.md)

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

`Function`

##### Type Parameters

• **K** *extends* `string` \| `number` \| `symbol`

• **Payload** = `EmitList`\[`K`\]

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

> `protected` **getInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId`?, `principalId`?, `tenantId`?, `invokes`?): \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType`, `contentEncoding`) => `Promise`\<`any`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:223](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L223)

#### Type Parameters

• **Invokes** *extends* [`InvokeList`](../type-aliases/InvokeList.md)

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

`Function`

##### Type Parameters

• **Payload**

• **Parameter** *extends* [`EmptyObject`](../type-aliases/EmptyObject.md)

##### Parameters

###### receiver

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

###### invokePayload

`Payload`

###### invokeparameter

`Parameter`

###### contentType

`string` = `'application/json'`

###### contentEncoding

`string` = `'utf-8'`

##### Returns

`Promise`\<`any`\>

***

### getTracer()

> **getTracer**(`name`?, `version`?): `Tracer`

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:112](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L112)

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

Defined in: [packages/core/src/core/Service/Service.impl.ts:169](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L169)

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

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\>

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

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ServiceEvents`](../type-aliases/ServiceEvents.md)\>

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

Defined in: [packages/core/src/core/Service/Service.impl.ts:804](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L804)

Registers a new command for the service

#### Parameters

##### commandDefinition

[`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

the service command definition

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`registerCommand`](../interfaces/ServiceClass.md#registercommand)

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:1052](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1052)

Registers a new subscription for the service

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

the subscription definition

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`registerSubscription`](../interfaces/ServiceClass.md#registersubscription)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

#### Returns

`void`

#### Inherited from

`ServiceBaseClass.removeAllListeners`

***

### sendServiceInfo()

> `protected` **sendServiceInfo**(`infoType`, `target`?, `payload`?): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [packages/core/src/core/Service/Service.impl.ts:203](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L203)

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

Defined in: [packages/core/src/core/Service/Service.impl.ts:130](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L130)

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`start`](../interfaces/ServiceClass.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:127](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L127)

Start a child span for opentelemetry tracking

#### Type Parameters

• **F**

#### Parameters

##### name

`string`

name of span

##### opts

`SpanOptions`

span options

##### context

optional context

`undefined` | `Context`

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

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context`?): `Promise`\<`F`\>

Defined in: [packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:177](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L177)

Start span for opentelemetry tracking on same level.
The created span will not become the "active" span within opentelemetry!

This means during logging and similar the spanId of parent span is logged.

Use wrapInSpan for marking points in flow of one bigger function,
but not to trace the program flow itself

#### Type Parameters

• **F**

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
