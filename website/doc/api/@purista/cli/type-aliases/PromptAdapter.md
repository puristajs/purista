[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PromptAdapter

# Type Alias: PromptAdapter

> **PromptAdapter** = `object`

Defined in: [packages/cli/src/core/types.ts:85](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/types.ts#L85)

## Properties

### confirm()

> **confirm**: (`request`) => `Promise`\<`boolean`\>

Defined in: [packages/cli/src/core/types.ts:87](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/types.ts#L87)

#### Parameters

##### request

[`ConfirmPromptRequest`](ConfirmPromptRequest.md)

#### Returns

`Promise`\<`boolean`\>

***

### input()

> **input**: (`request`) => `Promise`\<`string`\>

Defined in: [packages/cli/src/core/types.ts:86](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/types.ts#L86)

#### Parameters

##### request

[`InputPromptRequest`](InputPromptRequest.md)

#### Returns

`Promise`\<`string`\>

***

### note()?

> `optional` **note**: (`message`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/cli/src/core/types.ts:89](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/types.ts#L89)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`void`\> \| `void`

***

### select()

> **select**: (`request`) => `Promise`\<`string`\>

Defined in: [packages/cli/src/core/types.ts:88](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/cli/src/core/types.ts#L88)

#### Parameters

##### request

[`SelectPromptRequest`](SelectPromptRequest.md)

#### Returns

`Promise`\<`string`\>
