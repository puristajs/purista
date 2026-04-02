[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / getSubscriptionBuilderFileContent

# Function: getSubscriptionBuilderFileContent()

> **getSubscriptionBuilderFileContent**(`input`): `string`

Defined in: [packages/cli/src/api/content/subscription/getSubscriptionBuilderFileContent.ts:9](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/cli/src/api/content/subscription/getSubscriptionBuilderFileContent.ts#L9)

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
