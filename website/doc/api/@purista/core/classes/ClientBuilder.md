[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ClientBuilder

# Class: ClientBuilder

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L39)

ClientBuilder to generate clients, based on service definitions.

## Extends

- [`GenericEventEmitter`](GenericEventEmitter.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

## Constructors

### new ClientBuilder()

> **new ClientBuilder**(`config`?): [`ClientBuilder`](ClientBuilder.md)

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:48](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L48)

#### Parameters

##### config?

`Partial`\<\{ `buildAs`: `"esm"` \| `"commonjs"` \| `"both"`; `definitionPath`: `string`; `eventBridgeClient`: \{ `clientName`: `string`; \}; `httpClient`: \{ `clientName`: `string`; \}; `outputPath`: `string`; `package`: \{ `description`: `string`; `name`: `string`; `private`: `boolean`; \}; `version`: `string`; \}\>

#### Returns

[`ClientBuilder`](ClientBuilder.md)

#### Overrides

[`GenericEventEmitter`](GenericEventEmitter.md).[`constructor`](GenericEventEmitter.md#constructors)

## Properties

### config

> **config**: `object`

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L40)

#### buildAs

> **buildAs**: `"esm"` \| `"commonjs"` \| `"both"`

#### definitionPath

> **definitionPath**: `string`

#### eventBridgeClient

> **eventBridgeClient**: `object` = `eventBridgeClientConfigSchema`

##### eventBridgeClient.clientName

> **eventBridgeClient.clientName**: `string`

#### httpClient

> **httpClient**: `object` = `httpClientConfigSchema`

##### httpClient.clientName

> **httpClient.clientName**: `string`

#### outputPath

> **outputPath**: `string`

#### package?

> `optional` **package**: `object`

##### package.description

> **package.description**: `string`

##### package.name

> **package.name**: `string`

##### package.private

> **package.private**: `boolean`

#### version

> **version**: `string`

***

### rootPath

> **rootPath**: `string`

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L46)

The root file from where the relative paths are resolved.
Defaults to current users directory

## Methods

### build()

> **build**(): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:223](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L223)

Runs the tsc against the generated ts source files.
Depending on settings, it will generate ESM and/or commonJS files

#### Returns

`Promise`\<`void`\>

***

### cleanDistFolder()

> **cleanDistFolder**(): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:143](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L143)

Deletes the content of the output folder.
Should be called before generating the client

#### Returns

`Promise`\<`void`\>

***

### createIndex()

> **createIndex**(): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:153](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L153)

Creates a index.ts file which exports the client(s) and types.
Is used in generated package.json

#### Returns

`Promise`\<`void`\>

***

### createPackageJson()

> **createPackageJson**(): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:175](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L175)

Creates a package.json file in the output folder.
Exports the files which are build by tsc based on generated client files

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `void`

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:812](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L812)

Destroys the builder and cleans the event listeners

#### Returns

`void`

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter`?): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L24)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

#### Parameters

##### eventName

`K`

##### parameter?

[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\[`K`\]

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`emit`](GenericEventEmitter.md#emit)

***

### generateHEventBridgeClient()

> **generateHEventBridgeClient**(`serviceDefinition`): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:708](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L708)

Generates the zero-dependency HTTP client source files

#### Parameters

##### serviceDefinition

[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)

#### Returns

`Promise`\<`void`\>

***

### generateHttpClient()

> **generateHttpClient**(`serviceDefinition`): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:332](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L332)

Generates the zero-dependency HTTP client source files

#### Parameters

##### serviceDefinition

[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)

#### Returns

`Promise`\<`void`\>

***

### getDefinitionPath()

> **getDefinitionPath**(): `string`

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L126)

Resolves the definitions folder path from config with rootPath

#### Returns

`string`

path of definitions folder

***

### getDefinitionsFromServiceBuilders()

> **getDefinitionsFromServiceBuilders**(`serviceBuilders`): `Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:100](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L100)

Gets the definitions from the provided service builders

#### Parameters

##### serviceBuilders

[`ServiceBuilder`](ServiceBuilder.md)\<[`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\>[]

#### Returns

`Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

***

### getOutputPath()

> **getOutputPath**(): `string`

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:134](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L134)

Resolves the output folder path from config with rootPath

#### Returns

`string`

path of output folder

***

### loadConfig()

> **loadConfig**(`path`?): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L78)

Loads the config fom JSON file.
If no path is provided, it will try to load the config from purista.client.json in rootPath directory

#### Parameters

##### path?

`string`

#### Returns

`Promise`\<`void`\>

***

### loadDefinitionFiles()

> **loadDefinitionFiles**(`path`?): `Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:299](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L299)

Loads the definitions from JSON files

#### Parameters

##### path?

`string`

#### Returns

`Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L20)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`off`](GenericEventEmitter.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L16)

#### Type Parameters

• **K** *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

`EventReceiver`\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`on`](GenericEventEmitter.md#on)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [packages/core/src/core/types/GenericEventEmitter.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L28)

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`removeAllListeners`](GenericEventEmitter.md#removealllisteners)

***

### writeConfig()

> **writeConfig**(`path`?): `Promise`\<`void`\>

Defined in: [packages/core/src/ClientBuilder/ClientBuilder.impl.ts:117](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L117)

Writes the config to a config file.
Defaults to purista.client.json in rootPath directory

#### Parameters

##### path?

`string`

#### Returns

`Promise`\<`void`\>
