[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / convertToProjectFileCasing

# Function: convertToProjectFileCasing()

> **convertToProjectFileCasing**(`input`, `puristaProjectConfig`): `string`

Defined in: [packages/cli/src/api/convertToProjectFileCasing.ts:4](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/api/convertToProjectFileCasing.ts#L4)

## Parameters

### input

`string`

### puristaProjectConfig

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

## Returns

`string`
