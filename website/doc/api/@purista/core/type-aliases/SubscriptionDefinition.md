[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinition

# Type Alias: SubscriptionDefinition\<S, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, FunctionOutputType, FinalFunctionOutputType, TransformOutputHookOutput, Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, MetadataType\>

> **SubscriptionDefinition**\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `FinalFunctionOutputType`, `TransformOutputHookOutput`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `MetadataType`\> = `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L24)

The definition for a subscription provided by some service.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### TransformInputPayload

`TransformInputPayload`

### TransformInputParams

`TransformInputParams`

### FunctionPayloadType

`FunctionPayloadType`

### FunctionParamsType

`FunctionParamsType`

### FunctionOutputType

`FunctionOutputType`

### FinalFunctionOutputType

`FinalFunctionOutputType`

### TransformOutputHookOutput

`TransformOutputHookOutput`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\>

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### MetadataType

`MetadataType` *extends* [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md) = [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md)

## Properties

### call

> **call**: [`SubscriptionFunction`](SubscriptionFunction.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`\>

Defined in: [core/types/subscription/SubscriptionDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L49)

the subscription function

***

### deprecated

> **deprecated**: `boolean`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:135](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L135)

***

### emitEventName?

> `optional` **emitEventName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L78)

event name to be used for custom message if the subscription functions returns value

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:133](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L133)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L47)

config information for event bridge

***

### eventName?

> `optional` **eventName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:76](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L76)

filter forevent name

***

### hooks

> **hooks**: `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L84)

hooks of subscription

#### afterGuard?

> `optional` **afterGuard**: `Record`\<`string`, [`SubscriptionAfterGuardHook`](SubscriptionAfterGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`\>\>

#### beforeGuard?

> `optional` **beforeGuard**: `Record`\<`string`, [`SubscriptionBeforeGuardHook`](SubscriptionBeforeGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`\>\>

#### transformInput?

> `optional` **transformInput**: `object`

##### transformInput.transformFunction

> **transformFunction**: [`SubscriptionTransformInputHook`](SubscriptionTransformInputHook.md)\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`\>

##### transformInput.transformInputSchema

> **transformInputSchema**: [`Schema`](Schema.md)

##### transformInput.transformParameterSchema

> **transformParameterSchema**: [`Schema`](Schema.md)

#### transformOutput?

> `optional` **transformOutput**: `object`

##### transformOutput.transformFunction

> **transformFunction**: [`SubscriptionTransformOutputHook`](SubscriptionTransformOutputHook.md)\<`S`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`\>

##### transformOutput.transformOutputSchema

> **transformOutputSchema**: [`Schema`](Schema.md)

***

### invokes

> **invokes**: `Invokes`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:131](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L131)

***

### messageType?

> `optional` **messageType**: [`EBMessageType`](../enumerations/EBMessageType.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:74](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L74)

filter for message type

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L45)

the metadata of the subscription

***

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L80)

filter for principal id

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:134](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L134)

***

### receiver?

> `optional` **receiver**: `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:67](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L67)

filter for messages consumed by given receiver

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

Defined in: [core/types/subscription/SubscriptionDefinition.ts:60](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L60)

filter for messages produced by given sender

#### instanceId?

> `optional` **instanceId**: [`InstanceId`](InstanceId.md)

#### serviceName?

> `optional` **serviceName**: `string`

#### serviceTarget?

> `optional` **serviceTarget**: `string`

#### serviceVersion?

> `optional` **serviceVersion**: `string`

***

### streamInvokes

> **streamInvokes**: `StreamInvokes`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:132](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L132)

***

### subscriptionDescription

> **subscriptionDescription**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L43)

the description of the subscription

***

### subscriptionName

> **subscriptionName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L41)

the name of the subscription

***

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L82)

filter for tenant id
