[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / runPuristaCommand

# Function: runPuristaCommand()

> **runPuristaCommand**\<`TInput`\>(`commandId`, `input`, `options?`): `Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>

Defined in: [packages/cli/src/engine.ts:107](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/engine.ts#L107)

## Type Parameters

### TInput

`TInput`

## Parameters

### commandId

`"add-service"` \| `"add-command"` \| `"add-subscription"` \| `"add-stream"` \| `"add-queue"` \| `"add-queue-worker"` \| `"add-agent"` \| `"export-asyncapi"` \| `"export-runtime-capabilities"` \| `"export-schedule-manifest"` \| `"export-kubernetes-cronjob"` \| `"export-cloudevents-schema"` \| `"init-project"`

### input

`TInput`

### options?

[`PuristaCliEngineOptions`](../type-aliases/PuristaCliEngineOptions.md)

## Returns

`Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>
