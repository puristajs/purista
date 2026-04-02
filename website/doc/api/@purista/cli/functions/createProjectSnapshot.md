[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / createProjectSnapshot

# Function: createProjectSnapshot()

> **createProjectSnapshot**(`puristaConfig`, `projectRootPath?`): `Promise`\<[`ProjectSnapshot`](../type-aliases/ProjectSnapshot.md)\>

Defined in: [packages/cli/src/project/createProjectSnapshot.ts:42](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/project/createProjectSnapshot.ts#L42)

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

`Promise`\<[`ProjectSnapshot`](../type-aliases/ProjectSnapshot.md)\>
