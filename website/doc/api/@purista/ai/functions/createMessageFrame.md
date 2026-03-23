[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createMessageFrame

# Function: createMessageFrame()

> **createMessageFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:50](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/protocol/helpers.ts#L50)

## Parameters

### input

#### content

`string`

#### final?

`boolean`

#### partial?

`boolean`

#### role

`"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"` \| `undefined`

#### summary?

`string`

## Returns

`object`

### content

> `readonly` **content**: `string` = `input.content`

### final

> `readonly` **final**: `boolean` \| `undefined` = `input.final`

### kind

> `readonly` **kind**: `"message"` = `'message'`

### partial

> `readonly` **partial**: `boolean` \| `undefined` = `input.partial`

### role

> `readonly` **role**: `"user"` \| `"assistant"` \| `"system"` \| `"developer"` \| `"tool"`

### summary

> `readonly` **summary**: `string` \| `undefined` = `input.summary`
