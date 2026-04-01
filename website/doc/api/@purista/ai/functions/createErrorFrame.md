[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createErrorFrame

# Function: createErrorFrame()

> **createErrorFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:130](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/protocol/helpers.ts#L130)

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
