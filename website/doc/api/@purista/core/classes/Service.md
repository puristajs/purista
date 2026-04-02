[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Service

# Class: Service\<S\>

Defined in: [core/Service/Service.impl.ts:142](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L142)

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

- [`SandboxService`](../../ai/classes/SandboxService.md)
- [`HonoServiceClass`](../../hono-http-server/classes/HonoServiceClass.md)

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md) = [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)

## Implements

- [`ServiceClass`](../interfaces/ServiceClass.md)\<`S`\>

## Constructors

### Constructor

> **new Service**\<`S`\>(`config`): `Service`\<`S`\>

Defined in: [core/Service/Service.impl.ts:185](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L185)

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

Defined in: [core/Service/Service.impl.ts:160](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L160)

***

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:176](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L176)

***

### commands

> `protected` **commands**: `Map`\<`string`, [`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`, `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:150](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L150)

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/Service/Service.impl.ts:179](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L179)

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

Defined in: [core/Service/Service.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L183)

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L33)

#### Inherited from

`ServiceBaseClass.logger`

***

### queueDefinitionList

> `protected` **queueDefinitionList**: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:158](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L158)

***

### queueWorkerDefinitionList

> `protected` **queueWorkerDefinitionList**: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:159](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L159)

***

### resources

> **resources**: `S`\[`"Resources"`\]

Defined in: [core/Service/Service.impl.ts:181](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L181)

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

Defined in: [core/Service/Service.impl.ts:178](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L178)

***

### streams

> `protected` **streams**: `Map`\<`string`, [`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`, `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:154](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L154)

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: [core/Service/Service.impl.ts:177](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L177)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`, `any`, `any`, `any`\>\>

Defined in: [core/Service/Service.impl.ts:146](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L146)

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

Defined in: [core/Service/Service.impl.ts:210](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L210)

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

Defined in: [core/Service/Service.impl.ts:3048](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L3048)

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

Defined in: [core/Service/Service.impl.ts:1823](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1823)

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

Defined in: [core/Service/Service.impl.ts:2405](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2405)

#### Parameters

##### message

`Readonly`\<[`StreamMessage`](../type-aliases/StreamMessage.md)\>

#### Returns

`Promise`\<`void`\>

***

### executeSubscription()

> **executeSubscription**(`message`, `subscriptionName`): `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

Defined in: [core/Service/Service.impl.ts:2683](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2683)

#### Parameters

##### message

`Readonly`\<[`EBMessage`](../type-aliases/EBMessage.md)\>

##### subscriptionName

`string`

#### Returns

`Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

***

### getAgentInvokeFunction()

> `protected` **getAgentInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `agentInvokes?`): \<`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`receiver`, `payload`, `parameter`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<`InvokeResponseType`\>

Defined in: [core/Service/Service.impl.ts:476](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L476)

#### Type Parameters

##### Invokes

`Invokes` *extends* [`AgentInvokeList`](../type-aliases/AgentInvokeList.md)

#### Parameters

##### serviceTarget

`string`

##### traceId?

`string`

##### principalId?

`string`

##### tenantId?

`string`

##### agentInvokes?

`Invokes`

#### Returns

> \<`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`receiver`, `payload`, `parameter`): [`AgentInvocation`](../interfaces/AgentInvocation.md)\<`InvokeResponseType`\>

##### Type Parameters

###### InvokeResponseType

`InvokeResponseType` = \{ `history`: `any`[]; `message`: `any`; \}

###### PayloadType

`PayloadType` = \{\[`key`: `string`\]: `unknown`; `attachments`: `any`[]; `conversationId?`: `string`; `history`: `any`[]; `message`: `string`; \}

###### ParameterType

`ParameterType` = [`EmptyObject`](../type-aliases/EmptyObject.md)

##### Parameters

###### receiver

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

###### payload

`PayloadType`

###### parameter

`ParameterType`

##### Returns

[`AgentInvocation`](../interfaces/AgentInvocation.md)\<`InvokeResponseType`\>

***

### getConsumeStreamFunction()

> `protected` **getConsumeStreamFunction**\<`StreamInvokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `streamInvokes?`): [`OpenStreamFunction`](../type-aliases/OpenStreamFunction.md)

Defined in: [core/Service/Service.impl.ts:1458](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1458)

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

Defined in: [core/Service/Service.impl.ts:1648](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1648)

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

Defined in: [core/Service/Service.impl.ts:1570](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L1570)

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

### getInFlightDiagnostics()

> **getInFlightDiagnostics**(): `object`

Defined in: [core/Service/Service.impl.ts:2369](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2369)

#### Returns

`object`

##### byKind

> **byKind**: `Record`\<`"stream"` \| `"command"` \| `"subscription"` \| `"generic"`, `number`\>

##### total

> **total**: `number`

***

### getInvokeFunction()

> `protected` **getInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `invokes?`): \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType`, `contentEncoding`) => `Promise`\<`any`\>

Defined in: [core/Service/Service.impl.ts:341](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L341)

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

### getPausedSubscriptionConsumerState()

> **getPausedSubscriptionConsumerState**(): `Record`\<`string`, \{ `pausedAt`: `number`; `reason`: `string`; \}\>

Defined in: [core/Service/Service.impl.ts:2380](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2380)

#### Returns

`Record`\<`string`, \{ `pausedAt`: `number`; `reason`: `string`; \}\>

#### Implementation of

[`ServiceClass`](../interfaces/ServiceClass.md).[`getPausedSubscriptionConsumerState`](../interfaces/ServiceClass.md#getpausedsubscriptionconsumerstate)

***

### getQueueNamespace()

> `protected` **getQueueNamespace**(`queueInvokes?`, `traceId?`, `principalId?`, `tenantId?`): `object`

Defined in: [core/Service/Service.impl.ts:743](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L743)

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

> **getQueueWorkerPauseState**(): `object`

Defined in: [core/Service/Service.impl.ts:2376](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2376)

#### Returns

`object`

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../type-aliases/ServiceHealthState.md)\>

Defined in: [core/Service/Service.impl.ts:2319](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2319)

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

Defined in: [core/Service/Service.impl.ts:259](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L259)

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

Defined in: [core/Service/Service.impl.ts:295](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L295)

#### Returns

`Promise`\<`void`\>

***

### pauseQueueWorkers()

> **pauseQueueWorkers**(`queueName`, `reason?`): `void`

Defined in: [core/Service/Service.impl.ts:2384](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2384)

#### Parameters

##### queueName

`string`

##### reason?

`string` = `'paused_by_operator'`

#### Returns

`void`

***

### registerCommand()

> **registerCommand**(`commandDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2050](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2050)

#### Parameters

##### commandDefinition

[`CommandDefinition`](../type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### registerStream()

> **registerStream**(`streamDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2653](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2653)

#### Parameters

##### streamDefinition

[`StreamDefinition`](../type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`, `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2979](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2979)

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### resumeQueueWorkers()

> **resumeQueueWorkers**(`queueName`): `void`

Defined in: [core/Service/Service.impl.ts:2391](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2391)

#### Parameters

##### queueName

`string`

#### Returns

`void`

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2395](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2395)

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

Defined in: [core/Service/Service.impl.ts:321](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L321)

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

Defined in: [core/Service/Service.impl.ts:217](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L217)

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

### startQueueWorkers()

> `protected` **startQueueWorkers**(): `void`

Defined in: [core/Service/Service.impl.ts:2095](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2095)

#### Returns

`void`

***

### stopQueueWorkers()

> `protected` **stopQueueWorkers**(): `Promise`\<`void`\>

Defined in: [core/Service/Service.impl.ts:2110](https://github.com/puristajs/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L2110)

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
