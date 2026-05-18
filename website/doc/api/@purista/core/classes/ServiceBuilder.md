[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceBuilder

# Class: ServiceBuilder\<S\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L82)

This class is used to build a service.

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md) = [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)

## Constructors

### Constructor

> **new ServiceBuilder**\<`S`\>(`info`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:111](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L111)

#### Parameters

##### info

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Returns

`ServiceBuilder`\<`S`\>

## Properties

### info

> **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:111](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L111)

***

### SClass

> **SClass**: [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\> = `Service`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:108](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L108)

## Methods

### addCommandDefinition()

> **addCommandDefinition**(...`commands`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:139](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L139)

#### Parameters

##### commands

...[`CommandDefinitionList`](../type-aliases/CommandDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addQueueDefinition()

> **addQueueDefinition**(...`queues`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:172](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L172)

#### Parameters

##### queues

...[`QueueDefinitionList`](../type-aliases/QueueDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addQueueWorkerDefinition()

> **addQueueWorkerDefinition**(...`workers`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:183](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L183)

#### Parameters

##### workers

...[`QueueWorkerDefinitionList`](../type-aliases/QueueWorkerDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addScheduleDefinition()

> **addScheduleDefinition**(...`schedules`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:194](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L194)

#### Parameters

##### schedules

...[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]

#### Returns

`ServiceBuilder`\<`S`\>

***

### addStreamDefinition()

> **addStreamDefinition**(...`streams`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:161](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L161)

#### Parameters

##### streams

...[`StreamDefinitionList`](../type-aliases/StreamDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addSubscriptionDefinition()

> **addSubscriptionDefinition**(...`subscription`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:150](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L150)

#### Parameters

##### subscription

...[`SubscriptionDefinitionList`](../type-aliases/SubscriptionDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### bindEventToQueue()

> **bindEventToQueue**(`eventName`, `queueName`, `options?`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:215](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L215)

Bind a custom event to a durable queue job through a generated bounded subscription.

#### Parameters

##### eventName

`string`

##### queueName

`string`

##### options?

`Omit`\<[`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md), `"eventName"` \| `"queueName"` \| `"idempotencyMode"`\> & `object` = `{}`

#### Returns

`ServiceBuilder`\<`S`\>

#### Example

```ts
service.bindEventToQueue('billing.monthlyCycleDue', 'billing.monthlyClosing', {
  idempotencyKey: event => `billing-cycle:${event.cycleId}`,
})
```

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourcesType`\>(): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:281](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L281)

#### Type Parameters

##### ResourceName

`ResourceName` *extends* `string`

##### ResourcesType

`ResourcesType`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

***

### getCommandBuilder()

> **getCommandBuilder**\<`T`, `N`\>(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:378](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L378)

#### Type Parameters

##### T

`T` *extends* `string`

##### N

`N` *extends* `string`

#### Parameters

##### commandName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

##### eventName?

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

#### Returns

[`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

***

### getCommandDefinitions()

> **getCommandDefinitions**(): [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:459](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L459)

#### Returns

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getCustomClass()

> **getCustomClass**(): [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:295](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L295)

#### Returns

[`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

***

### getEventToQueueBindings()

> **getEventToQueueBindings**(): [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:531](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L531)

#### Returns

[`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]

***

### getFullServiceDefinition()

> **getFullServiceDefinition**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:628](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L628)

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:299](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L299)

#### Parameters

##### eventBridge

[`EventBridge`](../interfaces/EventBridge.md)

##### options?

\{ \[K in string \| number \| symbol\]: (\{ configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; queueBridge?: QueueBridge; queueJobStore?: QueueJobStore; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof S\["Resources"\] extends never ? \{ resources?: undefined \} : \{ resources: S\["Resources"\] \}) & (keyof S\["ConfigInputType"\] extends never ? \{ serviceConfig?: undefined \} : \{ serviceConfig?: S\["ConfigInputType"\] \}))\[K\] \}

#### Returns

`Promise`\<`S`\[`"ServiceClassType"`\]\>

***

### getQueueBuilder()

> **getQueueBuilder**\<`T`\>(`queueName`, `description`): [`QueueDefinitionBuilder`](QueueDefinitionBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:489](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L489)

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### queueName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

#### Returns

[`QueueDefinitionBuilder`](QueueDefinitionBuilder.md)

***

### getQueueDefinitions()

> **getQueueDefinitions**(): [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:501](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L501)

#### Returns

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getQueueWorkerBuilder()

> **getQueueWorkerBuilder**\<`T`\>(`queueName`, `workerName`): [`QueueWorkerBuilder`](QueueWorkerBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:493](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L493)

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### queueName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### workerName

`string`

#### Returns

[`QueueWorkerBuilder`](QueueWorkerBuilder.md)

***

### getQueueWorkerDefinitions()

> **getQueueWorkerDefinitions**(): [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:511](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L511)

#### Returns

[`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getScheduleBuilder()

> **getScheduleBuilder**\<`T`\>(`scheduleName`, `description`): [`ScheduleDefinitionBuilder`](ScheduleDefinitionBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:497](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L497)

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### scheduleName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

#### Returns

[`ScheduleDefinitionBuilder`](ScheduleDefinitionBuilder.md)

***

### getScheduleDefinitions()

> **getScheduleDefinitions**(): [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:521](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L521)

#### Returns

[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]

***

### getStreamBuilder()

> **getStreamBuilder**\<`T`, `N`\>(`streamName`, `description`, `finalEventName?`): [`StreamDefinitionBuilder`](StreamDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:438](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L438)

#### Type Parameters

##### T

`T` *extends* `string`

##### N

`N` *extends* `string`

#### Parameters

##### streamName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

##### finalEventName?

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

#### Returns

[`StreamDefinitionBuilder`](StreamDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

***

### getStreamDefinitions()

> **getStreamDefinitions**(): [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:479](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L479)

#### Returns

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getSubscriptionBuilder()

> **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:401](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L401)

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### subscriptionName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

##### description

`string`

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

***

### getSubscriptionDefinitions()

> **getSubscriptionDefinitions**(): [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:469](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L469)

#### Returns

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:134](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L134)

#### Returns

`ServiceBuilder`\<`S`\>

***

### resolveDefinitions()

> **resolveDefinitions**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:240](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L240)

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): `ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:113](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L113)

#### Type Parameters

##### T

`T` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`T`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

***

### setCustomClass()

> **setCustomClass**\<`T`\>(`customClass`): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:288](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L288)

#### Type Parameters

##### T

`T` *extends* [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Parameters

##### customClass

[`Newable`](../type-aliases/Newable.md)\<`T`, [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Returns

`ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

***

### setDefaultConfig()

> **setDefaultConfig**(`config`): `this`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:129](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L129)

#### Parameters

##### config

[`Complete`](../type-aliases/Complete.md)\<`S`\[`"ConfigType"`\]\>

#### Returns

`this`

***

### testServiceSetup()

> **testServiceSetup**(): `Promise`\<`boolean`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:541](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L541)

#### Returns

`Promise`\<`boolean`\>

***

### ~~validateCommandDefinitions()~~

> **validateCommandDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:641](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L641)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateCommands()

> `protected` **validateCommands**(`commandDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:553](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L553)

#### Parameters

##### commandDefinitions

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateQueues()

> `protected` **validateQueues**(`queueDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:598](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L598)

#### Parameters

##### queueDefinitions

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateQueueWorkers()

> `protected` **validateQueueWorkers**(`queueWorkers`, `queues`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:609](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L609)

#### Parameters

##### queueWorkers

[`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`any`\>

##### queues

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateStreams()

> `protected` **validateStreams**(`streamDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:587](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L587)

#### Parameters

##### streamDefinitions

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### ~~validateSubscriptionDefinitions()~~

> **validateSubscriptionDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:649](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L649)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateSubscriptions()

> `protected` **validateSubscriptions**(`subscriptionDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:575](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L575)

#### Parameters

##### subscriptionDefinitions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`void`
