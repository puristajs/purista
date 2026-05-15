[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / StateGetterFunction

# Type Alias: StateGetterFunction

> **StateGetterFunction** = \<`StateNames`\>(...`stateNames`) => `Promise`\<[`ObjectWithKeysFromStringArray`](ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>

Defined in: [core/StateStore/types/StateGetterFunction.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/StateStore/types/StateGetterFunction.ts#L4)

get a state value from the state store

## Type Parameters

### StateNames

`StateNames` *extends* `string`[]

## Parameters

### stateNames

...`StateNames`

## Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](ObjectWithKeysFromStringArray.md)\<`StateNames`\>\>
