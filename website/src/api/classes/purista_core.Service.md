[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / Service

# Class: Service<ConfigType\>

[@purista/core](../modules/purista_core.md).Service

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

- [`ServiceBaseClass`](purista_core.internal.ServiceBaseClass.md)

  ↳ **`Service`**

## Implements

- [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`ConfigType`\>

## Table of contents

### Constructors

- [constructor](purista_core.Service.md#constructor)

### Properties

- [commandDefinitionList](purista_core.Service.md#commanddefinitionlist)
- [commands](purista_core.Service.md#commands)
- [config](purista_core.Service.md#config)
- [configStore](purista_core.Service.md#configstore)
- [eventBridge](purista_core.Service.md#eventbridge)
- [info](purista_core.Service.md#info)
- [logger](purista_core.Service.md#logger)
- [secretStore](purista_core.Service.md#secretstore)
- [spanProcessor](purista_core.Service.md#spanprocessor)
- [stateStore](purista_core.Service.md#statestore)
- [subscriptionDefinitionList](purista_core.Service.md#subscriptiondefinitionlist)
- [subscriptions](purista_core.Service.md#subscriptions)
- [traceProvider](purista_core.Service.md#traceprovider)

### Accessors

- [name](purista_core.Service.md#name)
- [serviceInfo](purista_core.Service.md#serviceinfo)

### Methods

- [destroy](purista_core.Service.md#destroy)
- [emit](purista_core.Service.md#emit)
- [executeCommand](purista_core.Service.md#executecommand)
- [executeSubscription](purista_core.Service.md#executesubscription)
- [getContextFunctions](purista_core.Service.md#getcontextfunctions)
- [getEmitFunction](purista_core.Service.md#getemitfunction)
- [getInvokeFunction](purista_core.Service.md#getinvokefunction)
- [getTracer](purista_core.Service.md#gettracer)
- [initializeEventbridgeConnect](purista_core.Service.md#initializeeventbridgeconnect)
- [off](purista_core.Service.md#off)
- [on](purista_core.Service.md#on)
- [registerCommand](purista_core.Service.md#registercommand)
- [registerSubscription](purista_core.Service.md#registersubscription)
- [removeAllListeners](purista_core.Service.md#removealllisteners)
- [sendServiceInfo](purista_core.Service.md#sendserviceinfo)
- [start](purista_core.Service.md#start)
- [startActiveSpan](purista_core.Service.md#startactivespan)
- [wrapInSpan](purista_core.Service.md#wrapinspan)

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
| `config` | [`ServiceConstructorInput`](../modules/purista_core.md#serviceconstructorinput)<`ConfigType`\> |

#### Overrides

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[constructor](purista_core.internal.ServiceBaseClass.md#constructor)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:81](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L81)

## Properties

### commandDefinitionList

• **commandDefinitionList**: [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:77](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L77)

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:75](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L75)

___

### config

• **config**: `ConfigType`

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[config](../interfaces/purista_core.ServiceClass.md#config)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:79](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L79)

___

### configStore

• **configStore**: [`ConfigStore`](../interfaces/purista_core.ConfigStore.md)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[configStore](purista_core.internal.ServiceBaseClass.md#configstore)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:35](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L35)

___

### eventBridge

• **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[eventBridge](purista_core.internal.ServiceBaseClass.md#eventbridge)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L26)

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[info](purista_core.internal.ServiceBaseClass.md#info)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L24)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[logger](purista_core.internal.ServiceBaseClass.md#logger)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:28](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L28)

___

### secretStore

• **secretStore**: [`SecretStore`](../interfaces/purista_core.SecretStore.md)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[secretStore](purista_core.internal.ServiceBaseClass.md#secretstore)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:34](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L34)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[spanProcessor](purista_core.internal.ServiceBaseClass.md#spanprocessor)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:30](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L30)

___

### stateStore

• **stateStore**: [`StateStore`](../interfaces/purista_core.StateStore.md)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[stateStore](purista_core.internal.ServiceBaseClass.md#statestore)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:36](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L36)

___

### subscriptionDefinitionList

• **subscriptionDefinitionList**: [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`any`\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:78](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L78)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:74](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L74)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[traceProvider](purista_core.internal.ServiceBaseClass.md#traceprovider)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L32)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:97](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L97)

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

ServiceBaseClass.serviceInfo

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:94](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L94)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Stop and destroy the current service

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[destroy](../interfaces/purista_core.ServiceClass.md#destroy)

#### Overrides

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[destroy](purista_core.internal.ServiceBaseClass.md#destroy)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:749](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L749)

___

### emit

▸ **emit**<`K`\>(`eventName`, `parameter?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`EventKey`](../modules/purista_core.md#eventkey)<[`ServiceEvents`](../modules/purista_core.md#serviceevents)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `parameter?` | [`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`] |

#### Returns

`void`

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[emit](purista_core.internal.ServiceBaseClass.md#emit)

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### executeCommand

▸ **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`Command`](../modules/purista_core.md#command)\> |

#### Returns

`Promise`<`Readonly`<`Omit`<[`CommandErrorResponse`](../modules/purista_core.md#commanderrorresponse), ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:414](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L414)

___

### executeSubscription

▸ **executeSubscription**(`message`, `subscriptionName`): `Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_core.md#custommessage), ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\> |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`undefined` \| `Omit`<[`CustomMessage`](../modules/purista_core.md#custommessage), ``"id"`` \| ``"instanceId"`` \| ``"timestamp"``\>\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:567](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L567)

___

### getContextFunctions

▸ **getContextFunctions**(`logger`): [`ContextBase`](../modules/purista_core.md#contextbase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](purista_core.Logger.md) |

#### Returns

[`ContextBase`](../modules/purista_core.md#contextbase)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:241](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L241)

___

### getEmitFunction

▸ `Protected` **getEmitFunction**(`serviceTarget`, `traceId`, `principalId`): <Payload\>(`eventName`: `string`, `eventPayload?`: `Payload`, `contentType`: `string`, `contentEncoding`: `string`) => `Promise`<`void`\>

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

| Name | Type | Default value |
| :------ | :------ | :------ |
| `eventName` | `string` | `undefined` |
| `eventPayload?` | `Payload` | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |

##### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:208](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L208)

___

### getInvokeFunction

▸ `Protected` **getInvokeFunction**(`serviceTarget`, `traceId`, `principalId?`): (`receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress), `eventPayload`: `unknown`, `parameter`: `unknown`, `contentType`: `string`, `contentEncoding`: `string`) => `Promise`<`any`\>

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

| Name | Type | Default value |
| :------ | :------ | :------ |
| `receiver` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | `undefined` |
| `eventPayload` | `unknown` | `undefined` |
| `parameter` | `unknown` | `undefined` |
| `contentType` | `string` | `'application/json'` |
| `contentEncoding` | `string` | `'utf-8'` |

##### Returns

`Promise`<`any`\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:174](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L174)

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

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[getTracer](../interfaces/purista_core.ServiceClass.md#gettracer)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[getTracer](purista_core.internal.ServiceBaseClass.md#gettracer)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:103](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L103)

___

### initializeEventbridgeConnect

▸ `Protected` **initializeEventbridgeConnect**(`commandDefinitionList`, `subscriptions`): `Promise`<`void`\>

Connect service to event bridge to receive commands and command responses

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandDefinitionList` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\> |
| `subscriptions` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:125](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L125)

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

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[off](purista_core.internal.ServiceBaseClass.md#off)

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[on](purista_core.internal.ServiceBaseClass.md#on)

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L16)

___

### registerCommand

▸ **registerCommand**(`commandDefinition`): `Promise`<`void`\>

Registers a new command for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition) | the service command definition |

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[registerCommand](../interfaces/purista_core.ServiceClass.md#registercommand)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:540](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L540)

___

### registerSubscription

▸ **registerSubscription**(`subscriptionDefinition`): `Promise`<`void`\>

Registers a new subscription for the service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionDefinition` | [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition) | the subscription definition |

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[registerSubscription](../interfaces/purista_core.ServiceClass.md#registersubscription)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:713](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L713)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[removeAllListeners](purista_core.internal.ServiceBaseClass.md#removealllisteners)

#### Defined in

[packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/types/GenericEventEmitter.ts#L28)

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

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:159](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L159)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[start](../interfaces/purista_core.ServiceClass.md#start)

#### Defined in

[packages/core/src/core/Service/Service.impl.ts:104](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/Service.impl.ts#L104)

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

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[startActiveSpan](../interfaces/purista_core.ServiceClass.md#startactivespan)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[startActiveSpan](purista_core.internal.ServiceBaseClass.md#startactivespan)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:118](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L118)

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

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[wrapInSpan](../interfaces/purista_core.ServiceClass.md#wrapinspan)

#### Inherited from

[ServiceBaseClass](purista_core.internal.ServiceBaseClass.md).[wrapInSpan](purista_core.internal.ServiceBaseClass.md#wrapinspan)

#### Defined in

[packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:168](https://github.com/sebastianwessel/purista/blob/dde9cc6/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L168)
