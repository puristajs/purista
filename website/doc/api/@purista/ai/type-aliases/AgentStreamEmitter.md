[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamEmitter

# Type Alias: AgentStreamEmitter

> **AgentStreamEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:105](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L105)

## Methods

### sendArtifact()

> **sendArtifact**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:109](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L109)

#### Parameters

##### input

###### artifactId

`string`

###### content

`string` \| `Record`\<`string`, `unknown`\>

###### final?

`boolean`

###### mimeType?

`string`

###### sequence?

`number`

###### total?

`number`

#### Returns

`void`

***

### sendChunk()

> **sendChunk**(`content`): `void`

Defined in: [packages/ai/src/runtime/context.ts:106](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L106)

#### Parameters

##### content

`string`

#### Returns

`void`

***

### sendError()

> **sendError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:117](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L117)

#### Parameters

##### error

`unknown`

##### overrides?

###### code?

`string`

###### handled?

`boolean`

#### Returns

`void`

***

### sendFinal()

> **sendFinal**(`content`, `options?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:107](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L107)

#### Parameters

##### content

`string`

##### options?

###### summary?

`string`

#### Returns

`void`

***

### sendReasoning()

> **sendReasoning**(`content`, `options?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:108](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/runtime/context.ts#L108)

#### Parameters

##### content

`string`

##### options?

###### artifactId?

`string`

#### Returns

`void`
