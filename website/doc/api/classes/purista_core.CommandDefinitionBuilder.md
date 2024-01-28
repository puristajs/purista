[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / CommandDefinitionBuilder

# Class: CommandDefinitionBuilder\<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, FunctionPayloadType, FunctionParamsType, FunctionResultType, Invokes, EmitListType\>

[@purista/core](../modules/purista_core.md).CommandDefinitionBuilder

Command definition builder is a helper to create and define a command for a service.
It helps to set all needed information like schemas and hooks.
With these information, the types are automatically set and extended.

A working schema definition needs at least a command name, a short description and the function implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |
| `Invokes` | {} |
| `EmitListType` | {} |

## Table of contents

### Constructors

- [constructor](purista_core.CommandDefinitionBuilder.md#constructor)

### Properties

- [autoacknowledge](purista_core.CommandDefinitionBuilder.md#autoacknowledge)
- [commandDescription](purista_core.CommandDefinitionBuilder.md#commanddescription)
- [commandName](purista_core.CommandDefinitionBuilder.md#commandname)
- [deprecated](purista_core.CommandDefinitionBuilder.md#deprecated)
- [durable](purista_core.CommandDefinitionBuilder.md#durable)
- [emitList](purista_core.CommandDefinitionBuilder.md#emitlist)
- [errorStatusCodes](purista_core.CommandDefinitionBuilder.md#errorstatuscodes)
- [eventName](purista_core.CommandDefinitionBuilder.md#eventname)
- [fn](purista_core.CommandDefinitionBuilder.md#fn)
- [hooks](purista_core.CommandDefinitionBuilder.md#hooks)
- [httpMetadata](purista_core.CommandDefinitionBuilder.md#httpmetadata)
- [inputContentEncoding](purista_core.CommandDefinitionBuilder.md#inputcontentencoding)
- [inputContentType](purista_core.CommandDefinitionBuilder.md#inputcontenttype)
- [inputSchema](purista_core.CommandDefinitionBuilder.md#inputschema)
- [invokes](purista_core.CommandDefinitionBuilder.md#invokes)
- [isSecure](purista_core.CommandDefinitionBuilder.md#issecure)
- [operationId](purista_core.CommandDefinitionBuilder.md#operationid)
- [outputContentEncoding](purista_core.CommandDefinitionBuilder.md#outputcontentencoding)
- [outputContentType](purista_core.CommandDefinitionBuilder.md#outputcontenttype)
- [outputSchema](purista_core.CommandDefinitionBuilder.md#outputschema)
- [parameterSchema](purista_core.CommandDefinitionBuilder.md#parameterschema)
- [queryParameter](purista_core.CommandDefinitionBuilder.md#queryparameter)
- [summary](purista_core.CommandDefinitionBuilder.md#summary)
- [tags](purista_core.CommandDefinitionBuilder.md#tags)

### Methods

- [addOpenApiErrorStatusCodes](purista_core.CommandDefinitionBuilder.md#addopenapierrorstatuscodes)
- [addOpenApiTags](purista_core.CommandDefinitionBuilder.md#addopenapitags)
- [addOutputSchema](purista_core.CommandDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](purista_core.CommandDefinitionBuilder.md#addparameterschema)
- [addPayloadSchema](purista_core.CommandDefinitionBuilder.md#addpayloadschema)
- [addQueryParameters](purista_core.CommandDefinitionBuilder.md#addqueryparameters)
- [adviceAutoacknowledgeMessages](purista_core.CommandDefinitionBuilder.md#adviceautoacknowledgemessages)
- [canEmit](purista_core.CommandDefinitionBuilder.md#canemit)
- [canInvoke](purista_core.CommandDefinitionBuilder.md#caninvoke)
- [disableHttpSecurity](purista_core.CommandDefinitionBuilder.md#disablehttpsecurity)
- [enableHttpSecurity](purista_core.CommandDefinitionBuilder.md#enablehttpsecurity)
- [exposeAsHttpEndpoint](purista_core.CommandDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](purista_core.CommandDefinitionBuilder.md#extendwithhttpmetadata)
- [getCommandContextMock](purista_core.CommandDefinitionBuilder.md#getcommandcontextmock)
- [getCommandFunction](purista_core.CommandDefinitionBuilder.md#getcommandfunction)
- [getCommandTransformContextMock](purista_core.CommandDefinitionBuilder.md#getcommandtransformcontextmock)
- [getDefinition](purista_core.CommandDefinitionBuilder.md#getdefinition)
- [getTransformInputFunction](purista_core.CommandDefinitionBuilder.md#gettransforminputfunction)
- [getTransformOutputFunction](purista_core.CommandDefinitionBuilder.md#gettransformoutputfunction)
- [markAsDeprecated](purista_core.CommandDefinitionBuilder.md#markasdeprecated)
- [setAfterGuardHooks](purista_core.CommandDefinitionBuilder.md#setafterguardhooks)
- [setBeforeGuardHooks](purista_core.CommandDefinitionBuilder.md#setbeforeguardhooks)
- [setCommandFunction](purista_core.CommandDefinitionBuilder.md#setcommandfunction)
- [setOpenApiOperationId](purista_core.CommandDefinitionBuilder.md#setopenapioperationid)
- [setOpenApiSummary](purista_core.CommandDefinitionBuilder.md#setopenapisummary)
- [setSuccessEventName](purista_core.CommandDefinitionBuilder.md#setsuccesseventname)
- [setTransformInput](purista_core.CommandDefinitionBuilder.md#settransforminput)
- [setTransformOutput](purista_core.CommandDefinitionBuilder.md#settransformoutput)

## Constructors

### constructor

• **new CommandDefinitionBuilder**\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>(`commandName`, `commandDescription`, `eventName?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)\<`unknown`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |
| `Invokes` | {} |
| `EmitListType` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `commandDescription` | `string` |
| `eventName?` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:133](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L133)

## Properties

### autoacknowledge

• `Private` **autoacknowledge**: `boolean` = `true`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:70](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L70)

___

### commandDescription

• `Private` **commandDescription**: `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:135](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L135)

___

### commandName

• `Private` **commandName**: `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:134](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L134)

___

### deprecated

• `Private` **deprecated**: `boolean` = `false`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:59](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L59)

___

### durable

• `Private` **durable**: `boolean` = `false`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:69](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L69)

___

### emitList

• `Private` **emitList**: `EmitListType`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:77](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L77)

___

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/purista_core.StatusCode.md)[] = `[]`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:63](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L63)

___

### eventName

• `Private` `Optional` **eventName**: `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:136](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L136)

___

### fn

• `Private` `Optional` **fn**: [`CommandFunction`](../modules/purista_core.md#commandfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:121](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L121)

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard` | `Record`\<`string`, [`CommandAfterGuardHook`](../modules/purista_core.md#commandafterguardhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`, `Invokes`, `EmitListType`\>\> |
| `beforeGuard` | `Record`\<`string`, [`CommandBeforeGuardHook`](../modules/purista_core.md#commandbeforeguardhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Invokes`, `EmitListType`\>\> |
| `transformInput?` | \{ `transformFunction`: [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)\<`ServiceClassType`, `any`, `any`, `any`, `any`\> ; `transformInputSchema`: `Schema` ; `transformParameterSchema`: `Schema`  } |
| `transformInput.transformFunction` | [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)\<`ServiceClassType`, `any`, `any`, `any`, `any`\> |
| `transformInput.transformInputSchema` | `Schema` |
| `transformInput.transformParameterSchema` | `Schema` |
| `transformOutput?` | \{ `transformFunction`: [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)\<`ServiceClassType`, `any`, `any`, `any`, `any`, `any`\> ; `transformOutputSchema`: `Schema`  } |
| `transformOutput.transformFunction` | [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)\<`ServiceClassType`, `any`, `any`, `any`, `any`, `any`\> |
| `transformOutput.transformOutputSchema` | `Schema` |

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:79](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L79)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | \{ `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & \{ `http`: \{ `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: \{ `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)\<`FunctionParamsType`\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L47)

___

### inputContentEncoding

• `Private` **inputContentEncoding**: `undefined` \| `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:50](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L50)

___

### inputContentType

• `Private` **inputContentType**: `undefined` \| `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:49](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L49)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `Schema`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:48](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L48)

___

### invokes

• `Private` **invokes**: [`FromInvokeToOtherType`](../modules/purista_core.md#frominvoketoothertype)\<`Invokes`, \{ `outputSchema?`: `Schema` ; `parameterSchema?`: `Schema` ; `payloadSchema?`: `Schema`  }\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L72)

___

### isSecure

• `Private` **isSecure**: `boolean` = `true`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:65](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L65)

___

### operationId

• `Private` `Optional` **operationId**: `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:67](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L67)

___

### outputContentEncoding

• `Private` **outputContentEncoding**: `undefined` \| `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L53)

___

### outputContentType

• `Private` **outputContentType**: `undefined` \| `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:52](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L52)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `Schema`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:51](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L51)

___

### parameterSchema

• `Private` `Optional` **parameterSchema**: `Schema`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L54)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules/purista_core.md#queryparameter)\<`FunctionParamsType`\>[] = `[]`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:55](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L55)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L61)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:57](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L57)

## Methods

### addOpenApiErrorStatusCodes

▸ **addOpenApiErrorStatusCodes**(`...codes`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

If a function can return other status codes, than the default ones, you should add them to openApi definition.
Per default, 200, 204, 400, 401 and 500 can be autogenerated in most cases.
Special cases or different status codes should be added with this function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...codes` | [`StatusCode`](../enums/purista_core.StatusCode.md)[] | List of status codes |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

**`Example`**

```ts
addErrorStatusCodes(StatusCode.PaymentRequired, StatusCode.Conflict)
```

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:392](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L392)

___

### addOpenApiTags

▸ **addOpenApiTags**(`...tags`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Add tags for openApi definition for given function.
It is recommended to use some enum for tags to avoid typo issues.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...tags` | `string`[] | List of tag strings |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

**`Example`**

```ts
addTags('User','Public')
```

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:374](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L374)

___

### addOutputSchema

▸ **addOutputSchema**\<`T`\>(`outputSchema`, `outputContentType?`, `outputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `FunctionPayloadType`, `FunctionParamsType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `Invokes`, `EmitListType`\>

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outputSchema` | `T` | The schema validation for output payload |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `FunctionPayloadType`, `FunctionParamsType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:288](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L288)

___

### addParameterSchema

▸ **addParameterSchema**\<`T`\>(`parameterSchema`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageResultType`, `FunctionPayloadType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `FunctionResultType`, `Invokes`, `EmitListType`\>

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameterSchema` | `T` | The schema validation for output parameter |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageResultType`, `FunctionPayloadType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:320](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L320)

___

### addPayloadSchema

▸ **addPayloadSchema**\<`T`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageParamsType`, `MessageResultType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputSchema` | `T` | The schema validation for input payload |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, `MessageParamsType`, `MessageResultType`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:263](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L263)

___

### addQueryParameters

▸ **addQueryParameters**(`...queryParams`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Define query parameters if you expose the function as http endpoint.
Query parameters are add to openApi definition.
Query parameters are add to input parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...queryParams` | [`QueryParameter`](../modules/purista_core.md#queryparameter)\<`FunctionParamsType`\>[] | Add one or more query parameter definitions |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

**`Example`**

```ts
.addQueryParameters(
  {
    required: false,
    name: 'search',
  },
  {
    required: false,
    name: 'limit',
  },
)
```

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:357](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L357)

___

### adviceAutoacknowledgeMessages

▸ **adviceAutoacknowledgeMessages**(`acknowledge?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Instruct the event bridge message broker to autoacknowledge commands as soon as they arrive.
This means, a message will not be resent, if the command execution fails unexpected.

If set to false, the command message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the command execution fails unexpected
- if sending of command response failed

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `acknowledge` | `boolean` | `true` | Enable (true) and disable (false) |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinition

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:724](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L724)

___

### canEmit

▸ **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType` & `Record`\<`EventName`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>\>\>

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

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType` & `Record`\<`EventName`, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>\>\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:224](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L224)

___

### canInvoke

▸ **canInvoke**\<`Output`, `Payload`, `Parameter`, `SName`, `Version`, `Fname`\>(`serviceName`, `serviceVersion`, `serviceTarget`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes` & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`: `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `parameter`: `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>) => `Promise`\<`UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>\>\>\>\>, `EmitListType`\>

Define a command which can be invoked by the current command

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

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes` & `Record`\<`SName`, `Record`\<`Version`, `Record`\<`Fname`, (`payload`: `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `parameter`: `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>) => `Promise`\<`UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>\>\>\>\>, `EmitListType`\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:149](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L149)

___

### disableHttpSecurity

▸ **disableHttpSecurity**(`disabled?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `disabled` | `boolean` | `true` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:624](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L624)

___

### enableHttpSecurity

▸ **enableHttpSecurity**(`enabled?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `enabled` | `boolean` | `true` | Defaults to true if not set means "enable security" |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:614](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L614)

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Mark the function to be exposed as http endpoint.

Api url prefix and service version are prepended automatically

For exposing a url like: `/api/V1/user/login` simply provide `user/login`as path

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | [`SupportedHttpMethod`](../modules/purista_core.md#supportedhttpmethod) | Http method POST, PUT, PATCH, GET, DELETE |
| `path` | `string` | The url path |
| `contentTypeRequest?` | `string` | input content type defaults to application/json |
| `contentEncodingRequest?` | `string` | input content encoding defaults to utf-8 |
| `contentTypeResponse?` | `string` | input content type defaults to application/json |
| `contentEncodingResponse?` | `string` | input content encoding defaults to utf-8 |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:586](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L586)

___

### extendWithHttpMetadata

▸ **extendWithHttpMetadata**(`definition`): [`Complete`](../modules/purista_core.md#complete)\<[`CommandDefinition`](../modules/purista_core.md#commanddefinition)\<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`Complete`](../modules/purista_core.md#complete)\<[`CommandDefinition`](../modules/purista_core.md#commanddefinition)\<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>\> |

#### Returns

[`Complete`](../modules/purista_core.md#complete)\<[`CommandDefinition`](../modules/purista_core.md#commanddefinition)\<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:655](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L655)

___

### getCommandContextMock

▸ **getCommandContextMock**(`payload`, `parameter`, `sandbox?`): `Object`

Returns a mocked command function context, which can be used in unit tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `MessagePayloadType` | - |
| `parameter` | `MessageParamsType` | - |
| `sandbox?` | `SinonSandbox` | Sinon sandbox |

#### Returns

`Object`

a mocked command function context

| Name | Type |
| :------ | :------ |
| `mock` | \{ `configs`: \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } ; `emit`: [`EmitCustomMessageFunction`](../modules/purista_core.md#emitcustommessagefunction)\<`EmitListType`\> ; `invoke`: [`InvokeFunction`](../modules/purista_core.md#invokefunction) ; `logger`: [`Logger`](purista_core.Logger.md) ; `message`: `Readonly`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `MessageParamsType` ; `payload`: `MessagePayloadType`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> ; `secrets`: \{ `getSecret`: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)  } ; `service`: `Invokes` ; `startActiveSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>) => `Promise`\<`F`\> ; `states`: \{ `getState`: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)  } ; `wrapInSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>, `context?`: `Context`) => `Promise`\<`F`\>  } |
| `mock.configs` | \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction) |
| `mock.emit` | [`EmitCustomMessageFunction`](../modules/purista_core.md#emitcustommessagefunction)\<`EmitListType`\> |
| `mock.invoke` | [`InvokeFunction`](../modules/purista_core.md#invokefunction) |
| `mock.logger` | [`Logger`](purista_core.Logger.md) |
| `mock.message` | `Readonly`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `MessageParamsType` ; `payload`: `MessagePayloadType`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
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

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:915](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L915)

___

### getCommandFunction

▸ **getCommandFunction**(): [`CommandFunction`](../modules/purista_core.md#commandfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Get the function implementation

#### Returns

[`CommandFunction`](../modules/purista_core.md#commandfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

the function

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:878](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L878)

___

### getCommandTransformContextMock

▸ **getCommandTransformContextMock**(`payload`, `parameter`, `sandbox?`): `Object`

Returns a mocked transform function context, which can be used in unit tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `MessagePayloadType` | - |
| `parameter` | `MessageParamsType` | - |
| `sandbox?` | `SinonSandbox` | Sinon sandbox |

#### Returns

`Object`

a mocked transform function context

| Name | Type |
| :------ | :------ |
| `mock` | \{ `configs`: \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } ; `logger`: [`Logger`](purista_core.Logger.md) ; `message`: `Readonly`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `MessageParamsType` ; `payload`: `MessagePayloadType`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> ; `secrets`: \{ `getSecret`: [`SecretGetterFunction`](../modules/purista_core.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](../modules/purista_core.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](../modules/purista_core.md#secretsetterfunction)  } ; `startActiveSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `undefined` \| `Context`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>) => `Promise`\<`F`\> ; `states`: \{ `getState`: [`StateGetterFunction`](../modules/purista_core.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](../modules/purista_core.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](../modules/purista_core.md#statesetterfunction)  } ; `wrapInSpan`: \<F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`\<`F`\>, `context?`: `Context`) => `Promise`\<`F`\>  } |
| `mock.configs` | \{ `getConfig`: [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction)  } |
| `mock.configs.getConfig` | [`ConfigGetterFunction`](../modules/purista_core.md#configgetterfunction) |
| `mock.configs.removeConfig` | [`ConfigDeleteFunction`](../modules/purista_core.md#configdeletefunction) |
| `mock.configs.setConfig` | [`ConfigSetterFunction`](../modules/purista_core.md#configsetterfunction) |
| `mock.logger` | [`Logger`](purista_core.Logger.md) |
| `mock.message` | `Readonly`\<\{ `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: \{ `parameter`: `MessageParamsType` ; `payload`: `MessagePayloadType`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: \{ `instanceId`: `string` ; `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  } ; `tenantId?`: `string` ; `timestamp`: `number` ; `traceId?`: `string`  }\> |
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

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:932](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L932)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)\<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Creates and returns the CommandDefinition used as input for the service.

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)\<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinition

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:733](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L733)

___

### getTransformInputFunction

▸ **getTransformInputFunction**(): `undefined` \| [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)\<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

Return the transform input function

#### Returns

`undefined` \| [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)\<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

the input transform function if defined

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:446](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L446)

___

### getTransformOutputFunction

▸ **getTransformOutputFunction**(): `undefined` \| [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionResultType`, `FunctionParamsType`\>

Return the transform output function

#### Returns

`undefined` \| [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionResultType`, `FunctionParamsType`\>

the transform output function if defined

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:507](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L507)

___

### markAsDeprecated

▸ **markAsDeprecated**(): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Mark this endpoint/command as deprecated

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:309](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L309)

___

### setAfterGuardHooks

▸ **setAfterGuardHooks**(`afterGuards`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuards` | `Record`\<`string`, [`CommandAfterGuardHook`](../modules/purista_core.md#commandafterguardhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`, `Invokes`, `EmitListType`\>\> |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:552](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L552)

___

### setBeforeGuardHooks

▸ **setBeforeGuardHooks**(`beforeGuards`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `beforeGuards` | `Record`\<`string`, [`CommandBeforeGuardHook`](../modules/purista_core.md#commandbeforeguardhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Invokes`, `EmitListType`\>\> | Object of key = name of guard, value = function |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:528](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L528)

___

### setCommandFunction

▸ **setCommandFunction**(`fn`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Anonymous functions do not have access to the `this` scope.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`CommandFunction`](../modules/purista_core.md#commandfunction)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\> | the function implementation |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

**`Example`**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:828](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L828)

___

### setOpenApiOperationId

▸ **setOpenApiOperationId**(`operationId`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Set the operationId for openApi documentation

#### Parameters

| Name | Type |
| :------ | :------ |
| `operationId` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:650](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L650)

___

### setOpenApiSummary

▸ **setOpenApiSummary**(`summary`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Set the function summary text used for example in openApi documentation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `summary` | `string` | Summary text |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

**`Example`**

```ts
setSummary('Some function summary')
```

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:640](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L640)

___

### setSuccessEventName

▸ **setSuccessEventName**\<`N`\>(`eventName`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`N`\> |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:250](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L250)

___

### setTransformInput

▸ **setTransformInput**\<`Payload`, `Parameter`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

Set a transform input hook which will encode or transform the input payload and parameters.
Will be executed as first step before input validation, before guard and the function itself.
This will change the type of input message payload and input message parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | extends `Schema` |
| `Parameter` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformInputSchema` | `Payload` | Input payload validation schema |
| `transformParameterSchema` | `Parameter` | Input parameter validation schema |
| `transformFunction` | [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)\<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>\> | Transform input function |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `UnknownIfNever`\<`IfDefined`\<`Payload` extends `Type` ? `Payload`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Payload` extends `CustomSchema`\<`any`\> ? keyof `Payload` extends `never` ? `Awaited`\<`ReturnType`\<`Payload`\>\> : `never` : `never`\> \| `IfDefined`\<`Payload` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `TSchema` ? `Static`\<`Payload`\> : `never`\> \| `IfDefined`\<`Payload` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Payload` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Payload`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`Parameter` extends `Type` ? `Parameter`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Parameter` extends `CustomSchema`\<`any`\> ? keyof `Parameter` extends `never` ? `Awaited`\<`ReturnType`\<`Parameter`\>\> : `never` : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `TSchema` ? `Static`\<`Parameter`\> : `never`\> \| `IfDefined`\<`Parameter` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Parameter` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Parameter`\> : `never`\>\>, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:408](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L408)

___

### setTransformOutput

▸ **setTransformOutput**\<`Output`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

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
| `transformFunction` | [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"inferIn"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`Output`\> : `never`\>\>, `FunctionResultType`, `FunctionParamsType`\> | Transform output function |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `UnknownIfNever`\<`IfDefined`\<`Output` extends `Type` ? `Output`[``"infer"``] : `never`\> \| `IfDefined`\<`Output` extends `CustomSchema`\<`any`\> ? keyof `Output` extends `never` ? `Awaited`\<`ReturnType`\<`Output`\>\> : `never` : `never`\> \| `IfDefined`\<`Output` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `TSchema` ? `Static`\<`Output`\> : `never`\> \| `IfDefined`\<`Output` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`Output` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`Output`\> : `never`\>\>, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`, `Invokes`, `EmitListType`\>

CommandDefinitionBuilder

#### Defined in

[CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:470](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L470)
