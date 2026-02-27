[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createToolEventFrame

# Function: createToolEventFrame()

> **createToolEventFrame**(`input`): `object`

Defined in: protocol/helpers.ts:74

## Parameters

### input

#### args?

`unknown`

#### message?

`string`

#### result?

`unknown`

#### status

`"invoked"` \| `"succeeded"` \| `"failed"`

#### toolName

`string`

## Returns

`object`

### input

> `readonly` **input**: `unknown` = `input.args`

### kind

> `readonly` **kind**: `"tool"` = `'tool'`

### message

> `readonly` **message**: `string` \| `undefined` = `input.message`

### output

> `readonly` **output**: `unknown` = `input.result`

### status

> `readonly` **status**: `"invoked"` \| `"succeeded"` \| `"failed"` = `input.status`

### toolName

> `readonly` **toolName**: `string` = `input.toolName`
