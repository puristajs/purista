[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceBuilder

# Class: ServiceBuilder\<S\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L103)

This class is used to build a service.

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`\> = [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)

## Constructors

### Constructor

> **new ServiceBuilder**\<`S`\>(`info`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:135](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L135)

#### Parameters

##### info

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Returns

`ServiceBuilder`\<`S`\>

## Properties

### info

> **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:135](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L135)

***

### SClass

> **SClass**: [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\> = `Service`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:132](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L132)

## Methods

### addAgentDefinition()

> **addAgentDefinition**\<`Definition`\>(...`definitions`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:239](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L239)

Add one or more attached agent definitions to this service.

The attached agent is expanded into normal queue, queue worker, command,
and stream definitions so the rest of core can treat it like any other
declared PURISTA boundary.

#### Type Parameters

##### Definition

`Definition` *extends* [`AttachedAgentDefinition`](../type-aliases/AttachedAgentDefinition.md)\<`any`\>

#### Parameters

##### definitions

...`Definition`[]

#### Returns

`ServiceBuilder`\<`S`\>

#### Example

```ts
const triage = await service
  .getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
  .setRunFunction(async context => ({ priority: 'normal' }))
  .getDefinition()

service.addAgentDefinition(triage)
```

***

### addCommandDefinition()

> **addCommandDefinition**(...`commands`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:167](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L167)

#### Parameters

##### commands

...[`CommandDefinitionList`](../type-aliases/CommandDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addQueueDefinition()

> **addQueueDefinition**(...`queues`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:200](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L200)

#### Parameters

##### queues

...[`QueueDefinitionList`](../type-aliases/QueueDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addQueueWorkerDefinition()

> **addQueueWorkerDefinition**(...`workers`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:211](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L211)

#### Parameters

##### workers

...[`QueueWorkerDefinitionList`](../type-aliases/QueueWorkerDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addScheduleDefinition()

> **addScheduleDefinition**(...`schedules`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:259](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L259)

#### Parameters

##### schedules

...[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]

#### Returns

`ServiceBuilder`\<`S`\>

***

### addStreamDefinition()

> **addStreamDefinition**(...`streams`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:189](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L189)

#### Parameters

##### streams

...[`StreamDefinitionList`](../type-aliases/StreamDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addSubscriptionDefinition()

> **addSubscriptionDefinition**(...`subscription`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:178](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L178)

#### Parameters

##### subscription

...[`SubscriptionDefinitionList`](../type-aliases/SubscriptionDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### bindEventToQueue()

> **bindEventToQueue**(`eventName`, `queueName`, `options?`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:280](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L280)

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

### defineMetric()

> **defineMetric**\<`MetricName`, `Definition`\>(`name`, `definition`): `ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `Metrics`: `Metrics`; `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `Metrics`\>\>; \}\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:365](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L365)

Declare a custom application metric available in every service handler.

#### Type Parameters

##### MetricName

`MetricName` *extends* `string`

##### Definition

`Definition` *extends* `PuristaMetricDefinition`\<`any`\>

#### Parameters

##### name

`MetricName`

##### definition

`Definition`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `Metrics`: `Metrics`; `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `Metrics`\>\>; \}\>\>

#### Example

```ts
const service = new ServiceBuilder(serviceInfo).defineMetric('app.orders.created', {
  kind: 'counter',
  unit: '{order}',
  description: 'Created orders',
})
```

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourcesType`\>(): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:346](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L346)

#### Type Parameters

##### ResourceName

`ResourceName` *extends* `string`

##### ResourcesType

`ResourcesType`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

***

### getAgentQueueBuilder()

> **getAgentQueueBuilder**\<`AgentName`\>(`agentName`, `description`): [`AgentQueueBuilder`](AgentQueueBuilder.md)\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\] *extends* `Record`\<`string`, `unknown`\> ? `any`\[`any`\] : `Record`\<`string`, `never`\>, `Record`\<`never`, `never`\>, `Record`\<`never`, `never`\>, `Record`\<`never`, `never`\>, `undefined`, `S`\[`"Metrics"`\]\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:592](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L592)

Create a native core builder for a queue-backed PURISTA agent.

The returned builder preserves this service builder's resource type and
cascades payload, parameter, output, model, command-tool, and child-agent
declarations into the agent handler context.

#### Type Parameters

##### AgentName

`AgentName` *extends* `string`

#### Parameters

##### agentName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`AgentName`\>

##### description

`string`

#### Returns

[`AgentQueueBuilder`](AgentQueueBuilder.md)\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\] *extends* `Record`\<`string`, `unknown`\> ? `any`\[`any`\] : `Record`\<`string`, `never`\>, `Record`\<`never`, `never`\>, `Record`\<`never`, `never`\>, `Record`\<`never`, `never`\>, `undefined`, `S`\[`"Metrics"`\]\>\>

#### Example

```ts
const triage = service
  .getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
```

***

### getCommandBuilder()

> **getCommandBuilder**\<`T`, `N`\>(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:497](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L497)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:613](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L613)

#### Returns

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getCustomClass()

> **getCustomClass**(): [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:389](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L389)

#### Returns

[`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\>

***

### getEventToQueueBindings()

> **getEventToQueueBindings**(): [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:685](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L685)

#### Returns

[`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]

***

### getFullServiceDefinition()

> **getFullServiceDefinition**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:782](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L782)

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:393](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L393)

#### Parameters

##### eventBridge

[`EventBridge`](../interfaces/EventBridge.md)

##### options?

\{ \[K in string \| number \| symbol\]: (\{ ai?: AgentRuntimeOptions\<Record\<string, AgentModelBinding\>\>; configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; metrics?: PuristaMetricsRuntimeOptions; metricsRecorder?: PuristaMetricsRecorderInterface; queueBridge?: QueueBridge; queueJobStore?: QueueJobStore; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof S\["Resources"\] extends never ? \{ resources?: undefined \} : \{ resources: S\["Resources"\] \}) & (keyof S\["ConfigInputType"\] extends never ? \{ serviceConfig?: undefined \} : \{ serviceConfig?: S\["ConfigInputType"\] \}))\[K\] \}

#### Returns

`Promise`\<`S`\[`"ServiceClassType"`\]\>

***

### getQueueBuilder()

> **getQueueBuilder**\<`T`\>(`queueName`, `description`): [`QueueDefinitionBuilder`](QueueDefinitionBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:643](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L643)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:655](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L655)

#### Returns

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getQueueWorkerBuilder()

> **getQueueWorkerBuilder**\<`T`\>(`queueName`, `workerName`): [`QueueWorkerBuilder`](QueueWorkerBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:647](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L647)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:665](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L665)

#### Returns

[`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getScheduleBuilder()

> **getScheduleBuilder**\<`T`\>(`scheduleName`, `description`): [`ScheduleDefinitionBuilder`](ScheduleDefinitionBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:651](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L651)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:675](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L675)

#### Returns

[`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]

***

### getStreamBuilder()

> **getStreamBuilder**\<`T`, `N`\>(`streamName`, `description`, `finalEventName?`): [`StreamDefinitionBuilder`](StreamDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:557](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L557)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:633](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L633)

#### Returns

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getSubscriptionBuilder()

> **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:520](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L520)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:623](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L623)

#### Returns

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:162](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L162)

#### Returns

`ServiceBuilder`\<`S`\>

***

### resolveDefinitions()

> **resolveDefinitions**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:305](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L305)

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `eventToQueueBindings`: [`EventToQueueBindingDefinition`](../type-aliases/EventToQueueBindingDefinition.md)[]; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `schedules`: [`ScheduleDefinition`](../type-aliases/ScheduleDefinition.md)[]; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): `ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\>; \}\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:137](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L137)

#### Type Parameters

##### T

`T` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`T`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md) : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\>; \}\>\>

***

### setCustomClass()

> **setCustomClass**\<`T`\>(`customClass`): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:382](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L382)

#### Type Parameters

##### T

`T` *extends* [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\>

#### Parameters

##### customClass

[`Newable`](../type-aliases/Newable.md)\<`T`, [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\], `S`\[`"Metrics"`\]\>\>

#### Returns

`ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

***

### setDefaultConfig()

> **setDefaultConfig**(`config`): `this`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:157](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L157)

#### Parameters

##### config

[`Complete`](../type-aliases/Complete.md)\<`S`\[`"ConfigType"`\]\>

#### Returns

`this`

***

### testServiceSetup()

> **testServiceSetup**(): `Promise`\<`boolean`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:695](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L695)

#### Returns

`Promise`\<`boolean`\>

***

### ~~validateCommandDefinitions()~~

> **validateCommandDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:795](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L795)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateCommands()

> `protected` **validateCommands**(`commandDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:707](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L707)

#### Parameters

##### commandDefinitions

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateQueues()

> `protected` **validateQueues**(`queueDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:752](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L752)

#### Parameters

##### queueDefinitions

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateQueueWorkers()

> `protected` **validateQueueWorkers**(`queueWorkers`, `queues`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:763](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L763)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:741](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L741)

#### Parameters

##### streamDefinitions

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### ~~validateSubscriptionDefinitions()~~

> **validateSubscriptionDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:803](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L803)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateSubscriptions()

> `protected` **validateSubscriptions**(`subscriptionDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:729](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L729)

#### Parameters

##### subscriptionDefinitions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`void`
