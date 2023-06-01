[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / Service

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

- `ServiceBaseClass`

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

ServiceBaseClass.constructor

#### Defined in

[core/Service/Service.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L82)

## Properties

### commandDefinitionList

• **commandDefinitionList**: [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`any`\>

#### Defined in

[core/Service/Service.impl.ts:78](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L78)

___

### commands

• `Protected` **commands**: `Map`<`string`, [`CommandDefinition`](../modules/purista_core.md#commanddefinition)\>

#### Defined in

[core/Service/Service.impl.ts:76](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L76)

___

### config

• **config**: `ConfigType`

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[config](../interfaces/purista_core.ServiceClass.md#config)

#### Defined in

[core/Service/Service.impl.ts:80](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L80)

___

### configStore

• **configStore**: [`ConfigStore`](../interfaces/purista_core.ConfigStore.md)

#### Inherited from

ServiceBaseClass.configStore

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:35](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L35)

___

### eventBridge

• **eventBridge**: [`EventBridge`](../interfaces/purista_core.EventBridge.md)

#### Inherited from

ServiceBaseClass.eventBridge

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:26](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L26)

___

### info

• `Readonly` **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

ServiceBaseClass.info

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L24)

___

### logger

• **logger**: [`Logger`](purista_core.Logger.md)

#### Inherited from

ServiceBaseClass.logger

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L28)

___

### secretStore

• **secretStore**: [`SecretStore`](../interfaces/purista_core.SecretStore.md)

#### Inherited from

ServiceBaseClass.secretStore

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:34](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L34)

___

### spanProcessor

• **spanProcessor**: `undefined` \| `SpanProcessor`

#### Inherited from

ServiceBaseClass.spanProcessor

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:30](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L30)

___

### stateStore

• **stateStore**: [`StateStore`](../interfaces/purista_core.StateStore.md)

#### Inherited from

ServiceBaseClass.stateStore

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:36](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L36)

___

### subscriptionDefinitionList

• **subscriptionDefinitionList**: [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`any`\>

#### Defined in

[core/Service/Service.impl.ts:79](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L79)

___

### subscriptions

• `Protected` **subscriptions**: `Map`<`string`, [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)\>

#### Defined in

[core/Service/Service.impl.ts:75](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L75)

___

### traceProvider

• **traceProvider**: `NodeTracerProvider`

#### Inherited from

ServiceBaseClass.traceProvider

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:32](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L32)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[core/Service/Service.impl.ts:98](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L98)

___

### serviceInfo

• `get` **serviceInfo**(): [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

Get service info

#### Returns

[`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Inherited from

ServiceBaseClass.serviceInfo

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:94](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L94)

## Methods

### destroy

▸ **destroy**(): `Promise`<`void`\>

Stop and destroy the current service

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[destroy](../interfaces/purista_core.ServiceClass.md#destroy)

#### Overrides

ServiceBaseClass.destroy

#### Defined in

[core/Service/Service.impl.ts:760](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L760)

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

ServiceBaseClass.emit

#### Defined in

[core/types/GenericEventEmitter.ts:24](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

___

### executeCommand

▸ **executeCommand**(`message`): `Promise`<`Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: { `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: { `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

Called when a command is received by the service

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }\> |

#### Returns

`Promise`<`Readonly`<`Omit`<{ `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_core.EBMessageType.md#commanderrorresponse) ; `otp?`: `string` ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_core.StatusCode.md)  } ; `principalId?`: `string` ; `receiver`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"instanceId"``\>\> \| { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`CommandSuccessResponse`](../enums/purista_core.EBMessageType.md#commandsuccessresponse) ; `otp`: `string` ; `payload`: `unknown` ; `principalId?`: `string` ; `receiver`: { `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `sender`: { `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `timestamp`: `number` ; `traceId?`: `string`  }\>

#### Defined in

[core/Service/Service.impl.ts:422](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L422)

___

### executeSubscription

▸ **executeSubscription**(`message`, `subscriptionName`): `Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Readonly`<[`EBMessage`](../modules/purista_core.md#ebmessage)\> |
| `subscriptionName` | `string` |

#### Returns

`Promise`<`undefined` \| `Omit`<{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId?`: `string` ; `eventName`: `string` ; `id`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_core.EBMessageType.md#custommessage) ; `otp?`: `string` ; `payload?`: `unknown` ; `principalId?`: `string` ; `receiver?`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, ``"id"`` \| ``"timestamp"``\>\>

#### Defined in

[core/Service/Service.impl.ts:578](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L578)

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

[core/Service/Service.impl.ts:249](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L249)

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

[core/Service/Service.impl.ts:215](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L215)

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

[core/Service/Service.impl.ts:180](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L180)

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

ServiceBaseClass.getTracer

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:103](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L103)

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

[core/Service/Service.impl.ts:126](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L126)

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
| `fn` | `EventReceiver`<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

ServiceBaseClass.off

#### Defined in

[core/types/GenericEventEmitter.ts:20](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

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
| `fn` | `EventReceiver`<[`ServiceEvents`](../modules/purista_core.md#serviceevents)[`K`]\> |

#### Returns

`void`

#### Inherited from

ServiceBaseClass.on

#### Defined in

[core/types/GenericEventEmitter.ts:16](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

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

[core/Service/Service.impl.ts:551](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L551)

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

[core/Service/Service.impl.ts:725](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L725)

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

#### Returns

`void`

#### Inherited from

ServiceBaseClass.removeAllListeners

#### Defined in

[core/types/GenericEventEmitter.ts:28](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

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

[core/Service/Service.impl.ts:160](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L160)

___

### start

▸ **start**(): `Promise`<`void`\>

It connects to the event bridge and subscribes to the topics that are in the subscription list.

#### Returns

`Promise`<`void`\>

#### Implementation of

[ServiceClass](../interfaces/purista_core.ServiceClass.md).[start](../interfaces/purista_core.ServiceClass.md#start)

#### Defined in

[core/Service/Service.impl.ts:105](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/Service.impl.ts#L105)

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

ServiceBaseClass.startActiveSpan

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:118](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L118)

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

ServiceBaseClass.wrapInSpan

#### Defined in

[core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts:168](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/Service/ServiceBaseClass/ServiceBaseClass.impl.ts#L168)
