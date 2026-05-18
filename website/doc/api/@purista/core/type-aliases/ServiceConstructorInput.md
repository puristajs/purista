[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceConstructorInput

# Type Alias: ServiceConstructorInput\<S\>

> **ServiceConstructorInput**\<`S`\> = `object`

Defined in: [core/types/ServiceConstructorInput.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L28)

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](ServiceClassTypes.md) = [`ServiceClassTypes`](ServiceClassTypes.md)

## Properties

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](CommandDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L36)

The list of command definitions for this service

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/types/ServiceConstructorInput.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L46)

The service specific config

***

### configSchema?

> `optional` **configSchema?**: [`Schema`](Schema.md)

Defined in: [core/types/ServiceConstructorInput.ts:68](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L68)

The config validation schema

***

### configStore?

> `optional` **configStore?**: [`ConfigStore`](../interfaces/ConfigStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L50)

The config store instance

***

### eventBridge

> **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

Defined in: [core/types/ServiceConstructorInput.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L34)

The eventBridge instance

***

### eventToQueueBindingList?

> `optional` **eventToQueueBindingList?**: [`EventToQueueBindingDefinition`](EventToQueueBindingDefinition.md)[]

Defined in: [core/types/ServiceConstructorInput.ts:66](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L66)

Generated event-to-queue bindings for this service

***

### info

> **info**: [`ServiceInfoType`](ServiceInfoType.md)

Defined in: [core/types/ServiceConstructorInput.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L32)

The service info with name, version and description of service

***

### logger

> **logger**: [`Logger`](../classes/Logger.md)

Defined in: [core/types/ServiceConstructorInput.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L30)

A logger instance

***

### metricDefinitionList?

> `optional` **metricDefinitionList?**: `PuristaMetricDefinitions`

Defined in: [core/types/ServiceConstructorInput.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L60)

Custom metric definitions exposed on handler contexts

***

### metrics?

> `optional` **metrics?**: [`PuristaMetricsRuntimeOptions`](../interfaces/PuristaMetricsRuntimeOptions.md)

Defined in: [core/types/ServiceConstructorInput.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L56)

OpenTelemetry metrics runtime options for the service instance

***

### metricsRecorder?

> `optional` **metricsRecorder?**: [`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md)

Defined in: [core/types/ServiceConstructorInput.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L58)

Optional preconfigured recorder, mainly used by tests or advanced runtime wiring

***

### queueBridge?

> `optional` **queueBridge?**: [`QueueBridge`](../interfaces/QueueBridge.md)

Defined in: [core/types/ServiceConstructorInput.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L62)

Queue bridge implementation

***

### queueDefinitionList?

> `optional` **queueDefinitionList?**: [`QueueDefinitionListResolved`](QueueDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L42)

The list of queue definitions for this service

***

### queueJobStore?

> `optional` **queueJobStore?**: [`QueueJobStore`](QueueJobStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L64)

Optional queue job status/result store

***

### queueWorkerDefinitionList?

> `optional` **queueWorkerDefinitionList?**: [`QueueWorkerDefinitionListResolved`](QueueWorkerDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L44)

The list of queue worker definitions for this service

***

### resources?

> `optional` **resources?**: `S`\[`"Resources"`\]

Defined in: [core/types/ServiceConstructorInput.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L69)

***

### secretStore?

> `optional` **secretStore?**: [`SecretStore`](../interfaces/SecretStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L48)

The secret store instance

***

### spanProcessor?

> `optional` **spanProcessor?**: `SpanProcessor`

Defined in: [core/types/ServiceConstructorInput.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L54)

The opentelemetry span processor instance

***

### stateStore?

> `optional` **stateStore?**: [`StateStore`](../interfaces/StateStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L52)

the state store instance

***

### streamDefinitionList?

> `optional` **streamDefinitionList?**: [`StreamDefinitionListResolved`](StreamDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L40)

The list of stream definitions for this service

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L38)

The list of subscription definitions for this service
