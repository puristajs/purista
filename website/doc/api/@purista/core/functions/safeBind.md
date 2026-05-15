[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / safeBind

# Function: safeBind()

> **safeBind**\<`ThisType`, `Args`, `ReturnType`\>(`fn`, `thisArg`): (...`args`) => `ReturnType`

Defined in: [helper/safeBind.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/safeBind.impl.ts#L13)

Bind `this` argument like regular `.bind(thisArg)`, but keeps the typescript types in result

## Type Parameters

### ThisType

`ThisType`

### Args

`Args` *extends* `unknown`[]

### ReturnType

`ReturnType`

## Parameters

### fn

(`this`, ...`args`) => `ReturnType`

The function

### thisArg

`ThisType`

## Returns

(...`args`) => `ReturnType`

## Example

```typescript
const functionWithThisSet = safeBind(fn, thisParam)
```
