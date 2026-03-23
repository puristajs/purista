[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / convertToProjectFileCasing

# Function: convertToProjectFileCasing()

> **convertToProjectFileCasing**(`input`, `puristaProjectConfig`): `string`

Defined in: [convertToProjectFileCasing.ts:4](https://github.com/puristajs/purista/blob/f5d6341014c00d0ace275b083eb8e473fc2845f5/packages/cli/src/api/convertToProjectFileCasing.ts#L4)

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

`"biome"` \| `"none"` \| `"prettier"` = `...`

#### linter

`"biome"` \| `"eslint"` \| `"none"` = `...`

#### runtime

`"node"` \| `"bun"` = `...`

#### servicePath

`string` = `...`

## Returns

`string`
