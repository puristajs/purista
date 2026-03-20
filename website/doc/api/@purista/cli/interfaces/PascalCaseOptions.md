[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PascalCaseOptions

# Interface: PascalCaseOptions

Defined in: [change-case.ts:32](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L32)

Options used for converting strings to pascal/camel case.

## Extends

- [`Options`](Options.md)

## Properties

### delimiter?

> `optional` **delimiter**: `string`

Defined in: [change-case.ts:44](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L44)

#### Inherited from

[`Options`](Options.md).[`delimiter`](Options.md#delimiter)

***

### locale?

> `optional` **locale**: [`Locale`](../type-aliases/Locale.md)

Defined in: [change-case.ts:40](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L40)

#### Inherited from

[`Options`](Options.md).[`locale`](Options.md#locale)

***

### mergeAmbiguousCharacters?

> `optional` **mergeAmbiguousCharacters**: `boolean`

Defined in: [change-case.ts:33](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L33)

***

### prefixCharacters?

> `optional` **prefixCharacters**: `string`

Defined in: [change-case.ts:45](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L45)

#### Inherited from

[`Options`](Options.md).[`prefixCharacters`](Options.md#prefixcharacters)

***

### ~~separateNumbers?~~

> `optional` **separateNumbers**: `boolean`

Defined in: [change-case.ts:43](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L43)

#### Deprecated

Pass `split: splitSeparateNumbers` instead.

#### Inherited from

[`Options`](Options.md).[`separateNumbers`](Options.md#separatenumbers)

***

### split()?

> `optional` **split**: (`value`) => `string`[]

Defined in: [change-case.ts:41](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L41)

#### Parameters

##### value

`string`

#### Returns

`string`[]

#### Inherited from

[`Options`](Options.md).[`split`](Options.md#split)

***

### suffixCharacters?

> `optional` **suffixCharacters**: `string`

Defined in: [change-case.ts:46](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/cli/src/api/change-case.ts#L46)

#### Inherited from

[`Options`](Options.md).[`suffixCharacters`](Options.md#suffixcharacters)
