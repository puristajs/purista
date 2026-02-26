[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / scanPuristaProject

# Function: scanPuristaProject()

> **scanPuristaProject**(`puristaConfig`, `projectRootPath?`): `Promise`\<[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)\>

Defined in: [scanPuristaProject.ts:44](https://github.com/puristajs/purista/blob/643d8ae461234cbb142aca5f38526a7b04d6fea0/packages/cli/src/api/scanPuristaProject.ts#L44)

Walk through the file and folder structure and extract the existing services with their commands and subscriptions.

## Parameters

### puristaConfig

#### $schema

`string` = `...`

#### eventBridge

`"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"` = `...`

#### eventConvention

`"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"` = `...`

#### fileConvention

`"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` = `...`

#### formatter

`"biome"` \| `"none"` \| `"prettier"` = `...`

#### linter

`"biome"` \| `"eslint"` \| `"none"` = `...`

#### runtime

`"node"` \| `"bun"` = `...`

#### servicePath

`string` = `...`

### projectRootPath?

`string`

## Returns

`Promise`\<[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)\>
