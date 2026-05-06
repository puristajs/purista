[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AllowedCommandToolDefinition

# Type Alias: AllowedCommandToolDefinition\<Output, Payload, Parameter\>

> **AllowedCommandToolDefinition**\<`Output`, `Payload`, `Parameter`\> = `object`

Defined in: ai/src/builder/types.ts:62

## Type Parameters

### Output

`Output` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### Payload

`Payload` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

### Parameter

`Parameter` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

## Properties

### commandName

> **commandName**: `string`

Defined in: ai/src/builder/types.ts:69

***

### outputSchema?

> `optional` **outputSchema**: `Output`

Defined in: ai/src/builder/types.ts:70

***

### parameterSchema?

> `optional` **parameterSchema**: `Parameter`

Defined in: ai/src/builder/types.ts:72

***

### payloadSchema?

> `optional` **payloadSchema**: `Payload`

Defined in: ai/src/builder/types.ts:71

***

### serviceName

> **serviceName**: `string`

Defined in: ai/src/builder/types.ts:67

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: ai/src/builder/types.ts:68
