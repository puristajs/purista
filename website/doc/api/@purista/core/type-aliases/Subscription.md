[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Subscription

# Type Alias: Subscription\<PayloadType, ParameterType\>

> **Subscription**\<`PayloadType`, `ParameterType`\> = `object`

Defined in: [core/types/subscription/Subscription.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L13)

A subscription managed by the event bridge

## Type Parameters

### PayloadType

`PayloadType` = `unknown`

### ParameterType

`ParameterType` = `unknown`

## Properties

### emitEventName?

> `optional` **emitEventName**: `string`

Defined in: [core/types/subscription/Subscription.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L33)

the event name to be used for custom message if the subscriptions returns a result

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/subscription/Subscription.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L46)

config information for event bridge

***

### eventName?

> `optional` **eventName**: `string`

Defined in: [core/types/subscription/Subscription.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L31)

the event name to subscribe for

***

### messageType?

> `optional` **messageType**: [`EBMessageType`](../enumerations/EBMessageType.md)

Defined in: [core/types/subscription/Subscription.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L29)

the message type

***

### payload?

> `optional` **payload**: `object`

Defined in: [core/types/subscription/Subscription.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L39)

the message payload

#### parameter?

> `optional` **parameter**: `ParameterType`

#### payload?

> `optional` **payload**: `PayloadType`

***

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

Defined in: [core/types/subscription/Subscription.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L35)

the principal id

***

### receiver?

> `optional` **receiver**: `object`

Defined in: [core/types/subscription/Subscription.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L22)

the consumer address of the message

#### instanceId?

> `optional` **instanceId**: [`InstanceId`](InstanceId.md)

#### serviceName?

> `optional` **serviceName**: `string`

#### serviceTarget?

> `optional` **serviceTarget**: `string`

#### serviceVersion?

> `optional` **serviceVersion**: `string`

***

### sender?

> `optional` **sender**: `object`

Defined in: [core/types/subscription/Subscription.ts:15](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L15)

the producer address of the message

#### instanceId?

> `optional` **instanceId**: [`InstanceId`](InstanceId.md)

#### serviceName?

> `optional` **serviceName**: `string`

#### serviceTarget?

> `optional` **serviceTarget**: `string`

#### serviceVersion?

> `optional` **serviceVersion**: `string`

***

### subscriber

> **subscriber**: [`EBMessageAddress`](EBMessageAddress.md)

Defined in: [core/types/subscription/Subscription.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L44)

the address of the subscription (service name, version and subscription name)

***

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

Defined in: [core/types/subscription/Subscription.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L37)

the tenant id
