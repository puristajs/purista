[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createErrorFrame

# Function: createErrorFrame()

> **createErrorFrame**(`input`): `object`

Defined in: [ai/src/protocol/helpers.ts:120](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/protocol/helpers.ts#L120)

## Parameters

### input

#### code

`string`

#### details?

`unknown`

#### handled?

`boolean`

#### message

`string`

## Returns

`object`

### code

> `readonly` **code**: `string` = `input.code`

### details

> `readonly` **details**: `unknown` = `input.details`

### handled

> `readonly` **handled**: `boolean`

### kind

> `readonly` **kind**: `"error"` = `'error'`

### message

> `readonly` **message**: `string` = `input.message`
