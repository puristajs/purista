[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / addPrefixToObject

# Type Alias: addPrefixToObject\<T, P\>

> **addPrefixToObject**\<`T`, `P`\>: `` { [K in keyof T as K extends string ? `${P}${K}` : never]: T[K] } ``

Defined in: [packages/core/src/core/types/addPrefixToObject.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/addPrefixToObject.ts#L7)

Helper for better typescript type.
All keys of given object must start with the given prefix. Otherwise Typescript will complain.

```

## Type Parameters

• **T**

• **P** *extends* `string`
