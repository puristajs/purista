[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createMessageFrame

# Function: createMessageFrame()

> **createMessageFrame**(`input`): `object`

Defined in: [ai/src/protocol/helpers.ts:50](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/protocol/helpers.ts#L50)

## Parameters

### input

#### content

`string`

#### final?

`boolean`

#### partial?

`boolean`

#### role

`"user"` \| `"assistant"` \| `"system"` \| `"tool"` \| `undefined`

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

> `readonly` **role**: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`

### summary

> `readonly` **summary**: `string` \| `undefined` = `input.summary`
