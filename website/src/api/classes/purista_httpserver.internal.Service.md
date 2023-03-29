[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / Service

# Class: Service<ConfigType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).Service

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

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

## Hierarchy

- [`ServiceBaseClass`](purista_httpserver.internal.ServiceBaseClass.md)

  ↳ **`Service`**

  ↳↳ [`HttpServerClass`](purista_httpserver.internal.HttpServerClass.md)

## Implements

- [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md)<`ConfigType`\>

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.Service.md#constructor)

### Properties

- [commandDefinitionList](purista_httpserver.internal.Service.md#commanddefinitionlist)
- [commands](purista_httpserver.internal.Service.md#commands)
- [config](purista_httpserver.internal.Service.md#config)
- [configStore](purista_httpserver.internal.Service.md#configstore)
- [eventBridge](purista_httpserver.internal.Service.md#eventbridge)
- [info](purista_httpserver.internal.Service.md#info)
- [logger](purista_httpserver.internal.Service.md#logger)
- [secretStore](purista_httpserver.internal.Service.md#secretstore)
- [spanProcessor](purista_httpserver.internal.Service.md#spanprocessor)
- [stateStore](purista_httpserver.internal.Service.md#statestore)
- [subscriptionDefinitionList](purista_httpserver.internal.Service.md#subscriptiondefinitionlist)
- [subscriptions](purista_httpserver.internal.Service.md#subscriptions)
- [traceProvider](purista_httpserver.internal.Service.md#traceprovider)

### Accessors

- [name](purista_httpserver.internal.Service.md#name)
- [serviceInfo](purista_httpserver.internal.Service.md#serviceinfo)

### Methods

- [destroy](purista_httpserver.internal.Service.md#destroy)
- [emit](purista_httpserver.internal.Service.md#emit)
- [executeCommand](purista_httpserver.internal.Service.md#executecommand)
- [executeSubscription](purista_httpserver.internal.Service.md#executesubscription)
- [getContextFunctions](purista_httpserver.internal.Service.md#getcontextfunctions)
- [getEmitFunction](purista_httpserver.internal.Service.md#getemitfunction)
- [getInvokeFunction](purista_httpserver.internal.Service.md#getinvokefunction)
- [getTracer](purista_httpserver.internal.Service.md#gettracer)
- [initializeEventbridgeConnect](purista_httpserver.internal.Service.md#initializeeventbridgeconnect)
- [off](purista_httpserver.internal.Service.md#off)
- [on](purista_httpserver.internal.Service.md#on)
- [registerCommand](purista_httpserver.internal.Service.md#registercommand)
- [registerSubscription](purista_httpserver.internal.Service.md#registersubscription)
- [removeAllListeners](purista_httpserver.internal.Service.md#removealllisteners)
- [sendServiceInfo](purista_httpserver.internal.Service.md#sendserviceinfo)
- [start](purista_httpserver.internal.Service.md#start)
- [startActiveSpan](purista_httpserver.internal.Service.md#startactivespan)
- [wrapInSpan](purista_httpserver.internal.Service.md#wrapinspan)

## Constructors

### constructor

• **new Service**<`ConfigType`\>(`config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ServiceConstructorInput`](../modules/purista_httpserver.internal.md#serviceconstructorinput)<`ConfigType`\> |

#### Overrides

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[constructor](purista_httpserver.internal.ServiceBaseClass.md#constructor)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:32

## Properties

### commandDefinitionList

• **commandDefinitionList**: [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`any`\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:29

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:28

___

### config

• **config**: `ConfigType`

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[config](../interfaces/purista_httpserver.internal.ServiceClass.md#config)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:31

___

### configStore

• **configStore**: [`ConfigStore`](../interfaces/purista_httpserver.internal.ConfigStore.md)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[configStore](purista_httpserver.internal.ServiceBaseClass.md#configstore)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:24

___

### eventBridge

• **eventBridge**: [`EventBridge`](../interfaces/purista_httpserver.internal.EventBridge.md)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[eventBridge](purista_httpserver.internal.ServiceBaseClass.md#eventbridge)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:19

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[info](purista_httpserver.internal.ServiceBaseClass.md#info)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:18

___

### logger

• **logger**: [`Logger`](purista_httpserver.internal.Logger.md)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[logger](purista_httpserver.internal.ServiceBaseClass.md#logger)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:20

___

### secretStore

• **secretStore**: [`SecretStore`](../interfaces/purista_httpserver.internal.SecretStore.md)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[secretStore](purista_httpserver.internal.ServiceBaseClass.md#secretstore)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:23

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[spanProcessor](purista_httpserver.internal.ServiceBaseClass.md#spanprocessor)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:21

___

### stateStore

• **stateStore**: [`StateStore`](../interfaces/purista_httpserver.internal.StateStore.md)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[stateStore](purista_httpserver.internal.ServiceBaseClass.md#statestore)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:25

___

### subscriptionDefinitionList

• **subscriptionDefinitionList**: [`SubscriptionDefinitionList`](../modules/purista_httpserver.internal.md#subscriptiondefinitionlist)<`any`\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:30

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:27

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[traceProvider](purista_httpserver.internal.ServiceBaseClass.md#traceprovider)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:22

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:33

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Inherited from

ServiceBaseClass.serviceInfo

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:38

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Stop and destroy the current service

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[destroy](../interfaces/purista_httpserver.internal.ServiceClass.md#destroy)

#### Overrides

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[destroy](purista_httpserver.internal.ServiceBaseClass.md#destroy)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:75

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[emit](purista_httpserver.internal.ServiceBaseClass.md#emit)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:13

___

### executeCommand

▸ **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_httpserver.internal.md#command-1)\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_httpserver.internal.md#commanderrorresponse-1), ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../modules/purista_httpserver.internal.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:57

___

### executeSubscription

▸ **executeSubscription**(`message`, `subscriptionName`): `Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_httpserver.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\> |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_httpserver.internal.md#custommessage-1), ``"id"`` \| ``"timestamp"`` \| ``"instanceId"``\>\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:73

___

### getContextFunctions

▸ **getContextFunctions**(`logger`): [`ContextBase`](../modules/purista_httpserver.internal.md#contextbase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](purista_httpserver.internal.Logger.md) |

#### Returns

[`ContextBase`](../modules/purista_httpserver.internal.md#contextbase)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:50

___

### getEmitFunction

▸ `Protected` **getEmitFunction**(`serviceTarget`, `traceId`, `principalId`): <Payload\>(`eventName`: `string`, `eventPayload?`: `Payload`, `contentType?`: `string`, `contentEncoding?`: `string`) => `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId` | `undefined` \| `string` |

#### Returns

`fn`

▸ <`Payload`\>(`eventName`, `eventPayload?`, `contentType?`, `contentEncoding?`): `Promise`<`void`\>

##### Type parameters

| Name |
| :------ |
| `Payload` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `eventPayload?` | `Payload` |
| `contentType?` | `string` |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:49

___

### getInvokeFunction

▸ `Protected` **getInvokeFunction**(`serviceTarget`, `traceId`, `principalId?`): (`receiver`: [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress), `eventPayload`: `unknown`, `parameter`: `unknown`, `contentType?`: `string`, `contentEncoding?`: `string`) => `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId?` | `string` |

#### Returns

`fn`

▸ (`receiver`, `eventPayload`, `parameter`, `contentType?`, `contentEncoding?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | [`EBMessageAddress`](../modules/purista_httpserver.internal.md#ebmessageaddress) |
| `eventPayload` | `unknown` |
| `parameter` | `unknown` |
| `contentType?` | `string` |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`any`\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:48

___

### getTracer

▸ **getTracer**(`name?`, `version?`): `Tracer`

Returns open telemetry tracer of this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |
| `version?` | `string` |

#### Returns

`Tracer`

Tracer

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[getTracer](../interfaces/purista_httpserver.internal.ServiceClass.md#gettracer)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[getTracer](purista_httpserver.internal.ServiceBaseClass.md#gettracer)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:44

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandDefinitionList`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinitionList` | [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:41

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[off](purista_httpserver.internal.ServiceBaseClass.md#off)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:12

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_httpserver.internal.md#eventkey)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_httpserver.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_httpserver.internal.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[on](purista_httpserver.internal.ServiceBaseClass.md#on)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:11

___

### registerCommand

▸ **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Registers a new command for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition) | the service command definition |

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[registerCommand](../interfaces/purista_httpserver.internal.ServiceClass.md#registercommand)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:72

___

### registerSubscription

▸ **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

Registers a new subscription for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_httpserver.internal.md#subscriptiondefinition) | the subscription definition |

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[registerSubscription](../interfaces/purista_httpserver.internal.ServiceClass.md#registersubscription)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:74

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[removeAllListeners](purista_httpserver.internal.ServiceBaseClass.md#removealllisteners)

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:14

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\>\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_httpserver.internal.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `payload?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_httpserver.internal.md#ebmessage)\>\>

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:47

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[start](../interfaces/purista_httpserver.internal.ServiceClass.md#start)

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:37

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

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[startActiveSpan](../interfaces/purista_httpserver.internal.ServiceClass.md#startactivespan)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[startActiveSpan](purista_httpserver.internal.ServiceBaseClass.md#startactivespan)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:53

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

#### Implementation of

[ServiceClass](../interfaces/purista_httpserver.internal.ServiceClass.md).[wrapInSpan](../interfaces/purista_httpserver.internal.ServiceClass.md#wrapinspan)

#### Inherited from

[ServiceBaseClass](purista_httpserver.internal.ServiceBaseClass.md).[wrapInSpan](purista_httpserver.internal.ServiceBaseClass.md#wrapinspan)

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:69
