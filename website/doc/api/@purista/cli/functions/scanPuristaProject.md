[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / scanPuristaProject

# Function: scanPuristaProject()

> **scanPuristaProject**(`puristaConfig`, `projectRootPath?`): `Promise`\<[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)\>

Defined in: [scanPuristaProject.ts:44](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/cli/src/api/scanPuristaProject.ts#L44)

Walk through the file and folder structure and extract the existing services with their commands and subscriptions.

## Parameters

### puristaConfig

#### $schema

`string` = `...`

#### agentPath

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
