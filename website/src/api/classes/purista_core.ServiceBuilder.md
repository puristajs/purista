[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ServiceBuilder

# Class: ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType\>

[@purista/core](../modules/purista_core.md).ServiceBuilder

This class is used to build a service.
The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
command definitions and subscription definitions to the service. It also has a method that is used
to create an instance of the service class.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`Service`](purista_core.Service.md)<`ConfigType`\> |

## Table of contents

### Constructors

- [constructor](purista_core.ServiceBuilder.md#constructor)

### Properties

- [SClass](purista_core.ServiceBuilder.md#sclass)
- [commandDefinitionList](purista_core.ServiceBuilder.md#commanddefinitionlist)
- [configSchema](purista_core.ServiceBuilder.md#configschema)
- [defaultConfig](purista_core.ServiceBuilder.md#defaultconfig)
- [info](purista_core.ServiceBuilder.md#info)
- [instance](purista_core.ServiceBuilder.md#instance)
- [subscriptionDefinitionList](purista_core.ServiceBuilder.md#subscriptiondefinitionlist)

### Methods

- [addCommandDefinition](purista_core.ServiceBuilder.md#addcommanddefinition)
- [addFunctionDefinition](purista_core.ServiceBuilder.md#addfunctiondefinition)
- [addSubscriptionDefinition](purista_core.ServiceBuilder.md#addsubscriptiondefinition)
- [getCommandBuilder](purista_core.ServiceBuilder.md#getcommandbuilder)
- [getCommandDefinitions](purista_core.ServiceBuilder.md#getcommanddefinitions)
- [getCustomClass](purista_core.ServiceBuilder.md#getcustomclass)
- [getFunctionBuilder](purista_core.ServiceBuilder.md#getfunctionbuilder)
- [getInstance](purista_core.ServiceBuilder.md#getinstance)
- [getSubscriptionBuilder](purista_core.ServiceBuilder.md#getsubscriptionbuilder)
- [getSubscriptionDefinitions](purista_core.ServiceBuilder.md#getsubscriptiondefinitions)
- [setConfigSchema](purista_core.ServiceBuilder.md#setconfigschema)
- [setCustomClass](purista_core.ServiceBuilder.md#setcustomclass)
- [setDefaultConfig](purista_core.ServiceBuilder.md#setdefaultconfig)
- [validateCommandDefinitions](purista_core.ServiceBuilder.md#validatecommanddefinitions)
- [validateSubscriptionDefinitions](purista_core.ServiceBuilder.md#validatesubscriptiondefinitions)

## Constructors

### constructor

• **new ServiceBuilder**<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>(`info`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`unknown`, `ServiceClassType`\> = [`Service`](purista_core.Service.md)<`ConfigType`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L53)

## Properties

### SClass

• **SClass**: [`Newable`](../modules/purista_core.md#newable)<`any`, `ConfigType`\> = `Service`

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:50](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L50)

___

### commandDefinitionList

• `Private` **commandDefinitionList**: [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\> = `[]`

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L43)

___

### configSchema

• `Private` `Optional` **configSchema**: `ZodType`<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:46](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L46)

___

### defaultConfig

• `Private` `Optional` **defaultConfig**: [`Complete`](../modules/purista_core.md#complete)<`ConfigType`\>

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L47)

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L53)

___

### instance

• `Optional` **instance**: `ServiceClassType`

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:49](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L49)

___

### subscriptionDefinitionList

• `Private` **subscriptionDefinitionList**: [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`ServiceClassType`\> = `[]`

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L44)

## Methods

### addCommandDefinition

▸ **addCommandDefinition**(`...commands`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

`addCommandDefinition` adds a list of command definitions to the service builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...commands` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\> | CommandDefinitionList |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The service builder

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:94](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L94)

___

### addFunctionDefinition

▸ **addFunctionDefinition**(`...functions`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

**`Deprecated`**

use addCommandDefinition instead of addFunctionDefinition as it will be removed soon.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...functions` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\> |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:85](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L85)

___

### addSubscriptionDefinition

▸ **addSubscriptionDefinition**(`...subscription`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

It adds a subscription definition to the service builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...subscription` | [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`ServiceClassType`\> | SubscriptionDefinitionList |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The service builder

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:117](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L117)

___

### getCommandBuilder

▸ **getCommandBuilder**(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

It returns a new instance of the CommandDefinitionBuilder class, which is a class that is used to
build a command definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandName` | `string` | The name of the command. |
| `description` | `string` | The description of the command. |
| `eventName?` | `string` | The name of the event that will be emitted when the command is executed. |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

A CommandDefinitionBuilder object.

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:248](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L248)

___

### getCommandDefinitions

▸ **getCommandDefinitions**(): [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\>

#### Returns

[`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)<`ServiceClassType`\>

the definition of registered commands

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:273](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L273)

___

### getCustomClass

▸ **getCustomClass**(): [`Newable`](../modules/purista_core.md#newable)<`any`, `ConfigType`\>

#### Returns

[`Newable`](../modules/purista_core.md#newable)<`any`, `ConfigType`\>

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:145](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L145)

___

### getFunctionBuilder

▸ **getFunctionBuilder**(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

**`Deprecated`**

user getCommandBuilder instead. It will be removed soon.

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `description` | `string` |
| `eventName?` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:231](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L231)

___

### getInstance

▸ **getInstance**(`eventBridge`, `options?`): `ServiceClassType`

It creates a new instance of the service class, passing in the logger, service info, event bridge,
command functions, subscription list, and configuration

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventBridge` | [`EventBridge`](../interfaces/purista_core.EventBridge.md) | EventBridge |
| `options` | `Object` | additional config like logger, stores and opentelemetry span processor |
| `options.configStore?` | [`ConfigStore`](../interfaces/purista_core.ConfigStore.md) | - |
| `options.logLevel?` | [`LogLevelName`](../modules/purista_core.md#loglevelname) | - |
| `options.logger?` | [`Logger`](purista_core.Logger.md) | - |
| `options.secretStore?` | [`SecretStore`](../interfaces/purista_core.SecretStore.md) | - |
| `options.serviceConfig?` | `ConfigInputType` | - |
| `options.spanProcessor?` | `SpanProcessor` | - |
| `options.stateStore?` | [`StateStore`](../interfaces/purista_core.StateStore.md) | - |

#### Returns

`ServiceClassType`

The instance of the service class

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:156](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L156)

___

### getSubscriptionBuilder

▸ **getSubscriptionBuilder**(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `undefined` \| `void`\>

It returns a new instance of the `SubscriptionDefinitionBuilder` class, which is a class that is
used to build a subscription definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionName` | `string` | The name of the subscription. |
| `description` | `string` | The description of the subscription. |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `undefined` \| `void`\>

A SubscriptionDefinitionBuilder

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:263](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L263)

___

### getSubscriptionDefinitions

▸ **getSubscriptionDefinitions**(): [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`ServiceClassType`\>

#### Returns

[`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)<`ServiceClassType`\>

the definition of registered subscriptions

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:280](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L280)

___

### setConfigSchema

▸ **setConfigSchema**<`I`, `D`, `O`\>(`schema`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`O`, `I`, [`Service`](purista_core.Service.md)<`O`\>\>

"This function sets the config schema for the service builder."

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `unknown` |
| `D` | extends `ZodTypeDef` = `ZodTypeDef` |
| `O` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `ZodType`<`O`, `D`, `I`\> | The schema that will be used to validate the config. |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`O`, `I`, [`Service`](purista_core.Service.md)<`O`\>\>

ServiceBuilder

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:61](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L61)

___

### setCustomClass

▸ **setCustomClass**<`T`\>(`customClass`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `T`\>

It sets the class type of the service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)<`ConfigType`, `T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customClass` | [`Newable`](../modules/purista_core.md#newable)<`T`, `ConfigType`\> | A class which extends the Service class |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `T`\>

The builder itself, but with the type of the service class changed.

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:140](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L140)

___

### setDefaultConfig

▸ **setDefaultConfig**(`config`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

"This function sets the default configuration for the service."

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Complete`](../modules/purista_core.md#complete)<`ConfigType`\> | ConfigType - The default configuration for the service. |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The ServiceBuilder instance.

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:72](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L72)

___

### validateCommandDefinitions

▸ **validateCommandDefinitions**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:284](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L284)

___

### validateSubscriptionDefinitions

▸ **validateSubscriptionDefinitions**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:310](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L310)
