[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / Session

# Interface: Session\<S\>

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:435

Session-scoped operational API.

## Type Parameters

### S

`S` *extends* `BuilderState`

## Properties

### agents

> `readonly` **agents**: \{ readonly \[K in string \| number \| symbol\]: AgentInvoker\<S, K\> \}

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:437

***

### history

> **history**: `ConversationHistory`

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:444

***

### id

> `readonly` **id**: `string`

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:436

***

### memory

> **memory**: `SessionMemory`

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:443

***

### workflows

> `readonly` **workflows**: \{ readonly \[K in string \| number \| symbol\]: WorkflowInvoker\<S, K\> \}

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:440

## Methods

### clearHistory()

> **clearHistory**(): `Promise`\<`void`\>

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:445

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:447

#### Returns

`Promise`\<`void`\>

***

### replaceHistory()

> **replaceHistory**(`messages`): `Promise`\<`void`\>

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:446

#### Parameters

##### messages

readonly `Omit`\<`Message`, `"id"` \| `"timestamp"`\>[]

#### Returns

`Promise`\<`void`\>
