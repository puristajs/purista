[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ClientBuilder

# Class: ClientBuilder

Defined in: [ClientBuilder/ClientBuilder.impl.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L42)

ClientBuilder to generate clients, based on service definitions.

## Extends

- [`GenericEventEmitter`](GenericEventEmitter.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

## Constructors

### Constructor

> **new ClientBuilder**(`config?`): `ClientBuilder`

Defined in: [ClientBuilder/ClientBuilder.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L51)

#### Parameters

##### config?

`Partial`\<\{ `buildAs`: `"esm"` \| `"commonjs"` \| `"both"`; `definitionPath`: `string`; `eventBridgeClient?`: \{ `clientName`: `string`; \}; `httpClient?`: \{ `clientName`: `string`; \}; `outputPath`: `string`; `package?`: \{ `description`: `string`; `name`: `string`; `private`: `boolean`; \}; `version`: `string`; \}\>

#### Returns

`ClientBuilder`

#### Overrides

[`GenericEventEmitter`](GenericEventEmitter.md).[`constructor`](GenericEventEmitter.md#constructor)

## Properties

### config

> **config**: `object`

Defined in: [ClientBuilder/ClientBuilder.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L43)

#### buildAs

> **buildAs**: `"esm"` \| `"commonjs"` \| `"both"`

#### definitionPath

> **definitionPath**: `string`

#### eventBridgeClient

> **eventBridgeClient**: `object` = `eventBridgeClientConfigSchema`

##### eventBridgeClient.clientName

> **clientName**: `string`

#### httpClient

> **httpClient**: `object` = `httpClientConfigSchema`

##### httpClient.clientName

> **clientName**: `string`

#### outputPath

> **outputPath**: `string`

#### package?

> `optional` **package**: `object`

##### package.description

> **description**: `string`

##### package.name

> **name**: `string`

##### package.private

> **private**: `boolean`

#### version

> **version**: `string`

***

### rootPath

> **rootPath**: `string`

Defined in: [ClientBuilder/ClientBuilder.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L49)

The root path from where relative definition/config/output paths are resolved.
Defaults to the current working directory (`process.cwd()`).

## Methods

### build()

> **build**(): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:240](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L240)

Runs the tsc against the generated ts source files.
Depending on settings, it will generate ESM and/or commonJS files

#### Returns

`Promise`\<`void`\>

***

### cleanDistFolder()

> **cleanDistFolder**(): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:146](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L146)

Deletes the content of the output folder.
Should be called before generating the client

#### Returns

`Promise`\<`void`\>

***

### createIndex()

> **createIndex**(): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:156](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L156)

Creates a index.ts file which exports the client(s) and types.
Is used in generated package.json

#### Returns

`Promise`\<`void`\>

***

### createPackageJson()

> **createPackageJson**(): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:178](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L178)

Creates a package.json file in the output folder.
Exports the files which are build by tsc based on generated client files

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `void`

Defined in: [ClientBuilder/ClientBuilder.impl.ts:853](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L853)

Destroys the builder and cleans the event listeners

#### Returns

`void`

***

### emit()

> **emit**\<`K`\>(`eventName`, `parameter?`): `void`

Defined in: [core/types/GenericEventEmitter.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L27)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

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

### generateEventBridgeClient()

> **generateEventBridgeClient**(`serviceDefinition`): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:742](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L742)

Generates the zero-dependency EventBridge client source files.

#### Parameters

##### serviceDefinition

[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)

#### Returns

`Promise`\<`void`\>

***

### ~~generateHEventBridgeClient()~~

> **generateHEventBridgeClient**(`serviceDefinition`): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:786](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L786)

#### Parameters

##### serviceDefinition

[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use `generateEventBridgeClient` instead.

***

### generateHttpClient()

> **generateHttpClient**(`serviceDefinition`): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:362](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L362)

Generate zero‑dependency HTTP client source files from the given definition.

#### Parameters

##### serviceDefinition

[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)

The full service definition containing the exposed commands.

#### Returns

`Promise`\<`void`\>

#### Example

```ts
const services = await clientBuilder.loadDefinitionFiles()
await clientBuilder.generateHttpClient(services)
```

***

### getDefinitionPath()

> **getDefinitionPath**(): `string`

Defined in: [ClientBuilder/ClientBuilder.impl.ts:129](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L129)

Resolves the definitions folder path from config with rootPath

#### Returns

`string`

path of definitions folder

***

### getDefinitionsFromServiceBuilders()

> **getDefinitionsFromServiceBuilders**(`serviceBuilders`): `Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:103](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L103)

Gets the definitions from the provided service builders

#### Parameters

##### serviceBuilders

[`ServiceBuilder`](ServiceBuilder.md)\<[`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\>[]

#### Returns

`Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

***

### getOutputPath()

> **getOutputPath**(): `string`

Defined in: [ClientBuilder/ClientBuilder.impl.ts:137](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L137)

Resolves the output folder path from config with rootPath

#### Returns

`string`

path of output folder

***

### loadConfig()

> **loadConfig**(`path?`): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L81)

Loads the config from a JSON file.
If no path is provided, it loads `purista.client.json` from `rootPath`.

#### Parameters

##### path?

`string`

#### Returns

`Promise`\<`void`\>

***

### loadDefinitionFiles()

> **loadDefinitionFiles**(`path?`): `Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:322](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L322)

Load service definitions from JSON files.

#### Parameters

##### path?

`string`

Optional path to the folder containing the definition files.
Defaults to the configured definition path.

#### Returns

`Promise`\<[`FullServiceDefinition`](../type-aliases/FullServiceDefinition.md)\>

#### Example

```ts
const defs = await clientBuilder.loadDefinitionFiles()
```

***

### off()

> **off**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L23)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../type-aliases/EventReceiver.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`off`](GenericEventEmitter.md#off)

***

### on()

> **on**\<`K`\>(`eventName`, `fn`): `void`

Defined in: [core/types/GenericEventEmitter.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L19)

#### Type Parameters

##### K

`K` *extends* [`EventKey`](../type-aliases/EventKey.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\>

#### Parameters

##### eventName

`K`

##### fn

[`EventReceiver`](../type-aliases/EventReceiver.md)\<[`ClientBuilderEvents`](../type-aliases/ClientBuilderEvents.md)\[`K`\]\>

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`on`](GenericEventEmitter.md#on)

***

### removeAllListeners()

> **removeAllListeners**(): `void`

Defined in: [core/types/GenericEventEmitter.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GenericEventEmitter.ts#L31)

#### Returns

`void`

#### Inherited from

[`GenericEventEmitter`](GenericEventEmitter.md).[`removeAllListeners`](GenericEventEmitter.md#removealllisteners)

***

### writeConfig()

> **writeConfig**(`path?`): `Promise`\<`void`\>

Defined in: [ClientBuilder/ClientBuilder.impl.ts:120](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/ClientBuilder.impl.ts#L120)

Writes the config to a config file.
Defaults to purista.client.json in rootPath directory

#### Parameters

##### path?

`string`

#### Returns

`Promise`\<`void`\>
