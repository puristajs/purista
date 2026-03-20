[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamEmitter

# Type Alias: AgentStreamEmitter

> **AgentStreamEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:98](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L98)

## Methods

### sendArtifact()

> **sendArtifact**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:102](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L102)

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

Defined in: [packages/ai/src/runtime/context.ts:99](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L99)

#### Parameters

##### content

`string`

#### Returns

`void`

***

### sendError()

> **sendError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:110](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L110)

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

Defined in: [packages/ai/src/runtime/context.ts:100](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L100)

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

Defined in: [packages/ai/src/runtime/context.ts:101](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/runtime/context.ts#L101)

#### Parameters

##### content

`string`

##### options?

###### artifactId?

`string`

#### Returns

`void`
