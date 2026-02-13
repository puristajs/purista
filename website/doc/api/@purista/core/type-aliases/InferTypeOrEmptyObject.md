[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InferTypeOrEmptyObject

# Type Alias: InferTypeOrEmptyObject\<T\>

> **InferTypeOrEmptyObject**\<`T`\> = `T` *extends* [`Schema`](Schema.md) ? [`Infer`](Infer.md)\<`T`\> *extends* [`EmptyObject`](EmptyObject.md) ? [`Infer`](Infer.md)\<`T`\> : [`EmptyObject`](EmptyObject.md) : [`EmptyObject`](EmptyObject.md)

Defined in: [core/types/InferTypeOrEmptyObject.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/InferTypeOrEmptyObject.ts#L4)

## Type Parameters

### T

`T` *extends* [`Schema`](Schema.md) \| `undefined`
