[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceConstructorInput

# Type Alias: ServiceConstructorInput\<S\>

> **ServiceConstructorInput**\<`S`\>: `object`

Defined in: [packages/core/src/core/types/ServiceConstructorInput.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceConstructorInput.ts#L17)

## Type Parameters

• **S** *extends* [`ServiceClassTypes`](ServiceClassTypes.md) = [`ServiceClassTypes`](ServiceClassTypes.md)

## Type declaration

### commandDefinitionList

> **commandDefinitionList**: [`CommandDefinitionListResolved`](CommandDefinitionListResolved.md)\<`any`\>

The list of command definitions for this service

### config

> **config**: `S`\[`"ConfigType"`\]

The service specific config

### configSchema?

> `optional` **configSchema**: `Schema`

The config validation schema

### configStore?

> `optional` **configStore**: [`ConfigStore`](../interfaces/ConfigStore.md)

The config store instance

### eventBridge

> **eventBridge**: [`EventBridge`](../interfaces/EventBridge.md)

The eventBridge instance

### info

> **info**: [`ServiceInfoType`](ServiceInfoType.md)

The service info with name, version and description of service

### logger

> **logger**: [`Logger`](../classes/Logger.md)

A logger instance

### resources?

> `optional` **resources**: `S`\[`"Resources"`\]

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../interfaces/SecretStore.md)

The secret store instance

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

The opentelemetry span processor instance

### stateStore?

> `optional` **stateStore**: [`StateStore`](../interfaces/StateStore.md)

the state store instance

### subscriptionDefinitionList

> **subscriptionDefinitionList**: [`SubscriptionDefinitionListResolved`](SubscriptionDefinitionListResolved.md)\<`any`\>

The list of subscription definitions for this service
