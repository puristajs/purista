[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SetNewTypeValue

# Type Alias: SetNewTypeValue\<T, K, V\>

> **SetNewTypeValue**\<`T`, `K`, `V`\>: `{ [P in keyof T]: P extends K ? V : T[P] }`

Defined in: [packages/core/src/core/types/SetNewTypeValue.ts:1](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/SetNewTypeValue.ts#L1)

## Type Parameters

• **T**

• **K** *extends* keyof `T`

• **V**
