[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentTaskEmitter

# Type Alias: AgentTaskEmitter

> **AgentTaskEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:450](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L450)

Task-lane helper API exposed via `context.io.tasks`.

## Methods

### sendChunk()

> **sendChunk**(`taskId`, `content`, `options?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:451](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L451)

#### Parameters

##### taskId

`string`

##### content

[`JsonValue`](JsonValue.md)

##### options?

###### final?

`boolean`

###### kind?

`string`

###### metadata?

`Record`\<`string`, `unknown`\>

###### mimeType?

`string`

###### sequence?

`number`

#### Returns

`void`

***

### sendStatus()

> **sendStatus**(`taskId`, `status`, `options?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:462](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L462)

#### Parameters

##### taskId

`string`

##### status

`"failed"` | `"pending"` | `"running"` | `"completed"`

##### options?

###### detail?

`string`

###### summary?

`string`

#### Returns

`void`
