[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / SelectPromptRequest

# Type Alias: SelectPromptRequest\<TKey, TValue\>

> **SelectPromptRequest**\<`TKey`, `TValue`\> = [`BasePromptRequest`](BasePromptRequest.md)\<`TKey`\> & `object`

Defined in: [packages/cli/src/core/types.ts:69](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/types.ts#L69)

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
