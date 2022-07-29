[PURISTA API - v1.3.1](../README.md) / [@purista/core](../modules/purista_core.md) / ServiceBuilder

# Class: ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType\>

[@purista/core](../modules/purista_core.md).ServiceBuilder

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](purista_core.ServiceClass.md) = [`Service`](purista_core.Service.md)<`ConfigType`\> |

## Table of contents

### Constructors

- [constructor](purista_core.ServiceBuilder.md#constructor)

### Properties

- [SClass](purista_core.ServiceBuilder.md#sclass)
- [commandFunctions](purista_core.ServiceBuilder.md#commandfunctions)
- [configSchema](purista_core.ServiceBuilder.md#configschema)
- [defaultConfig](purista_core.ServiceBuilder.md#defaultconfig)
- [info](purista_core.ServiceBuilder.md#info)
- [instance](purista_core.ServiceBuilder.md#instance)
- [subscriptionList](purista_core.ServiceBuilder.md#subscriptionlist)

### Methods

- [addFunctionDefinition](purista_core.ServiceBuilder.md#addfunctiondefinition)
- [addSubscriptionDefinition](purista_core.ServiceBuilder.md#addsubscriptiondefinition)
- [getFunctionBuilder](purista_core.ServiceBuilder.md#getfunctionbuilder)
- [getInstance](purista_core.ServiceBuilder.md#getinstance)
- [getSubscriptionBuilder](purista_core.ServiceBuilder.md#getsubscriptionbuilder)
- [setConfigSchema](purista_core.ServiceBuilder.md#setconfigschema)
- [setCustomClass](purista_core.ServiceBuilder.md#setcustomclass)
- [setDefaultConfig](purista_core.ServiceBuilder.md#setdefaultconfig)

## Constructors

### constructor

• **new ServiceBuilder**<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>(`info`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](purista_core.ServiceClass.md)<`unknown`, `ServiceClassType`\> = [`Service`](purista_core.Service.md)<`ConfigType`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:33](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L33)

## Properties

### SClass

• **SClass**: `any` = `Service`

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:30](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L30)

___

### commandFunctions

• `Private` **commandFunctions**: [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\> = `[]`

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:22](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L22)

___

### configSchema

• `Private` `Optional` **configSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:25](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L25)

___

### defaultConfig

• `Private` `Optional` **defaultConfig**: `ConfigType`

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:26](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L26)

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:33](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L33)

___

### instance

• `Optional` **instance**: `ServiceClassType`

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:28](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L28)

___

### subscriptionList

• `Private` **subscriptionList**: [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`ServiceClassType`\> = `[]`

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:23](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L23)

## Methods

### addFunctionDefinition

▸ **addFunctionDefinition**(...`functions`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...functions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\> |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:49](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L49)

___

### addSubscriptionDefinition

▸ **addSubscriptionDefinition**(...`subscription`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...subscription` | [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`ServiceClassType`\> |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:54](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L54)

___

### getFunctionBuilder

▸ **getFunctionBuilder**(`commandName`, `description`, `eventName?`): [`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `description` | `string` |
| `eventName?` | `string` |

#### Returns

[`FunctionDefinitionBuilder`](purista_core.FunctionDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:91](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L91)

___

### getInstance

▸ **getInstance**(`logger`, `eventBridge`, `config?`): `ServiceClassType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](purista_core.Logger.md) |
| `eventBridge` | [`EventBridge`](purista_core.EventBridge.md) |
| `config?` | `ConfigInputType` |

#### Returns

`ServiceClassType`

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:64](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L64)

___

### getSubscriptionBuilder

▸ **getSubscriptionBuilder**(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionName` | `string` |
| `description` | `string` |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, [`EBMessage`](../modules/purista_core.md#ebmessage), `unknown`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:99](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L99)

___

### setConfigSchema

▸ **setConfigSchema**<`I`, `D`, `O`\>(`schema`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`O`, `I`, [`Service`](purista_core.Service.md)<`O`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `unknown` |
| `D` | `unknown` |
| `O` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `ZodType`<`O`, `D`, `I`\> |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`O`, `I`, [`Service`](purista_core.Service.md)<`O`\>\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:35](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L35)

___

### setCustomClass

▸ **setCustomClass**<`T`\>(`c`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ServiceClass`](purista_core.ServiceClass.md)<`ConfigType`, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `c` | [`Newable`](../modules/purista_core.md#newable)<`T`\> |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `T`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:59](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L59)

___

### setDefaultConfig

▸ **setDefaultConfig**(`config`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `ConfigType` |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Defined in

[core/src/helper/ServiceBuilder.impl.ts:40](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/core/src/helper/ServiceBuilder.impl.ts#L40)
