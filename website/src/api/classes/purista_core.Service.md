[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / Service

# Class: Service<ConfigType\>

[@purista/core](../modules/purista_core.md).Service

Base class for all services.
This class provides base functions to work with the event bridge, logging and so on

Every service should extend this class and should not directly access the eventbridge or other service

```typescript
class MyService extends Service {

  constructor(baseLogger: Logger, info: ServiceInfoType, eventBridge: EventBridge, config?: MyServiceConfig, spanProcessor?: SpanProcessor,) {
    super( baseLogger, info, eventBridge, config, spanProcessor )
    // ... initial service logic
  }
  // ... service methods, functions and logic
}
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

## Hierarchy

- [`ServiceClass`](purista_core.ServiceClass.md)<`ConfigType`\>

  ↳ **`Service`**

## Implements

- [`IServiceClass`](../interfaces/purista_core.IServiceClass.md)

## Table of contents

### Constructors

- [constructor](purista_core.Service.md#constructor)

### Properties

- [commandFunctions](purista_core.Service.md#commandfunctions)
- [commands](purista_core.Service.md#commands)
- [config](purista_core.Service.md#config)
- [eventBridge](purista_core.Service.md#eventbridge)
- [info](purista_core.Service.md#info)
- [serviceLogger](purista_core.Service.md#servicelogger)
- [spanProcessor](purista_core.Service.md#spanprocessor)
- [subscriptionList](purista_core.Service.md#subscriptionlist)
- [subscriptions](purista_core.Service.md#subscriptions)
- [traceProvider](purista_core.Service.md#traceprovider)

### Accessors

- [serviceInfo](purista_core.Service.md#serviceinfo)

### Methods

- [destroy](purista_core.Service.md#destroy)
- [emit](purista_core.Service.md#emit)
- [executeCommand](purista_core.Service.md#executecommand)
- [executeSubscription](purista_core.Service.md#executesubscription)
- [getEmitFunction](purista_core.Service.md#getemitfunction)
- [getInvokeFunction](purista_core.Service.md#getinvokefunction)
- [getTracer](purista_core.Service.md#gettracer)
- [initializeEventbridgeConnect](purista_core.Service.md#initializeeventbridgeconnect)
- [off](purista_core.Service.md#off)
- [on](purista_core.Service.md#on)
- [registerCommand](purista_core.Service.md#registercommand)
- [registerSubscription](purista_core.Service.md#registersubscription)
- [sendServiceInfo](purista_core.Service.md#sendserviceinfo)
- [start](purista_core.Service.md#start)
- [startActiveSpan](purista_core.Service.md#startactivespan)
- [wrapInSpan](purista_core.Service.md#wrapinspan)

## Constructors

### constructor

• **new Service**<`ConfigType`\>(`baseLogger`, `info`, `eventBridge`, `commandFunctions`, `subscriptionList`, `config`, `spanProcessor?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseLogger` | [`Logger`](purista_core.Logger.md) |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |
| `eventBridge` | [`EventBridge`](purista_core.EventBridge.md) |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\> |
| `subscriptionList` | [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`any`\> |
| `config` | `ConfigType` |
| `spanProcessor?` | `SpanProcessor` |

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[constructor](purista_core.ServiceClass.md#constructor)

#### Defined in

[core/src/core/Service/Service.impl.ts:60](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L60)

## Properties

### commandFunctions

• `Private` **commandFunctions**: [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:64](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L64)

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:58](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L58)

___

### config

• **config**: `ConfigType`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[config](purista_core.ServiceClass.md#config)

#### Defined in

[core/src/core/Service/Service.impl.ts:66](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L66)

___

### eventBridge

• **eventBridge**: [`EventBridge`](purista_core.EventBridge.md)

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[eventBridge](purista_core.ServiceClass.md#eventbridge)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L20)

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[info](purista_core.ServiceClass.md#info)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:18](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L18)

___

### serviceLogger

• **serviceLogger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[serviceLogger](purista_core.ServiceClass.md#servicelogger)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:22](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L22)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[spanProcessor](purista_core.ServiceClass.md#spanprocessor)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L24)

___

### subscriptionList

• `Private` **subscriptionList**: [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`any`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:65](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L65)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>\>

#### Defined in

[core/src/core/Service/Service.impl.ts:57](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L57)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[traceProvider](purista_core.ServiceClass.md#traceprovider)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L26)

## Accessors

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Implementation of

IServiceClass.serviceInfo

#### Inherited from

ServiceClass.serviceInfo

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:72](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L72)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[IServiceClass](../interfaces/purista_core.IServiceClass.md).[destroy](../interfaces/purista_core.IServiceClass.md#destroy)

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[destroy](purista_core.ServiceClass.md#destroy)

#### Defined in

[core/src/core/Service/Service.impl.ts:514](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L514)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter` | [`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[emit](purista_core.ServiceClass.md#emit)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### executeCommand

▸ `Protected` **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\> \| { `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_core.md#command)<`unknown`, `unknown`\>\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\> \| { `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[core/src/core/Service/Service.impl.ts:193](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L193)

___

### executeSubscription

▸ `Protected` **executeSubscription**(`message`, `subscriptionName`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:412](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L412)

___

### getEmitFunction

▸ `Protected` **getEmitFunction**(`serviceTarget`, `traceId`, `principalId?`): <Payload\>(`eventName`: `string`, `eventPayload?`: `Payload`) => `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId?` | `string` |

#### Returns

`fn`

▸ <`Payload`\>(`eventName`, `eventPayload?`): `Promise`<`void`\>

##### Type parameters

| Name |
| :------ |
| `Payload` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `eventPayload?` | `Payload` |

##### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:161](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L161)

___

### getInvokeFunction

▸ `Protected` **getInvokeFunction**(`serviceTarget`, `traceId`, `principalId?`): (`receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress), `eventPayload`: `unknown`, `parameter`: `unknown`) => `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceTarget` | `string` |
| `traceId` | `string` |
| `principalId?` | `string` |

#### Returns

`fn`

▸ (`receiver`, `eventPayload`, `parameter`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `eventPayload` | `unknown` |
| `parameter` | `unknown` |

##### Returns

`Promise`<`any`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:131](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L131)

___

### getTracer

▸ **getTracer**(): `Tracer`

Returns open telemetry tracer of this service

#### Returns

`Tracer`

Tracer

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[getTracer](purista_core.ServiceClass.md#gettracer)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:81](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L81)

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandFunctions`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandFunctions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:93](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L93)

___

### off

▸ **off**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[off](purista_core.ServiceClass.md#off)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L20)

___

### on

▸ **on**<`K`\>(`eventName`, `fn`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `fn` | [`EventReceiver`](../modules/purista_core.internal.md#eventreceiver)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

[ServiceClass](purista_core.ServiceClass.md).[on](purista_core.ServiceClass.md#on)

#### Defined in

[core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerCommand

▸ `Protected` **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Register a new command (function) for this service

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, `Record`<`string`, `unknown`\>, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[registerCommand](purista_core.ServiceClass.md#registercommand)

#### Defined in

[core/src/core/Service/Service.impl.ts:382](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L382)

___

### registerSubscription

▸ `Protected` **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)<[`ServiceClass`](purista_core.ServiceClass.md)<`unknown`\>, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[core/src/core/Service/Service.impl.ts:481](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L481)

___

### sendServiceInfo

▸ **sendServiceInfo**(`infoType`, `target?`, `payload?`): `Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

Broadcast service info message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `infoType` | [`InfoMessageType`](../modules/purista_core.md#infomessagetype) | type of info message |
| `target?` | `string` | function name is need in messages like InfoServiceFunctionAdded |
| `payload?` | `Record`<`string`, `unknown`\> | - |

#### Returns

`Promise`<`Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\>\>

#### Implementation of

[IServiceClass](../interfaces/purista_core.IServiceClass.md).[sendServiceInfo](../interfaces/purista_core.IServiceClass.md#sendserviceinfo)

#### Defined in

[core/src/core/Service/Service.impl.ts:120](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L120)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Implementation of

[IServiceClass](../interfaces/purista_core.IServiceClass.md).[start](../interfaces/purista_core.IServiceClass.md#start)

#### Overrides

[ServiceClass](purista_core.ServiceClass.md).[start](purista_core.ServiceClass.md#start)

#### Defined in

[core/src/core/Service/Service.impl.ts:76](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/Service.impl.ts#L76)

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

[ServiceClass](purista_core.ServiceClass.md).[startActiveSpan](purista_core.ServiceClass.md#startactivespan)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:93](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L93)

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

[ServiceClass](purista_core.ServiceClass.md).[wrapInSpan](purista_core.ServiceClass.md#wrapinspan)

#### Defined in

[core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:142](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L142)
