[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / scanPuristaProject

# Function: scanPuristaProject()

> **scanPuristaProject**(`puristaConfig`, `projectRootPath?`): `Promise`\<[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)\>

Defined in: [packages/cli/src/api/scanPuristaProject.ts:19](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/api/scanPuristaProject.ts#L19)

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

`"biome"` \| `"prettier"` \| `"none"` = `...`

#### linter

`"biome"` \| `"none"` \| `"eslint"` = `...`

#### runtime

`"node"` \| `"bun"` = `...`

#### servicePath

`string` = `...`

### projectRootPath?

`string`

## Returns

`Promise`\<[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)\>
