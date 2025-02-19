[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getTimeoutPromise

# Function: getTimeoutPromise()

> **getTimeoutPromise**\<`T`\>(`fn`, `ttl`): `Promise`\<`T`\>

Defined in: [packages/core/src/helper/getTimeoutPromise.impl.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/getTimeoutPromise.impl.ts#L9)

## Type Parameters

• **T**

## Parameters

### fn

`Promise`\<`T`\>

the promise which should get a timeout

### ttl

`number` = `30000`

the timeout in ms

## Returns

`Promise`\<`T`\>

## Default

```ts
30000
```
