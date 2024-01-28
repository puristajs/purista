[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / ServiceBuilder

# Class: ServiceBuilder\<ConfigType, ConfigInputType, ServiceClassType\>

[@purista/core](../modules/purista_core.md).ServiceBuilder

This class is used to build a service.
The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
command definitions and subscription definitions to the service. It also has a method that is used
to create an instance of the service class.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`\<`string`, `unknown`\> |
| `ConfigInputType` | `Record`\<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md) = [`Service`](purista_core.Service.md)\<`ConfigType`\> |

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
- [addSubscriptionDefinition](purista_core.ServiceBuilder.md#addsubscriptiondefinition)
- [getCommandBuilder](purista_core.ServiceBuilder.md#getcommandbuilder)
- [getCommandDefinitions](purista_core.ServiceBuilder.md#getcommanddefinitions)
- [getCustomClass](purista_core.ServiceBuilder.md#getcustomclass)
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

• **new ServiceBuilder**\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>(`info`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `Record`\<`string`, `unknown`\> |
| `ConfigInputType` | `Record`\<`string`, `unknown`\> |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)\<`unknown`\> = [`Service`](purista_core.Service.md)\<`ConfigType`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype) |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L53)

## Properties

### SClass

• **SClass**: [`Newable`](../modules/purista_core.md#newable)\<`any`, `ConfigType`\> = `Service`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:50](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L50)

___

### commandDefinitionList

• `Private` **commandDefinitionList**: [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)\<`ServiceClassType`\> = `[]`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:43](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L43)

___

### configSchema

• `Private` `Optional` **configSchema**: `Schema`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:46](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L46)

___

### defaultConfig

• `Private` `Optional` **defaultConfig**: [`Complete`](../modules/purista_core.md#complete)\<`ConfigType`\>

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:47](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L47)

___

### info

• **info**: [`ServiceInfoType`](../modules/purista_core.md#serviceinfotype)

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:53](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L53)

___

### instance

• `Optional` **instance**: `ServiceClassType`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:49](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L49)

___

### subscriptionDefinitionList

• `Private` **subscriptionDefinitionList**: [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)\<`ServiceClassType`\> = `[]`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:44](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L44)

## Methods

### addCommandDefinition

▸ **addCommandDefinition**(`...commands`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

`addCommandDefinition` adds a list of command definitions to the service builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...commands` | [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)\<`ServiceClassType`\> | CommandDefinitionList |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The service builder

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:82](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L82)

___

### addSubscriptionDefinition

▸ **addSubscriptionDefinition**(`...subscription`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

It adds a subscription definition to the service builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...subscription` | [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)\<`ServiceClassType`\> | SubscriptionDefinitionList |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The service builder

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:105](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L105)

___

### getCommandBuilder

▸ **getCommandBuilder**\<`T`, `N`\>(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`, {}, {}\>

It returns a new instance of the CommandDefinitionBuilder class, which is a class that is used to
build a command definition

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |
| `N` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandName` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`T`\> | The name of the command. |
| `description` | `string` | The description of the command. |
| `eventName?` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`N`\> | The name of the event that will be emitted when the command is executed. |

#### Returns

[`CommandDefinitionBuilder`](purista_core.CommandDefinitionBuilder.md)\<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `void`, {}, {}\>

A CommandDefinitionBuilder object.

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:213](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L213)

___

### getCommandDefinitions

▸ **getCommandDefinitions**(): [`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)\<`ServiceClassType`\>

#### Returns

[`CommandDefinitionList`](../modules/purista_core.md#commanddefinitionlist)\<`ServiceClassType`\>

the definition of registered commands

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:238](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L238)

___

### getCustomClass

▸ **getCustomClass**(): [`Newable`](../modules/purista_core.md#newable)\<`any`, `ConfigType`\>

#### Returns

[`Newable`](../modules/purista_core.md#newable)\<`any`, `ConfigType`\>

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:133](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L133)

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

[ServiceBuilder/ServiceBuilder.impl.ts:144](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L144)

___

### getSubscriptionBuilder

▸ **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `undefined` \| `void`, {}, {}\>

It returns a new instance of the `SubscriptionDefinitionBuilder` class, which is a class that is
used to build a subscription definition

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscriptionName` | [`NonEmptyString`](../modules/purista_core.md#nonemptystring)\<`T`\> | The name of the subscription. |
| `description` | `string` | The description of the subscription. |

#### Returns

[`SubscriptionDefinitionBuilder`](purista_core.SubscriptionDefinitionBuilder.md)\<`ServiceClassType`, `unknown`, `undefined`, `void`, `unknown`, `undefined`, `undefined` \| `void`, {}, {}\>

A SubscriptionDefinitionBuilder

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:228](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L228)

___

### getSubscriptionDefinitions

▸ **getSubscriptionDefinitions**(): [`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)\<`ServiceClassType`\>

#### Returns

[`SubscriptionDefinitionList`](../modules/purista_core.md#subscriptiondefinitionlist)\<`ServiceClassType`\>

the definition of registered subscriptions

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:245](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L245)

___

### setConfigSchema

▸ **setConfigSchema**\<`T`\>(`schema`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, [`Service`](purista_core.Service.md)\<`UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>\>\>

"This function sets the config schema for the service builder."

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Schema` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `T` | The schema that will be used to validate the config. |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>, `UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"inferIn"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `From`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `OutputOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Input`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `input`\<`T`\> : `never`\>\>, [`Service`](purista_core.Service.md)\<`UnknownIfNever`\<`IfDefined`\<`T` extends `Type` ? `T`[``"infer"``] : `never`\> \| `IfDefined`\<`T` extends `CustomSchema`\<`any`\> ? keyof `T` extends `never` ? `Awaited`\<`ReturnType`\<`T`\>\> : `never` : `never`\> \| `IfDefined`\<`T` extends `Schema$1`\<`any`, `any`\> ? `To`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Any` ? `TypeOf`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Predicate` ? `Infer$1`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Runtype` ? `Static`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Struct`\<`any`, `any`\> ? `Infer$2`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `TSchema` ? `Static`\<`T`\> : `never`\> \| `IfDefined`\<`T` extends `any` ? `Output`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `Schema$2` ? `InferType`\<`this`[``"schema"``]\> : `never`\> \| `IfDefined`\<`T` extends `ZodType`\<`any`, `ZodTypeDef`, `any`\> ? `output`\<`T`\> : `never`\>\>\>\>

ServiceBuilder

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:61](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L61)

___

### setCustomClass

▸ **setCustomClass**\<`T`\>(`customClass`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `T`\>

It sets the class type of the service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ServiceClass`](../interfaces/purista_core.ServiceClass.md)\<`ConfigType`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customClass` | [`Newable`](../modules/purista_core.md#newable)\<`T`, `ConfigType`\> | A class which extends the Service class |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `T`\>

The builder itself, but with the type of the service class changed.

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:128](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L128)

___

### setDefaultConfig

▸ **setDefaultConfig**(`config`): [`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

"This function sets the default configuration for the service."

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Complete`](../modules/purista_core.md#complete)\<`ConfigType`\> | ConfigType - The default configuration for the service. |

#### Returns

[`ServiceBuilder`](purista_core.ServiceBuilder.md)\<`ConfigType`, `ConfigInputType`, `ServiceClassType`\>

The ServiceBuilder instance.

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:72](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L72)

___

### validateCommandDefinitions

▸ **validateCommandDefinitions**(): `void`

#### Returns

`void`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:249](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L249)

___

### validateSubscriptionDefinitions

▸ **validateSubscriptionDefinitions**(): `void`

#### Returns

`void`

#### Defined in

[ServiceBuilder/ServiceBuilder.impl.ts:275](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L275)
