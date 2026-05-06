[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createErrorFrame

# Function: createErrorFrame()

> **createErrorFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:148](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/helpers.ts#L148)

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
