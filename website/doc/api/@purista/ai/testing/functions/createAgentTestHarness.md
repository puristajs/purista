[**PURISTA API**](../../../../README.md)

***

[PURISTA API](../../../../packages.md) / [@purista/ai](../../README.md) / [testing](../README.md) / createAgentTestHarness

# Function: createAgentTestHarness()

> **createAgentTestHarness**\<`Definition`\>(`definition`, `options`): `object`

Defined in: [testing/index.ts:87](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/testing/index.ts#L87)

## Type Parameters

### Definition

`Definition` *extends* [`AttachedAgentDefinition`](../../type-aliases/AttachedAgentDefinition.md)\<`any`\>

## Parameters

### definition

`Definition`

### options

[`CreateAgentTestHarnessOptions`](../type-aliases/CreateAgentTestHarnessOptions.md)\<`Definition`\[`"manifest"`\]\[`"models"`\]\>

## Returns

`object`

### run()

> **run**(`input`): `Promise`\<`unknown`\>

#### Parameters

##### input

###### message?

`Record`\<`string`, `unknown`\>

###### parameter?

`unknown`

###### payload?

`unknown`

#### Returns

`Promise`\<`unknown`\>

### stream()

> **stream**(`input`): `Promise`\<\{ `chunks`: `unknown`[]; `final`: `unknown`; \}\>

#### Parameters

##### input

###### message?

`Record`\<`string`, `unknown`\>

###### parameter?

`unknown`

###### payload?

`unknown`

#### Returns

`Promise`\<\{ `chunks`: `unknown`[]; `final`: `unknown`; \}\>
