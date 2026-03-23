[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / SandboxService

# Class: SandboxService

Defined in: packages/ai/src/sandbox/service/Sandbox/v1/SandboxService.ts:11

Custom Sandbox service with startup reconciliation.

This runs once on service start and is intentionally implemented in service
lifecycle (not as subscription) because subscriptions are event-triggered.

## Extends

- [`Service`](../../core/classes/Service.md)

## Constructors

### Constructor

> **new SandboxService**(`config`): `SandboxService`

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:82

#### Parameters

##### config

[`ServiceConstructorInput`](../../core/type-aliases/ServiceConstructorInput.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\>

#### Returns

`SandboxService`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`constructor`](../../core/classes/Service.md#constructor)

## Properties

### activeStreamSessions

> `protected` **activeStreamSessions**: `Map`\<`string`, \{ `cancelled`: `boolean`; `cancelReason?`: `string`; `onCancel`: (`reason?`) => `void`[]; \}\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:65

#### Inherited from

[`Service`](../../core/classes/Service.md).[`activeStreamSessions`](../../core/classes/Service.md#activestreamsessions)

***

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`any`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:76

#### Inherited from

[`Service`](../../core/classes/Service.md).[`commandDefinitionList`](../../core/classes/Service.md#commanddefinitionlist)

***

### commands

> `protected` **commands**: `Map`\<`string`, [`CommandDefinition`](../../core/type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`, `any`, `any`, `any`\>\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:61

#### Inherited from

[`Service`](../../core/classes/Service.md).[`commands`](../../core/classes/Service.md#commands)

***

### config

> **config**: [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:79

#### Inherited from

[`Service`](../../core/classes/Service.md).[`config`](../../core/classes/Service.md#config)

***

### configSchema

> `protected` **configSchema**: [`Schema`](../../core/type-aliases/Schema.md) \| `undefined`

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:31

#### Inherited from

[`Service`](../../core/classes/Service.md).[`configSchema`](../../core/classes/Service.md#configschema)

***

### configStore

> `protected` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:29

#### Inherited from

[`Service`](../../core/classes/Service.md).[`configStore`](../../core/classes/Service.md#configstore)

***

### eventBridge

> `protected` **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:24

#### Inherited from

[`Service`](../../core/classes/Service.md).[`eventBridge`](../../core/classes/Service.md#eventbridge)

***

### info

> `readonly` **info**: [`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:23

#### Inherited from

[`Service`](../../core/classes/Service.md).[`info`](../../core/classes/Service.md#info)

***

### isStarted

> **isStarted**: `boolean`

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:81

#### Inherited from

[`Service`](../../core/classes/Service.md).[`isStarted`](../../core/classes/Service.md#isstarted)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:25

#### Inherited from

[`Service`](../../core/classes/Service.md).[`logger`](../../core/classes/Service.md#logger)

***

### queueDefinitionList

> `protected` **queueDefinitionList**: [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`any`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:63

#### Inherited from

[`Service`](../../core/classes/Service.md).[`queueDefinitionList`](../../core/classes/Service.md#queuedefinitionlist)

***

### queueWorkerDefinitionList

> `protected` **queueWorkerDefinitionList**: [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`any`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:64

#### Inherited from

[`Service`](../../core/classes/Service.md).[`queueWorkerDefinitionList`](../../core/classes/Service.md#queueworkerdefinitionlist)

***

### resources

> **resources**: [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:80

#### Inherited from

[`Service`](../../core/classes/Service.md).[`resources`](../../core/classes/Service.md#resources)

***

### secretStore

> `protected` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:28

#### Inherited from

[`Service`](../../core/classes/Service.md).[`secretStore`](../../core/classes/Service.md#secretstore)

***

### spanProcessor

> **spanProcessor**: `SpanProcessor` \| `undefined`

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:26

#### Inherited from

[`Service`](../../core/classes/Service.md).[`spanProcessor`](../../core/classes/Service.md#spanprocessor)

***

### stateStore

> `protected` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:30

#### Inherited from

[`Service`](../../core/classes/Service.md).[`stateStore`](../../core/classes/Service.md#statestore)

***

### streamDefinitionList

> **streamDefinitionList**: [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`any`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:78

#### Inherited from

[`Service`](../../core/classes/Service.md).[`streamDefinitionList`](../../core/classes/Service.md#streamdefinitionlist)

***

### streams

> `protected` **streams**: `Map`\<`string`, [`StreamDefinition`](../../core/type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`, `any`, `any`, `any`\>\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:62

#### Inherited from

[`Service`](../../core/classes/Service.md).[`streams`](../../core/classes/Service.md#streams)

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:77

#### Inherited from

[`Service`](../../core/classes/Service.md).[`subscriptionDefinitionList`](../../core/classes/Service.md#subscriptiondefinitionlist)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionDefinition`](../../core/type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`, `any`, `any`, `any`\>\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:60

#### Inherited from

[`Service`](../../core/classes/Service.md).[`subscriptions`](../../core/classes/Service.md#subscriptions)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:27

#### Inherited from

[`Service`](../../core/classes/Service.md).[`traceProvider`](../../core/classes/Service.md#traceprovider)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:83

##### Returns

`string`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`name`](../../core/classes/Service.md#name)

***

### serviceInfo

#### Get Signature

> **get** **serviceInfo**(): [`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:45

Get service info

##### Returns

[`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`serviceInfo`](../../core/classes/Service.md#serviceinfo)

## Methods

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:192

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`destroy`](../../core/classes/Service.md#destroy)

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: packages/core/dist/commonjs/core/types/GenericEventEmitter.d.ts:16

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<[`ServiceEvents`](../../core/type-aliases/ServiceEvents.md)\>

#### Parameters

##### eventName

`K`

##### parameter?

[`ServiceEvents`](../../core/type-aliases/ServiceEvents.md)\[`K`\]

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`emit`](../../core/classes/Service.md#emit)

***

### executeCommand()

> **executeCommand**(`message`): `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:140

Called when a command is received by the service

#### Parameters

##### message

`Readonly`\<[`Command`](../../core/type-aliases/Command.md)\>

Command envelope to execute

#### Returns

`Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`executeCommand`](../../core/classes/Service.md#executecommand)

***

### executeStream()

> **executeStream**(`message`): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:184

#### Parameters

##### message

`Readonly`\<[`StreamMessage`](../../core/type-aliases/StreamMessage.md)\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`executeStream`](../../core/classes/Service.md#executestream)

***

### executeSubscription()

> **executeSubscription**(`message`, `subscriptionName`): `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:186

#### Parameters

##### message

`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>

##### subscriptionName

`string`

#### Returns

`Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`executeSubscription`](../../core/classes/Service.md#executesubscription)

***

### getAgentInvokeFunction()

> `protected` **getAgentInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `agentInvokes?`): \<`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`receiver`, `payload`, `parameter`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<`InvokeResponseType`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:100

#### Type Parameters

##### Invokes

`Invokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

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

> \<`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`receiver`, `payload`, `parameter`): [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<`InvokeResponseType`\>

##### Type Parameters

###### InvokeResponseType

`InvokeResponseType` = \{ `history`: `any`[]; `message`: `any`; \}

###### PayloadType

`PayloadType` = \{\[`x`: `string`\]: `unknown`; `attachments`: `any`[]; `conversationId?`: `string`; `history`: `any`[]; `message`: `string`; \}

###### ParameterType

`ParameterType` = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

##### Parameters

###### receiver

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

###### payload

`PayloadType`

###### parameter

`ParameterType`

##### Returns

[`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<`InvokeResponseType`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getAgentInvokeFunction`](../../core/classes/Service.md#getagentinvokefunction)

***

### getConsumeStreamFunction()

> `protected` **getConsumeStreamFunction**\<`StreamInvokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `streamInvokes?`): [`OpenStreamFunction`](../../core/type-aliases/OpenStreamFunction.md)

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:132

#### Type Parameters

##### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md)

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

[`OpenStreamFunction`](../../core/type-aliases/OpenStreamFunction.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getConsumeStreamFunction`](../../core/classes/Service.md#getconsumestreamfunction)

***

### getContextFunctions()

> **getContextFunctions**(`logger`, `queueNamespace?`): [`ContextBase`](../../core/type-aliases/ContextBase.md)

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:134

#### Parameters

##### logger

[`Logger`](../../core/classes/Logger.md)

##### queueNamespace?

[`QueueContext`](../../core/type-aliases/QueueContext.md)

#### Returns

[`ContextBase`](../../core/type-aliases/ContextBase.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getContextFunctions`](../../core/classes/Service.md#getcontextfunctions)

***

### getEmitFunction()

> `protected` **getEmitFunction**\<`EmitList`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `emitList?`): \<`K`, `Payload`\>(`eventName`, `eventPayload?`, `contentType?`, `contentEncoding?`) => `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:133

#### Type Parameters

##### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

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

`string`

###### contentEncoding?

`string`

##### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getEmitFunction`](../../core/classes/Service.md#getemitfunction)

***

### getInvokeFunction()

> `protected` **getInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `invokes?`): \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType?`, `contentEncoding?`) => `Promise`\<`any`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:99

#### Type Parameters

##### Invokes

`Invokes` *extends* [`InvokeList`](../../core/type-aliases/InvokeList.md)

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

`Parameter` *extends* [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

##### Parameters

###### receiver

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

###### invokePayload

`Payload`

###### invokeparameter

`Parameter`

###### contentType?

`string`

###### contentEncoding?

`string`

##### Returns

`Promise`\<`any`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getInvokeFunction`](../../core/classes/Service.md#getinvokefunction)

***

### getQueueNamespace()

> `protected` **getQueueNamespace**(`queueInvokes?`, `traceId?`, `principalId?`, `tenantId?`): `object`

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:110

#### Parameters

##### queueInvokes?

[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)

##### traceId?

`string`

##### principalId?

`string`

##### tenantId?

`string`

#### Returns

`object`

##### enqueue

> **enqueue**: [`QueueInvokeFunction`](../../core/type-aliases/QueueInvokeFunction.md) & [`QueueInvokeClientMap`](../../core/type-aliases/QueueInvokeClientMap.md)\<[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>

##### scheduleAt

> **scheduleAt**: [`QueueScheduleFunction`](../../core/type-aliases/QueueScheduleFunction.md) & [`QueueScheduleProxy`](../../core/type-aliases/QueueScheduleProxy.md)\<[`QueueInvokeClientMap`](../../core/type-aliases/QueueInvokeClientMap.md)\<[`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getQueueNamespace`](../../core/classes/Service.md#getqueuenamespace)

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../../core/type-aliases/ServiceHealthState.md)\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:183

#### Returns

`Promise`\<[`ServiceHealthState`](../../core/type-aliases/ServiceHealthState.md)\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getServiceHealth`](../../core/classes/Service.md#getservicehealth)

***

### getTracer()

> **getTracer**(`name?`, `version?`): `Tracer`

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:51

Returns open telemetry tracer of this service

#### Parameters

##### name?

`string`

##### version?

`string`

#### Returns

`Tracer`

Tracer

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getTracer`](../../core/classes/Service.md#gettracer)

***

### initializeEventbridgeConnect()

> `protected` **initializeEventbridgeConnect**(`commandDefinitionList`, `subscriptions`, `streams`): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:91

Connect service to event bridge to receive commands and command responses

#### Parameters

##### commandDefinitionList

[`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`any`\>

##### subscriptions

[`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

##### streams

[`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`initializeEventbridgeConnect`](../../core/classes/Service.md#initializeeventbridgeconnect)

***

### initializeQueues()

> `protected` **initializeQueues**(): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:92

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`initializeQueues`](../../core/classes/Service.md#initializequeues)

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: packages/core/dist/commonjs/core/types/GenericEventEmitter.d.ts:15

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<[`ServiceEvents`](../../core/type-aliases/ServiceEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../../core/type-aliases/EventReceiver.md)\<[`ServiceEvents`](../../core/type-aliases/ServiceEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`off`](../../core/classes/Service.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: packages/core/dist/commonjs/core/types/GenericEventEmitter.d.ts:14

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../../core/type-aliases/EventKey.md)\<[`ServiceEvents`](../../core/type-aliases/ServiceEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../../core/type-aliases/EventReceiver.md)\<[`ServiceEvents`](../../core/type-aliases/ServiceEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`on`](../../core/classes/Service.md#on)

***

### registerCommand()

> **registerCommand**(`commandDefinition`): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:176

#### Parameters

##### commandDefinition

[`CommandDefinition`](../../core/type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`registerCommand`](../../core/classes/Service.md#registercommand)

***

### registerStream()

> **registerStream**(`streamDefinition`): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:185

#### Parameters

##### streamDefinition

[`StreamDefinition`](../../core/type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`, `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`registerStream`](../../core/classes/Service.md#registerstream)

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:187

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../../core/type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`registerSubscription`](../../core/classes/Service.md#registersubscription)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: packages/core/dist/commonjs/core/types/GenericEventEmitter.d.ts:17

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`removeAllListeners`](../../core/classes/Service.md#removealllisteners)

***

### sendServiceInfo()

> `protected` **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:98

Broadcast service info message

#### Parameters

##### infoType

[`InfoMessageType`](../../core/type-aliases/InfoMessageType.md)

type of info message

##### target?

`string`

function name is need in messages like InfoServiceFunctionAdded

##### payload?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`sendServiceInfo`](../../core/classes/Service.md#sendserviceinfo)

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: packages/ai/src/sandbox/service/Sandbox/v1/SandboxService.ts:16

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`Service`](../../core/classes/Service.md).[`start`](../../core/classes/Service.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:60

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

#### Inherited from

[`Service`](../../core/classes/Service.md).[`startActiveSpan`](../../core/classes/Service.md#startactivespan)

***

### startQueueWorkers()

> `protected` **startQueueWorkers**(): `void`

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:177

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`startQueueWorkers`](../../core/classes/Service.md#startqueueworkers)

***

### stopQueueWorkers()

> `protected` **stopQueueWorkers**(): `Promise`\<`void`\>

Defined in: packages/core/dist/commonjs/core/Service/Service.impl.d.ts:178

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`stopQueueWorkers`](../../core/classes/Service.md#stopqueueworkers)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: packages/core/dist/commonjs/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:76

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

#### Inherited from

[`Service`](../../core/classes/Service.md).[`wrapInSpan`](../../core/classes/Service.md#wrapinspan)
