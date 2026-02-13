[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / addPuristaSubscription

# Function: addPuristaSubscription()

> **addPuristaSubscription**(`input`): `Promise`\<`void`\>

Defined in: [addPuristaSubscription.ts:17](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/addPuristaSubscription.ts#L17)

Add all folders and files for a new subscription to an existing PURISTA service.

## Parameters

### input

#### codeWriterOptions?

`Partial`\<`Options`\>

#### eventToSubscribe?

`string`

#### projectRootPath?

`string`

#### puristaConfig

\{ `$schema`: `string`; `eventBridge`: `"default"` \| `"amqp"` \| `"nats"` \| `"mqtt"` \| `"dapr"`; `eventConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"` \| `"constantCase"` \| `"dotCase"` \| `"pathCase"` \| `"trainCase"`; `fileConvention`: `"camel"` \| `"snake"` \| `"kebab"` \| `"pascal"` \| `"pascalSnake"`; `formatter`: `"biome"` \| `"none"` \| `"prettier"`; `linter`: `"biome"` \| `"eslint"` \| `"none"`; `runtime`: `"node"` \| `"bun"`; `servicePath`: `string`; \}

#### puristaConfig.$schema

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

#### subscriptionDescription

`string`

#### subscriptionName

`string`

## Returns

`Promise`\<`void`\>
