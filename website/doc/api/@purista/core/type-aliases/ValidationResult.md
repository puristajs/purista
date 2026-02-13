[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ValidationResult

# Type Alias: ValidationResult\<TOutput\>

> **ValidationResult**\<`TOutput`\> = \{ `data`: `TOutput`; `success`: `true`; \} \| \{ `issues`: `ReadonlyArray`\<`StandardSchemaV1.Issue`\>; `success`: `false`; \}

Defined in: [schema/standardSchema.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/schema/standardSchema.ts#L18)

Unified validation result shape for all supported schema vendors.

## Type Parameters

### TOutput

`TOutput`
