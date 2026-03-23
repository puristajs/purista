[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamEmitter

# Type Alias: AgentStreamEmitter

> **AgentStreamEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:106](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L106)

## Methods

### sendArtifact()

> **sendArtifact**(`input`): `void`

Defined in: [packages/ai/src/runtime/context.ts:110](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L110)

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

Defined in: [packages/ai/src/runtime/context.ts:107](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L107)

#### Parameters

##### content

`string`

#### Returns

`void`

***

### sendError()

> **sendError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:118](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L118)

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

Defined in: [packages/ai/src/runtime/context.ts:108](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L108)

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

Defined in: [packages/ai/src/runtime/context.ts:109](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/context.ts#L109)

#### Parameters

##### content

`string`

##### options?

###### artifactId?

`string`

#### Returns

`void`
