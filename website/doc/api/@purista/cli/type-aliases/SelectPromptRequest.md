[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / SelectPromptRequest

# Type Alias: SelectPromptRequest\<TKey, TValue\>

> **SelectPromptRequest**\<`TKey`, `TValue`\> = [`BasePromptRequest`](BasePromptRequest.md)\<`TKey`\> & `object`

Defined in: [packages/cli/src/core/types.ts:69](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/cli/src/core/types.ts#L69)

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
