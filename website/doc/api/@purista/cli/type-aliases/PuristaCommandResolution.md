[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PuristaCommandResolution

# Type Alias: PuristaCommandResolution\<TInput, TResolved\>

> **PuristaCommandResolution**\<`TInput`, `TResolved`\> = `object`

Defined in: [packages/cli/src/core/types.ts:37](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L37)

## Type Parameters

### TInput

`TInput`

### TResolved

`TResolved`

## Properties

### command

> **command**: [`PuristaCommandId`](PuristaCommandId.md)

Defined in: [packages/cli/src/core/types.ts:38](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L38)

***

### errors

> **errors**: [`PuristaCommandIssue`](PuristaCommandIssue.md)[]

Defined in: [packages/cli/src/core/types.ts:43](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L43)

***

### input

> **input**: `TInput`

Defined in: [packages/cli/src/core/types.ts:39](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L39)

***

### missing

> **missing**: [`PromptRequest`](PromptRequest.md)[]

Defined in: [packages/cli/src/core/types.ts:41](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L41)

***

### resolvedInput?

> `optional` **resolvedInput**: `TResolved`

Defined in: [packages/cli/src/core/types.ts:40](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L40)

***

### warnings

> **warnings**: `string`[]

Defined in: [packages/cli/src/core/types.ts:42](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/cli/src/core/types.ts#L42)
