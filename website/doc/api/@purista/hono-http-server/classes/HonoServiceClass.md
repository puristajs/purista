[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/hono-http-server](../README.md) / HonoServiceClass

# Class: HonoServiceClass\<Bindings, Variables\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:104](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L104)

A service which creates a Hono server, adds the command endpoints of given services.
The webserver needs to be started programmatically, after the `.start` method.

Minimal example:

## Example

```typescript
import { serve } from '@hono/node-server'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

// create and init our eventbridge
const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your service
const pingService = await pingV1Service.getInstance(eventBridge)
await pingService.start()

const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    enableDynamicRoutes: false,
  }
})
honoService.registerService(pingService)
await honoService.start()

const _serverInstance = serve({
  fetch: honoService.app.fetch,
  port: 3000,
})

```

## Extends

- [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<[`HonoServiceV1Config`](../type-aliases/HonoServiceV1Config.md)\>\>

## Type Parameters

### Bindings

`Bindings` *extends* [`BindingsBase`](../type-aliases/BindingsBase.md) = [`BindingsBase`](../type-aliases/BindingsBase.md)

### Variables

`Variables` *extends* [`VariablesBase`](../type-aliases/VariablesBase.md) = [`VariablesBase`](../type-aliases/VariablesBase.md)

## Constructors

### Constructor

> **new HonoServiceClass**\<`Bindings`, `Variables`\>(`config`): `HonoServiceClass`\<`Bindings`, `Variables`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:123](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L123)

#### Parameters

##### config

[`ServiceConstructorInput`](../../core/type-aliases/ServiceConstructorInput.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<\{ `apiMountPath`: `string`; `autoRegisterServicesFromConfig`: `boolean`; `enableDynamicRoutes`: `boolean`; `enableHealth`: `boolean`; `healthFunction?`: `any`; `healthPath`: `string`; `logLevel`: `"error"` \| `"info"` \| `"warn"` \| `"debug"` \| `"trace"` \| `"fatal"`; `openApi?`: \{ `components?`: `any`; `enabled`: `boolean`; `externalDocs?`: \{ `description?`: `string`; `url`: `string`; \}; `info`: \{ `contact?`: \{ `email?`: `string`; `name?`: `string`; `url?`: `string`; \}; `description`: `string`; `license?`: \{ `name`: `string`; `url?`: `string`; \}; `termsOfService?`: `string`; `title`: `string`; `version`: `string`; \}; `openapi`: `string`; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\>; `security?`: `any`[]; `servers?`: `object`[]; `tags?`: `object`[]; \}; `problemDetails?`: \{ `typeBaseUri?`: `string`; \}; `protectHandler?`: `any`; `services`: [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\>[]; `streamRequestTimeoutMs`: `number`; `traceHeaderField`: `string`; \}, [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>\>

#### Returns

`HonoServiceClass`\<`Bindings`, `Variables`\>

#### Overrides

[`Service`](../../core/classes/Service.md).[`constructor`](../../core/classes/Service.md#constructor)

## Properties

### activeStreamSessions

> `protected` **activeStreamSessions**: `Map`\<`string`, \{ `cancelled`: `boolean`; `cancelReason?`: `string`; `onCancel`: (`reason?`) => `void`[]; \}\>

Defined in: core/dist/core/Service/Service.impl.d.ts:65

#### Inherited from

[`Service`](../../core/classes/Service.md).[`activeStreamSessions`](../../core/classes/Service.md#activestreamsessions)

***

### app

> **app**: `Hono`\<\{ `Bindings`: `Bindings`; `Variables`: `Variables`; \}, `BlankSchema`, `"/"`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:111](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L111)

The Hono instance

***

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`any`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:80

#### Inherited from

[`Service`](../../core/classes/Service.md).[`commandDefinitionList`](../../core/classes/Service.md#commanddefinitionlist)

***

### commands

> `protected` **commands**: `Map`\<`string`, [`CommandDefinition`](../../core/type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>\>

Defined in: core/dist/core/Service/Service.impl.d.ts:61

#### Inherited from

[`Service`](../../core/classes/Service.md).[`commands`](../../core/classes/Service.md#commands)

***

### config

> **config**: `object`

Defined in: core/dist/core/Service/Service.impl.d.ts:83

#### apiMountPath

> **apiMountPath**: `string`

#### autoRegisterServicesFromConfig

> **autoRegisterServicesFromConfig**: `boolean`

#### enableDynamicRoutes

> **enableDynamicRoutes**: `boolean`

#### enableHealth

> **enableHealth**: `boolean`

#### healthFunction?

> `optional` **healthFunction?**: `any`

#### healthPath

> **healthPath**: `string`

#### logLevel

> **logLevel**: `"error"` \| `"info"` \| `"warn"` \| `"debug"` \| `"trace"` \| `"fatal"`

#### openApi?

> `optional` **openApi?**: `object`

##### openApi.components?

> `optional` **components?**: `any`

##### openApi.enabled

> **enabled**: `boolean`

##### openApi.externalDocs?

> `optional` **externalDocs?**: `object`

##### openApi.externalDocs.description?

> `optional` **description?**: `string`

##### openApi.externalDocs.url

> **url**: `string`

##### openApi.info

> **info**: `object` = `InfoObjectSchema`

##### openApi.info.contact?

> `optional` **contact?**: `object`

##### openApi.info.contact.email?

> `optional` **email?**: `string`

##### openApi.info.contact.name?

> `optional` **name?**: `string`

##### openApi.info.contact.url?

> `optional` **url?**: `string`

##### openApi.info.description

> **description**: `string`

##### openApi.info.license?

> `optional` **license?**: `object`

##### openApi.info.license.name

> **name**: `string`

##### openApi.info.license.url?

> `optional` **url?**: `string`

##### openApi.info.termsOfService?

> `optional` **termsOfService?**: `string`

##### openApi.info.title

> **title**: `string`

##### openApi.info.version

> **version**: `string`

##### openApi.openapi

> **openapi**: `string`

##### openApi.paths?

> `optional` **paths?**: `Record`\<`string`, `Record`\<`string`, `any`\>\>

##### openApi.security?

> `optional` **security?**: `any`[]

##### openApi.servers?

> `optional` **servers?**: `object`[]

##### openApi.tags?

> `optional` **tags?**: `object`[]

#### problemDetails?

> `optional` **problemDetails?**: `object`

##### problemDetails.typeBaseUri?

> `optional` **typeBaseUri?**: `string`

#### protectHandler?

> `optional` **protectHandler?**: `any`

#### services

> **services**: [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\>[]

#### streamRequestTimeoutMs

> **streamRequestTimeoutMs**: `number`

#### traceHeaderField

> **traceHeaderField**: `string`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`config`](../../core/classes/Service.md#config)

***

### configSchema

> `protected` **configSchema**: [`Schema`](../../core/type-aliases/Schema.md) \| `undefined`

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:29

#### Inherited from

[`Service`](../../core/classes/Service.md).[`configSchema`](../../core/classes/Service.md#configschema)

***

### configStore

> `protected` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:27

#### Inherited from

[`Service`](../../core/classes/Service.md).[`configStore`](../../core/classes/Service.md#configstore)

***

### eventBridge

> `protected` **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:22

#### Inherited from

[`Service`](../../core/classes/Service.md).[`eventBridge`](../../core/classes/Service.md#eventbridge)

***

### info

> `readonly` **info**: [`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:21

#### Inherited from

[`Service`](../../core/classes/Service.md).[`info`](../../core/classes/Service.md#info)

***

### isStarted

> **isStarted**: `boolean`

Defined in: core/dist/core/Service/Service.impl.d.ts:85

#### Inherited from

[`Service`](../../core/classes/Service.md).[`isStarted`](../../core/classes/Service.md#isstarted)

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:23

#### Inherited from

[`Service`](../../core/classes/Service.md).[`logger`](../../core/classes/Service.md#logger)

***

### openApi

> **openApi**: `OpenApiBuilder`

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:116](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L116)

The OpenApiBuilder instance

***

### queueDefinitionList

> `protected` **queueDefinitionList**: [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`any`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:63

#### Inherited from

[`Service`](../../core/classes/Service.md).[`queueDefinitionList`](../../core/classes/Service.md#queuedefinitionlist)

***

### queueWorkerDefinitionList

> `protected` **queueWorkerDefinitionList**: [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`any`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:64

#### Inherited from

[`Service`](../../core/classes/Service.md).[`queueWorkerDefinitionList`](../../core/classes/Service.md#queueworkerdefinitionlist)

***

### resources

> **resources**: [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

Defined in: core/dist/core/Service/Service.impl.d.ts:84

#### Inherited from

[`Service`](../../core/classes/Service.md).[`resources`](../../core/classes/Service.md#resources)

***

### secretStore

> `protected` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:26

#### Inherited from

[`Service`](../../core/classes/Service.md).[`secretStore`](../../core/classes/Service.md#secretstore)

***

### spanProcessor

> **spanProcessor**: `SpanProcessor` \| `undefined`

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:24

#### Inherited from

[`Service`](../../core/classes/Service.md).[`spanProcessor`](../../core/classes/Service.md#spanprocessor)

***

### stateStore

> `protected` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:28

#### Inherited from

[`Service`](../../core/classes/Service.md).[`stateStore`](../../core/classes/Service.md#statestore)

***

### streamDefinitionList

> **streamDefinitionList**: [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`any`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:82

#### Inherited from

[`Service`](../../core/classes/Service.md).[`streamDefinitionList`](../../core/classes/Service.md#streamdefinitionlist)

***

### streams

> `protected` **streams**: `Map`\<`string`, [`StreamDefinition`](../../core/type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>\>

Defined in: core/dist/core/Service/Service.impl.d.ts:62

#### Inherited from

[`Service`](../../core/classes/Service.md).[`streams`](../../core/classes/Service.md#streams)

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:81

#### Inherited from

[`Service`](../../core/classes/Service.md).[`subscriptionDefinitionList`](../../core/classes/Service.md#subscriptiondefinitionlist)

***

### subscriptions

> `protected` **subscriptions**: `Map`\<`string`, [`SubscriptionDefinition`](../../core/type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>\>

Defined in: core/dist/core/Service/Service.impl.d.ts:60

#### Inherited from

[`Service`](../../core/classes/Service.md).[`subscriptions`](../../core/classes/Service.md#subscriptions)

***

### traceProvider

> **traceProvider**: `NodeTracerProvider`

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:25

#### Inherited from

[`Service`](../../core/classes/Service.md).[`traceProvider`](../../core/classes/Service.md#traceprovider)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: core/dist/core/Service/Service.impl.d.ts:87

##### Returns

`string`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`name`](../../core/classes/Service.md#name)

***

### serviceInfo

#### Get Signature

> **get** **serviceInfo**(): [`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:43

Get service info

##### Returns

[`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`serviceInfo`](../../core/classes/Service.md#serviceinfo)

## Methods

### addEndpoint()

> **addEndpoint**(`metadata`, `service`): `void`

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:375](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L375)

Adds a single service command endpoint to the Hono router

#### Parameters

##### metadata

[`CommandDefinitionMetadataBase`](../../core/type-aliases/CommandDefinitionMetadataBase.md)

Command metadata produced by the builder

##### service

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

Address of the service hosting the command

#### Returns

`void`

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:723](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L723)

Stop and destroy the current service

#### Returns

`Promise`\<`void`\>

#### Overrides

[`Service`](../../core/classes/Service.md).[`destroy`](../../core/classes/Service.md#destroy)

***

### executeCommand()

> **executeCommand**(`message`): `Promise`\<`Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}\>

Defined in: core/dist/core/Service/Service.impl.d.ts:150

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

Defined in: core/dist/core/Service/Service.impl.d.ts:205

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

Defined in: core/dist/core/Service/Service.impl.d.ts:207

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

### getConsumeStreamFunction()

> `protected` **getConsumeStreamFunction**\<`StreamInvokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `streamInvokes?`): [`OpenStreamFunction`](../../core/type-aliases/OpenStreamFunction.md)

Defined in: core/dist/core/Service/Service.impl.d.ts:142

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

Defined in: core/dist/core/Service/Service.impl.d.ts:144

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

Defined in: core/dist/core/Service/Service.impl.d.ts:143

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

\<`K`, `Payload`\>(`eventName`, `eventPayload?`, `contentType?`, `contentEncoding?`) => `Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getEmitFunction`](../../core/classes/Service.md#getemitfunction)

***

### getInFlightDiagnostics()

> **getInFlightDiagnostics**(): [`InFlightDiagnostics`](../../core/type-aliases/InFlightDiagnostics.md)

Defined in: core/dist/core/Service/Service.impl.d.ts:199

#### Returns

[`InFlightDiagnostics`](../../core/type-aliases/InFlightDiagnostics.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getInFlightDiagnostics`](../../core/classes/Service.md#getinflightdiagnostics)

***

### getInvokeFunction()

> `protected` **getInvokeFunction**\<`Invokes`\>(`serviceTarget`, `traceId?`, `principalId?`, `tenantId?`, `invokes?`): \<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType?`, `contentEncoding?`) => `Promise`\<`any`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:103

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

\<`Payload`, `Parameter`\>(`receiver`, `invokePayload`, `invokeparameter`, `contentType?`, `contentEncoding?`) => `Promise`\<`any`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getInvokeFunction`](../../core/classes/Service.md#getinvokefunction)

***

### getPausedSubscriptionConsumerState()

> **getPausedSubscriptionConsumerState**(): [`PausedSubscriptionConsumersByRegistrationKey`](../../core/type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

Defined in: core/dist/core/Service/Service.impl.d.ts:201

#### Returns

[`PausedSubscriptionConsumersByRegistrationKey`](../../core/type-aliases/PausedSubscriptionConsumersByRegistrationKey.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getPausedSubscriptionConsumerState`](../../core/classes/Service.md#getpausedsubscriptionconsumerstate)

***

### getQueueNamespace()

> `protected` **getQueueNamespace**(`queueInvokes?`, `traceId?`, `principalId?`, `tenantId?`): `object`

Defined in: core/dist/core/Service/Service.impl.d.ts:104

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

### getQueueWorkerPauseState()

> **getQueueWorkerPauseState**(): [`QueueWorkerPauseStateByQueue`](../../core/type-aliases/QueueWorkerPauseStateByQueue.md)

Defined in: core/dist/core/Service/Service.impl.d.ts:200

#### Returns

[`QueueWorkerPauseStateByQueue`](../../core/type-aliases/QueueWorkerPauseStateByQueue.md)

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getQueueWorkerPauseState`](../../core/classes/Service.md#getqueueworkerpausestate)

***

### getServiceHealth()

> **getServiceHealth**(): `Promise`\<[`ServiceHealthState`](../../core/type-aliases/ServiceHealthState.md)\>

Defined in: core/dist/core/Service/Service.impl.d.ts:198

#### Returns

`Promise`\<[`ServiceHealthState`](../../core/type-aliases/ServiceHealthState.md)\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`getServiceHealth`](../../core/classes/Service.md#getservicehealth)

***

### getTracer()

> **getTracer**(`name?`, `version?`): `Tracer`

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:49

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

Defined in: core/dist/core/Service/Service.impl.d.ts:95

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

Defined in: core/dist/core/Service/Service.impl.d.ts:96

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`initializeQueues`](../../core/classes/Service.md#initializequeues)

***

### invoke()

> **invoke**\<`T`\>(`input`, `endpoint`): `Promise`\<`T`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:642](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L642)

#### Type Parameters

##### T

`T`

#### Parameters

##### input

`Omit`\<[`Command`](../../core/type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"` \| `"sender"`\>

##### endpoint

`string`

#### Returns

`Promise`\<`T`\>

***

### openStream()

> **openStream**(`input`, `endpoint`, `timeoutMs?`): `Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`unknown`, `unknown`\>\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:657](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L657)

#### Parameters

##### input

`Omit`\<[`Command`](../../core/type-aliases/Command.md), `"id"` \| `"messageType"` \| `"timestamp"` \| `"correlationId"` \| `"sender"`\>

##### endpoint

`string`

##### timeoutMs?

`number` = `...`

#### Returns

`Promise`\<[`StreamHandle`](../../core/interfaces/StreamHandle.md)\<`unknown`, `unknown`\>\>

***

### pauseQueueWorkers()

> **pauseQueueWorkers**(`queueName`, `reason?`): `void`

Defined in: core/dist/core/Service/Service.impl.d.ts:202

#### Parameters

##### queueName

`string`

##### reason?

`string`

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`pauseQueueWorkers`](../../core/classes/Service.md#pausequeueworkers)

***

### prepareDestroy()

> **prepareDestroy**(): `object`

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:716](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L716)

Helper function to be used in gracefulShutdown.
It prevents to handle new requests during shut down.
Incoming requests are rejected with 503 Service Unavailable.

#### Returns

##### destroy

> **destroy**: () => `Promise`\<`void`\>

Set the service unavailable
The webserver will return 503 Service Unavailable

###### Returns

`Promise`\<`void`\>

##### name

> **name**: `string`

#### Example

```typescript
gracefulShutdown(logger, [
honoService.prepareDestroy(),
eventbridge,
...services,
honoService
])
```

***

### registerCommand()

> **registerCommand**(`commandDefinition`): `Promise`\<`void`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:186

#### Parameters

##### commandDefinition

[`CommandDefinition`](../../core/type-aliases/CommandDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`registerCommand`](../../core/classes/Service.md#registercommand)

***

### registerService()

> **registerService**(...`services`): `HonoServiceClass`\<`Bindings`, `Variables`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:347](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L347)

Register a service instance.
Must be called before `.start`.
Adds the endpoints of the service commands to the Hono router

#### Parameters

##### services

...`AnyService`[]

#### Returns

`HonoServiceClass`\<`Bindings`, `Variables`\>

***

### registerStream()

> **registerStream**(`streamDefinition`): `Promise`\<`void`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:206

#### Parameters

##### streamDefinition

[`StreamDefinition`](../../core/type-aliases/StreamDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`registerStream`](../../core/classes/Service.md#registerstream)

***

### registerSubscription()

> **registerSubscription**(`subscriptionDefinition`): `Promise`\<`void`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:208

#### Parameters

##### subscriptionDefinition

[`SubscriptionDefinition`](../../core/type-aliases/SubscriptionDefinition.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `any`, `any`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`registerSubscription`](../../core/classes/Service.md#registersubscription)

***

### resumeQueueWorkers()

> **resumeQueueWorkers**(`queueName`): `void`

Defined in: core/dist/core/Service/Service.impl.d.ts:203

#### Parameters

##### queueName

`string`

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`resumeQueueWorkers`](../../core/classes/Service.md#resumequeueworkers)

***

### resumeSubscriptionConsumer()

> **resumeSubscriptionConsumer**(`registrationKey`): `Promise`\<`void`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:204

#### Parameters

##### registrationKey

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`resumeSubscriptionConsumer`](../../core/classes/Service.md#resumesubscriptionconsumer)

***

### sendServiceInfo()

> `protected` **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

Defined in: core/dist/core/Service/Service.impl.d.ts:102

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

### setHealthFunction()

> **setHealthFunction**(`fn`): `HonoServiceClass`\<`Bindings`, `Variables`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:160](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L160)

Set a custom health function

#### Parameters

##### fn

[`HealthFunction`](../type-aliases/HealthFunction.md)\<`HonoServiceClass`\<`Bindings`, `Variables`\>\>

#### Returns

`HonoServiceClass`\<`Bindings`, `Variables`\>

***

### setHonoTypes()

> **setHonoTypes**\<`E`\>(): `HonoServiceClass`\<`Bindings` & `E`\[`"Bindings"`\], `Variables` & `E`\[`"Variables"`\]\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:147](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L147)

Set the Hono types for Variables and Bindings.

#### Type Parameters

##### E

`E` *extends* `object` = \{ `Bindings`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); `Variables`: [`EmptyObject`](../../core/type-aliases/EmptyObject.md); \}

#### Returns

`HonoServiceClass`\<`Bindings` & `E`\[`"Bindings"`\], `Variables` & `E`\[`"Variables"`\]\>

The service instance with propper types

***

### setProtectMiddleware()

> **setProtectMiddleware**(`fn`): `HonoServiceClass`\<`Bindings`, `Variables`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:180](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L180)

Set the middleware which will be executed on all endpoints which are marked as secured/protected.
It can also be used to enhance input information.

#### Parameters

##### fn

[`EndpointProtectMiddleware`](../type-aliases/EndpointProtectMiddleware.md)\<`HonoServiceClass`\<`Bindings`, `Variables`\>, `Bindings`, `Variables`\>

#### Returns

`HonoServiceClass`\<`Bindings`, `Variables`\>

#### Example

```typescript
honoService.setProtectHandler(async function (c, next) {
const auth = basicAuth({ username: 'user', password: 'password' })
c.set('additionalParameter', { userId: '123' })
return auth(c, next)
})
```

***

### setServiceAvailable()

> **setServiceAvailable**(): `Promise`\<`void`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:696](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L696)

Set the service available
Request will be processed.

#### Returns

`Promise`\<`void`\>

***

### setServiceUnavailable()

> **setServiceUnavailable**(): `Promise`\<`void`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:688](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L688)

Set the service unavailable
The webserver will return 503 Service Unavailable

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [hono-http-server/src/service/hono/v1/HonoServiceClass.ts:206](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts#L206)

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`Service`](../../core/classes/Service.md).[`start`](../../core/classes/Service.md#start)

***

### startActiveSpan()

> **startActiveSpan**\<`F`\>(`name`, `opts`, `context`, `fn`): `Promise`\<`F`\>

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:58

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

#### Inherited from

[`Service`](../../core/classes/Service.md).[`startActiveSpan`](../../core/classes/Service.md#startactivespan)

***

### startQueueWorkers()

> `protected` **startQueueWorkers**(): `void`

Defined in: core/dist/core/Service/Service.impl.d.ts:187

#### Returns

`void`

#### Inherited from

[`Service`](../../core/classes/Service.md).[`startQueueWorkers`](../../core/classes/Service.md#startqueueworkers)

***

### stopQueueWorkers()

> `protected` **stopQueueWorkers**(): `Promise`\<`void`\>

Defined in: core/dist/core/Service/Service.impl.d.ts:188

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../../core/classes/Service.md).[`stopQueueWorkers`](../../core/classes/Service.md#stopqueueworkers)

***

### wrapInSpan()

> **wrapInSpan**\<`F`\>(`name`, `opts`, `fn`, `context?`): `Promise`\<`F`\>

Defined in: core/dist/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:74

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
