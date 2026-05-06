[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / Options

# Interface: Options

Defined in: [packages/cli/src/api/change-case.ts:39](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L39)

Options used for converting strings to any case.

## Extended by

- [`PascalCaseOptions`](PascalCaseOptions.md)

## Properties

### delimiter?

> `optional` **delimiter**: `string`

Defined in: [packages/cli/src/api/change-case.ts:44](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L44)

***

### locale?

> `optional` **locale**: [`Locale`](../type-aliases/Locale.md)

Defined in: [packages/cli/src/api/change-case.ts:40](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L40)

***

### prefixCharacters?

> `optional` **prefixCharacters**: `string`

Defined in: [packages/cli/src/api/change-case.ts:45](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L45)

***

### ~~separateNumbers?~~

> `optional` **separateNumbers**: `boolean`

Defined in: [packages/cli/src/api/change-case.ts:43](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L43)

#### Deprecated

Pass `split: splitSeparateNumbers` instead.

***

### split()?

> `optional` **split**: (`value`) => `string`[]

Defined in: [packages/cli/src/api/change-case.ts:41](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L41)

#### Parameters

##### value

`string`

#### Returns

`string`[]

***

### suffixCharacters?

> `optional` **suffixCharacters**: `string`

Defined in: [packages/cli/src/api/change-case.ts:46](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/cli/src/api/change-case.ts#L46)
