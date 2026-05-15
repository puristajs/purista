[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / createProjectSnapshot

# Function: createProjectSnapshot()

> **createProjectSnapshot**(`puristaConfig`, `projectRootPath?`): `Promise`\<[`ProjectSnapshot`](../type-aliases/ProjectSnapshot.md)\>

Defined in: [packages/cli/src/project/createProjectSnapshot.ts:42](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/cli/src/project/createProjectSnapshot.ts#L42)

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
