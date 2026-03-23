[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / getQueueWorkerBuilderFileContent

# Function: getQueueWorkerBuilderFileContent()

> **getQueueWorkerBuilderFileContent**(`input`): `string`

Defined in: [content/queueWorker/getQueueWorkerBuilderFileContent.ts:7](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/cli/src/api/content/queueWorker/getQueueWorkerBuilderFileContent.ts#L7)

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
