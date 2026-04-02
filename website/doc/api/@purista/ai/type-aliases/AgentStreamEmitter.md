[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamEmitter

# Type Alias: AgentStreamEmitter

> **AgentStreamEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:131](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L131)

## Methods

### endStructuredObject()

> **endStructuredObject**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:154](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L154)

#### Parameters

##### input

###### data

`unknown`

###### source?

`string`

###### streamId

`string`

###### summary?

`string`

#### Returns

`void`

***

### endText()

> **endText**(`options?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:133](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L133)

#### Parameters

##### options?

###### summary?

`string`

#### Returns

`void`

***

### sendArtifact()

> **sendArtifact**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:137](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L137)

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

Defined in: [packages/ai/src/runtime/context.ts:134](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L134)

#### Parameters

##### content

`string`

#### Returns

`void`

***

### sendError()

> **sendError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:155](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L155)

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

Defined in: [packages/ai/src/runtime/context.ts:135](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L135)

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

Defined in: [packages/ai/src/runtime/context.ts:136](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L136)

#### Parameters

##### content

`string`

##### options?

###### artifactId?

`string`

#### Returns

`void`

***

### sendStructuredSection()

> **sendStructuredSection**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:145](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L145)

#### Parameters

##### input

###### content

`unknown`

###### order?

`number`

###### section

`string`

###### source?

`string`

###### streamId

`string`

###### summary?

`string`

###### title?

`string`

#### Returns

`void`

***

### sendTextDelta()

> **sendTextDelta**(`content`): `void`

Defined in: [packages/ai/src/runtime/context.ts:132](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/context.ts#L132)

#### Parameters

##### content

`string`

#### Returns

`void`
