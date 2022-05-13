[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / FunctionDefinitionBuilder

# Class: FunctionDefinitionBuilder<ServiceClassType, PayloadType, ParamsType, ResultType\>

[@purista/core](../modules/purista_core.md).FunctionDefinitionBuilder

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](purista_core.Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

## Table of contents

### Constructors

- [constructor](purista_core.FunctionDefinitionBuilder.md#constructor)

### Properties

- [contentEncoding](purista_core.FunctionDefinitionBuilder.md#contentencoding)
- [errorStatusCodes](purista_core.FunctionDefinitionBuilder.md#errorstatuscodes)
- [httpMetadata](purista_core.FunctionDefinitionBuilder.md#httpmetadata)
- [inputSchema](purista_core.FunctionDefinitionBuilder.md#inputschema)
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
- [exposeAsHttpEndpoint](purista_core.FunctionDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](purista_core.FunctionDefinitionBuilder.md#extendwithhttpmetadata)
- [getDefinition](purista_core.FunctionDefinitionBuilder.md#getdefinition)
- [setSummary](purista_core.FunctionDefinitionBuilder.md#setsummary)

## Constructors

### constructor

• **new FunctionDefinitionBuilder**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`commandName`, `commandDescription`, `fn`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](purista_core.Service.md)<`ServiceClassType`\> |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `commandDescription` | `string` |
| `fn` | [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:31](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L31)

## Properties

### contentEncoding

• `Private` **contentEncoding**: `string` = `'application/json'`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:28](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L28)

___

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/purista_core.StatusCode.md)[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:26](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L26)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta)

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:15](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L15)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:16](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L16)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:17](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L17)

___

### paramsSchema

• `Private` `Optional` **paramsSchema**: `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:18](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L18)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules/purista_core.md#queryparameter)[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:20](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L20)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:24](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L24)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:22](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L22)

## Methods

### addErrorStatusCodes

▸ **addErrorStatusCodes**(...`codes`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...codes` | [`StatusCode`](../enums/purista_core.StatusCode.md)[] |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:62](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L62)

___

### addInputSchema

▸ **addInputSchema**(`inputSchema`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputSchema` | `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:37](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L37)

___

### addOutputSchema

▸ **addOutputSchema**(`outputSchema`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputSchema` | `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L42)

___

### addParameterSchema

▸ **addParameterSchema**(`paramsSchema`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramsSchema` | `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L47)

___

### addQueryParameters

▸ **addQueryParameters**(...`queryParams`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...queryParams` | [`QueryParameter`](../modules/purista_core.md#queryparameter)[] |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:52](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L52)

___

### addTags

▸ **addTags**(...`tags`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...tags` | `string`[] |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:57](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L57)

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentType?`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `method` | [`SupportedHttpMethod`](../modules/purista_core.md#supportedhttpmethod) | `undefined` |
| `path` | `string` | `undefined` |
| `contentType` | `string` | `'application/json'` |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:67](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L67)

___

### extendWithHttpMetadata

▸ `Private` **extendWithHttpMetadata**(`definition`): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta), [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta), [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\> |

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<[`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta), [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:85](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L85)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`unknown`, [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`unknown`, [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:114](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L114)

___

### setSummary

▸ **setSummary**(`summary`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `summary` | `string` |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:80](https://github.com/sebastianwessel/purista/blob/c66c2b4/src/helper/FunctionDefinitionBuilder.impl.ts#L80)
