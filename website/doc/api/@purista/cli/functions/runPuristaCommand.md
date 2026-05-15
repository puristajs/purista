[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / runPuristaCommand

# Function: runPuristaCommand()

> **runPuristaCommand**\<`TInput`\>(`commandId`, `input`, `options?`): `Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>

Defined in: [packages/cli/src/engine.ts:107](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/cli/src/engine.ts#L107)

## Type Parameters

### TInput

`TInput`

## Parameters

### commandId

`"add-service"` \| `"add-command"` \| `"add-subscription"` \| `"add-stream"` \| `"add-queue"` \| `"add-queue-worker"` \| `"add-agent"` \| `"export-asyncapi"` \| `"export-runtime-capabilities"` \| `"export-schedule-manifest"` \| `"export-cloudevents-schema"` \| `"init-project"`

### input

`TInput`

### options?

[`PuristaCliEngineOptions`](../type-aliases/PuristaCliEngineOptions.md)

## Returns

`Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>
