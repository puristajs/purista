[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / SubscriptionDefinitionBuilder

# Class: SubscriptionDefinitionBuilder\<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, PayloadSchema, ParameterSchema, ResultSchema, Invokes, EmitListType\>

[@purista/core](../modules/purista_core.md).SubscriptionDefinitionBuilder

Subscription definition builder is a helper to create and define a subscriptions for a service.
It helps to set all needed filters.

A working schema definition needs at least a subscription name, a short description and the subscription implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `PayloadSchema` | extends `Schema` = `ZodAny` |
| `ParameterSchema` | extends `Schema` = `ZodAny` |
| `ResultSchema` | extends `Schema` = `ZodAny` |
| `Invokes` | {} |
| `EmitListType` | {} |

## Table of contents

### Constructors

- [constructor](purista_core.SubscriptionDefinitionBuilder.md#constructor)

### Properties

- [autoacknowledge](purista_core.SubscriptionDefinitionBuilder.md#autoacknowledge)
- [durable](purista_core.SubscriptionDefinitionBuilder.md#durable)
- [emitEventName](purista_core.SubscriptionDefinitionBuilder.md#emiteventname)
- [emitList](purista_core.SubscriptionDefinitionBuilder.md#emitlist)
- [eventName](purista_core.SubscriptionDefinitionBuilder.md#eventname)
- [fn](purista_core.SubscriptionDefinitionBuilder.md#fn)
- [hooks](purista_core.SubscriptionDefinitionBuilder.md#hooks)
- [inputContentEncoding](purista_core.SubscriptionDefinitionBuilder.md#inputcontentencoding)
- [inputContentType](purista_core.SubscriptionDefinitionBuilder.md#inputcontenttype)
- [inputSchema](purista_core.SubscriptionDefinitionBuilder.md#inputschema)
- [invokes](purista_core.SubscriptionDefinitionBuilder.md#invokes)
- [messageType](purista_core.SubscriptionDefinitionBuilder.md#messagetype)
- [outputContentEncoding](purista_core.SubscriptionDefinitionBuilder.md#outputcontentencoding)
- [outputContentType](purista_core.SubscriptionDefinitionBuilder.md#outputcontenttype)
- [outputSchema](purista_core.SubscriptionDefinitionBuilder.md#outputschema)
- [parameterSchema](purista_core.SubscriptionDefinitionBuilder.md#parameterschema)
- [principalId](purista_core.SubscriptionDefinitionBuilder.md#principalid)
- [receiver](purista_core.SubscriptionDefinitionBuilder.md#receiver)
- [sender](purista_core.SubscriptionDefinitionBuilder.md#sender)
- [shared](purista_core.SubscriptionDefinitionBuilder.md#shared)
- [subscriptionDescription](purista_core.SubscriptionDefinitionBuilder.md#subscriptiondescription)
- [subscriptionName](purista_core.SubscriptionDefinitionBuilder.md#subscriptionname)
- [tenantId](purista_core.SubscriptionDefinitionBuilder.md#tenantid)

### Methods

- [addOutputSchema](purista_core.SubscriptionDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](purista_core.SubscriptionDefinitionBuilder.md#addparameterschema)
- [addPayloadSchema](purista_core.SubscriptionDefinitionBuilder.md#addpayloadschema)
- [adviceAutoacknowledgeMessage](purista_core.SubscriptionDefinitionBuilder.md#adviceautoacknowledgemessage)
- [adviceDurable](purista_core.SubscriptionDefinitionBuilder.md#advicedurable)
- [canEmit](purista_core.SubscriptionDefinitionBuilder.md#canemit)
- [canInvoke](purista_core.SubscriptionDefinitionBuilder.md#caninvoke)
- [filterForMessageType](purista_core.SubscriptionDefinitionBuilder.md#filterformessagetype)
- [filterPrincipalId](purista_core.SubscriptionDefinitionBuilder.md#filterprincipalid)
- [filterReceivedBy](purista_core.SubscriptionDefinitionBuilder.md#filterreceivedby)
- [filterSentFrom](purista_core.SubscriptionDefinitionBuilder.md#filtersentfrom)
- [filterTenantId](purista_core.SubscriptionDefinitionBuilder.md#filtertenantid)
- [getDefinition](purista_core.SubscriptionDefinitionBuilder.md#getdefinition)
- [getSubscriptionContextMock](purista_core.SubscriptionDefinitionBuilder.md#getsubscriptioncontextmock)
- [getSubscriptionFunction](purista_core.SubscriptionDefinitionBuilder.md#getsubscriptionfunction)
- [getSubscriptionFunctionPlain](purista_core.SubscriptionDefinitionBuilder.md#getsubscriptionfunctionplain)
- [getSubscriptionTransformContextMock](purista_core.SubscriptionDefinitionBuilder.md#getsubscriptiontransformcontextmock)
- [getTransformInputFunction](purista_core.SubscriptionDefinitionBuilder.md#gettransforminputfunction)
- [getTransformOutputFunction](purista_core.SubscriptionDefinitionBuilder.md#gettransformoutputfunction)
- [receiveMessageOnEveryInstance](purista_core.SubscriptionDefinitionBuilder.md#receivemessageoneveryinstance)
- [setAfterGuardHooks](purista_core.SubscriptionDefinitionBuilder.md#setafterguardhooks)
- [setBeforeGuardHooks](purista_core.SubscriptionDefinitionBuilder.md#setbeforeguardhooks)
- [setSubscriptionFunction](purista_core.SubscriptionDefinitionBuilder.md#setsubscriptionfunction)
- [setTransformInput](purista_core.SubscriptionDefinitionBuilder.md#settransforminput)
- [setTransformOutput](purista_core.SubscriptionDefinitionBuilder.md#settransformoutput)
- [subscribeToEvent](purista_core.SubscriptionDefinitionBuilder.md#subscribetoevent)

## Constructors

### constructor

• **new SubscriptionDefinitionBuilder**\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>(`subscriptionName`, `subscriptionDescription`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)\<`unknown`\> = [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)\<`unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `PayloadSchema` | extends `Schema` = `ZodAny` |
| `ParameterSchema` | extends `Schema` = `ZodAny` |
| `ResultSchema` | extends `Schema` = `ZodAny` |
| `Invokes` | {} |
| `EmitListType` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `subscriptionDescription` | `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:142](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L142)

## Properties

### autoacknowledge

• `Private` **autoacknowledge**: `boolean` = `false`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:132](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L132)

___

### durable

• `Private` **durable**: `boolean` = `true`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:129](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L129)

___

### emitEventName

• `Private` `Optional` **emitEventName**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:124](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L124)

___

### emitList

• `Private` **emitList**: `EmitListType`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:139](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L139)

___

### eventName

• `Private` `Optional` **eventName**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:123](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L123)

___

### fn

• `Private` `Optional` **fn**: [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`ResultSchema`\> : `never`\>\>, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:112](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L112)

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard` | `Record`\<`string`, [`SubscriptionAfterGuardHook`](../modules/purista_core.md#subscriptionafterguardhook)\<`ServiceClassType`, `Infer`\<`ResultSchema`\>, `Infer`\<`PayloadSchema`\>, `Infer`\<`ParameterSchema`\>, `Invokes`, `EmitListType`\>\> |
| `beforeGuard` | `Record`\<`string`, [`SubscriptionBeforeGuardHook`](../modules/purista_core.md#subscriptionbeforeguardhook)\<`ServiceClassType`, `Infer`\<`PayloadSchema`\>, `Infer`\<`ParameterSchema`\>, `Invokes`, `EmitListType`\>\> |
| `transformInput?` | \{ `transformFunction`: [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)\<`ServiceClassType`, `any`, `any`, `any`, `any`\> ; `transformInputSchema`: `Schema` ; `transformParameterSchema`: `Schema`  } |
| `transformInput.transformFunction` | [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)\<`ServiceClassType`, `any`, `any`, `any`, `any`\> |
| `transformInput.transformInputSchema` | `Schema` |
| `transformInput.transformParameterSchema` | `Schema` |
| `transformOutput?` | \{ `transformFunction`: [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)\<`ServiceClassType`, `Infer`\<`ResultSchema`\>, `Infer`\<`PayloadSchema`\>, `any`\> ; `transformOutputSchema`: `Schema`  } |
| `transformOutput.transformFunction` | [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)\<`ServiceClassType`, `Infer`\<`ResultSchema`\>, `Infer`\<`PayloadSchema`\>, `any`\> |
| `transformOutput.transformOutputSchema` | `Schema` |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L61)

___

### inputContentEncoding

• `Private` **inputContentEncoding**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:55](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L55)

___

### inputContentType

• `Private` **inputContentType**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L54)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `PayloadSchema`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L53)

___

### invokes

• `Private` **invokes**: [`FromInvokeToOtherType`](../modules/purista_core.md#frominvoketoothertype)\<`Invokes`, \{ `outputSchema?`: `Schema` ; `parameterSchema?`: `Schema` ; `payloadSchema?`: `Schema`  }\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:134](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L134)

___

### messageType

• `Private` **messageType**: `undefined` \| [`EBMessageType`](../enums/purista_core.EBMessageType.md)

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L51)

___

### outputContentEncoding

• `Private` **outputContentEncoding**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:58](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L58)

___

### outputContentType

• `Private` **outputContentType**: `undefined` \| `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:57](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L57)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ResultSchema`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:56](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L56)

___

### parameterSchema

• `Private` `Optional` **parameterSchema**: `ParameterSchema`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:59](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L59)

___

### principalId

• `Private` `Optional` **principalId**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:126](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L126)

___

### receiver

• `Private` `Optional` **receiver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `instanceId?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:105](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L105)

___

### sender

• `Private` `Optional` **sender**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `instanceId?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:98](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L98)

___

### shared

• `Private` **shared**: `boolean` = `true`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:131](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L131)

___

### subscriptionDescription

• `Private` **subscriptionDescription**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:144](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L144)

___

### subscriptionName

• `Private` **subscriptionName**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:143](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L143)

___

### tenantId

• `Private` `Optional` **tenantId**: `string`

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:127](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L127)

## Methods

### addOutputSchema

▸ **addOutputSchema**\<`T`\>(`eventName`, `outputSchema`, `outputContentType?`, `outputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `T`, `PayloadSchema`, `ParameterSchema`, `T`, `Invokes`, `EmitListType`\>

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `eventName` | `string` | `undefined` | the event name to be used when the subscription result is emitted as custom event |
| `outputSchema` | `T` | `undefined` | the validation schema for the output payload |
| `outputContentType` | `string` | `'application/json'` | optional the content type of payload |
| `outputContentEncoding` | `string` | `'utf-8'` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `T`, `PayloadSchema`, `ParameterSchema`, `T`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:441](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L441)

___

### addParameterSchema

▸ **addParameterSchema**\<`T`\>(`parameterSchema`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageResultType`, `PayloadSchema`, `T`, `ResultSchema`, `Invokes`, `EmitListType`\>

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameterSchema` | `T` | the validation schema for output parameter |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageResultType`, `PayloadSchema`, `T`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:470](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L470)

___

### addPayloadSchema

▸ **addPayloadSchema**\<`T`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageParamsType`, `MessageResultType`, `T`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `inputSchema` | `T` | `undefined` | the validation schema for input payload |
| `inputContentType` | `string` | `'application/json'` | optional the content type of payload |
| `inputContentEncoding` | `string` | `'utf-8'` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageParamsType`, `MessageResultType`, `T`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:410](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L410)

___

### adviceAutoacknowledgeMessage

▸ **adviceAutoacknowledgeMessage**(`acknowledge?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
This means, a message will not be resent, if the subscription execution fails unexpected.

If set to false, the message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the subscription execution fails unexpected
- if sending of optional subscription response failed

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `acknowledge` | `boolean` | `true` | Enable (true) and disable (false) |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinition

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:290](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L290)

___

### adviceDurable

▸ **adviceDurable**(`durable`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.

True: Advises the event bridge (like rabbitMQ) to store all messages if the subscription is not running.
As soon as the subscription is back again, all missed messages will be sent first, before it starts working like a live-subscription.

#### Parameters

| Name | Type |
| :------ | :------ |
| `durable` | `boolean` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:315](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L315)

___

### canEmit

▸ **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType` & `Record`\<`EventName`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>\>\>

Define which custom events the command can emit.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `EventName` | extends `string` |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `EventName` | The custom event name |
| `schema` | `T` | the payload schema |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType` & `Record`\<`EventName`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>\>\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:222](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L222)

___

### canInvoke

▸ **canInvoke**\<`Output`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes` & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`: `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `parameter`: `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>) => `Promise`\<`UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>\>\>\>\>, `EmitListType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Output` | extends `Schema` |
| `Payload` | extends `Schema` |
| `Parameter` | extends `Schema` |
| `SName` | extends `string` = `string` |
| `Version` | extends `string` = `string` |
| `Fname` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `SName` |
| `serviceVersion` | `Version` |
| `serviceTarget` | `Fname` |
| `outputSchema?` | `Output` |
| `payloadSchema?` | `Payload` |
| `parameterSchema?` | `Parameter` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes` & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`: `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `parameter`: `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>) => `Promise`\<`UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>\>\>\>\>, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:147](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L147)

___

### filterForMessageType

▸ **filterForMessageType**(`messageType`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Adds a filter to match specific message type.

Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.

See  EBMessageType for full available list.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageType` | [`EBMessageType`](../enums/purista_core.EBMessageType.md) | the type of message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:396](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L396)

___

### filterPrincipalId

▸ **filterPrincipalId**\<`T`\>(`principalId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Filter messages only for principalId

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `principalId` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`T`\> | the principal id to subscribe |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:263](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L263)

___

### filterReceivedBy

▸ **filterReceivedBy**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Add filter to only match messages received by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send to function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
receivedBy('UserService', undefined, 'testFunction')
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `string` |
| `V` | extends `string` |
| `T` | extends `string` |
| `I` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceName` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`N`\> | the name of the service that consumes the message |
| `serviceVersion` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`V`\> | the version of the service that consumes the message |
| `serviceTarget` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`T`\> | the command or subscription name of the service that consumes the message |
| `instanceId` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`I`\> | the event bridge instance id which should receive the message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:371](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L371)

___

### filterSentFrom

▸ **filterSentFrom**\<`N`, `V`, `T`, `I`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `instanceId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Add filter to only match messages send by given service function & version.
Set one or more parameters to undefined means "do not filter by this criteria".
For example:

This will filter for all messages send from function testFunction of service UserService.
This will include messages from all versions of this function.

```typescript
sentFrom('UserService', undefined, 'testFunction')
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `string` |
| `V` | extends `string` |
| `T` | extends `string` |
| `I` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceName` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`N`\> | the name of the service that produces the message |
| `serviceVersion` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`V`\> | the version of the service that produces the message |
| `serviceTarget` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`T`\> | the command or subscription name of the service that produces the message |
| `instanceId` | `undefined` \| [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`I`\> | the event bridge instance id which was publishing the message |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:338](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L338)

___

### filterTenantId

▸ **filterTenantId**\<`T`\>(`tenantId`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Filter messages only for tenantId

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tenantId` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`T`\> | the principal id to subscribe |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:273](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L273)

___

### getDefinition

▸ **getDefinition**(): [`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)\<`ServiceClassType`, [`SubscriptionDefinitionMetadataBase`](../modules/purista_core.md#subscriptiondefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `Infer`\<`PayloadSchema`\>, `Infer`\<`ParameterSchema`\>, `Infer`\<`ResultSchema`\>, `Invokes`, `EmitListType`\>

Returns the final subscription definition which will be passed into the service class.

#### Returns

[`SubscriptionDefinition`](../modules/purista_core.md#subscriptiondefinition)\<`ServiceClassType`, [`SubscriptionDefinitionMetadataBase`](../modules/purista_core.md#subscriptiondefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `Infer`\<`PayloadSchema`\>, `Infer`\<`ParameterSchema`\>, `Infer`\<`ResultSchema`\>, `Invokes`, `EmitListType`\>

SubscriptionDefinition

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:773](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L773)

___

### getSubscriptionContextMock

▸ **getSubscriptionContextMock**(`message`, `sandbox?`): `Object`

Returns a mocked command function context, which can be used in unit tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) | - |
| `sandbox?` | `SinonSandbox` | Sinon sandbox |

#### Returns

`Object`

a mocked command function context

| Name | Type |
| :------ | :------ |
| `mock` | \{ `configs`: \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } ; `emit`: [`EmitCustomMessageFunction`](../modules/purista_core.md#emitcustommessagefunction)\<{}\> ; `invoke`: [`InvokeFunction`](../modules/purista_core.md#invokefunction) ; `logger`: [`Logger`](purista_core.Logger.md) ; `message`: `Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\> ; `secrets`: \{ `getSecret`: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)  } ; `service`: `Invokes` ; `startActiveSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>) => `Promise`\<`F`\> ; `states`: \{ `getState`: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)  } ; `wrapInSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>, `context?`: `Context`) => `Promise`\<`F`\>  } |
| `mock.configs` | \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction) |
| `mock.emit` | [`EmitCustomMessageFunction`](../modules/purista_core.md#emitcustommessagefunction)\<{}\> |
| `mock.invoke` | [`InvokeFunction`](../modules/purista_core.md#invokefunction) |
| `mock.logger` | [`Logger`](purista_core.Logger.md) |
| `mock.message` | `Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\> |
| `mock.secrets` | \{ `getSecret`: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)  } |
| `mock.secrets.getSecret` | [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) |
| `mock.secrets.removeSecret` | [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) |
| `mock.secrets.setSecret` | [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction) |
| `mock.service` | `Invokes` |
| `mock.startActiveSpan` | \<F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>) => `Promise`\<`F`\> |
| `mock.states` | \{ `getState`: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)  } |
| `mock.states.getState` | [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) |
| `mock.states.removeState` | [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) |
| `mock.states.setState` | [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction) |
| `mock.wrapInSpan` | \<F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>, `context?`: `Context`) => `Promise`\<`F`\> |
| `stubs` | \{ `emit`: [`FromEmitToOtherType`](../modules/purista_core.md#fromemittoothertype)\<`EmitListType`, `SinonStub`\<`any`[], `any`\>\> = eventList; `getConfig`: `SinonStub`\<`any`[], `any`\> ; `getSecret`: `SinonStub`\<`any`[], `any`\> ; `getState`: `SinonStub`\<`any`[], `any`\> ; `invoke`: `SinonStub`\<`any`[], `any`\> ; `logger`: \{ `debug`: `SinonStub`\<`any`[], `any`\> ; `error`: `SinonStub`\<`any`[], `any`\> ; `fatal`: `SinonStub`\<`any`[], `any`\> ; `info`: `SinonStub`\<`any`[], `any`\> ; `trace`: `SinonStub`\<`any`[], `any`\> ; `warn`: `SinonStub`\<`any`[], `any`\>  } = logger.stubs; `removeConfig`: `SinonStub`\<`any`[], `any`\> ; `removeSecret`: `SinonStub`\<`any`[], `any`\> ; `removeState`: `SinonStub`\<`any`[], `any`\> ; `service`: [`FromInvokeToOtherType`](../modules/purista_core.md#frominvoketoothertype)\<`Invokes`, `SinonStub`\<`any`[], `any`\>\> ; `setConfig`: `SinonStub`\<`any`[], `any`\> ; `setSecret`: `SinonStub`\<`any`[], `any`\> ; `setState`: `SinonStub`\<`any`[], `any`\> ; `startActiveSpan`: `SinonStub`\<`any`[], `any`\> ; `wrapInSpan`: `SinonStub`\<`any`[], `any`\>  } |
| `stubs.emit` | [`FromEmitToOtherType`](../modules/purista_core.md#fromemittoothertype)\<`EmitListType`, `SinonStub`\<`any`[], `any`\>\> |
| `stubs.getConfig` | `SinonStub`\<`any`[], `any`\> |
| `stubs.getSecret` | `SinonStub`\<`any`[], `any`\> |
| `stubs.getState` | `SinonStub`\<`any`[], `any`\> |
| `stubs.invoke` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger` | \{ `debug`: `SinonStub`\<`any`[], `any`\> ; `error`: `SinonStub`\<`any`[], `any`\> ; `fatal`: `SinonStub`\<`any`[], `any`\> ; `info`: `SinonStub`\<`any`[], `any`\> ; `trace`: `SinonStub`\<`any`[], `any`\> ; `warn`: `SinonStub`\<`any`[], `any`\>  } |
| `stubs.logger.debug` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.error` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.fatal` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.info` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.trace` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.warn` | `SinonStub`\<`any`[], `any`\> |
| `stubs.removeConfig` | `SinonStub`\<`any`[], `any`\> |
| `stubs.removeSecret` | `SinonStub`\<`any`[], `any`\> |
| `stubs.removeState` | `SinonStub`\<`any`[], `any`\> |
| `stubs.service` | [`FromInvokeToOtherType`](../modules/purista_core.md#frominvoketoothertype)\<`Invokes`, `SinonStub`\<`any`[], `any`\>\> |
| `stubs.setConfig` | `SinonStub`\<`any`[], `any`\> |
| `stubs.setSecret` | `SinonStub`\<`any`[], `any`\> |
| `stubs.setState` | `SinonStub`\<`any`[], `any`\> |
| `stubs.startActiveSpan` | `SinonStub`\<`any`[], `any`\> |
| `stubs.wrapInSpan` | `SinonStub`\<`any`[], `any`\> |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:856](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L856)

___

### getSubscriptionFunction

▸ **getSubscriptionFunction**(): [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>, `Invokes`, `EmitListType`\>

Get the function implementation including input and output validation.
Also, before and after hooks are triggered during execution.

#### Returns

[`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>, `Invokes`, `EmitListType`\>

the subscription function

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:713](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L713)

___

### getSubscriptionFunctionPlain

▸ **getSubscriptionFunctionPlain**(): `void`

Get the function implementation without input and output validation.
No hooks are triggered during execution.

#### Returns

`void`

the subscription function

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:750](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L750)

___

### getSubscriptionTransformContextMock

▸ **getSubscriptionTransformContextMock**(`message`, `sandbox?`): `Object`

Returns a mocked transform function context, which can be used in unit tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) | - |
| `sandbox?` | `SinonSandbox` | Sinon sandbox |

#### Returns

`Object`

a mocked transform function context

| Name | Type |
| :------ | :------ |
| `mock` | \{ `configs`: \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } ; `logger`: [`Logger`](purista_core.Logger.md) ; `message`: `Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\> ; `secrets`: \{ `getSecret`: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)  } ; `startActiveSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>) => `Promise`\<`F`\> ; `states`: \{ `getState`: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)  } ; `wrapInSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>, `context?`: `Context`) => `Promise`\<`F`\>  } |
| `mock.configs` | \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction) |
| `mock.logger` | [`Logger`](purista_core.Logger.md) |
| `mock.message` | `Readonly`\<[`EBMessage`](../modules/purista_core.md#ebmessage)\> |
| `mock.secrets` | \{ `getSecret`: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)  } |
| `mock.secrets.getSecret` | [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) |
| `mock.secrets.removeSecret` | [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) |
| `mock.secrets.setSecret` | [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction) |
| `mock.startActiveSpan` | \<F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>) => `Promise`\<`F`\> |
| `mock.states` | \{ `getState`: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)  } |
| `mock.states.getState` | [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) |
| `mock.states.removeState` | [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) |
| `mock.states.setState` | [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction) |
| `mock.wrapInSpan` | \<F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>, `context?`: `Context`) => `Promise`\<`F`\> |
| `stubs` | \{ `getConfig`: `SinonStub`\<`any`[], `any`\> ; `getSecret`: `SinonStub`\<`any`[], `any`\> ; `getState`: `SinonStub`\<`any`[], `any`\> ; `logger`: \{ `debug`: `SinonStub`\<`any`[], `any`\> ; `error`: `SinonStub`\<`any`[], `any`\> ; `fatal`: `SinonStub`\<`any`[], `any`\> ; `info`: `SinonStub`\<`any`[], `any`\> ; `trace`: `SinonStub`\<`any`[], `any`\> ; `warn`: `SinonStub`\<`any`[], `any`\>  } = logger.stubs; `removeConfig`: `SinonStub`\<`any`[], `any`\> ; `removeSecret`: `SinonStub`\<`any`[], `any`\> ; `removeState`: `SinonStub`\<`any`[], `any`\> ; `setConfig`: `SinonStub`\<`any`[], `any`\> ; `setSecret`: `SinonStub`\<`any`[], `any`\> ; `setState`: `SinonStub`\<`any`[], `any`\> ; `startActiveSpan`: `SinonStub`\<`any`[], `any`\> ; `wrapInSpan`: `SinonStub`\<`any`[], `any`\>  } |
| `stubs.getConfig` | `SinonStub`\<`any`[], `any`\> |
| `stubs.getSecret` | `SinonStub`\<`any`[], `any`\> |
| `stubs.getState` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger` | \{ `debug`: `SinonStub`\<`any`[], `any`\> ; `error`: `SinonStub`\<`any`[], `any`\> ; `fatal`: `SinonStub`\<`any`[], `any`\> ; `info`: `SinonStub`\<`any`[], `any`\> ; `trace`: `SinonStub`\<`any`[], `any`\> ; `warn`: `SinonStub`\<`any`[], `any`\>  } |
| `stubs.logger.debug` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.error` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.fatal` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.info` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.trace` | `SinonStub`\<`any`[], `any`\> |
| `stubs.logger.warn` | `SinonStub`\<`any`[], `any`\> |
| `stubs.removeConfig` | `SinonStub`\<`any`[], `any`\> |
| `stubs.removeSecret` | `SinonStub`\<`any`[], `any`\> |
| `stubs.removeState` | `SinonStub`\<`any`[], `any`\> |
| `stubs.setConfig` | `SinonStub`\<`any`[], `any`\> |
| `stubs.setSecret` | `SinonStub`\<`any`[], `any`\> |
| `stubs.setState` | `SinonStub`\<`any`[], `any`\> |
| `stubs.startActiveSpan` | `SinonStub`\<`any`[], `any`\> |
| `stubs.wrapInSpan` | `SinonStub`\<`any`[], `any`\> |

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:867](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L867)

___

### getTransformInputFunction

▸ **getTransformInputFunction**(): `undefined` \| [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`ParameterSchema`\> : `never`\>\>, `MessagePayloadType`, `MessageParamsType`\>

Return the transform input function

#### Returns

`undefined` \| [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`ParameterSchema`\> : `never`\>\>, `MessagePayloadType`, `MessageParamsType`\>

the input transform function if defined

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:534](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L534)

___

### getTransformOutputFunction

▸ **getTransformOutputFunction**(): `undefined` \| [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>\>

Return the transform output function

#### Returns

`undefined` \| [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>\>

the transform output function if defined

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:593](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L593)

___

### receiveMessageOnEveryInstance

▸ **receiveMessageOnEveryInstance**(`enforce?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Instruct the event bridge message broker to send the matching message to every running instance.
The underlaying message broker must support this functionality.

In serverless environments, this flag should not have any effect

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enforce` | `boolean` | `true` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinition

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:304](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L304)

___

### setAfterGuardHooks

▸ **setAfterGuardHooks**(`afterGuards`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuards` | `Record`\<`string`, [`SubscriptionAfterGuardHook`](../modules/purista_core.md#subscriptionafterguardhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ParameterSchema`\> : `never`\>\>, `Invokes`, `EmitListType`\>\> |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:628](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L628)

___

### setBeforeGuardHooks

▸ **setBeforeGuardHooks**(`beforeGuards`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `beforeGuards` | `Record`\<`string`, [`SubscriptionBeforeGuardHook`](../modules/purista_core.md#subscriptionbeforeguardhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ParameterSchema`\> : `never`\>\>, `Invokes`, `EmitListType`\>\> | Object of key = name of guard, value = function |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:612](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L612)

___

### setSubscriptionFunction

▸ **setSubscriptionFunction**(`fn`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Anonymous functions do not have access to the `this` scope.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`SubscriptionFunction`](../modules/purista_core.md#subscriptionfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `Infer`\<`PayloadSchema`\>, `Infer`\<`ParameterSchema`\>, `Infer`\<`ResultSchema`\>, `Invokes`, `EmitListType`\> | the function implementation |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

**`Example`**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:661](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L661)

___

### setTransformInput

▸ **setTransformInput**\<`TransFormPayloadSchema`, `TransFormParameterSchema`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`TransFormPayloadSchema` extends `Type` ? `TransFormPayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `TransFormPayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`TransFormPayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `TSchema` ? `Static`\<`TransFormPayloadSchema`\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`TransFormPayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`TransFormParameterSchema` extends `Type` ? `TransFormParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `TransFormParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`TransFormParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `TSchema` ? `Static`\<`TransFormParameterSchema`\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`TransFormParameterSchema`\> : `never`\>\>, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Set a transform input hook which will encode or transform the input payload and parameters.
Will be executed as first step before input validation, before guard and the function itself.
This will change the type of input message payload and input message parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TransFormPayloadSchema` | extends `Schema` |
| `TransFormParameterSchema` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformInputSchema` | `TransFormPayloadSchema` | Input payload validation schema |
| `transformParameterSchema` | `TransFormParameterSchema` | Input parameter validation schema |
| `transformFunction` | [`SubscriptionTransformInputHook`](../modules/purista_core.md#subscriptiontransforminputhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`PayloadSchema` extends `Type` ? `PayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`PayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `PayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`PayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `TSchema` ? `Static`\<`PayloadSchema`\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`PayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`PayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`TransFormPayloadSchema` extends `Type` ? `TransFormPayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `TransFormPayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`TransFormPayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `TSchema` ? `Static`\<`TransFormPayloadSchema`\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`TransFormPayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`TransFormParameterSchema` extends `Type` ? `TransFormParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `TransFormParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`TransFormParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `TSchema` ? `Static`\<`TransFormParameterSchema`\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`TransFormParameterSchema`\> : `never`\>\>\> | the transform input function |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`TransFormPayloadSchema` extends `Type` ? `TransFormPayloadSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `CustomSchema`\<`any`\> ? keyof `TransFormPayloadSchema` extends `never` ? `Awaited`\<`ReturnType`\<`TransFormPayloadSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `TSchema` ? `Static`\<`TransFormPayloadSchema`\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormPayloadSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`TransFormPayloadSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`TransFormParameterSchema` extends `Type` ? `TransFormParameterSchema`[``"inferIn"``] : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `TransFormParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`TransFormParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `TSchema` ? `Static`\<`TransFormParameterSchema`\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`TransFormParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`TransFormParameterSchema`\> : `never`\>\>, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:496](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L496)

___

### setTransformOutput

▸ **setTransformOutput**\<`Output`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Set a transform output hook which will encode or transform the response payload.
Will be executed at very last step after function execution, output validation and after guard hooks.
This will change the type of output message payload.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Output` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformOutputSchema` | `Output` | The output validation schema |
| `transformFunction` | [`SubscriptionTransformOutputHook`](../modules/purista_core.md#subscriptiontransformoutputhook)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`ResultSchema` extends `Type` ? `ResultSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ResultSchema` extends `CustomSchema`\<`any`\> ? keyof `ResultSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ResultSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `TSchema` ? `Static`\<`ResultSchema`\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ResultSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ResultSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`ParameterSchema` extends `Type` ? `ParameterSchema`[``"infer"``] : `never`\> \| `IfDefined`\<`ParameterSchema` extends `CustomSchema`\<`any`\> ? keyof `ParameterSchema` extends `never` ? `Awaited`\<`ReturnType`\<`ParameterSchema`\>\> : `never` : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `TSchema` ? `Static`\<`ParameterSchema`\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`ParameterSchema` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`ParameterSchema`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Output`\> : `never`\>\>\> | the transform output function |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:558](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L558)

___

### subscribeToEvent

▸ **subscribeToEvent**\<`N`, `V`\>(`eventName`, `serviceVersion?`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

Add a filter to only subscribe to messages with matching event name

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `string` |
| `V` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`N`\> | The name of event to subscribe |
| `serviceVersion?` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`V`\> | the version of the service that produces the event |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `PayloadSchema`, `ParameterSchema`, `ResultSchema`, `Invokes`, `EmitListType`\>

SubscriptionDefinitionBuilder

#### Defined in

[SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts:248](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts#L248)
