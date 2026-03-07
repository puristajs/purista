[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createMessageFrame

# Function: createMessageFrame()

> **createMessageFrame**(`input`): `object`

Defined in: [ai/src/protocol/helpers.ts:50](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/protocol/helpers.ts#L50)

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
