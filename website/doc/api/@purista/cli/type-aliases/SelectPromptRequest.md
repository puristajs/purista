[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / SelectPromptRequest

# Type Alias: SelectPromptRequest\<TKey, TValue\>

> **SelectPromptRequest**\<`TKey`, `TValue`\> = [`BasePromptRequest`](BasePromptRequest.md)\<`TKey`\> & `object`

Defined in: [packages/cli/src/core/types.ts:69](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L69)

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
