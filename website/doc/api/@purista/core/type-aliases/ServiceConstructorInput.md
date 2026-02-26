[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceConstructorInput

# Type Alias: ServiceConstructorInput\<S\>

> **ServiceConstructorInput**\<`S`\> = `object`

Defined in: [core/types/ServiceConstructorInput.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L21)

## Type Parameters

### S

`S` *extends* [`ServiceClassTypes`](ServiceClassTypes.md) = [`ServiceClassTypes`](ServiceClassTypes.md)

## Properties

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](CommandDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L29)

The list of command definitions for this service

***

### config

> **config**: `S`\[`"ConfigType"`\]

Defined in: [core/types/ServiceConstructorInput.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L39)

The service specific config

***

### configSchema?

> `optional` **configSchema**: [`Schema`](Schema.md)

Defined in: [core/types/ServiceConstructorInput.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L51)

The config validation schema

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../interfaces/ConfigStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L43)

The config store instance

***

### eventBridge

> **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

Defined in: [core/types/ServiceConstructorInput.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L27)

The eventBridge instance

***

### info

> **info**: [`ServiceInfoType`](ServiceInfoType.md)

Defined in: [core/types/ServiceConstructorInput.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L25)

The service info with name, version and description of service

***

### logger

> **logger**: [`Logger`](../classes/Logger.md)

Defined in: [core/types/ServiceConstructorInput.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L23)

A logger instance

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../interfaces/QueueBridge.md)

Defined in: [core/types/ServiceConstructorInput.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L49)

Queue bridge implementation

***

### queueDefinitionList?

> `optional` **queueDefinitionList**: [`QueueDefinitionListResolved`](QueueDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L35)

The list of queue definitions for this service

***

### queueWorkerDefinitionList?

> `optional` **queueWorkerDefinitionList**: [`QueueWorkerDefinitionListResolved`](QueueWorkerDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L37)

The list of queue worker definitions for this service

***

### resources?

> `optional` **resources**: `S`\[`"Resources"`\]

Defined in: [core/types/ServiceConstructorInput.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L52)

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../interfaces/SecretStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L41)

The secret store instance

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [core/types/ServiceConstructorInput.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L47)

The opentelemetry span processor instance

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../interfaces/StateStore.md)

Defined in: [core/types/ServiceConstructorInput.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L45)

the state store instance

***

### streamDefinitionList?

> `optional` **streamDefinitionList**: [`StreamDefinitionListResolved`](StreamDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L33)

The list of stream definitions for this service

***

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](SubscriptionDefinitionListResolved.md)\<`any`\>

Defined in: [core/types/ServiceConstructorInput.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L31)

The list of subscription definitions for this service
