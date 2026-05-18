[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / createPuristaCliEngine

# Function: createPuristaCliEngine()

> **createPuristaCliEngine**(`options?`): `object`

Defined in: [packages/cli/src/engine.ts:26](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/engine.ts#L26)

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

`"add-service"` \| `"add-command"` \| `"add-subscription"` \| `"add-stream"` \| `"add-queue"` \| `"add-queue-worker"` \| `"add-agent"` \| `"export-asyncapi"` \| `"export-runtime-capabilities"` \| `"export-schedule-manifest"` \| `"export-kubernetes-cronjob"` \| `"export-cloudevents-schema"` \| `"init-project"`

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

`"add-service"` \| `"add-command"` \| `"add-subscription"` \| `"add-stream"` \| `"add-queue"` \| `"add-queue-worker"` \| `"add-agent"` \| `"export-asyncapi"` \| `"export-runtime-capabilities"` \| `"export-schedule-manifest"` \| `"export-kubernetes-cronjob"` \| `"export-cloudevents-schema"` \| `"init-project"`

##### input

`TInput`

#### Returns

`Promise`\<[`PuristaCommandResult`](../type-aliases/PuristaCommandResult.md)\>
