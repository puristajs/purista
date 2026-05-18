[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PuristaCommandResolution

# Type Alias: PuristaCommandResolution\<TInput, TResolved\>

> **PuristaCommandResolution**\<`TInput`, `TResolved`\> = `object`

Defined in: [packages/cli/src/core/types.ts:42](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L42)

## Type Parameters

### TInput

`TInput`

### TResolved

`TResolved`

## Properties

### command

> **command**: [`PuristaCommandId`](PuristaCommandId.md)

Defined in: [packages/cli/src/core/types.ts:43](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L43)

***

### errors

> **errors**: [`PuristaCommandIssue`](PuristaCommandIssue.md)[]

Defined in: [packages/cli/src/core/types.ts:48](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L48)

***

### input

> **input**: `TInput`

Defined in: [packages/cli/src/core/types.ts:44](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L44)

***

### missing

> **missing**: [`PromptRequest`](PromptRequest.md)[]

Defined in: [packages/cli/src/core/types.ts:46](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L46)

***

### resolvedInput?

> `optional` **resolvedInput?**: `TResolved`

Defined in: [packages/cli/src/core/types.ts:45](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L45)

***

### warnings

> **warnings**: `string`[]

Defined in: [packages/cli/src/core/types.ts:47](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L47)
