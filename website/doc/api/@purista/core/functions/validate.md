[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / validate

# Function: validate()

> **validate**\<`TSchema`\>(`schema`, `value`): `Promise`\<[`ValidationResult`](../type-aliases/ValidationResult.md)\<[`Infer`](../type-aliases/Infer.md)\<`TSchema`\>\>\>

Defined in: [schema/standardSchema.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/schema/standardSchema.ts#L65)

Validates input data with a Standard Schema compatible validator.

## Type Parameters

### TSchema

`TSchema` *extends* [`Schema`](../type-aliases/Schema.md)

## Parameters

### schema

`TSchema`

### value

`unknown`

## Returns

`Promise`\<[`ValidationResult`](../type-aliases/ValidationResult.md)\<[`Infer`](../type-aliases/Infer.md)\<`TSchema`\>\>\>
