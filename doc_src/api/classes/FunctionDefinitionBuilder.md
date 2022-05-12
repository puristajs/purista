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

[src/helper/FunctionDefinitionBuilder.impl.ts:32](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L32)

## Properties

### contentEncoding

• `Private` **contentEncoding**: `string` = `'application/json'`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:29](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L29)

___

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/StatusCode.md)[] = `[]`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:27](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L27)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../modules.md#httpexposedservicemeta)

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:16](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L16)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:17](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L17)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:18](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L18)

___

### paramsSchema

• `Private` `Optional` **paramsSchema**: `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:19](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L19)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules.md#queryparameter)[] = `[]`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:21](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L21)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:25](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L25)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:23](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L23)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:63](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L63)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:38](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L38)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L43)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:48](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L48)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L53)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:58](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L58)

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentType?`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `method` | `HttpMethod` | `undefined` |
| `path` | `string` | `undefined` |
| `contentType` | `string` | `'application/json'` |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:68](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L68)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:86](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L86)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules.md#commanddefinition)<`unknown`, [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Returns

[`CommandDefinition`](../modules.md#commanddefinition)<`unknown`, [`CommandFunction`](../modules.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>\>

#### Defined in

[src/helper/FunctionDefinitionBuilder.impl.ts:115](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L115)

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

[src/helper/FunctionDefinitionBuilder.impl.ts:81](https://github.com/sebastianwessel/purista/blob/774b686/src/helper/FunctionDefinitionBuilder.impl.ts#L81)
