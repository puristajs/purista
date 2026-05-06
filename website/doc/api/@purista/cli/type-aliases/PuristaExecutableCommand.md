[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PuristaExecutableCommand

# Type Alias: PuristaExecutableCommand\<TInput, TResolved\>

> **PuristaExecutableCommand**\<`TInput`, `TResolved`\> = `object`

Defined in: [packages/cli/src/core/command.ts:24](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/command.ts#L24)

## Type Parameters

### TInput

`TInput`

### TResolved

`TResolved` = `TInput`

## Properties

### execute()

> **execute**: (`resolvedInput`, `context`) => `Promise`\<[`PuristaCommandResult`](PuristaCommandResult.md)\>

Defined in: [packages/cli/src/core/command.ts:27](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/command.ts#L27)

#### Parameters

##### resolvedInput

`TResolved`

##### context

[`PuristaCommandContext`](PuristaCommandContext.md)

#### Returns

`Promise`\<[`PuristaCommandResult`](PuristaCommandResult.md)\>

***

### id

> **id**: [`PuristaCommandId`](PuristaCommandId.md)

Defined in: [packages/cli/src/core/command.ts:25](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/command.ts#L25)

***

### resolve()

> **resolve**: (`input`, `context`) => `Promise`\<[`PuristaCommandResolution`](PuristaCommandResolution.md)\<`TInput`, `TResolved`\>\>

Defined in: [packages/cli/src/core/command.ts:26](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/command.ts#L26)

#### Parameters

##### input

`TInput`

##### context

[`PuristaCommandContext`](PuristaCommandContext.md)

#### Returns

`Promise`\<[`PuristaCommandResolution`](PuristaCommandResolution.md)\<`TInput`, `TResolved`\>\>
