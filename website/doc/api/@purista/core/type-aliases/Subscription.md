[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Subscription

# Type Alias: Subscription\<PayloadType, ParameterType\>

> **Subscription**\<`PayloadType`, `ParameterType`\>: `object`

Defined in: [packages/core/src/core/types/subscription/Subscription.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/Subscription.ts#L13)

A subscription managed by the event bridge

## Type Parameters

• **PayloadType** = `unknown`

• **ParameterType** = `unknown`

## Type declaration

### emitEventName?

> `optional` **emitEventName**: `string`

the event name to be used for custom message if the subscriptions returns a result

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

config information for event bridge

### eventName?

> `optional` **eventName**: `string`

the event name to subscribe for

### messageType?

> `optional` **messageType**: [`EBMessageType`](../enumerations/EBMessageType.md)

the message type

### payload?

> `optional` **payload**: `object`

the message payload

#### payload.parameter?

> `optional` **payload.parameter**: `ParameterType`

#### payload.payload?

> `optional` **payload.payload**: `PayloadType`

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

the principal id

### receiver?

> `optional` **receiver**: `object`

the consumer address of the message

#### receiver.instanceId?

> `optional` **receiver.instanceId**: [`InstanceId`](InstanceId.md)

#### receiver.serviceName?

> `optional` **receiver.serviceName**: `string`

#### receiver.serviceTarget?

> `optional` **receiver.serviceTarget**: `string`

#### receiver.serviceVersion?

> `optional` **receiver.serviceVersion**: `string`

### sender?

> `optional` **sender**: `object`

the producer address of the message

#### sender.instanceId?

> `optional` **sender.instanceId**: [`InstanceId`](InstanceId.md)

#### sender.serviceName?

> `optional` **sender.serviceName**: `string`

#### sender.serviceTarget?

> `optional` **sender.serviceTarget**: `string`

#### sender.serviceVersion?

> `optional` **sender.serviceVersion**: `string`

### subscriber

> **subscriber**: [`EBMessageAddress`](EBMessageAddress.md)

the address of the subscription (service name, version and subscription name)

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

the tenant id
