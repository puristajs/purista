[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PromptAdapter

# Type Alias: PromptAdapter

> **PromptAdapter** = `object`

Defined in: [packages/cli/src/core/types.ts:90](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L90)

## Properties

### confirm

> **confirm**: (`request`) => `Promise`\<`boolean`\>

Defined in: [packages/cli/src/core/types.ts:92](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L92)

#### Parameters

##### request

[`ConfirmPromptRequest`](ConfirmPromptRequest.md)

#### Returns

`Promise`\<`boolean`\>

***

### input

> **input**: (`request`) => `Promise`\<`string`\>

Defined in: [packages/cli/src/core/types.ts:91](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L91)

#### Parameters

##### request

[`InputPromptRequest`](InputPromptRequest.md)

#### Returns

`Promise`\<`string`\>

***

### note?

> `optional` **note?**: (`message`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/cli/src/core/types.ts:94](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L94)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`void`\> \| `void`

***

### select

> **select**: (`request`) => `Promise`\<`string`\>

Defined in: [packages/cli/src/core/types.ts:93](https://github.com/puristajs/purista/blob/26267b98f9adfa85c2bf732383fb98c6a2225b0f/packages/cli/src/core/types.ts#L93)

#### Parameters

##### request

[`SelectPromptRequest`](SelectPromptRequest.md)

#### Returns

`Promise`\<`string`\>
