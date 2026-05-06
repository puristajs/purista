[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / SelectPromptRequest

# Type Alias: SelectPromptRequest\<TKey, TValue\>

> **SelectPromptRequest**\<`TKey`, `TValue`\> = [`BasePromptRequest`](BasePromptRequest.md)\<`TKey`\> & `object`

Defined in: [packages/cli/src/core/types.ts:69](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/core/types.ts#L69)

## Type Declaration

### choices

> **choices**: `ReadonlyArray`\<[`PromptChoice`](PromptChoice.md)\<`TValue`\>\>

### defaultValue?

> `optional` **defaultValue**: `TValue`

### type

> **type**: `"select"`

## Type Parameters

### TKey

`TKey` *extends* `string` = `string`

### TValue

`TValue` *extends* `string` = `string`
