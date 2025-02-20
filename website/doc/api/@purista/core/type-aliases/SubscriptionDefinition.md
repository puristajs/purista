[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinition

# Type Alias: SubscriptionDefinition\<S, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, FunctionOutputType, FinalFunctionOutputType, TransformOutputHookOutput, Resources, Invokes, EmitList, MetadataType\>

> **SubscriptionDefinition**\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `FinalFunctionOutputType`, `TransformOutputHookOutput`, `Resources`, `Invokes`, `EmitList`, `MetadataType`\>: `object`

Defined in: [packages/core/src/core/types/subscription/SubscriptionDefinition.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinition.ts#L25)

The definition for a subscription provided by some service.

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)

• **TransformInputPayload**

• **TransformInputParams**

• **FunctionPayloadType**

• **FunctionParamsType**

• **FunctionOutputType**

• **FinalFunctionOutputType**

• **TransformOutputHookOutput**

• **Resources** *extends* `Record`\<`string`, `any`\>

• **Invokes** *extends* [`InvokeList`](InvokeList.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\>

• **MetadataType** *extends* [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md) = [`SubscriptionDefinitionMetadataBase`](SubscriptionDefinitionMetadataBase.md)

## Type declaration

### call

> **call**: [`SubscriptionFunction`](SubscriptionFunction.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>

the subscription function

### deprecated

> **deprecated**: `boolean`

### emitEventName?

> `optional` **emitEventName**: `string`

event name to be used for custom message if the subscription functions returns value

### emitList

> **emitList**: [`FromEmitToOtherType`](FromEmitToOtherType.md)\<`EmitList`, `SchemaObject`\>

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

config information for event bridge

### eventName?

> `optional` **eventName**: `string`

filter forevent name

### hooks

> **hooks**: `object`

hooks of subscription

#### hooks.afterGuard?

> `optional` **hooks.afterGuard**: `Record`\<`string`, [`SubscriptionAfterGuardHook`](SubscriptionAfterGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>\>

#### hooks.beforeGuard?

> `optional` **hooks.beforeGuard**: `Record`\<`string`, [`SubscriptionBeforeGuardHook`](SubscriptionBeforeGuardHook.md)\<`S`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `EmitList`\>\>

#### hooks.transformInput?

> `optional` **hooks.transformInput**: `object`

#### hooks.transformInput.transformFunction

> **hooks.transformInput.transformFunction**: [`SubscriptionTransformInputHook`](SubscriptionTransformInputHook.md)\<`S`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`\>

#### hooks.transformInput.transformInputSchema

> **hooks.transformInput.transformInputSchema**: `Schema`

#### hooks.transformInput.transformParameterSchema

> **hooks.transformInput.transformParameterSchema**: `Schema`

#### hooks.transformOutput?

> `optional` **hooks.transformOutput**: `object`

#### hooks.transformOutput.transformFunction

> **hooks.transformOutput.transformFunction**: [`SubscriptionTransformOutputHook`](SubscriptionTransformOutputHook.md)\<`S`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`\>

#### hooks.transformOutput.transformOutputSchema

> **hooks.transformOutput.transformOutputSchema**: `Schema`

### invokes

> **invokes**: [`FromInvokeToOtherType`](FromInvokeToOtherType.md)\<`Invokes`, \{ `outputSchema`: `SchemaObject`; `parameterSchema`: `SchemaObject`; `payloadSchema`: `SchemaObject`; \}\>

### messageType?

> `optional` **messageType**: [`EBMessageType`](../enumerations/EBMessageType.md)

filter for message type

### metadata

> **metadata**: `MetadataType`

the metadata of the subscription

### principalId?

> `optional` **principalId**: [`PrincipalId`](PrincipalId.md)

filter for principal id

### receiver?

> `optional` **receiver**: `object`

filter for messages consumed by given receiver

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

filter for messages produced by given sender

#### sender.instanceId?

> `optional` **sender.instanceId**: [`InstanceId`](InstanceId.md)

#### sender.serviceName?

> `optional` **sender.serviceName**: `string`

#### sender.serviceTarget?

> `optional` **sender.serviceTarget**: `string`

#### sender.serviceVersion?

> `optional` **sender.serviceVersion**: `string`

### subscriptionDescription

> **subscriptionDescription**: `string`

the description of the subscription

### subscriptionName

> **subscriptionName**: `string`

the name of the subscription

### tenantId?

> `optional` **tenantId**: [`TenantId`](TenantId.md)

filter for tenant id
