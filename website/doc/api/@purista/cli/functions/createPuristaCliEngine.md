[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / createPuristaCliEngine

# Function: createPuristaCliEngine()

> **createPuristaCliEngine**(`options?`): `object`

Defined in: [packages/cli/src/engine.ts:26](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/cli/src/engine.ts#L26)

## Parameters

### options?

[`PuristaCliEngineOptions`](../type-aliases/PuristaCliEngineOptions.md) = `{}`

## Returns

`object`

### resolvePuristaCommand

> **resolvePuristaCommand**: \<`TInput`\>(`commandId`, `input`) => `Promise`\<[`PuristaCommandResolution`](../type-aliases/PuristaCommandResolution.md)\<`TInput`, `unknown`\>\>

#### Type Parameters

##### TInput

`TInput`

#### Parameters

##### commandId

`"add-service"` \| `"add-command"` \| `"add-subscription"` \| `"add-stream"` \| `"add-queue"` \| `"add-queue-worker"` \| `"add-agent"` \| `"export-asyncapi"` \| `"export-runtime-capabilities"` \| `"export-schedule-manifest"` \| `"export-cloudevents-schema"` \| `"init-project"`

##### input

`TInput`

#### Returns

`Promise`\<[`PuristaCommandResolution`](../type-aliases/PuristaCommandResolution.md)\<`TInput`, `unknown`\>\>

### runPuristaCommand

> **runPuristaCommand**: \<`TInput`\>(`commandId`, `input`) => `Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>

#### Type Parameters

##### TInput

`TInput`

#### Parameters

##### commandId

`"add-service"` \| `"add-command"` \| `"add-subscription"` \| `"add-stream"` \| `"add-queue"` \| `"add-queue-worker"` \| `"add-agent"` \| `"export-asyncapi"` \| `"export-runtime-capabilities"` \| `"export-schedule-manifest"` \| `"export-cloudevents-schema"` \| `"init-project"`

##### input

`TInput`

#### Returns

`Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>
