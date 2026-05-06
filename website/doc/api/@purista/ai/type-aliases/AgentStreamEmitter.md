[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentStreamEmitter

# Type Alias: AgentStreamEmitter

> **AgentStreamEmitter** = `object`

Defined in: [packages/ai/src/runtime/context.ts:440](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L440)

Stream helper API exposed via `context.io.stream`.

## Methods

### sendDelta()

> **sendDelta**(`content`): `void`

Defined in: [packages/ai/src/runtime/context.ts:441](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L441)

#### Parameters

##### content

[`JsonValue`](JsonValue.md)

#### Returns

`void`

***

### sendError()

> **sendError**(`error`, `overrides?`): `void`

Defined in: [packages/ai/src/runtime/context.ts:444](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L444)

#### Parameters

##### error

`Error`

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

Defined in: [packages/ai/src/runtime/context.ts:442](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L442)

#### Parameters

##### content

[`JsonValue`](JsonValue.md)

##### options?

###### summary?

`string`

#### Returns

`void`

***

### sendReasoning()

> **sendReasoning**(`content`): `void`

Defined in: [packages/ai/src/runtime/context.ts:443](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L443)

#### Parameters

##### content

`string`

#### Returns

`void`
