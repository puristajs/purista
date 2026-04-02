[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createToolEventFrame

# Function: createToolEventFrame()

> **createToolEventFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:86](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/protocol/helpers.ts#L86)

## Parameters

### input

#### args?

`unknown`

#### errorCode?

`string`

#### message?

`string`

#### result?

`unknown`

#### status

`"error"` \| `"success"` \| `"invoked"`

#### toolName

`string`

## Returns

`object`

### errorCode

> `readonly` **errorCode**: `string` \| `undefined` = `input.errorCode`

### input

> `readonly` **input**: `unknown` = `input.args`

### kind

> `readonly` **kind**: `"tool"` = `'tool'`

### message

> `readonly` **message**: `string` \| `undefined` = `input.message`

### output

> `readonly` **output**: `unknown` = `input.result`

### status

> `readonly` **status**: `"error"` \| `"success"` \| `"invoked"` = `input.status`

### toolName

> `readonly` **toolName**: `string` = `input.toolName`
