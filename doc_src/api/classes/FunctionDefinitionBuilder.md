[@purista/core](../README.md) / [Exports](../modules.md) / FunctionDefinitionBuilder

# Class: FunctionDefinitionBuilder<ServiceClassType, PayloadType, ParamsType, ResultType\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

## Table of contents

### Constructors

- [constructor](FunctionDefinitionBuilder.md#constructor)

### Properties

- [contentEncoding](FunctionDefinitionBuilder.md#contentencoding)
- [errorStatusCodes](FunctionDefinitionBuilder.md#errorstatuscodes)
- [httpMetadata](FunctionDefinitionBuilder.md#httpmetadata)
- [inputSchema](FunctionDefinitionBuilder.md#inputschema)
- [outputSchema](FunctionDefinitionBuilder.md#outputschema)
- [paramsSchema](FunctionDefinitionBuilder.md#paramsschema)
- [queryParameter](FunctionDefinitionBuilder.md#queryparameter)
- [summary](FunctionDefinitionBuilder.md#summary)
- [tags](FunctionDefinitionBuilder.md#tags)

### Methods

- [addErrorStatusCodes](FunctionDefinitionBuilder.md#adderrorstatuscodes)
- [addInputSchema](FunctionDefinitionBuilder.md#addinputschema)
- [addOutputSchema](FunctionDefinitionBuilder.md#addoutputschema)
- [addParameterSchema](FunctionDefinitionBuilder.md#addparameterschema)
- [addQueryParameters](FunctionDefinitionBuilder.md#addqueryparameters)
- [addTags](FunctionDefinitionBuilder.md#addtags)
- [exposeAsHttpEndpoint](FunctionDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](FunctionDefinitionBuilder.md#extendwithhttpmetadata)
- [getDefinition](FunctionDefinitionBuilder.md#getdefinition)
- [setSummary](FunctionDefinitionBuilder.md#setsummary)

## Constructors

### constructor

• **new FunctionDefinitionBuilder**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`commandName`, `commandDescription`, `fn`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md)<`ServiceClassType`\> |
| `PayloadType` | `unknown` |
| `ParamsType` | `unknown` |
| `ResultType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `commandDescription` | `string` |
| `fn` | [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:31](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L31)

## Properties

### contentEncoding

• `Private` **contentEncoding**: `string` = `'application/json'`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:28](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L28)

___

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/StatusCode.md)[] = `[]`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:26](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L26)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../modules.md#httpexposedservicemeta)

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:15](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L15)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:16](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L16)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:17](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L17)

___

### paramsSchema

• `Private` `Optional` **paramsSchema**: `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:18](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L18)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules.md#queryparameter)[] = `[]`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:20](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L20)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:24](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L24)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:22](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L22)

## Methods

### addErrorStatusCodes

▸ **addErrorStatusCodes**(...`codes`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...codes` | [`StatusCode`](../enums/StatusCode.md)[] |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:62](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L62)

___

### addInputSchema

▸ **addInputSchema**(`inputSchema`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputSchema` | `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\> |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:37](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L37)

___

### addOutputSchema

▸ **addOutputSchema**(`outputSchema`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputSchema` | `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\> |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:42](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L42)

___

### addParameterSchema

▸ **addParameterSchema**(`paramsSchema`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramsSchema` | `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\> |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L47)

___

### addQueryParameters

▸ **addQueryParameters**(...`queryParams`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...queryParams` | [`QueryParameter`](../modules.md#queryparameter)[] |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:52](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L52)

___

### addTags

▸ **addTags**(...`tags`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...tags` | `string`[] |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:57](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L57)

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentType?`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `method` | [`SupportedHttpMethod`](../modules.md#supportedhttpmethod) | `undefined` |
| `path` | `string` | `undefined` |
| `contentType` | `string` | `'application/json'` |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:67](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L67)

___

### extendWithHttpMetadata

▸ `Private` **extendWithHttpMetadata**(`definition`): [`CommandDefinition`](../modules.md#commanddefinition)<[`HttpExposedServiceMeta`](../modules.md#httpexposedservicemeta), [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`CommandDefinition`](../modules.md#commanddefinition)<[`HttpExposedServiceMeta`](../modules.md#httpexposedservicemeta), [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\> |

#### Returns

[`CommandDefinition`](../modules.md#commanddefinition)<[`HttpExposedServiceMeta`](../modules.md#httpexposedservicemeta), [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:85](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L85)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules.md#commanddefinition)<`unknown`, [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Returns

[`CommandDefinition`](../modules.md#commanddefinition)<`unknown`, [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:114](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L114)

___

### setSummary

▸ **setSummary**(`summary`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `summary` | `string` |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:80](https://github.com/sebastianwessel/purista/blob/c4dff4d/src/helper/FunctionDefinitionBuilder.impl.ts#L80)
