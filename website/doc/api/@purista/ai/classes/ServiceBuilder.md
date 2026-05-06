[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / ServiceBuilder

# Class: ServiceBuilder\<S, Models\>

Defined in: [ai/src/builder/ServiceBuilder.ts:48](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/ServiceBuilder.ts#L48)

AI-enabled PURISTA service builder.

It keeps agents outside `@purista/core` by expanding every attached agent into
normal core queue, queue worker, command, and stream definitions.

## Example

```ts
const service = new ServiceBuilder(info)
const agent = await service
  .getAgentQueueBuilder('triage', 'Classify tickets')
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
  .setRunFunction(async context => ({ ok: true }))
  .getDefinition()

service.addAgentDefinition(agent)
```

## Extends

- [`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<`S`\>

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](../../core/type-aliases/ServiceBuilderTypes.md) = [`ServiceBuilderTypes`](../../core/type-aliases/ServiceBuilderTypes.md)

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](../type-aliases/AgentModelBinding.md)\> = `Record`\<`string`, `never`\>

## Constructors

### Constructor

> **new ServiceBuilder**\<`S`, `Models`\>(`info`): `ServiceBuilder`\<`S`, `Models`\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:79

#### Parameters

##### info

[`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

#### Returns

`ServiceBuilder`\<`S`, `Models`\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`constructor`](../../core/classes/ServiceBuilder.md#constructor)

## Properties

### info

> **info**: [`ServiceInfoType`](../../core/type-aliases/ServiceInfoType.md)

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:62

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`info`](../../core/classes/ServiceBuilder.md#info)

***

### SClass

> **SClass**: [`Newable`](../../core/type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:78

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`SClass`](../../core/classes/ServiceBuilder.md#sclass)

## Methods

### addAgentDefinition()

> **addAgentDefinition**\<`Definition`\>(...`definitions`): `ServiceBuilder`\<`S`, `MergeModels`\<`Models`, `ExtractAgentModels`\<`Definition`\>\>\>

Defined in: [ai/src/builder/ServiceBuilder.ts:65](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/ServiceBuilder.ts#L65)

#### Type Parameters

##### Definition

`Definition` *extends* [`AttachedAgentDefinition`](../type-aliases/AttachedAgentDefinition.md)\<`any`\>

#### Parameters

##### definitions

...`Definition`[]

#### Returns

`ServiceBuilder`\<`S`, `MergeModels`\<`Models`, `ExtractAgentModels`\<`Definition`\>\>\>

***

### addCommandDefinition()

> **addCommandDefinition**(...`commands`): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:87

#### Parameters

##### commands

...[`CommandDefinitionList`](../../core/type-aliases/CommandDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`addCommandDefinition`](../../core/classes/ServiceBuilder.md#addcommanddefinition)

***

### addQueueDefinition()

> **addQueueDefinition**(...`queues`): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:90

#### Parameters

##### queues

...[`QueueDefinitionList`](../../core/type-aliases/QueueDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`addQueueDefinition`](../../core/classes/ServiceBuilder.md#addqueuedefinition)

***

### addQueueWorkerDefinition()

> **addQueueWorkerDefinition**(...`workers`): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:91

#### Parameters

##### workers

...[`QueueWorkerDefinitionList`](../../core/type-aliases/QueueWorkerDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`addQueueWorkerDefinition`](../../core/classes/ServiceBuilder.md#addqueueworkerdefinition)

***

### addStreamDefinition()

> **addStreamDefinition**(...`streams`): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:89

#### Parameters

##### streams

...[`StreamDefinitionList`](../../core/type-aliases/StreamDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`addStreamDefinition`](../../core/classes/ServiceBuilder.md#addstreamdefinition)

***

### addSubscriptionDefinition()

> **addSubscriptionDefinition**(...`subscription`): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:88

#### Parameters

##### subscription

...[`SubscriptionDefinitionList`](../../core/type-aliases/SubscriptionDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`addSubscriptionDefinition`](../../core/classes/ServiceBuilder.md#addsubscriptiondefinition)

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourcesType`\>(): [`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:99

#### Type Parameters

##### ResourceName

`ResourceName` *extends* `string`

##### ResourcesType

`ResourcesType`

#### Returns

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`defineResource`](../../core/classes/ServiceBuilder.md#defineresource)

***

### getAgentQueueBuilder()

> **getAgentQueueBuilder**\<`AgentName`\>(`agentName`, `description`): [`AgentQueueBuilder`](AgentQueueBuilder.md)\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<[`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), `S`\[`"Resources"`\] *extends* `Record`\<`string`, `unknown`\> ? `any`\[`any`\] : `Record`\<`string`, `never`\>\>\>

Defined in: [ai/src/builder/ServiceBuilder.ts:54](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/ServiceBuilder.ts#L54)

#### Type Parameters

##### AgentName

`AgentName` *extends* `string`

#### Parameters

##### agentName

`AgentName`

##### description

`string`

#### Returns

[`AgentQueueBuilder`](AgentQueueBuilder.md)\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<[`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), `S`\[`"Resources"`\] *extends* `Record`\<`string`, `unknown`\> ? `any`\[`any`\] : `Record`\<`string`, `never`\>\>\>

***

### getCommandBuilder()

> **getCommandBuilder**\<`T`, `N`\>(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](../../core/classes/CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../../core/type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:103

#### Type Parameters

##### T

`T` *extends* `string`

##### N

`N` *extends* `string`

#### Parameters

##### commandName

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

##### eventName?

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`N`\>

#### Returns

[`CommandDefinitionBuilder`](../../core/classes/CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../../core/type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getCommandBuilder`](../../core/classes/ServiceBuilder.md#getcommandbuilder)

***

### getCommandDefinitions()

> **getCommandDefinitions**(): [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:106

#### Returns

[`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getCommandDefinitions`](../../core/classes/ServiceBuilder.md#getcommanddefinitions)

***

### getCustomClass()

> **getCustomClass**(): [`Newable`](../../core/type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:101

#### Returns

[`Newable`](../../core/type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getCustomClass`](../../core/classes/ServiceBuilder.md#getcustomclass)

***

### getFullServiceDefinition()

> **getFullServiceDefinition**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `queues`: [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:119

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `queues`: [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getFullServiceDefinition`](../../core/classes/ServiceBuilder.md#getfullservicedefinition)

***

### getInstance()

> **getInstance**(`eventBridge`, ...`args`): `Promise`\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ai/src/builder/ServiceBuilder.ts:77](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/ServiceBuilder.ts#L77)

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### args

...keyof `Models` *extends* `never` ? \[`AiServiceInstanceConfig`\<`S`, `Models`\>\] : \[`AiServiceInstanceConfig`\<`S`, `Models`\>\]

#### Returns

`Promise`\<`S`\[`"ServiceClassType"`\]\>

#### Overrides

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getInstance`](../../core/classes/ServiceBuilder.md#getinstance)

***

### getQueueBuilder()

> **getQueueBuilder**\<`T`\>(`queueName`, `description`): [`QueueDefinitionBuilder`](../../core/classes/QueueDefinitionBuilder.md)

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:109

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### queueName

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

#### Returns

[`QueueDefinitionBuilder`](../../core/classes/QueueDefinitionBuilder.md)

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getQueueBuilder`](../../core/classes/ServiceBuilder.md#getqueuebuilder)

***

### getQueueDefinitions()

> **getQueueDefinitions**(): [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:111

#### Returns

[`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getQueueDefinitions`](../../core/classes/ServiceBuilder.md#getqueuedefinitions)

***

### getQueueWorkerBuilder()

> **getQueueWorkerBuilder**\<`T`\>(`queueName`, `workerName`): [`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md)

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:110

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### queueName

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`T`\>

##### workerName

`string`

#### Returns

[`QueueWorkerBuilder`](../../core/classes/QueueWorkerBuilder.md)

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getQueueWorkerBuilder`](../../core/classes/ServiceBuilder.md#getqueueworkerbuilder)

***

### getQueueWorkerDefinitions()

> **getQueueWorkerDefinitions**(): [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:112

#### Returns

[`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getQueueWorkerDefinitions`](../../core/classes/ServiceBuilder.md#getqueueworkerdefinitions)

***

### getStreamBuilder()

> **getStreamBuilder**\<`T`, `N`\>(`streamName`, `description`, `finalEventName?`): [`StreamDefinitionBuilder`](../../core/classes/StreamDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`StreamDefinitionBuilderTypes`](../../core/type-aliases/StreamDefinitionBuilderTypes.md)\<[`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:105

#### Type Parameters

##### T

`T` *extends* `string`

##### N

`N` *extends* `string`

#### Parameters

##### streamName

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

##### finalEventName?

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`N`\>

#### Returns

[`StreamDefinitionBuilder`](../../core/classes/StreamDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`StreamDefinitionBuilderTypes`](../../core/type-aliases/StreamDefinitionBuilderTypes.md)\<[`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), [`Schema`](../../core/type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getStreamBuilder`](../../core/classes/ServiceBuilder.md#getstreambuilder)

***

### getStreamDefinitions()

> **getStreamDefinitions**(): [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:108

#### Returns

[`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getStreamDefinitions`](../../core/classes/ServiceBuilder.md#getstreamdefinitions)

***

### getSubscriptionBuilder()

> **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](../../core/classes/SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../../core/type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:104

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### subscriptionName

[`NonEmptyString`](../../core/type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

#### Returns

[`SubscriptionDefinitionBuilder`](../../core/classes/SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../../core/type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], [`InvokeList`](../../core/type-aliases/InvokeList.md), [`StreamInvokeList`](../../core/type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../../core/type-aliases/Schema.md)\>, [`QueueInvokeList`](../../core/type-aliases/QueueInvokeList.md)\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getSubscriptionBuilder`](../../core/classes/ServiceBuilder.md#getsubscriptionbuilder)

***

### getSubscriptionDefinitions()

> **getSubscriptionDefinitions**(): [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:107

#### Returns

[`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`getSubscriptionDefinitions`](../../core/classes/ServiceBuilder.md#getsubscriptiondefinitions)

***

### markAsDeprecated()

> **markAsDeprecated**(): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:86

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`markAsDeprecated`](../../core/classes/ServiceBuilder.md#markasdeprecated)

***

### resolveDefinitions()

> **resolveDefinitions**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queues`: [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `streams`: [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:92

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queues`: [`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `streams`: [`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`resolveDefinitions`](../../core/classes/ServiceBuilder.md#resolvedefinitions)

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): [`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValues`](../../core/type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../../core/type-aliases/InferIn.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\>\> : [`NeverObject`](../../core/type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`NeverObject`](../../core/type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:80

#### Type Parameters

##### T

`T` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`T`

#### Returns

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValues`](../../core/type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../../core/type-aliases/InferIn.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\>\> : [`NeverObject`](../../core/type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`NeverObject`](../../core/type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`setConfigSchema`](../../core/classes/ServiceBuilder.md#setconfigschema)

***

### setCustomClass()

> **setCustomClass**\<`T`\>(`customClass`): [`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:100

#### Type Parameters

##### T

`T` *extends* [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Parameters

##### customClass

[`Newable`](../../core/type-aliases/Newable.md)\<`T`, [`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Returns

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`setCustomClass`](../../core/classes/ServiceBuilder.md#setcustomclass)

***

### setDefaultConfig()

> **setDefaultConfig**(`config`): `this`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:85

#### Parameters

##### config

[`Complete`](../../core/type-aliases/Complete.md)\<`S`\[`"ConfigType"`\]\>

#### Returns

`this`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`setDefaultConfig`](../../core/classes/ServiceBuilder.md#setdefaultconfig)

***

### testServiceSetup()

> **testServiceSetup**(): `Promise`\<`boolean`\>

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:113

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`testServiceSetup`](../../core/classes/ServiceBuilder.md#testservicesetup)

***

### ~~validateCommandDefinitions()~~

> **validateCommandDefinitions**(): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:133

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateCommandDefinitions`](../../core/classes/ServiceBuilder.md#validatecommanddefinitions)

***

### validateCommands()

> `protected` **validateCommands**(`commandDefinitions`): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:114

#### Parameters

##### commandDefinitions

[`CommandDefinitionListResolved`](../../core/type-aliases/CommandDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateCommands`](../../core/classes/ServiceBuilder.md#validatecommands)

***

### validateQueues()

> `protected` **validateQueues**(`queueDefinitions`): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:117

#### Parameters

##### queueDefinitions

[`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateQueues`](../../core/classes/ServiceBuilder.md#validatequeues)

***

### validateQueueWorkers()

> `protected` **validateQueueWorkers**(`queueWorkers`, `queues`): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:118

#### Parameters

##### queueWorkers

[`QueueWorkerDefinitionListResolved`](../../core/type-aliases/QueueWorkerDefinitionListResolved.md)\<`any`\>

##### queues

[`QueueDefinitionListResolved`](../../core/type-aliases/QueueDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateQueueWorkers`](../../core/classes/ServiceBuilder.md#validatequeueworkers)

***

### validateStreams()

> `protected` **validateStreams**(`streamDefinitions`): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:116

#### Parameters

##### streamDefinitions

[`StreamDefinitionListResolved`](../../core/type-aliases/StreamDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateStreams`](../../core/classes/ServiceBuilder.md#validatestreams)

***

### ~~validateSubscriptionDefinitions()~~

> **validateSubscriptionDefinitions**(): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:137

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateSubscriptionDefinitions`](../../core/classes/ServiceBuilder.md#validatesubscriptiondefinitions)

***

### validateSubscriptions()

> `protected` **validateSubscriptions**(`subscriptionDefinitions`): `void`

Defined in: core/dist/esm/ServiceBuilder/ServiceBuilder.impl.d.ts:115

#### Parameters

##### subscriptionDefinitions

[`SubscriptionDefinitionListResolved`](../../core/type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

#### Inherited from

[`ServiceBuilder`](../../core/classes/ServiceBuilder.md).[`validateSubscriptions`](../../core/classes/ServiceBuilder.md#validatesubscriptions)
