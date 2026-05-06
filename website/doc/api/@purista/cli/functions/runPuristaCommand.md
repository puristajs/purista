[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / runPuristaCommand

# Function: runPuristaCommand()

> **runPuristaCommand**\<`TInput`\>(`commandId`, `input`, `options?`): `Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>

Defined in: [packages/cli/src/engine.ts:100](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/engine.ts#L100)

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

`Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>
