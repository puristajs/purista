[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / getQueueWorkerBuilderFileContent

# Function: getQueueWorkerBuilderFileContent()

> **getQueueWorkerBuilderFileContent**(`input`): `string`

Defined in: [packages/cli/src/api/content/queueWorker/getQueueWorkerBuilderFileContent.ts:7](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/api/content/queueWorker/getQueueWorkerBuilderFileContent.ts#L7)

## Parameters

### input

#### codeWriterOptions?

`Partial`\<`Options`\>

#### intervalMs?

`number`

#### maxParallelHandlers

`number`

#### mode

`"continuous"` \| `"interval"` \| `"sequential"`

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

#### queueName

`string`

#### serviceName

`string`

#### serviceVersion

`string`

#### workerDescription

`string`

#### workerName

`string`

## Returns

`string`
