[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createToolEventFrame

# Function: createToolEventFrame()

> **createToolEventFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:104](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/helpers.ts#L104)

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
