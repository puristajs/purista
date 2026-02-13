[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceBuilder

# Class: ServiceBuilder\<S\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:67](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L67)

This class is used to build a service.
The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
command definitions and subscription definitions to the service. It also has a method that is used
to create an instance of the service class.

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md) = [`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)

## Constructors

### Constructor

> **new ServiceBuilder**\<`S`\>(`info`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L86)

#### Parameters

##### info

[`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

#### Returns

`ServiceBuilder`\<`S`\>

## Properties

### info

> **info**: [`ServiceInfoType`](../type-aliases/ServiceInfoType.md)

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L86)

***

### SClass

> **SClass**: [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\> = `Service`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L83)

## Methods

### addCommandDefinition()

> **addCommandDefinition**(...`commands`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:136](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L136)

`addCommandDefinition` adds a list of command definitions to the service builder

#### Parameters

##### commands

...[`CommandDefinitionList`](../type-aliases/CommandDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

CommandDefinitionList

#### Returns

`ServiceBuilder`\<`S`\>

The service builder

***

### addSubscriptionDefinition()

> **addSubscriptionDefinition**(...`subscription`): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:152](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L152)

It adds a subscription definition to the service builder

#### Parameters

##### subscription

...[`SubscriptionDefinitionList`](../type-aliases/SubscriptionDefinitionList.md)\<`S`\[`"ServiceClassType"`\]\>

SubscriptionDefinitionList

#### Returns

`ServiceBuilder`\<`S`\>

The service builder

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourcesType`\>(): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:204](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L204)

Define the resources of the service.
Resources are available within commands and subscriptions.

#### Type Parameters

##### ResourceName

`ResourceName` *extends* `string`

##### ResourcesType

`ResourcesType`

#### Returns

`ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"Resources"`, `S`\[`"Resources"`\] & `{ [K in string]: InstanceOrType<ResourcesType> }`\>\>

The builder with defined types for resources

#### Example

```ts
serviceBuilder.defineResources<'resource_name',ResourceType>()
```

***

### getCommandBuilder()

> **getCommandBuilder**\<`T`, `N`\>(`commandName`, `description`, `eventName?`): [`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:335](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L335)

Create a [CommandDefinitionBuilder](CommandDefinitionBuilder.md) for defining a command of this service.

#### Type Parameters

##### T

`T` *extends* `string`

##### N

`N` *extends* `string`

#### Parameters

##### commandName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

The name of the command to create.

##### description

`string`

A short description of what the command does.

##### eventName?

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`N`\>

Optional event name emitted on success.

#### Returns

[`CommandDefinitionBuilder`](CommandDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`CommandDefinitionBuilderTypes`](../type-aliases/CommandDefinitionBuilderTypes.md)\<[`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), [`Schema`](../type-aliases/Schema.md), `S`\[`"Resources"`\], [`InvokeList`](../type-aliases/InvokeList.md), `Record`\<`string`, [`Schema`](../type-aliases/Schema.md)\>\>\>

A new command builder instance

#### Example

```ts
const cmd = serviceBuilder.getCommandBuilder('login', 'Authenticate user')
  .addPayloadSchema(z.object({ user: z.string() }))
  .setCommandFunction(async function () {})
```

***

### getCommandDefinitions()

> **getCommandDefinitions**(): [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:387](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L387)

#### Returns

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

the definition of registered commands

***

### getCustomClass()

> **getCustomClass**(): [`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:228](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L228)

Get the service class used when creating instances.

#### Returns

[`Newable`](../type-aliases/Newable.md)\<`S`\[`"ServiceClassType"`\], [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

The constructor function of the service

***

### getFullServiceDefinition()

> **getFullServiceDefinition**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:461](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L461)

Returns the service definition.
This includes information about commands and subscriptions.

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `deprecated`: `boolean`; `serviceDescription`: `string`; `serviceName`: `string`; `serviceVersion`: `string`; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:249](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L249)

Instantiate the service with the provided EventBridge and optional configuration.

All command and subscription definitions are resolved automatically
before the instance is created.

#### Parameters

##### eventBridge

[`EventBridge`](../interfaces/EventBridge.md)

The event bridge implementation to use.

##### options?

\{ \[K in string \| number \| symbol\]: (\{ configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof S\["Resources"\] extends NeverObject ? \{ resources?: undefined \} : \{ resources: S\["Resources"\] \}) & (keyof S\["ConfigInputType"\] extends NeverObject ? \{ serviceConfig?: undefined \} : \{ serviceConfig?: S\["ConfigInputType"\] \}))\[K\] \}

Optional configuration such as logger or stores.

#### Returns

`Promise`\<`S`\[`"ServiceClassType"`\]\>

The initialized service instance

#### Example

```ts
const svc = await serviceBuilder.getInstance(eventBridge, { logger })
svc.start()
```

***

### getSubscriptionBuilder()

> **getSubscriptionBuilder**\<`T`\>(`subscriptionName`, `description`): [`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\]\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:371](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L371)

Create a [SubscriptionDefinitionBuilder](SubscriptionDefinitionBuilder.md) for defining a subscription.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### subscriptionName

[`NonEmptyString`](../type-aliases/NonEmptyString.md)\<`T`\>

The name of the subscription.

##### description

`string`

A human readable description.

#### Returns

[`SubscriptionDefinitionBuilder`](SubscriptionDefinitionBuilder.md)\<`S`\[`"ServiceClassType"`\], [`SubscriptionDefinitionBuilderTypes`](../type-aliases/SubscriptionDefinitionBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `S`\[`"Resources"`\]\>\>

A subscription builder instance

#### Example

```ts
const sub = serviceBuilder
  .getSubscriptionBuilder('userCreated', 'React on user creation')
  .subscribeToEvent('UserCreated')
```

***

### getSubscriptionDefinitions()

> **getSubscriptionDefinitions**(): [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:400](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L400)

#### Returns

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>

the definition of registered subscriptions

***

### markAsDeprecated()

> **markAsDeprecated**(): `ServiceBuilder`\<`S`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L126)

Mark this service as deprecated

#### Returns

`ServiceBuilder`\<`S`\>

The ServiceBuilder instance

***

### resolveDefinitions()

> **resolveDefinitions**(): `Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:172](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L172)

Resolve all added command and subscription definitions.

The resolved definitions are cached and subsequent calls
will return the cached result. No new definitions can be
added after this method was executed.

#### Returns

`Promise`\<\{ `commands`: [`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; `subscriptions`: [`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`S`\[`"ServiceClassType"`\]\>; \}\>

The resolved command and subscription definitions

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): `ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md)\<[`InferIn`](../type-aliases/InferIn.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:94](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L94)

"This function sets the config schema for the service builder."

#### Type Parameters

##### T

`T` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`T`

The schema that will be used to validate the config.

#### Returns

`ServiceBuilder`\<[`SetNewTypeValues`](../type-aliases/SetNewTypeValues.md)\<`S`, \{ `ConfigInputType`: [`InferIn`](../type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../type-aliases/InferIn.md)\<[`InferIn`](../type-aliases/InferIn.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ConfigType`: [`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`NeverObject`](../type-aliases/NeverObject.md); `ServiceClassType`: [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../type-aliases/Infer.md)\<[`Infer`](../type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../type-aliases/EmptyObject.md), `S`\[`"Resources"`\]\>\>; \}\>\>

ServiceBuilder

***

### setCustomClass()

> **setCustomClass**\<`T`\>(`customClass`): `ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:216](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L216)

It sets the class type of the service.

#### Type Parameters

##### T

`T` *extends* [`Service`](Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

#### Parameters

##### customClass

[`Newable`](../type-aliases/Newable.md)\<`T`, [`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<`S`\[`"ConfigType"`\], `S`\[`"Resources"`\]\>\>

A class which extends the Service class

#### Returns

`ServiceBuilder`\<[`SetNewTypeValue`](../type-aliases/SetNewTypeValue.md)\<`S`, `"ServiceClassType"`, `T`\>\>

The builder itself, but with the type of the service class changed.

***

### ~~setDefaultConfig()~~

> **setDefaultConfig**(`config`): `this`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:117](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L117)

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

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:422](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L422)

Simple helper to verify the service configuration during tests.

It resolves the definitions and checks for duplicated command or
subscription names. Useful to ensure that your service setup is
correct before starting it.

#### Returns

`Promise`\<`boolean`\>

#### Example

```ts
await serviceBuilder.testServiceSetup()
```

***

### ~~validateCommandDefinitions()~~

> **validateCommandDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:486](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L486)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateCommands()

> `protected` **validateCommands**(`commandDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:431](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L431)

#### Parameters

##### commandDefinitions

[`CommandDefinitionListResolved`](../type-aliases/CommandDefinitionListResolved.md)\<`any`\>

#### Returns

`void`

***

### ~~validateSubscriptionDefinitions()~~

> **validateSubscriptionDefinitions**(): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:494](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L494)

#### Returns

`void`

#### Deprecated

Use testServiceSetup() instead

***

### validateSubscriptions()

> `protected` **validateSubscriptions**(`subscriptionDefinitions`): `void`

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:471](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L471)

#### Parameters

##### subscriptionDefinitions

[`SubscriptionDefinitionListResolved`](../type-aliases/SubscriptionDefinitionListResolved.md)\<`any`\>

#### Returns

`void`
