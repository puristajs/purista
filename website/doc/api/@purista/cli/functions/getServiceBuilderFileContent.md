[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / getServiceBuilderFileContent

# Function: getServiceBuilderFileContent()

> **getServiceBuilderFileContent**(`input`): `string`

Defined in: [content/service/getServiceBuilderFileContent.ts:12](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/content/service/getServiceBuilderFileContent.ts#L12)

Generate the builder file, which contains the creation of the service builder.
This basic service builder is than used in the service file, where commands and services are added.
The reason for splitting up: prevent cycling dependencies, as the command and subscription builders are created by this service builder.

## Parameters

### input

#### codeWriterOptions?

`Partial`\<`Options`\>

#### puristaConfig

\{ `$schema`: `string`; `agentPath`: `string`; `eventBridge`: `"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"`; `eventConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"`; `fileConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"`; `formatter`: `"biome"` \| `"none"` \| `"prettier"`; `linter`: `"biome"` \| `"eslint"` \| `"none"`; `runtime`: `"node"` \| `"bun"`; `servicePath`: `string`; \}

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

`"biome"` \| `"none"` \| `"prettier"` = `...`

#### puristaConfig.linter

`"biome"` \| `"eslint"` \| `"none"` = `...`

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
