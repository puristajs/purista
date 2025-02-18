[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceBuilder

# Class: ServiceBuilder\<S\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L65)

This class is used to build a service.
The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
command definitions and subscription definitions to the service. It also has a method that is used
to create an instance of the service class.

## Type Parameters

• **S** *extends* [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md) = [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)

## Constructors

### new ServiceBuilder()

> **new ServiceBuilder**\<`S`\>(`info`): [`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L84)

#### Parameters

##### info

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

## Properties

### info

> **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L84)

***

### SClass

> **SClass**: [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\> = `Service`

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L81)

## Methods

### addCommandDefinition()

> **addCommandDefinition**(...`commands`): [`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:134](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L134)

`addCommandDefinition` adds a list of command definitions to the service builder

#### Parameters

##### commands

...[`CommandDefinitionList`](../type-aliases/CommandDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

CommandDefinitionList

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

The service builder

***

### addSubscriptionDefinition()

> **addSubscriptionDefinition**(...`subscription`): [`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:150](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L150)

It adds a subscription definition to the service builder

#### Parameters

##### subscription

...[`SubscriptionDefinitionList`](../type-aliases/SubscriptionDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

SubscriptionDefinitionList

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

The service builder

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourcesType`\>(): [`ServiceBuilder`](ServiceBuilder.md)\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:197](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L197)

Define the resources of the service.
Resources are available within commands and subscriptions.

#### Type Parameters

• **ResourceName** *extends* `string`

• **ResourcesType**

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

The builder with defined types for resources

#### Example

```ts
serviceBuilder.defineResources<'resource_name',ResourceType>()
```

***

### getCommandBuilder()

> **getCommandBuilder**\<`T`, `N`\>(`commandName`, `description`, `eventName`?): [`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<`SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), `Record`\<`string`, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>\>\>\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:306](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L306)

It returns a new instance of the CommandDefinitionBuilder class, which is a class that is used to
build a command definition

#### Type Parameters

• **T** *extends* `string`

• **N** *extends* `string`

#### Parameters

##### commandName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

The name of the command.

##### description

`string`

The description of the command.

##### eventName?

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

The name of the event that will be emitted when the command is
executed.

#### Returns

[`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<`SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>, `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), `Record`\<`string`, `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>\>\>\>

A CommandDefinitionBuilder object.

***

### getCommandDefinitions()

> **getCommandDefinitions**(): [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:350](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L350)

#### Returns

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

the definition of registered commands

***

### getCustomClass()

> **getCustomClass**(): [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:216](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L216)

#### Returns

[`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

***

### getFullServiceDefintion()

> **getFullServiceDefintion**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:415](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L415)

Returns the service definition.
This inclues information about commands and subscriptions.

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### getInstance()

> **getInstance**(`eventBridge`, `options`?): `Promise`\<`S`\[`"ServiceClassType"`\]\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:227](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L227)

It creates a new instance of the service class, passing in the logger, service info, event bridge,
command functions, subscription list, and configuration

#### Parameters

##### eventBridge

[`EventBridge`](../interfaces/EventBridge.md)

EventBridge

##### options?

\{ \[K in string \| number \| symbol\]: (\{ configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof S\["Resources"\] extends NeverObject ? \{ resources?: undefined \} : \{ resources: S\["Resources"\] \}) & (keyof S\["ConfigInputType"\] extends NeverObject ? \{ serviceConfig?: undefined \} : \{ serviceConfig: S\["ConfigInputType"\] \}))\[K\] \}

additional config like logger, stores and opentelemetry span processor

#### Returns

`Promise`\<`S`\[`"ServiceClassType"`\]\>

The instance of the service class

***

### getSubscriptionBuilder()

> **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\]\>\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:334](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L334)

It returns a new instance of the `SubscriptionDefinitionBuilder` class, which is a class that is
used to build a subscription definition

#### Type Parameters

• **T** *extends* `string`

#### Parameters

##### subscriptionName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

The name of the subscription.

##### description

`string`

The description of the subscription.

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\]\>\>

A SubscriptionDefinitionBuilder

***

### getSubscriptionDefinitions()

> **getSubscriptionDefinitions**(): [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:363](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L363)

#### Returns

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

the definition of registered subscriptions

***

### markAsDeprecated()

> **markAsDeprecated**(): [`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:124](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L124)

Mark this service as deprecated

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<`S`\>

The ServiceBuilder instance

***

### resolveDefinitions()

> **resolveDefinitions**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:165](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L165)

Resolves the command and subscription definitions

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): [`ServiceBuilder`](ServiceBuilder.md)\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `T`\>\> *extends* `Record`\<`string`, `any`\> ? `Record`\<`string`, `any`\> & `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> *extends* `Record`\<`string`, `any`\> ? `Record`\<`string`, `any`\> & `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> *extends* `Record`\<`string`, `any`\> ? `Record`\<`string`, `any`\> & `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L92)

"This function sets the config schema for the service builder."

#### Type Parameters

• **T** *extends* `SchemaObject` \| `Schema`\<`any`, `any`, `any`, `""`\> \| `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Parameters

##### schema

`T`

The schema that will be used to validate the config.

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `T`\>\> *extends* `Record`\<`string`, `any`\> ? `Record`\<`string`, `any`\> & `UnknownIfNever`\<`InputFrom`\<`AdapterResolver`, `T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> *extends* `Record`\<`string`, `any`\> ? `Record`\<`string`, `any`\> & `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> *extends* `Record`\<`string`, `any`\> ? `Record`\<`string`, `any`\> & `UnknownIfNever`\<`OutputFrom`\<`AdapterResolver`, `T`\>\> : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

ServiceBuilder

***

### setCustomClass()

> **setCustomClass**\<`T`\>(`customClass`): [`ServiceBuilder`](ServiceBuilder.md)\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:209](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L209)

It sets the class type of the service.

#### Type Parameters

• **T** *extends* [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Parameters

##### customClass

[`Newable`](../type-aliases/Newable.md)\<`T`, [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

A class which extends the Service class

#### Returns

[`ServiceBuilder`](ServiceBuilder.md)\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

The builder itself, but with the type of the service class changed.

***

### ~~setDefaultConfig()~~

> **setDefaultConfig**(`config`): `this`

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:115](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L115)

"This function sets the default configuration for the service."

#### Parameters

##### config

[`Complete`](../type-aliases/Complete.md)\<`S`\[`"ConfigType"`\]\>

ConfigType - The default configuration for the service.

#### Returns

`this`

The ServiceBuilder instance

#### Deprecated

Use a default value in the config validation schema instead

***

### testServiceSetup()

> **testServiceSetup**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:376](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L376)

A simple test helper, which ensures, that there ar no duplicate names used.

#### Returns

`Promise`\<`boolean`\>

***

### ~~validateCommandDefinitions()~~

> **validateCommandDefinitions**(): `void`

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:440](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L440)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateCommands()

> `protected` **validateCommands**(`commandDefinitions`): `void`

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:385](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L385)

#### Parameters

##### commandDefinitions

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### ~~validateSubscriptionDefinitions()~~

> **validateSubscriptionDefinitions**(): `void`

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:448](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L448)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateSubscriptions()

> `protected` **validateSubscriptions**(`subscriptionDefinitions`): `void`

Defined in: [packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts:425](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L425)

#### Parameters

##### subscriptionDefinitions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`void`
