[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / loadPuristaConfig

# Function: loadPuristaConfig()

> **loadPuristaConfig**(`projectRootPath?`): `Promise`\<\{ `$schema`: `string`; `eventBridge`: `"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"`; `eventConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"`; `fileConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"`; `formatter`: `"biome"` \| `"none"` \| `"prettier"`; `linter`: `"biome"` \| `"eslint"` \| `"none"`; `runtime`: `"node"` \| `"bun"`; `servicePath`: `string`; \}\>

Defined in: [loadPuristaConfig.ts:42](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/loadPuristaConfig.ts#L42)

Load the project configuration file purista.json
This file must be placed in the project root (or workspace root).
(Same folder where the package.json is located.)

## Parameters

### projectRootPath?

`string`

## Returns

`Promise`\<\{ `$schema`: `string`; `eventBridge`: `"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"`; `eventConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"`; `fileConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"`; `formatter`: `"biome"` \| `"none"` \| `"prettier"`; `linter`: `"biome"` \| `"eslint"` \| `"none"`; `runtime`: `"node"` \| `"bun"`; `servicePath`: `string`; \}\>
