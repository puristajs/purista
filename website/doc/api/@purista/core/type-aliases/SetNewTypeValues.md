[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SetNewTypeValues

# Type Alias: SetNewTypeValues\<T, Changes\>

> **SetNewTypeValues**\<`T`, `Changes`\> = `{ [P in keyof T]: P extends keyof Changes ? Changes[P] : T[P] }`

Defined in: [core/types/SetNewTypeValue.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/SetNewTypeValue.ts#L5)

## Type Parameters

### T

`T`

### Changes

`Changes` *extends* `{ [K in keyof T]?: unknown }`
