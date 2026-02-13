[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ObjectWithKeysFromStringArray

# Type Alias: ObjectWithKeysFromStringArray\<T, Value\>

> **ObjectWithKeysFromStringArray**\<`T`, `Value`\> = `{ [K in T extends ReadonlyArray<infer U> ? U : never]: Value }`

Defined in: [helper/types/ObjectWithKeysFromStringArray.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/types/ObjectWithKeysFromStringArray.ts#L5)

Type helper which can create a typed record, based on given string array type.

## Type Parameters

### T

`T` *extends* `ReadonlyArray`\<`string`\>

### Value

`Value` = `unknown` \| `undefined`
