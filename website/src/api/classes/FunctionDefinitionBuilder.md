[PURISTA API](../README.md) / FunctionDefinitionBuilder

# Class: FunctionDefinitionBuilder<ServiceClassType, PayloadType, ParamsType, ResultType\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |
| `ResultType` | `unknown` |

## Table of contents

### Constructors

- [constructor](FunctionDefinitionBuilder.md#constructor)

### Properties

- [errorStatusCodes](FunctionDefinitionBuilder.md#errorstatuscodes)
- [hooks](FunctionDefinitionBuilder.md#hooks)
- [httpMetadata](FunctionDefinitionBuilder.md#httpmetadata)
- [inputSchema](FunctionDefinitionBuilder.md#inputschema)
- [isSecure](FunctionDefinitionBuilder.md#issecure)
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
- [enableHttpSecurity](FunctionDefinitionBuilder.md#enablehttpsecurity)
- [exposeAsHttpEndpoint](FunctionDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](FunctionDefinitionBuilder.md#extendwithhttpmetadata)
- [getDefinition](FunctionDefinitionBuilder.md#getdefinition)
- [setAfterGuardHook](FunctionDefinitionBuilder.md#setafterguardhook)
- [setBeforeGuardHook](FunctionDefinitionBuilder.md#setbeforeguardhook)
- [setSummary](FunctionDefinitionBuilder.md#setsummary)
- [setTransformInputHook](FunctionDefinitionBuilder.md#settransforminputhook)

## Constructors

### constructor

• **new FunctionDefinitionBuilder**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`commandName`, `commandDescription`, `fn`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](Service.md)<`ServiceClassType`\> |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |
| `ResultType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `commandDescription` | `string` |
| `fn` | [`CommandFunction`](../README.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:49

## Properties

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/StatusCode.md)[] = `[]`

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:34

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard?` | [`AfterGuardHook`](../README.md#afterguardhook)<`ServiceClassType`, `ResultType`\> |
| `beforeGuard?` | [`BeforeGuardHook`](../README.md#beforeguardhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |
| `transformInput?` | [`TransformHook`](../README.md#transformhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:38

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../README.md#httpexposedservicemeta)

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:23

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:24

___

### isSecure

• `Private` **isSecure**: `boolean` = `true`

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:36

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:25

___

### paramsSchema

• `Private` `Optional` **paramsSchema**: `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:26

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../README.md#queryparameter)[] = `[]`

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:28

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:32

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:30

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

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:80

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

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:55

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

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:60

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

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:65

___

### addQueryParameters

▸ **addQueryParameters**(...`queryParams`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...queryParams` | [`QueryParameter`](../README.md#queryparameter)[] |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:70

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

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:75

___

### enableHttpSecurity

▸ **enableHttpSecurity**(`enabled?`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enabled` | `boolean` | `true` |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:114

___

### exposeAsHttpEndpoint

▸ **exposeAsHttpEndpoint**(`method`, `path`, `contentType?`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `method` | [`SupportedHttpMethod`](../README.md#supportedhttpmethod) | `undefined` |
| `path` | `string` | `undefined` |
| `contentType` | `string` | `'application/json'` |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:100

___

### extendWithHttpMetadata

▸ `Private` **extendWithHttpMetadata**(`definition`): [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |

#### Returns

[`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:124

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Returns

[`CommandDefinition`](../README.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:159

___

### setAfterGuardHook

▸ **setAfterGuardHook**(`afterGuard`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuard` | [`AfterGuardHook`](../README.md#afterguardhook)<`ServiceClassType`, `ResultType`\> |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:95

___

### setBeforeGuardHook

▸ **setBeforeGuardHook**(`beforeGuard`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `beforeGuard` | [`BeforeGuardHook`](../README.md#beforeguardhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:90

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

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:119

___

### setTransformInputHook

▸ **setTransformInputHook**(`transformHook`): [`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformHook` | [`TransformHook`](../README.md#transformhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |

#### Returns

[`FunctionDefinitionBuilder`](FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

packages/core/src/helper/FunctionDefinitionBuilder.impl.ts:85
