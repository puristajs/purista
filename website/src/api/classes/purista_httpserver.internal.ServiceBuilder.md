[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/httpserver](../modules/purista_httpserver.md) / [internal](../modules/purista_httpserver.internal.md) / ServiceBuilder

# Class: ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType\>

[@purista/httpserver](../modules/purista_httpserver.md).[internal](../modules/purista_httpserver.internal.md).ServiceBuilder

This class is used to build a service.
The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
command definitions and subscription definitions to the service. It also has a method that is used
to create an instance of the service class.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md) = [`Service`](purista_httpserver.internal.Service.md)<`ConfigType`\> |

## Table of contents

### Constructors

- [constructor](purista_httpserver.internal.ServiceBuilder.md#constructor)

### Properties

- [SClass](purista_httpserver.internal.ServiceBuilder.md#sclass)
- [commandDefinitionList](purista_httpserver.internal.ServiceBuilder.md#commanddefinitionlist)
- [configSchema](purista_httpserver.internal.ServiceBuilder.md#configschema)
- [defaultConfig](purista_httpserver.internal.ServiceBuilder.md#defaultconfig)
- [info](purista_httpserver.internal.ServiceBuilder.md#info)
- [instance](purista_httpserver.internal.ServiceBuilder.md#instance)
- [subscriptionDefinitionList](purista_httpserver.internal.ServiceBuilder.md#subscriptiondefinitionlist)

### Methods

- [addCommandDefinition](purista_httpserver.internal.ServiceBuilder.md#addcommanddefinition)
- [addFunctionDefinition](purista_httpserver.internal.ServiceBuilder.md#addfunctiondefinition)
- [addSubscriptionDefinition](purista_httpserver.internal.ServiceBuilder.md#addsubscriptiondefinition)
- [getCommandBuilder](purista_httpserver.internal.ServiceBuilder.md#getcommandbuilder)
- [getCommandDefinitions](purista_httpserver.internal.ServiceBuilder.md#getcommanddefinitions)
- [getCustomClass](purista_httpserver.internal.ServiceBuilder.md#getcustomclass)
- [getFunctionBuilder](purista_httpserver.internal.ServiceBuilder.md#getfunctionbuilder)
- [getInstance](purista_httpserver.internal.ServiceBuilder.md#getinstance)
- [getSubscriptionBuilder](purista_httpserver.internal.ServiceBuilder.md#getsubscriptionbuilder)
- [getSubscriptionDefinitions](purista_httpserver.internal.ServiceBuilder.md#getsubscriptiondefinitions)
- [setConfigSchema](purista_httpserver.internal.ServiceBuilder.md#setconfigschema)
- [setCustomClass](purista_httpserver.internal.ServiceBuilder.md#setcustomclass)
- [setDefaultConfig](purista_httpserver.internal.ServiceBuilder.md#setdefaultconfig)
- [validateCommandDefinitions](purista_httpserver.internal.ServiceBuilder.md#validatecommanddefinitions)
- [validateSubscriptionDefinitions](purista_httpserver.internal.ServiceBuilder.md#validatesubscriptiondefinitions)

## Constructors

### constructor

• **new ServiceBuilder**<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>(`info`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`<`string`, `unknown`\> |
| `ConfigInputType` | `Record`<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md)<`unknown`, `ServiceClassType`\> = [`Service`](purista_httpserver.internal.Service.md)<`ConfigType`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype) |

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:25

## Properties

### SClass

• **SClass**: [`Newable`](../modules/purista_httpserver.internal.md#newable)<`any`, `ConfigType`\>

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:24

___

### commandDefinitionList

• `Private` **commandDefinitionList**: `any`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:19

___

### configSchema

• `Private` `Optional` **configSchema**: `any`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:21

___

### defaultConfig

• `Private` `Optional` **defaultConfig**: `any`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:22

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_httpserver.internal.md#serviceinfotype)

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:18

___

### instance

• `Optional` **instance**: `ServiceClassType`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:23

___

### subscriptionDefinitionList

• `Private` **subscriptionDefinitionList**: `any`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:20

## Methods

### addCommandDefinition

▸ **addCommandDefinition**(`...commands`): [`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

`addCommandDefinition` adds a list of command definitions to the service builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...commands` | [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`ServiceClassType`\> | CommandDefinitionList |

#### Returns

[`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The service builder

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:50

___

### addFunctionDefinition

▸ **addFunctionDefinition**(`...functions`): [`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

**`Deprecated`**

use addCommandDefinition instead of addFunctionDefinition as it will be removed soon.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...functions` | [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`ServiceClassType`\> |

#### Returns

[`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:44

___

### addSubscriptionDefinition

▸ **addSubscriptionDefinition**(`...subscription`): [`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

It adds a subscription definition to the service builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...subscription` | [`SubscriptionDefinitionList`](../modules/purista_httpserver.internal.md#subscriptiondefinitionlist)<`ServiceClassType`\> | SubscriptionDefinitionList |

#### Returns

[`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The service builder

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:56

___

### getCommandBuilder

▸ **getCommandBuilder**(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

It returns a new instance of the CommandDefinitionBuilder class, which is a class that is used to
build a command definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandName` | `string` | The name of the command. |
| `description` | `string` | The description of the command. |
| `eventName?` | `string` | The name of the event that will be emitted when the command is executed. |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

A CommandDefinitionBuilder object.

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:93

___

### getCommandDefinitions

▸ **getCommandDefinitions**(): [`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`ServiceClassType`\>

#### Returns

[`CommandDefinitionList`](../modules/purista_httpserver.internal.md#commanddefinitionlist)<`ServiceClassType`\>

the definition of registered commands

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:105

___

### getCustomClass

▸ **getCustomClass**(): [`Newable`](../modules/purista_httpserver.internal.md#newable)<`any`, `ConfigType`\>

#### Returns

[`Newable`](../modules/purista_httpserver.internal.md#newable)<`any`, `ConfigType`\>

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:63

___

### getFunctionBuilder

▸ **getFunctionBuilder**(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

**`Deprecated`**

user getCommandBuilder instead. It will be removed soon.

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandName` | `string` |
| `description` | `string` |
| `eventName?` | `string` |

#### Returns

[`CommandDefinitionBuilder`](purista_httpserver.internal.CommandDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`\>

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:83

___

### getInstance

▸ **getInstance**(`eventBridge`, `options?`): `ServiceClassType`

It creates a new instance of the service class, passing in the logger, service info, event bridge,
command functions, subscription list, and configuration

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventBridge` | [`EventBridge`](../interfaces/purista_httpserver.internal.EventBridge.md) | EventBridge |
| `options?` | `Object` | additional config like logger, stores and opentelemetry span processor |
| `options.configStore?` | [`ConfigStore`](../interfaces/purista_httpserver.internal.ConfigStore.md) | - |
| `options.logger?` | [`Logger`](purista_httpserver.internal.Logger.md) | - |
| `options.secretStore?` | [`SecretStore`](../interfaces/purista_httpserver.internal.SecretStore.md) | - |
| `options.serviceConfig?` | `ConfigInputType` | - |
| `options.spanProcessor?` | `SpanProcessor` | - |
| `options.stateStore?` | [`StateStore`](../interfaces/purista_httpserver.internal.StateStore.md) | - |

#### Returns

`ServiceClassType`

The instance of the service class

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:71

___

### getSubscriptionBuilder

▸ **getSubscriptionBuilder**(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `undefined` \| `void`\>

It returns a new instance of the `SubscriptionDefinitionBuilder` class, which is a class that is
used to build a subscription definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionName` | `string` | The name of the subscription. |
| `description` | `string` | The description of the subscription. |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_httpserver.internal.SubscriptionDefinitionBuilder.md)<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `undefined` \| `void`\>

A SubscriptionDefinitionBuilder

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:101

___

### getSubscriptionDefinitions

▸ **getSubscriptionDefinitions**(): [`SubscriptionDefinitionList`](../modules/purista_httpserver.internal.md#subscriptiondefinitionlist)<`ServiceClassType`\>

#### Returns

[`SubscriptionDefinitionList`](../modules/purista_httpserver.internal.md#subscriptiondefinitionlist)<`ServiceClassType`\>

the definition of registered subscriptions

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:109

___

### setConfigSchema

▸ **setConfigSchema**<`I`, `D`, `O`\>(`schema`): [`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`O`, `I`, [`Service`](purista_httpserver.internal.Service.md)<`O`\>\>

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

[`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`O`, `I`, [`Service`](purista_httpserver.internal.Service.md)<`O`\>\>

ServiceBuilder

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:32

___

### setCustomClass

▸ **setCustomClass**<`T`\>(`customClass`): [`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `T`\>

It sets the class type of the service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ServiceClass`](../interfaces/purista_httpserver.internal.ServiceClass.md)<`ConfigType`, `T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customClass` | [`Newable`](../modules/purista_httpserver.internal.md#newable)<`T`, `ConfigType`\> | A class which extends the Service class |

#### Returns

[`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `T`\>

The builder itself, but with the type of the service class changed.

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:62

___

### setDefaultConfig

▸ **setDefaultConfig**(`config`): [`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

"This function sets the default configuration for the service."

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Complete`](../modules/purista_httpserver.internal.md#complete)<`ConfigType`\> | ConfigType - The default configuration for the service. |

#### Returns

[`ServiceBuilder`](purista_httpserver.internal.ServiceBuilder.md)<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The ServiceBuilder instance.

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:39

___

### validateCommandDefinitions

▸ **validateCommandDefinitions**(): `void`

#### Returns

`void`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:110

___

### validateSubscriptionDefinitions

▸ **validateSubscriptionDefinitions**(): `void`

#### Returns

`void`

#### Defined in

packages/core/lib/ServiceBuilder/ServiceBuilder.impl.d.ts:111
