[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / getSubscriptionBuilderFileContent

# Function: getSubscriptionBuilderFileContent()

> **getSubscriptionBuilderFileContent**(`input`): `string`

Defined in: [content/subscription/getSubscriptionBuilderFileContent.ts:9](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/content/subscription/getSubscriptionBuilderFileContent.ts#L9)

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

#### puristaProject

[`PuristaProjectInfo`](../type-aliases/PuristaProjectInfo.md)

#### responseEventName?

`string`

#### serviceName

`string`

#### serviceVersion

`string`

#### subscribeToEvent?

`string`

#### subscriptionDescription

`string`

#### subscriptionName

`string`

## Returns

`string`
