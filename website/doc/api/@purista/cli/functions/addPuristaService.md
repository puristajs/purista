[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / addPuristaService

# Function: addPuristaService()

> **addPuristaService**(`input`): `Promise`\<`void`\>

Defined in: [addPuristaService.ts:19](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/addPuristaService.ts#L19)

Add all folders and files for a new service to the project.

## Parameters

### input

#### codeWriterOptions?

`Partial`\<`Options`\>

#### projectRootPath?

`string`

#### puristaConfig

\{ `$schema`: `string`; `eventBridge`: `"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"`; `eventConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"`; `fileConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"`; `formatter`: `"biome"` \| `"none"` \| `"prettier"`; `linter`: `"biome"` \| `"eslint"` \| `"none"`; `runtime`: `"node"` \| `"bun"`; `servicePath`: `string`; \}

#### puristaConfig.$schema

`string` = `...`

#### puristaConfig.eventBridge

`"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"` = `...`

#### puristaConfig.eventConvention

`"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"` = `...`

#### puristaConfig.fileConvention

`"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` = `...`

#### puristaConfig.formatter

`"biome"` \| `"none"` \| `"prettier"` = `...`

#### puristaConfig.linter

`"biome"` \| `"eslint"` \| `"none"` = `...`

#### puristaConfig.runtime

`"node"` \| `"bun"` = `...`

#### puristaConfig.servicePath

`string` = `...`

#### puristaProject

[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)

#### serviceDescription

`string`

#### serviceName

`string`

#### serviceVersion?

`string`

## Returns

`Promise`\<`void`\>
