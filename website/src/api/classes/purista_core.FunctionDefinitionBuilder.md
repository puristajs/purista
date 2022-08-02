[PURISTA API - v1.4.3](../README.md) / [@purista/core](../modules/purista_core.md) / FunctionDefinitionBuilder

# Class: FunctionDefinitionBuilder<ServiceClassType, MessagePayloadType, MessageParamsType, MessageResultType, FunctionPayloadType, FunctionParamsType, FunctionResultType\>

[@purista/core](../modules/purista_core.md).FunctionDefinitionBuilder

Function definition builder is a helper to create and define a function for a service.
It helps to set all needed information like schemas and hooks.
With these information, the types are automatically set and extended.

A working schema definition needs at least a function name, a short description and the function implementation.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](purista_core.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

## Table of contents

### Constructors

- [constructor](purista_core.FunctionDefinitionBuilder.md#constructor)

### Properties

- [errorStatusCodes](purista_core.FunctionDefinitionBuilder.md#errorstatuscodes)
- [fn](purista_core.FunctionDefinitionBuilder.md#fn)
- [hooks](purista_core.FunctionDefinitionBuilder.md#hooks)
- [httpMetadata](purista_core.FunctionDefinitionBuilder.md#httpmetadata)
- [inputSchema](purista_core.FunctionDefinitionBuilder.md#inputschema)
- [isSecure](purista_core.FunctionDefinitionBuilder.md#issecure)
- [outputSchema](purista_core.FunctionDefinitionBuilder.md#outputschema)
- [paramsSchema](purista_core.FunctionDefinitionBuilder.md#paramsschema)
- [queryParameter](purista_core.FunctionDefinitionBuilder.md#queryparameter)
- [summary](purista_core.FunctionDefinitionBuilder.md#summary)
- [tags](purista_core.FunctionDefinitionBuilder.md#tags)

### Methods

- [addErrorStatusCodes](purista_core.FunctionDefinitionBuilder.md#adderrorstatuscodes)
- [addInputSchema](purista_core.FunctionDefinitionBuilder.md#addinputschema)
- [addOutputSchema](purista_core.FunctionDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](purista_core.FunctionDefinitionBuilder.md#addparameterschema)
- [addQueryParameters](purista_core.FunctionDefinitionBuilder.md#addqueryparameters)
- [addTags](purista_core.FunctionDefinitionBuilder.md#addtags)
- [disableHttpSecurity](purista_core.FunctionDefinitionBuilder.md#disablehttpsecurity)
- [enableHttpSecurity](purista_core.FunctionDefinitionBuilder.md#enablehttpsecurity)
- [exposeAsHttpEndpoint](purista_core.FunctionDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](purista_core.FunctionDefinitionBuilder.md#extendwithhttpmetadata)
- [getDefinition](purista_core.FunctionDefinitionBuilder.md#getdefinition)
- [getFunction](purista_core.FunctionDefinitionBuilder.md#getfunction)
- [onFailure](purista_core.FunctionDefinitionBuilder.md#onfailure)
- [onSuccess](purista_core.FunctionDefinitionBuilder.md#onsuccess)
- [setAfterGuardHook](purista_core.FunctionDefinitionBuilder.md#setafterguardhook)
- [setBeforeGuardHook](purista_core.FunctionDefinitionBuilder.md#setbeforeguardhook)
- [setFunction](purista_core.FunctionDefinitionBuilder.md#setfunction)
- [setSuccessEventName](purista_core.FunctionDefinitionBuilder.md#setsuccesseventname)
- [setSummary](purista_core.FunctionDefinitionBuilder.md#setsummary)
- [transformInput](purista_core.FunctionDefinitionBuilder.md#transforminput)
- [transformOutput](purista_core.FunctionDefinitionBuilder.md#transformoutput)

## Constructors

### constructor

• **new FunctionDefinitionBuilder**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>(`commandName`, `commandDescription`, `eventName?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](purista_core.ServiceClass.md)<`unknown`, `ServiceClassType`\> |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:83](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L83)

## Properties

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/purista_core.StatusCode.md)[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L44)

___

### fn

• `Private` `Optional` **fn**: [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:73](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L73)

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard` | [`AfterGuardHook`](../modules/purista_core.md#afterguardhook)<`ServiceClassType`, `MessageResultType`, `MessagePayloadType`, `MessageParamsType`\>[] |
| `beforeGuard` | [`BeforeGuardHook`](../modules/purista_core.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] |
| `transformInput?` | { `transformFunction`: [`TransformInputHook`](../modules/purista_core.md#transforminputhook)<`ServiceClassType`, `any`, `any`, `any`, `any`\> ; `transformInputSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\> ; `transformParameterSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\>  } |
| `transformInput.transformFunction` | [`TransformInputHook`](../modules/purista_core.md#transforminputhook)<`ServiceClassType`, `any`, `any`, `any`, `any`\> |
| `transformInput.transformInputSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |
| `transformInput.transformParameterSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |
| `transformOutput?` | { `transformFunction`: [`TransformOutputHook`](../modules/purista_core.md#transformoutputhook)<`ServiceClassType`, `any`, `any`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `ZodType`<`any`, `ZodTypeDef`, `any`\>  } |
| `transformOutput.transformFunction` | [`TransformOutputHook`](../modules/purista_core.md#transformoutputhook)<`ServiceClassType`, `any`, `any`, `FunctionParamsType`, `any`\> |
| `transformOutput.transformOutputSchema` | `ZodType`<`any`, `ZodTypeDef`, `any`\> |

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:48](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L48)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta)

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:34](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L34)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:35](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L35)

___

### isSecure

• `Private` **isSecure**: `boolean` = `true`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:46](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L46)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:36](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L36)

___

### paramsSchema

• `Private` `Optional` **paramsSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:37](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L37)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules/purista_core.md#queryparameter)[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:38](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L38)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L42)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:40](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L40)

## Methods

### addErrorStatusCodes

▸ **addErrorStatusCodes**(...`codes`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

If a function can return other status codes you should add them to openApi definition.
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

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:210](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L210)

___

### addInputSchema

▸ **addInputSchema**<`I`, `D`, `O`\>(`inputSchema`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

Add a schema for input payload validation.
Types for payload of message and function payload input are generated from given schema.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `unknown` |
| `D` | `unknown` |
| `O` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputSchema` | `ZodType`<`O`, `D`, `I`\> | The schema validation for input payload |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `I`, `MessageParamsType`, `MessageResultType`, `O`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:102](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L102)

___

### addOutputSchema

▸ **addOutputSchema**<`I`, `D`, `O`\>(`outputSchema`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

Add a schema for output payload validation.
Types for payload of message and function payload output are generated from given schema.

#### Type parameters

| Name |
| :------ |
| `I` |
| `D` |
| `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outputSchema` | `ZodType`<`O`, `D`, `I`\> | The schema validation for output payload |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `O`, `FunctionPayloadType`, `FunctionParamsType`, `I`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:121](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L121)

___

### addParameterSchema

▸ **addParameterSchema**<`I`, `D`, `O`\>(`paramsSchema`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

Add a schema for output parameter validation.
Types for parameter of message and function parameter output are generated from given schema.

#### Type parameters

| Name |
| :------ |
| `I` |
| `D` |
| `O` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paramsSchema` | `ZodType`<`O`, `D`, `I`\> | The schema validation for output parameter |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `I`, `MessageResultType`, `FunctionPayloadType`, `O`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:140](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L140)

___

### addQueryParameters

▸ **addQueryParameters**(...`queryParams`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `...queryParams` | [`QueryParameter`](../modules/purista_core.md#queryparameter)[] | Add one or more query parameter definitions |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:175](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L175)

___

### addTags

▸ **addTags**(...`tags`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:192](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L192)

___

### disableHttpSecurity

▸ **disableHttpSecurity**(`enabled?`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `enabled` | `boolean` | `false` | Defaults to false if not set |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:365](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L365)

___

### enableHttpSecurity

▸ **enableHttpSecurity**(`enabled?`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `enabled` | `boolean` | `true` | Defaults to true if not set |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:355](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L355)

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentType?`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Mark the function to be exposed as http endpoint.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `method` | [`SupportedHttpMethod`](../modules/purista_core.md#supportedhttpmethod) | `undefined` | Http method POST, PUT, PATCH, GET, DELETE |
| `path` | `string` | `undefined` | The url path |
| `contentType` | `string` | `'application/json'` | response content type defaults to application/json |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:337](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L337)

___

### extendWithHttpMetadata

▸ `Private` **extendWithHttpMetadata**(`definition`): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\> |

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:386](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L386)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\>

Creates and returns the CommandDefinition used as input for the service.

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`ServiceClassType`, `Record`<`string`, `unknown`\>, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`\>

CommandDefinition

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:439](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L439)

___

### getFunction

▸ **getFunction**(): [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Get the function implementation

#### Returns

[`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

the function

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:541](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L541)

___

### onFailure

▸ **onFailure**(): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Called

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:318](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L318)

___

### onSuccess

▸ **onSuccess**(): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Called

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:326](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L326)

___

### setAfterGuardHook

▸ **setAfterGuardHook**(...`afterGuard`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more after guard hook(s).
If there are multiple after guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...afterGuard` | [`AfterGuardHook`](../modules/purista_core.md#afterguardhook)<`ServiceClassType`, `MessageResultType`, `MessagePayloadType`, `MessageParamsType`\>[] | After guard function |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:307](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L307)

___

### setBeforeGuardHook

▸ **setBeforeGuardHook**(...`beforeGuards`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set one or more before guard hook(s).
If there are multiple before guard hooks, they are executed in parallel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...beforeGuards` | [`BeforeGuardHook`](../modules/purista_core.md#beforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>[] | Before guard function |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:288](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L288)

___

### setFunction

▸ **setFunction**(`fn`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:499](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L499)

___

### setSuccessEventName

▸ **setSuccessEventName**(`eventName`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:91](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L91)

___

### setSummary

▸ **setSummary**(`summary`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:381](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L381)

___

### transformInput

▸ **transformInput**<`PayloadIn`, `ParamsIn`, `PayloadOut`, `ParamsOut`, `PayloadD`, `ParamsD`\>(`transformInputSchema`, `transformParameterSchema`, `transformFunction`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

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
| `PayloadD` | `unknown` |
| `ParamsD` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformInputSchema` | `ZodType`<`PayloadOut`, `PayloadD`, `PayloadIn`\> |
| `transformParameterSchema` | `ZodType`<`ParamsOut`, `ParamsD`, `ParamsIn`\> |
| `transformFunction` | [`TransformInputHook`](../modules/purista_core.md#transforminputhook)<`ServiceClassType`, `PayloadOut`, `ParamsOut`, `PayloadIn`, `ParamsIn`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadIn`, `ParamsIn`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:222](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L222)

___

### transformOutput

▸ **transformOutput**<`PayloadOut`, `PayloadD`, `PayloadIn`\>(`transformOutputSchema`, `transformFunction`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

Set a transform output hook which will encode or transform the response payload.
Will be executed at very last step after function execution, output validation and after guard hooks.
This will change the type of output message payload.

#### Type parameters

| Name |
| :------ |
| `PayloadOut` |
| `PayloadD` |
| `PayloadIn` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformOutputSchema` | `ZodType`<`PayloadOut`, `PayloadD`, `PayloadIn`\> |
| `transformFunction` | [`TransformOutputHook`](../modules/purista_core.md#transformoutputhook)<`ServiceClassType`, `PayloadOut`, `MessagePayloadType`, `FunctionParamsType`, `PayloadIn`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `PayloadOut`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>

FunctionDefinitionBuilder

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:257](https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L257)
