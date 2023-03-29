[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / CommandDefinitionBuilder

# Class: CommandDefinitionBuilder<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, FunctionPayloadType, FunctionParamsType, FunctionResultType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).CommandDefinitionBuilder

Command definition builder is a helper to create and define a command for a service.
It helps to set all needed information like schemas and hooks.
With these information, the types are automatically set and extended.

A working schema definition needs at least a command name, a short description and the function implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `MessageResultType` | `void` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.CommandDefinitionBuilder.md#constructor)

### Properties

- [autoacknowledge](purista_httpserver.internal.CommandDefinitionBuilder.md#autoacknowledge)
- [commandDescription](purista_httpserver.internal.CommandDefinitionBuilder.md#commanddescription)
- [commandName](purista_httpserver.internal.CommandDefinitionBuilder.md#commandname)
- [deprecated](purista_httpserver.internal.CommandDefinitionBuilder.md#deprecated)
- [durable](purista_httpserver.internal.CommandDefinitionBuilder.md#durable)
- [errorStatusCodes](purista_httpserver.internal.CommandDefinitionBuilder.md#errorstatuscodes)
- [eventName](purista_httpserver.internal.CommandDefinitionBuilder.md#eventname)
- [extendWithHttpMetadata](purista_httpserver.internal.CommandDefinitionBuilder.md#extendwithhttpmetadata)
- [fn](purista_httpserver.internal.CommandDefinitionBuilder.md#fn)
- [hooks](purista_httpserver.internal.CommandDefinitionBuilder.md#hooks)
- [httpMetadata](purista_httpserver.internal.CommandDefinitionBuilder.md#httpmetadata)
- [inputContentEncoding](purista_httpserver.internal.CommandDefinitionBuilder.md#inputcontentencoding)
- [inputContentType](purista_httpserver.internal.CommandDefinitionBuilder.md#inputcontenttype)
- [inputSchema](purista_httpserver.internal.CommandDefinitionBuilder.md#inputschema)
- [isSecure](purista_httpserver.internal.CommandDefinitionBuilder.md#issecure)
- [operationId](purista_httpserver.internal.CommandDefinitionBuilder.md#operationid)
- [outputContentEncoding](purista_httpserver.internal.CommandDefinitionBuilder.md#outputcontentencoding)
- [outputContentType](purista_httpserver.internal.CommandDefinitionBuilder.md#outputcontenttype)
- [outputSchema](purista_httpserver.internal.CommandDefinitionBuilder.md#outputschema)
- [parameterSchema](purista_httpserver.internal.CommandDefinitionBuilder.md#parameterschema)
- [queryParameter](purista_httpserver.internal.CommandDefinitionBuilder.md#queryparameter)
- [summary](purista_httpserver.internal.CommandDefinitionBuilder.md#summary)
- [tags](purista_httpserver.internal.CommandDefinitionBuilder.md#tags)

### Methods

- [addOpenApiErrorStatusCodes](purista_httpserver.internal.CommandDefinitionBuilder.md#addopenapierrorstatuscodes)
- [addOpenApiTags](purista_httpserver.internal.CommandDefinitionBuilder.md#addopenapitags)
- [addOutputSchema](purista_httpserver.internal.CommandDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](purista_httpserver.internal.CommandDefinitionBuilder.md#addparameterschema)
- [addPayloadSchema](purista_httpserver.internal.CommandDefinitionBuilder.md#addpayloadschema)
- [addQueryParameters](purista_httpserver.internal.CommandDefinitionBuilder.md#addqueryparameters)
- [adviceAutoacknowledgeMessages](purista_httpserver.internal.CommandDefinitionBuilder.md#adviceautoacknowledgemessages)
- [disableHttpSecurity](purista_httpserver.internal.CommandDefinitionBuilder.md#disablehttpsecurity)
- [enableHttpSecurity](purista_httpserver.internal.CommandDefinitionBuilder.md#enablehttpsecurity)
- [exposeAsHttpEndpoint](purista_httpserver.internal.CommandDefinitionBuilder.md#exposeashttpendpoint)
- [getCommandFunction](purista_httpserver.internal.CommandDefinitionBuilder.md#getcommandfunction)
- [getDefinition](purista_httpserver.internal.CommandDefinitionBuilder.md#getdefinition)
- [getTransformInputFunction](purista_httpserver.internal.CommandDefinitionBuilder.md#gettransforminputfunction)
- [getTransformOutputFunction](purista_httpserver.internal.CommandDefinitionBuilder.md#gettransformoutputfunction)
- [markAsDeprecated](purista_httpserver.internal.CommandDefinitionBuilder.md#markasdeprecated)
- [setAfterGuardHooks](purista_httpserver.internal.CommandDefinitionBuilder.md#setafterguardhooks)
- [setBeforeGuardHooks](purista_httpserver.internal.CommandDefinitionBuilder.md#setbeforeguardhooks)
- [setCommandFunction](purista_httpserver.internal.CommandDefinitionBuilder.md#setcommandfunction)
- [setOpenApiOperationId](purista_httpserver.internal.CommandDefinitionBuilder.md#setopenapioperationid)
- [setOpenApiSummary](purista_httpserver.internal.CommandDefinitionBuilder.md#setopenapisummary)
- [setSuccessEventName](purista_httpserver.internal.CommandDefinitionBuilder.md#setsuccesseventname)
- [setTransformInput](purista_httpserver.internal.CommandDefinitionBuilder.md#settransforminput)
- [setTransformOutput](purista_httpserver.internal.CommandDefinitionBuilder.md#settransformoutput)

## Constructors

### constructor

• **new CommandDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`commandName`, `commandDescription`, `eventName?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md)<`unknown`, `ServiceClassType`\> |
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

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:36

## Properties

### autoacknowledge

• `Private` **autoacknowledge**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:33

___

### commandDescription

• `Private` **commandDescription**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:15

___

### commandName

• `Private` **commandName**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:14

___

### deprecated

• `Private` **deprecated**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:27

___

### durable

• `Private` **durable**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:32

___

### errorStatusCodes

• `Private` **errorStatusCodes**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:29

___

### eventName

• `Private` `Optional` **eventName**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:16

___

### extendWithHttpMetadata

• `Private` **extendWithHttpMetadata**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:211

___

### fn

• `Private` `Optional` **fn**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:35

___

### hooks

• `Private` **hooks**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:34

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:17

___

### inputContentEncoding

• `Private` **inputContentEncoding**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:20

___

### inputContentType

• `Private` **inputContentType**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:19

___

### inputSchema

• `Private` `Optional` **inputSchema**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:18

___

### isSecure

• `Private` **isSecure**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:30

___

### operationId

• `Private` `Optional` **operationId**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:31

___

### outputContentEncoding

• `Private` **outputContentEncoding**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:23

___

### outputContentType

• `Private` **outputContentType**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:22

___

### outputSchema

• `Private` `Optional` **outputSchema**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:21

___

### parameterSchema

• `Private` `Optional` **parameterSchema**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:24

___

### queryParameter

• `Private` **queryParameter**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:25

___

### summary

• `Private` `Optional` **summary**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:28

___

### tags

• `Private` **tags**: `any`

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:26

## Methods

### addOpenApiErrorStatusCodes

▸ **addOpenApiErrorStatusCodes**(`...codes`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `...codes` | [`StatusCode`](../enums/purista_httpserver.internal.StatusCode.md)[] | List of status codes |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:117

___

### addOpenApiTags

▸ **addOpenApiTags**(`...tags`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:103

___

### addOutputSchema

▸ **addOutputSchema**<`I`, `D`, `O`\>(`outputSchema`, `outputContentType?`, `outputContentEncoding?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

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

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:55

___

### addParameterSchema

▸ **addParameterSchema**<`I`, `D`, `O`\>(`parameterSchema`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

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

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:67

___

### addPayloadSchema

▸ **addPayloadSchema**<`I`, `D`, `O`\>(`inputSchema`, `inputContentType?`, `inputContentEncoding?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

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

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:46

___

### addQueryParameters

▸ **addQueryParameters**(`...queryParams`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `...queryParams` | [`QueryParameter`](../modules/purista_httpserver.internal.md#queryparameter)<`FunctionParamsType`\>[] | Add one or more query parameter definitions |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:90

___

### adviceAutoacknowledgeMessages

▸ **adviceAutoacknowledgeMessages**(`acknowledge?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Instruct the event bridge message broker to autoacknowledge commands as soon as they arrive.
This means, a message will not be resent, if the command execution fails unexpected.

If set to false, the command message will be resent from message broker to eventbridge, if:
- the underlaying message broker supports it
- if the command execution fails unexpected
- if sending of command response failed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `acknowledge?` | `boolean` | Enable (true) and disable (false) |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinition

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:224

___

### disableHttpSecurity

▸ **disableHttpSecurity**(`disabled?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `disabled?` | `boolean` |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:192

___

### enableHttpSecurity

▸ **enableHttpSecurity**(`enabled?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `enabled?` | `boolean` | Defaults to true if not set means "enable security" |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:186

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Mark the function to be exposed as http endpoint.

Api url prefix and service version are prepended automatically

For exposing a url like: `/api/V1/user/login` simply provide `user/login`as path

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | [`SupportedHttpMethod`](../modules/purista_httpserver.internal.md#supportedhttpmethod) | Http method POST, PUT, PATCH, GET, DELETE |
| `path` | `string` | The url path |
| `contentTypeRequest?` | `string` | input content type defaults to application/json |
| `contentEncodingRequest?` | `string` | input content encoding defaults to utf-8 |
| `contentTypeResponse?` | `string` | input content type defaults to application/json |
| `contentEncodingResponse?` | `string` | input content encoding defaults to utf-8 |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:180

___

### getCommandFunction

▸ **getCommandFunction**(): [`CommandFunction`](../modules/purista_httpserver.internal.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Get the function implementation

#### Returns

[`CommandFunction`](../modules/purista_httpserver.internal.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

the function

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:251

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_httpserver.internal.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Creates and returns the CommandDefinition used as input for the service.

#### Returns

[`CommandDefinition`](../modules/purista_httpserver.internal.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](../modules/purista_httpserver.internal.md#commanddefinitionmetadatabase), `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinition

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:229

___

### getTransformInputFunction

▸ **getTransformInputFunction**(): `undefined` \| [`CommandTransformInputHook`](../modules/purista_httpserver.internal.md#commandtransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

Return the transform input function

#### Returns

`undefined` \| [`CommandTransformInputHook`](../modules/purista_httpserver.internal.md#commandtransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `MessagePayloadType`, `MessageParamsType`\>

the input transform function if defined

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:134

___

### getTransformOutputFunction

▸ **getTransformOutputFunction**(): `undefined` \| [`CommandTransformOutputHook`](../modules/purista_httpserver.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `FunctionResultType`, `FunctionParamsType`, `MessageResultType`\>

Return the transform output function

#### Returns

`undefined` \| [`CommandTransformOutputHook`](../modules/purista_httpserver.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `FunctionResultType`, `FunctionParamsType`, `MessageResultType`\>

the transform output function if defined

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:150

___

### markAsDeprecated

▸ **markAsDeprecated**(): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Mark this endpoint/command as deprecated

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:60

___

### setAfterGuardHooks

▸ **setAfterGuardHooks**(`afterGuards`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuards` | `Record`<`string`, [`CommandAfterGuardHook`](../modules/purista_httpserver.internal.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:164

___

### setBeforeGuardHooks

▸ **setBeforeGuardHooks**(`beforeGuards`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `beforeGuards` | `Record`<`string`, [`CommandBeforeGuardHook`](../modules/purista_httpserver.internal.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | Object of key = name of guard, value = function |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:157

___

### setCommandFunction

▸ **setCommandFunction**(`fn`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `fn` | [`CommandFunction`](../modules/purista_httpserver.internal.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\> | the function implementation |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:246

___

### setOpenApiOperationId

▸ **setOpenApiOperationId**(`operationId`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set the operationId for openApi documentation

#### Parameters

| Name | Type |
| :------ | :------ |
| `operationId` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:210

___

### setOpenApiSummary

▸ **setOpenApiSummary**(`summary`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:204

___

### setSuccessEventName

▸ **setSuccessEventName**(`eventName`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:37

___

### setTransformInput

▸ **setTransformInput**<`PayloadIn`, `ParamsIn`, `PayloadOut`, `ParamsOut`, `PayloadD`, `ParamsD`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`, `inputContentType?`, `inputContentEncoding?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `transformFunction` | [`CommandTransformInputHook`](../modules/purista_httpserver.internal.md#commandtransforminputhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`, `PayloadIn`, `ParamsIn`\> | Transform input function |
| `inputContentType?` | `string` | optional the content type of payload |
| `inputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:129

___

### setTransformOutput

▸ **setTransformOutput**<`PayloadOut`, `PayloadD`, `PayloadIn`\>(`transformOutputSchema`, `transformFunction`, `outputContentType?`, `outputContentEncoding?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `transformFunction` | [`CommandTransformOutputHook`](../modules/purista_httpserver.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `FunctionResultType`, `FunctionParamsType`, `PayloadIn`\> | Transform output function |
| `outputContentType?` | `string` | optional the content type of payload |
| `outputContentEncoding?` | `string` | optional the content encoding |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

CommandDefinitionBuilder

#### Defined in

packages/core/lib/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.d.ts:145
