[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / resolvePuristaCommand

# Function: resolvePuristaCommand()

> **resolvePuristaCommand**\<`TInput`\>(`commandId`, `input`, `options?`): `Promise`\<[`PuristaCommandResolution`](../type-aliases/PuristaCommandResolution.md)\<`TInput`, `unknown`\>\>

Defined in: [packages/cli/src/engine.ts:94](https://github.com/puristajs/purista/blob/6304710cc2bd8718e85e838752c7933f343ed2ce/packages/cli/src/engine.ts#L94)

## Type Parameters

### TInput

`TInput`

## Parameters

### commandId

`"add-service"` | `"add-command"` | `"add-subscription"` | `"add-stream"` | `"add-queue"` | `"add-queue-worker"` | `"add-agent"` | `"init-project"`

### input

`TInput`

### options?

[`PuristaCliEngineOptions`](../type-aliases/PuristaCliEngineOptions.md)

## Returns

`Promise`\<[`PuristaCommandResolution`](../type-aliases/PuristaCommandResolution.md)\<`TInput`, `unknown`\>\>
