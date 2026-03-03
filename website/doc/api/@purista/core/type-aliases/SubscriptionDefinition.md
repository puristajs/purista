[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinition

# Type Alias: SubscriptionDefinition\<S, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, FunctionOutputType, FinalFunctionOutputType, TransformOutputHookOutput, Resources, Invokes, StreamInvokes, EmitList, MetadataType, QueueInvokes, AgentInvokes\>

> **SubscriptionDefinition**\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `FinalFunctionOutputType`, `TransformOutputHookOutput`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `MetadataType`, `QueueInvokes`, `AgentInvokes`\> = `object`

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

### MetadataType

`MetadataType` *extends* [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md) = [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md)

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](AgentInvokeList.md) = [`AgentInvokeList`](AgentInvokeList.md)

## Properties

### agentInvokes

> **agentInvokes**: `AgentInvokes`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:140](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L140)

***

### call

> **call**: [`SubscriptionFunction`](SubscriptionFunction.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>

Defined in: [core/types/subscription/SubscriptionDefinition.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L50)

the subscription function

***

### deprecated

> **deprecated**: `boolean`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:143](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L143)

***

### emitEventName?

> `optional` **emitEventName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L81)

event name to be used for custom message if the subscription functions returns value

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:141](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L141)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L48)

config information for event bridge

***

### eventName?

> `optional` **eventName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L79)

filter forevent name

***

### hooks

> **hooks**: `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L87)

hooks of subscription

#### afterGuard?

> `optional` **afterGuard**: `Record`\<`string`, [`SubscriptionAfterGuardHook`](SubscriptionAfterGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>\>

#### beforeGuard?

> `optional` **beforeGuard**: `Record`\<`string`, [`SubscriptionBeforeGuardHook`](SubscriptionBeforeGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`, `AgentInvokes`\>\>

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

Defined in: [core/types/subscription/SubscriptionDefinition.ts:138](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L138)

***

### messageType?

> `optional` **messageType**: [`EBMessageType`](../enumerations/EBMessageType.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L77)

filter for message type

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L46)

the metadata of the subscription

***

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L83)

filter for principal id

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:142](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L142)

***

### receiver?

> `optional` **receiver**: `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:70](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L70)

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

Defined in: [core/types/subscription/SubscriptionDefinition.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L63)

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

Defined in: [core/types/subscription/SubscriptionDefinition.ts:139](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L139)

***

### subscriptionDescription

> **subscriptionDescription**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:44](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L44)

the description of the subscription

***

### subscriptionName

> **subscriptionName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L42)

the name of the subscription

***

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L85)

filter for tenant id
