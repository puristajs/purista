[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getTimeoutPromise

# Function: getTimeoutPromise()

> **getTimeoutPromise**\<`T`\>(`fn`, `ttl?`): `Promise`\<`T`\>

Defined in: [helper/getTimeoutPromise.impl.ts:10](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/getTimeoutPromise.impl.ts#L10)

## Type Parameters

### T

`T`

## Parameters

### fn

`Promise`\<`T`\>

the promise which should get a timeout

### ttl?

`number` = `30000`

the timeout in ms

## Returns

`Promise`\<`T`\>

## Default

```ts
30000
```
