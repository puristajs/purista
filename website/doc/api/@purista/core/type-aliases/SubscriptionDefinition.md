[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinition

# Type Alias: SubscriptionDefinition\<S, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, FunctionOutputType, FinalFunctionOutputType, TransformOutputHookOutput, Resources, Invokes, EmitList, MetadataType\>

> **SubscriptionDefinition**\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `FinalFunctionOutputType`, `TransformOutputHookOutput`, `Resources`, `Invokes`, `EmitList`, `MetadataType`\> = `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L22)

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

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\>

### MetadataType

`MetadataType` *extends* [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md) = [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md)

## Properties

### call

> **call**: [`SubscriptionFunction`](SubscriptionFunction.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>

Defined in: [core/types/subscription/SubscriptionDefinition.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L45)

the subscription function

***

### deprecated

> **deprecated**: `boolean`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:119](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L119)

***

### emitEventName?

> `optional` **emitEventName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:73](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L73)

event name to be used for custom message if the subscription functions returns value

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:118](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L118)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L43)

config information for event bridge

***

### eventName?

> `optional` **eventName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L71)

filter forevent name

***

### hooks

> **hooks**: `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:79](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L79)

hooks of subscription

#### afterGuard?

> `optional` **afterGuard**: `Record`\<`string`, [`SubscriptionAfterGuardHook`](SubscriptionAfterGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>\>

#### beforeGuard?

> `optional` **beforeGuard**: `Record`\<`string`, [`SubscriptionBeforeGuardHook`](SubscriptionBeforeGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `EmitList`\>\>

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

Defined in: [core/types/subscription/SubscriptionDefinition.ts:117](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L117)

***

### messageType?

> `optional` **messageType**: [`EBMessageType`](../enumerations/EBMessageType.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L69)

filter for message type

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L41)

the metadata of the subscription

***

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:75](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L75)

filter for principal id

***

### receiver?

> `optional` **receiver**: `object`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L62)

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

Defined in: [core/types/subscription/SubscriptionDefinition.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L55)

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

### subscriptionDescription

> **subscriptionDescription**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L39)

the description of the subscription

***

### subscriptionName

> **subscriptionName**: `string`

Defined in: [core/types/subscription/SubscriptionDefinition.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L37)

the name of the subscription

***

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

Defined in: [core/types/subscription/SubscriptionDefinition.ts:77](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L77)

filter for tenant id
