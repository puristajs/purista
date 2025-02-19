[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Complete

# Type Alias: Complete\<T\>

> **Complete**\<`T`\>: \{ \[P in keyof Required\<T\>\]: Pick\<T, P\> extends Required\<Pick\<T, P\>\> ? T\[P\] : T\[P\] \| undefined \}

Defined in: [packages/core/src/core/types/Complete.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Complete.ts#L21)

A helper which forces to provide all object keys, even if they are optional.

## Type Parameters

• **T**

## Example

```typescript
type A = {
 one?: string,
 two?: number,
 three: string
}

// without:
const x:A = { three: 'will work'}

// this will fail
const y:Complete<A> = { three: 'will complain that one and two is missing'}
// needs to be like this:
const z:Complete<A> = { one: undefined, two: undefined, three: 'will work'}
```
