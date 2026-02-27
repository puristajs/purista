[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createMessageFrame

# Function: createMessageFrame()

> **createMessageFrame**(`input`): `object`

Defined in: protocol/helpers.ts:50

## Parameters

### input

#### content

`string`

#### role

`"user"` \| `"assistant"` \| `"system"` \| `"tool"` \| `undefined`

#### summary?

`string`

## Returns

`object`

### content

> `readonly` **content**: `string` = `input.content`

### kind

> `readonly` **kind**: `"message"` = `'message'`

### role

> `readonly` **role**: `"user"` \| `"assistant"` \| `"system"` \| `"tool"`

### summary

> `readonly` **summary**: `string` \| `undefined` = `input.summary`
