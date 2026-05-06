[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceBuilder

# Class: ServiceBuilder\<S\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L77)

This class is used to build a service.

## Extended by

- [`ServiceBuilder`](../../ai/classes/ServiceBuilder.md)

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md) = [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)

## Constructors

### Constructor

> **new ServiceBuilder**\<`S`\>(`info`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L102)

#### Parameters

##### info

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Returns

`ServiceBuilder`\<`S`\>

## Properties

### info

> **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:102](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L102)

***

### SClass

> **SClass**: [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\> = `Service`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L99)

## Methods

### addCommandDefinition()

> **addCommandDefinition**(...`commands`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:130](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L130)

#### Parameters

##### commands

...[`CommandDefinitionList`](../type-aliases/CommandDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addQueueDefinition()

> **addQueueDefinition**(...`queues`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:163](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L163)

#### Parameters

##### queues

...[`QueueDefinitionList`](../type-aliases/QueueDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addQueueWorkerDefinition()

> **addQueueWorkerDefinition**(...`workers`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:174](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L174)

#### Parameters

##### workers

...[`QueueWorkerDefinitionList`](../type-aliases/QueueWorkerDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addStreamDefinition()

> **addStreamDefinition**(...`streams`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:152](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L152)

#### Parameters

##### streams

...[`StreamDefinitionList`](../type-aliases/StreamDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### addSubscriptionDefinition()

> **addSubscriptionDefinition**(...`subscription`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:141](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L141)

#### Parameters

##### subscription

...[`SubscriptionDefinitionList`](../type-aliases/SubscriptionDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

#### Returns

`ServiceBuilder`\<`S`\>

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourcesType`\>(): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:218](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L218)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:312](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L312)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:393](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L393)

#### Returns

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getCustomClass()

> **getCustomClass**(): [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:232](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L232)

#### Returns

[`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

***

### getFullServiceDefinition()

> **getFullServiceDefinition**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:538](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L538)

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:236](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L236)

#### Parameters

##### eventBridge

[`EventBridge`](../interfaces/EventBridge.md)

##### options?

\{ \[K in string \| number \| symbol\]: (\{ configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; queueBridge?: QueueBridge; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof S\["Resources"\] extends never ? \{ resources?: undefined \} : \{ resources: S\["Resources"\] \}) & (keyof S\["ConfigInputType"\] extends never ? \{ serviceConfig?: undefined \} : \{ serviceConfig?: S\["ConfigInputType"\] \}))\[K\] \}

#### Returns

`Promise`\<`S`\[`"ServiceClassType"`\]\>

***

### getQueueBuilder()

> **getQueueBuilder**\<`T`\>(`queueName`, `description`): [`QueueDefinitionBuilder`](QueueDefinitionBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:423](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L423)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:431](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L431)

#### Returns

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getQueueWorkerBuilder()

> **getQueueWorkerBuilder**\<`T`\>(`queueName`, `workerName`): [`QueueWorkerBuilder`](QueueWorkerBuilder.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:427](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L427)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:441](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L441)

#### Returns

[`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getStreamBuilder()

> **getStreamBuilder**\<`T`, `N`\>(`streamName`, `description`, `finalEventName?`): [`StreamDefinitionBuilder`](StreamDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`StreamDefinitionBuilderTypes`](../type-aliases/StreamDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:372](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L372)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:413](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L413)

#### Returns

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### getSubscriptionBuilder()

> **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), [`StreamInvokeList`](../type-aliases/StreamInvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>, [`QueueInvokeList`](../type-aliases/QueueInvokeList.md)\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:335](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L335)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:403](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L403)

#### Returns

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:125](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L125)

#### Returns

`ServiceBuilder`\<`S`\>

***

### resolveDefinitions()

> **resolveDefinitions**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:185](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L185)

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queues`: [`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `queueWorkers`: [`QueueWorkerDefinitionListResolved`](../type-aliases/QueueWorkerDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `streams`: [`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): `ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md)\<[`InferIn`](../type-aliases/InferIn.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:104](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L104)

#### Type Parameters

##### T

`T` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`T`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md)\<[`InferIn`](../type-aliases/InferIn.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

***

### setCustomClass()

> **setCustomClass**\<`T`\>(`customClass`): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:225](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L225)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:120](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L120)

#### Parameters

##### config

[`Complete`](../type-aliases/Complete.md)\<`S`\[`"ConfigType"`\]\>

#### Returns

`this`

***

### testServiceSetup()

> **testServiceSetup**(): `Promise`\<`boolean`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:451](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L451)

#### Returns

`Promise`\<`boolean`\>

***

### ~~validateCommandDefinitions()~~

> **validateCommandDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:551](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L551)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateCommands()

> `protected` **validateCommands**(`commandDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:463](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L463)

#### Parameters

##### commandDefinitions

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateQueues()

> `protected` **validateQueues**(`queueDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:508](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L508)

#### Parameters

##### queueDefinitions

[`QueueDefinitionListResolved`](../type-aliases/QueueDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### validateQueueWorkers()

> `protected` **validateQueueWorkers**(`queueWorkers`, `queues`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:519](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L519)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:497](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L497)

#### Parameters

##### streamDefinitions

[`StreamDefinitionListResolved`](../type-aliases/StreamDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### ~~validateSubscriptionDefinitions()~~

> **validateSubscriptionDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:559](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L559)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateSubscriptions()

> `protected` **validateSubscriptions**(`subscriptionDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:485](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L485)

#### Parameters

##### subscriptionDefinitions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`void`
