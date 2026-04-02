[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / createPuristaCliEngine

# Function: createPuristaCliEngine()

> **createPuristaCliEngine**(`options?`): `object`

Defined in: [packages/cli/src/engine.ts:25](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/cli/src/engine.ts#L25)

## Parameters

### options?

[`PuristaCliEngineOptions`](../type-aliases/PuristaCliEngineOptions.md) = `{}`

## Returns

`object`

### resolvePuristaCommand()

> **resolvePuristaCommand**: \<`TInput`\>(`commandId`, `input`) => `Promise`\<[`PuristaCommandResolution`](../type-aliases/PuristaCommandResolution.md)\<`TInput`, `unknown`\>\>

#### Type Parameters

##### TInput

`TInput`

#### Parameters

##### commandId

`"add-service"` | `"add-command"` | `"add-subscription"` | `"add-stream"` | `"add-queue"` | `"add-queue-worker"` | `"add-agent"` | `"init-project"`

##### input

`TInput`

#### Returns

`Promise`\<[`PuristaCommandResolution`](../type-aliases/PuristaCommandResolution.md)\<`TInput`, `unknown`\>\>

### runPuristaCommand()

> **runPuristaCommand**: \<`TInput`\>(`commandId`, `input`) => `Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>

#### Type Parameters

##### TInput

`TInput`

#### Parameters

##### commandId

`"add-service"` | `"add-command"` | `"add-subscription"` | `"add-stream"` | `"add-queue"` | `"add-queue-worker"` | `"add-agent"` | `"init-project"`

##### input

`TInput`

#### Returns

`Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>
