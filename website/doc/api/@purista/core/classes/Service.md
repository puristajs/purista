[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Service

# Class: Service\<S\>

Defined in: [core/Service/Service.impl.ts:145](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L145)

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

## Extended by

- [`HonoServiceClass`](../../hono-http-server/classes/HonoServiceClass.md)

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Implements

- [`ServiceClass`](../interfaces/ServiceClass.md)\<`S`\>

## Constructors

### Constructor

> **new Service**\<`S`\>(`config`): `Service`\<`S`\>

Defined in: [core/Service/Service.impl.ts:191](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L191)

#### Parameters

##### config

[`ServiceConstructorInput`](../type-aliases/ServiceConstructorInput.md)\<`S`\>

#### Returns

`Service`\<`S`\>

#### Overrides

`ServiceBaseClass.constructor`

## Properties

### activeStreamSessions

> `protected` **activeStreamSessions**: `Map`\<`string`, \{ `cancelled`: `boolean`; `cancelReason?`: `string`; `onCancel`: (`reason?`) => `void`[]; \}\>

Defined in: [core/Service/Service.impl.ts:163](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L163)

***

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:182](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L182)

***

### commands

> `protected` **commands**: `Map`\<`string`, [`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:153](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L153)

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/Service/Service.impl.ts:185](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L185)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`config`](../interfaces/ServiceClass.md#config)

***

### configSchema

> `protected` **configSchema**: [`Schema`](../type-aliases/Schema.md) \| `undefined`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L43)

#### Inherited from

`ServiceBaseClass.configSchema`

***

### configStore

> `protected` **configStore**: [`ConfigStore`](../interfaces/ConfigStore.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L40)

#### Inherited from

`ServiceBaseClass.configStore`

***

### eventBridge

> `protected` **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L31)

#### Inherited from

`ServiceBaseClass.eventBridge`

***

### info

> `readonly` **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L29)

#### Inherited from

`ServiceBaseClass.info`

***

### isStarted

> **isStarted**: `boolean` = `false`

Defined in: [core/Service/Service.impl.ts:189](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L189)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L33)

#### Inherited from

`ServiceBaseClass.logger`

***

### queueDefinitionList

> `protected` **queueDefinitionList**: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:161](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L161)

***

### queueWorkerDefinitionList

> `protected` **queueWorkerDefinitionList**: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:162](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L162)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/Service/Service.impl.ts:187](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L187)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`resources`](../interfaces/ServiceClass.md#resources)

***

### secretStore

> `protected` **secretStore**: [`SecretStore`](../interfaces/SecretStore.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L39)

#### Inherited from

`ServiceBaseClass.secretStore`

***

### spanProcessor

> **spanProcessor**: `SpanProcessor` \| `undefined`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L35)

#### Inherited from

`ServiceBaseClass.spanProcessor`

***

### stateStore

> `protected` **stateStore**: [`StateStore`](../interfaces/StateStore.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L41)

#### Inherited from

`ServiceBaseClass.stateStore`

***

### streamDefinitionList

> **streamDefinitionList**: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:184](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L184)

***

### streams

> `protected` **streams**: `Map`\<`string`, [`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:157](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L157)

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L183)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:149](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L149)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L37)

#### Inherited from

`ServiceBaseClass.traceProvider`

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [core/Service/Service.impl.ts:222](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L222)

##### Returns

`string`

***

### serviceInfo

#### Get Signature

> **get** **serviceInfo**(): [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:100](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L100)

Get service info

##### Returns

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Inherited from

`ServiceBaseClass.serviceInfo`

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:3091](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L3091)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`destroy`](../interfaces/ServiceClass.md#destroy)

#### Overrides

`ServiceBaseClass.destroy`

***

### executeCommand()

> **executeCommand**(`message`): `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

Defined in: [core/Service/Service.impl.ts:1720](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1720)

Called when a command is received by the service

#### Parameters

##### message

`Readonly`\<[`Command`](../type-aliases/Command.md)\>

Command envelope to execute

#### Returns

`Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

***

### executeStream()

> **executeStream**(`message`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2475](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2475)

#### Parameters

##### message

`Readonly`\<[`StreamMessage`](../type-aliases/StreamMessage.md)\>

#### Returns

`Promise`\<`void`\>

***

### executeSubscription()

> **executeSubscription**(`message`, `subscriptionName`): `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

Defined in: [core/Service/Service.impl.ts:2744](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2744)

#### Parameters

##### message

`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

##### subscriptionName

`string`

#### Returns

`Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

***

### getConsumeStreamFunction()

> `protected` **getConsumeStreamFunction**\<`StreamInvokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `streamInvokes?`): [`OpenStreamFunction`](../type-aliases/OpenStreamFunction.md)

Defined in: [core/Service/Service.impl.ts:1355](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1355)

#### Type Parameters

##### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](../type-aliases/StreamInvokeList.md)

#### Parameters

##### serviceTarget

`string`

##### traceId?

`string`

##### principalId?

`string`

##### tenantId?

`string`

##### streamInvokes?

`StreamInvokes`

#### Returns

[`OpenStreamFunction`](../type-aliases/OpenStreamFunction.md)

***

### getContextFunctions()

> **getContextFunctions**(`logger`, `queueNamespace?`): [`ContextBase`](../type-aliases/ContextBase.md)

Defined in: [core/Service/Service.impl.ts:1545](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1545)

#### Parameters

##### logger

[`Logger`](Logger.md)

##### queueNamespace?

[`QueueContext`](../type-aliases/QueueContext.md)

#### Returns

[`ContextBase`](../type-aliases/ContextBase.md)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getContextFunctions`](../interfaces/ServiceClass.md#getcontextfunctions)

***

### getEmitFunction()

> `protected` **getEmitFunction**\<`EmitList`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `emitList?`): \<`K`, `Payload`\>(`eventName`, `eventPayload?`, `contentType`, `contentEncoding`) => `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:1467](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1467)

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

\<`K`, `Payload`\>(`eventName`, `eventPayload?`, `contentType`, `contentEncoding`) => `Promise`\<`void`\>

***

### getInFlightDiagnostics()

> **getInFlightDiagnostics**(): [`InFlightDiagnostics`](../type-aliases/InFlightDiagnostics.md)

Defined in: [core/Service/Service.impl.ts:2439](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2439)

#### Returns

[`InFlightDiagnostics`](../type-aliases/InFlightDiagnostics.md)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getInFlightDiagnostics`](../interfaces/ServiceClass.md#getinflightdiagnostics)

***

### getInvokeFunction()

> `protected` **getInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `invokes?`): \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType`, `contentEncoding`) => `Promise`\<`any`\>

Defined in: [core/Service/Service.impl.ts:353](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L353)

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

\<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType`, `contentEncoding`) => `Promise`\<`any`\>

***

### getPausedSubscriptionConsumerState()

> **getPausedSubscriptionConsumerState**(): [`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

Defined in: [core/Service/Service.impl.ts:2450](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2450)

#### Returns

[`PausedSubscriptionConsumersByRegistrationKey`](../type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getPausedSubscriptionConsumerState`](../interfaces/ServiceClass.md#getpausedsubscriptionconsumerstate)

***

### getQueueNamespace()

> `protected` **getQueueNamespace**(`queueInvokes?`, `traceId?`, `principalId?`, `tenantId?`): `object`

Defined in: [core/Service/Service.impl.ts:488](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L488)

#### Parameters

##### queueInvokes?

[`QueueInvokeList`](../type-aliases/QueueInvokeList.md)

##### traceId?

`string`

##### principalId?

`string`

##### tenantId?

`string`

#### Returns

`object`

##### enqueue

> **enqueue**: [`QueueInvokeFunction`](../type-aliases/QueueInvokeFunction.md) & [`QueueInvokeClientMap`](../type-aliases/QueueInvokeClientMap.md)\<[`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\> = `enqueueProxy`

##### scheduleAt

> **scheduleAt**: [`QueueScheduleFunction`](../type-aliases/QueueScheduleFunction.md) & [`QueueScheduleProxy`](../type-aliases/QueueScheduleProxy.md)\<[`QueueInvokeClientMap`](../type-aliases/QueueInvokeClientMap.md)\<[`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\> = `scheduleProxy`

***

### getQueueWorkerPauseState()

> **getQueueWorkerPauseState**(): [`QueueWorkerPauseStateByQueue`](../type-aliases/QueueWorkerPauseStateByQueue.md)

Defined in: [core/Service/Service.impl.ts:2446](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2446)

#### Returns

[`QueueWorkerPauseStateByQueue`](../type-aliases/QueueWorkerPauseStateByQueue.md)

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getQueueWorkerPauseState`](../interfaces/ServiceClass.md#getqueueworkerpausestate)

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

Defined in: [core/Service/Service.impl.ts:2373](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2373)

#### Returns

`Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getServiceHealth`](../interfaces/ServiceClass.md#getservicehealth)

***

### getTracer()

> **getTracer**(`name?`, `version?`): `Tracer`

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:109](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L109)

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

> `protected` **initializeEventbridgeConnect**(`commandDefinitionList`, `subscriptions`, `streams`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:271](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L271)

Connect service to event bridge to receive commands and command responses

#### Parameters

##### commandDefinitionList

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

##### subscriptions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

##### streams

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`any`\>

#### Returns

`Promise`\<`void`\>

***

### initializeQueues()

> `protected` **initializeQueues**(): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:307](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L307)

#### Returns

`Promise`\<`void`\>

***

### pauseQueueWorkers()

> **pauseQueueWorkers**(`queueName`, `reason?`): `void`

Defined in: [core/Service/Service.impl.ts:2454](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2454)

#### Parameters

##### queueName

`string`

##### reason?

`string` = `'paused_by_operator'`

#### Returns

`void`

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`pauseQueueWorkers`](../interfaces/ServiceClass.md#pausequeueworkers)

***

### registerCommand()

> **registerCommand**(`commandDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:1929](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1929)

#### Parameters

##### commandDefinition

[`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### registerStream()

> **registerStream**(`streamDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2714](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2714)

#### Parameters

##### streamDefinition

[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:3022](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L3022)

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### resumeQueueWorkers()

> **resumeQueueWorkers**(`queueName`): `void`

Defined in: [core/Service/Service.impl.ts:2461](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2461)

#### Parameters

##### queueName

`string`

#### Returns

`void`

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`resumeQueueWorkers`](../interfaces/ServiceClass.md#resumequeueworkers)

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2465](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2465)

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`resumeSubscriptionConsumer`](../interfaces/ServiceClass.md#resumesubscriptionconsumer)

***

### sendServiceInfo()

> `protected` **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`\<`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>\>

Defined in: [core/Service/Service.impl.ts:333](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L333)

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

Defined in: [core/Service/Service.impl.ts:229](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L229)

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`start`](../interfaces/ServiceClass.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:124](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L124)

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

`Context` \| `undefined`

optional context

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

### startQueueWorkers()

> `protected` **startQueueWorkers**(): `void`

Defined in: [core/Service/Service.impl.ts:1974](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1974)

#### Returns

`void`

***

### stopQueueWorkers()

> `protected` **stopQueueWorkers**(): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:1989](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1989)

#### Returns

`Promise`\<`void`\>

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:174](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L174)

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
