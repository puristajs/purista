[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentTextInputPart

# Type Alias: AgentTextInputPart

> **AgentTextInputPart** = `object`

Defined in: [packages/ai/src/input/types.ts:36](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/types.ts#L36)

Canonical normalized model input surface used across the runtime.

Applications should convert higher-level uploads/documents into these parts
before model invocation. For non-native formats such as PDF or Office files,
use a file-ingestion adapter rather than adding parser logic directly to the
framework runtime.

## Properties

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/ai/src/input/types.ts:39](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/types.ts#L39)

***

### text

> **text**: `string`

Defined in: [packages/ai/src/input/types.ts:38](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/types.ts#L38)

***

### type

> **type**: `"text"`

Defined in: [packages/ai/src/input/types.ts:37](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/types.ts#L37)
