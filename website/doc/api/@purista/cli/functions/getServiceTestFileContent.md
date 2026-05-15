[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / getServiceTestFileContent

# Function: getServiceTestFileContent()

> **getServiceTestFileContent**(`input`): `string`

Defined in: [packages/cli/src/api/content/service/getServiceTestFileContent.ts:10](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/cli/src/api/content/service/getServiceTestFileContent.ts#L10)

Create the content of the service test file.

## Parameters

### input

#### codeWriterOptions?

`Partial`\<`Options`\>

#### puristaConfig

\{ `$schema`: `string`; `agentPath`: `string`; `eventBridge`: `"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"`; `eventConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"`; `fileConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"`; `formatter`: `"biome"` \| `"prettier"` \| `"none"`; `linter`: `"biome"` \| `"none"` \| `"eslint"`; `runtime`: `"node"` \| `"bun"`; `servicePath`: `string`; \}

#### puristaConfig.$schema

`string` = `...`

#### puristaConfig.agentPath

`string` = `...`

#### puristaConfig.eventBridge

`"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"` = `...`

#### puristaConfig.eventConvention

`"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"` = `...`

#### puristaConfig.fileConvention

`"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` = `...`

#### puristaConfig.formatter

`"biome"` \| `"prettier"` \| `"none"` = `...`

#### puristaConfig.linter

`"biome"` \| `"none"` \| `"eslint"` = `...`

#### puristaConfig.runtime

`"node"` \| `"bun"` = `...`

#### puristaConfig.servicePath

`string` = `...`

#### serviceName

`string`

#### serviceVersion

`string`

## Returns

`string`
