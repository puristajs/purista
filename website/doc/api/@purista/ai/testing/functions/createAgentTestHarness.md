[**PURISTA API**](../../../../README.md)

***

[PURISTA API](../../../../packages.md) / [@purista/ai](../../README.md) / [testing](../README.md) / createAgentTestHarness

# Function: createAgentTestHarness()

> **createAgentTestHarness**\<`Definition`\>(`definition`, `options`): `object`

Defined in: ai/src/testing/index.ts:83

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
