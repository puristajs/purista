[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / safeBind

# Function: safeBind()

> **safeBind**\<`T`, `U`\>(`fn`, `thisArg`): (...`args`) => `ReturnType`\<`T`\>

Defined in: [packages/core/src/helper/safeBind.impl.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/safeBind.impl.ts#L13)

Bind `this` argument like regular `.bind(thisArg)`, but keeps the typescript types in result

## Type Parameters

• **T** *extends* (...`args`) => `any`

• **U**

## Parameters

### fn

`T`

The function

### thisArg

`U`

## Returns

`Function`

### Parameters

#### args

...`Parameters`\<`T`\>

### Returns

`ReturnType`\<`T`\>

## Example

```typescript
const functionWithThisSet = safeBind(fn, thisParam)
```
