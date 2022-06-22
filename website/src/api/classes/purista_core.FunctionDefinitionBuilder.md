[PURISTA API](../README.md) / [@purista/core](../modules/purista_core.md) / FunctionDefinitionBuilder

# Class: FunctionDefinitionBuilder<ServiceClassType, PayloadType, ParamsType, ResultType\>

[@purista/core](../modules/purista_core.md).FunctionDefinitionBuilder

## Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](purista_core.Service.md) |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |
| `ResultType` | `unknown` |

## Table of contents

### Constructors

- [constructor](purista_core.FunctionDefinitionBuilder.md#constructor)

### Properties

- [errorStatusCodes](purista_core.FunctionDefinitionBuilder.md#errorstatuscodes)
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
- [enableHttpSecurity](purista_core.FunctionDefinitionBuilder.md#enablehttpsecurity)
- [exposeAsHttpEndpoint](purista_core.FunctionDefinitionBuilder.md#exposeashttpendpoint)
- [extendWithHttpMetadata](purista_core.FunctionDefinitionBuilder.md#extendwithhttpmetadata)
- [getDefinition](purista_core.FunctionDefinitionBuilder.md#getdefinition)
- [setAfterGuardHook](purista_core.FunctionDefinitionBuilder.md#setafterguardhook)
- [setBeforeGuardHook](purista_core.FunctionDefinitionBuilder.md#setbeforeguardhook)
- [setSummary](purista_core.FunctionDefinitionBuilder.md#setsummary)
- [setTransformInputHook](purista_core.FunctionDefinitionBuilder.md#settransforminputhook)

## Constructors

### constructor

• **new FunctionDefinitionBuilder**<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>(`commandName`, `commandDescription`, `fn`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`Service`](purista_core.Service.md)<`ServiceClassType`\> |
| `PayloadType` | `unknown` |
| `ParamsType` | `Record`<`string`, `unknown`\> |
| `ResultType` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `commandDescription` | `string` |
| `fn` | [`CommandFunction`](../modules/purista_core.md#commandfunction)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:49](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L49)

## Properties

### errorStatusCodes

• `Private` **errorStatusCodes**: [`StatusCode`](../enums/purista_core.StatusCode.md)[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:34](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L34)

___

### hooks

• `Private` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `afterGuard?` | [`AfterGuardHook`](../modules/purista_core.md#afterguardhook)<`ServiceClassType`, `ResultType`\> |
| `beforeGuard?` | [`BeforeGuardHook`](../modules/purista_core.md#beforeguardhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |
| `transformInput?` | [`TransformHook`](../modules/purista_core.md#transformhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:38](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L38)

___

### httpMetadata

• `Private` `Optional` **httpMetadata**: [`HttpExposedServiceMeta`](../modules/purista_core.md#httpexposedservicemeta)

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:23](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L23)

___

### inputSchema

• `Private` `Optional` **inputSchema**: `ZodType`<`PayloadType`, `ZodTypeDef`, `PayloadType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:24](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L24)

___

### isSecure

• `Private` **isSecure**: `boolean` = `true`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:36](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L36)

___

### outputSchema

• `Private` `Optional` **outputSchema**: `ZodType`<`ResultType`, `ZodTypeDef`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:25](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L25)

___

### paramsSchema

• `Private` `Optional` **paramsSchema**: `ZodType`<`ParamsType`, `ZodTypeDef`, `ParamsType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:26](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L26)

___

### queryParameter

• `Private` **queryParameter**: [`QueryParameter`](../modules/purista_core.md#queryparameter)[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:28](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L28)

___

### summary

• `Private` `Optional` **summary**: `string`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:32](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L32)

___

### tags

• `Private` **tags**: `string`[] = `[]`

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:30](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L30)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:80](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L80)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:55](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L55)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:60](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L60)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:65](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L65)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:70](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L70)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:75](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L75)

___

### enableHttpSecurity

▸ **enableHttpSecurity**(`enabled?`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

enable or disable security for this endpoint

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enabled` | `boolean` | `true` |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:114](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L114)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:100](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L100)

___

### extendWithHttpMetadata

▸ `Private` **extendWithHttpMetadata**(`definition`): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\> |

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:124](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L124)

___

### getDefinition

▸ **getDefinition**(): [`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Returns

[`CommandDefinition`](../modules/purista_core.md#commanddefinition)<`Record`<`string`, `unknown`\>, `ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:159](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L159)

___

### setAfterGuardHook

▸ **setAfterGuardHook**(`afterGuard`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `afterGuard` | [`AfterGuardHook`](../modules/purista_core.md#afterguardhook)<`ServiceClassType`, `ResultType`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:95](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L95)

___

### setBeforeGuardHook

▸ **setBeforeGuardHook**(`beforeGuard`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `beforeGuard` | [`BeforeGuardHook`](../modules/purista_core.md#beforeguardhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:90](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L90)

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

[core/src/helper/FunctionDefinitionBuilder.impl.ts:119](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L119)

___

### setTransformInputHook

▸ **setTransformInputHook**(`transformHook`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformHook` | [`TransformHook`](../modules/purista_core.md#transformhook)<`ServiceClassType`, `PayloadType`, `ParamsType`\> |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `PayloadType`, `ParamsType`, `ResultType`\>

#### Defined in

[core/src/helper/FunctionDefinitionBuilder.impl.ts:85](https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/helper/FunctionDefinitionBuilder.impl.ts#L85)
