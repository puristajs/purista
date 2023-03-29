[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / CommandDefinitionBuilder

# Class: CommandDefinitionBuilder<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, FunctionPayloadType, FunctionParamsType, FunctionResultType\>

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

## Table of contents

### Constructors

- [constructor](purista_core.CommandDefinitionBuilder.md#constructor)

### Properties

- [autoacknowledge](purista_core.CommandDefinitionBuilder.md#autoacknowledge)
- [commandDescription](purista_core.CommandDefinitionBuilder.md#commanddescription)
- [commandName](purista_core.CommandDefinitionBuilder.md#commandname)
- [deprecated](purista_core.CommandDefinitionBuilder.md#deprecated)
- [durable](purista_core.CommandDefinitionBuilder.md#durable)
- [errorStatusCodes](purista_core.CommandDefinitionBuilder.md#errorstatuscodes)
- [eventName](purista_core.CommandDefinitionBuilder.md#eventname)
- [fn](purista_core.CommandDefinitionBuilder.md#fn)
- [hooks](purista_core.CommandDefinitionBuilder.md#hooks)
- [httpMetadata](purista_core.CommandDefinitionBuilder.md#httpmetadata)
- [inputContentEncoding](purista_core.CommandDefinitionBuilder.md#inputcontentencoding)
- [inputContentType](purista_core.CommandDefinitionBuilder.md#inputcontenttype)
- [inputSchema](purista_core.CommandDefinitionBuilder.md#inputschema)
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
- [disableHttpSecurity](purista_core.CommandDefinitionBuilder.md#disablehttpsecurity)
- [enableHttpSecurity](purista_core.CommandDefinitionBuilder.md#enablehttpsecurity)
- [exposeAsHttpEndpoint](purista_core.CommandDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](purista_core.CommandDefinitionBuilder.md#extendwithhttpmetadata)
- [getCommandFunction](purista_core.CommandDefinitionBuilder.md#getcommandfunction)
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

• **new CommandDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`commandName`, `commandDescription`, `eventName?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`unknown`, `ServiceClassType`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `commandDescription` | `string` |
| `eventName?` | `string` |

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:113](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L113)

## Properties

### autoacknowledge

• `Private` **autoacknowledge**: `boolean` = `true`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:63](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L63)

___

### commandDescription

• `Private` **commandDescription**: `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:113](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L113)

___

### commandName

• `Private` **commandName**: `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:113](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L113)

___

### deprecated

• `Private` **deprecated**: `boolean` = `false`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:52](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L52)

___

### durable

• `Private` **durable**: `boolean` = `false`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:62](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L62)

___

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/purista_core.StatusCode.md)[] = `[]`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:56](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L56)

___

### eventName

• `Private` `Optional` **eventName**: `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:113](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L113)

___

### fn

• `Private` `Optional` **fn**: [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:103](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L103)

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard` | `Record`<`string`, [`CommandAfterGuardHook`](../modules/purista_core.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |
| `beforeGuard` | `Record`<`string`, [`CommandBeforeGuardHook`](../modules/purista_core.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |
| `transformInput?` | { `transformFunction`: [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)<`ServiceClassType`, `any`, `any`, `any`, `any`\> ; `transformInputSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\> ; `transformParameterSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\>  } |
| `transformInput.transformFunction` | [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)<`ServiceClassType`, `any`, `any`, `any`, `any`\> |
| `transformInput.transformInputSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |
| `transformInput.transformParameterSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |
| `transformOutput?` | { `transformFunction`: [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `any`, `any`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\>  } |
| `transformOutput.transformFunction` | [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `any`, `any`, `FunctionParamsType`, `any`\> |
| `transformOutput.transformOutputSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:65](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L65)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta)<`FunctionParamsType`\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:40](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L40)

___

### inputContentEncoding

• `Private` **inputContentEncoding**: `undefined` \| `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L43)

___

### inputContentType

• `Private` **inputContentType**: `undefined` \| `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L42)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:41](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L41)

___

### isSecure

• `Private` **isSecure**: `boolean` = `true`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:58](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L58)

___

### operationId

• `Private` `Optional` **operationId**: `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:60](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L60)

___

### outputContentEncoding

• `Private` **outputContentEncoding**: `undefined` \| `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:46](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L46)

___

### outputContentType

• `Private` **outputContentType**: `undefined` \| `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:45](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L45)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L44)

___

### parameterSchema

• `Private` `Optional` **parameterSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L47)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules/purista_core.md#queryparameter)<`FunctionParamsType`\>[] = `[]`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:48](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L48)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:54](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L54)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:50](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L50)

## Methods

### addOpenApiErrorStatusCodes

▸ **addOpenApiErrorStatusCodes**(`...codes`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

If a function can return other status codes, than the default ones, you should add them to openApi definition.
Per default, 200, 204, 400, 401 and 500 can be autogenerated in most cases.
Special cases or different status codes should be added with this function.

**`Example`**

```ts
addErrorStatusCodes(StatusCode.PaymentRequired, StatusCode.Conflict)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...codes` | [`StatusCode`](../enums/purista_core.StatusCode.md)[] | List of status codes |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:265](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L265)

___

### addOpenApiTags

▸ **addOpenApiTags**(`...tags`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Add tags for openApi definition for given function.
It is recommended to use some enum for tags to avoid typo issues.

**`Example`**

```ts
addTags('User','Public')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...tags` | `string`[] | List of tag strings |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:247](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L247)

___

### addOutputSchema

▸ **addOutputSchema**<`I`, `D`, `O`\>(`outputSchema`, `outputContentType?`, `outputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `D` | extends `ZodTypeDef` |
| `O` | `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outputSchema` | `ZodType`<`O`, `D`, `I`\> | The schema validation for output payload |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:161](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L161)

___

### addParameterSchema

▸ **addParameterSchema**<`I`, `D`, `O`\>(`parameterSchema`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `D` | extends `ZodTypeDef` |
| `O` | `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parameterSchema` | `ZodType`<`O`, `D`, `I`\> | The schema validation for output parameter |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:195](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L195)

___

### addPayloadSchema

▸ **addPayloadSchema**<`I`, `D`, `O`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `unknown` |
| `D` | extends `ZodTypeDef` = `ZodTypeDef` |
| `O` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputSchema` | `ZodType`<`O`, `D`, `I`\> | The schema validation for input payload |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:134](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L134)

___

### addQueryParameters

▸ **addQueryParameters**(`...queryParams`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Define query parameters if you expose the function as http endpoint.
Query parameters are add to openApi definition.
Query parameters are add to input parameters.

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...queryParams` | [`QueryParameter`](../modules/purista_core.md#queryparameter)<`FunctionParamsType`\>[] | Add one or more query parameter definitions |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:230](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L230)

___

### adviceAutoacknowledgeMessages

▸ **adviceAutoacknowledgeMessages**(`acknowledge?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinition

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:589](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L589)

___

### disableHttpSecurity

▸ **disableHttpSecurity**(`disabled?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `disabled` | `boolean` | `true` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:493](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L493)

___

### enableHttpSecurity

▸ **enableHttpSecurity**(`enabled?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `enabled` | `boolean` | `true` | Defaults to true if not set means "enable security" |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:483](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L483)

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:455](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L455)

___

### extendWithHttpMetadata

▸ `Private` **extendWithHttpMetadata**(`definition`): [`Complete`](../modules/purista_core.md#complete)<[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`Complete`](../modules/purista_core.md#complete)<[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>\> |

#### Returns

[`Complete`](../modules/purista_core.md#complete)<[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:524](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L524)

___

### getCommandFunction

▸ **getCommandFunction**(): [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\>

Get the function implementation

#### Returns

[`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\>

the function

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:731](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L731)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Creates and returns the CommandDefinition used as input for the service.

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_core.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinition

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:598](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L598)

___

### getTransformInputFunction

▸ **getTransformInputFunction**(): `undefined` \| [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

Return the transform input function

#### Returns

`undefined` \| [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

the input transform function if defined

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:324](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L324)

___

### getTransformOutputFunction

▸ **getTransformOutputFunction**(): `undefined` \| [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `FunctionResultType`, `FunctionParamsType`, `MessageResultType`\>

Return the transform output function

#### Returns

`undefined` \| [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `FunctionResultType`, `FunctionParamsType`, `MessageResultType`\>

the transform output function if defined

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:381](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L381)

___

### markAsDeprecated

▸ **markAsDeprecated**(): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Mark this endpoint/command as deprecated

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:184](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L184)

___

### setAfterGuardHooks

▸ **setAfterGuardHooks**(`afterGuards`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuards` | `Record`<`string`, [`CommandAfterGuardHook`](../modules/purista_core.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:423](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L423)

___

### setBeforeGuardHooks

▸ **setBeforeGuardHooks**(`beforeGuards`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `beforeGuards` | `Record`<`string`, [`CommandBeforeGuardHook`](../modules/purista_core.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | Object of key = name of guard, value = function |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:401](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L401)

___

### setCommandFunction

▸ **setCommandFunction**(`fn`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Required: Set the function implementation.
The types should be automatically set as soon as schemas previously defined.
As the function will be a a function of a service class you need to implement as function declaration.
Anonymous functions do not have access to the `this` scope.

**`Example`**

```ts
async function (context, payload, parameter) {

   return `the result output payload`
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | the function implementation |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:689](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L689)

___

### setOpenApiOperationId

▸ **setOpenApiOperationId**(`operationId`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set the operationId for openApi documentation

#### Parameters

| Name | Type |
| :------ | :------ |
| `operationId` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:519](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L519)

___

### setOpenApiSummary

▸ **setOpenApiSummary**(`summary`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set the function summary text used for example in openApi documentation

**`Example`**

```ts
setSummary('Some function summary')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `summary` | `string` | Summary text |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:509](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L509)

___

### setSuccessEventName

▸ **setSuccessEventName**(`eventName`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:121](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L121)

___

### setTransformInput

▸ **setTransformInput**<`PayloadIn`, `ParamsIn`, `PayloadOut`, `ParamsOut`, `PayloadD`, `ParamsD`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set a transform input hook which will encode or transform the input payload and parameters.
Will be executed as first step before input validation, before guard and the function itself.
This will change the type of input message payload and input message parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadIn` | `MessagePayloadType` |
| `ParamsIn` | `MessageParamsType` |
| `PayloadOut` | `MessagePayloadType` |
| `ParamsOut` | `MessageParamsType` |
| `PayloadD` | extends `ZodTypeDef` = `ZodTypeDef` |
| `ParamsD` | extends `ZodTypeDef` = `ZodTypeDef` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformInputSchema` | `ZodType`<`PayloadOut`, `PayloadD`, `PayloadIn`\> | Input payload validation schema |
| `transformParameterSchema` | `ZodType`<`ParamsOut`, `ParamsD`, `ParamsIn`\> | Input parameter validation schema |
| `transformFunction` | [`CommandTransformInputHook`](../modules/purista_core.md#commandtransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `PayloadIn`, `ParamsIn`\> | Transform input function |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:281](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L281)

___

### setTransformOutput

▸ **setTransformOutput**<`PayloadOut`, `PayloadD`, `PayloadIn`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set a transform output hook which will encode or transform the response payload.
Will be executed at very last step after function execution, output validation and after guard hooks.
This will change the type of output message payload.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadOut` | `PayloadOut` |
| `PayloadD` | extends `ZodTypeDef` |
| `PayloadIn` | `PayloadIn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformOutputSchema` | `ZodType`<`PayloadOut`, `PayloadD`, `PayloadIn`\> | The output validation schema |
| `transformFunction` | [`CommandTransformOutputHook`](../modules/purista_core.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `FunctionResultType`, `FunctionParamsType`, `PayloadIn`\> | Transform output function |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

[packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts:348](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts#L348)
