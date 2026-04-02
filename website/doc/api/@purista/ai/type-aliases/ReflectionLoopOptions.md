[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ReflectionLoopOptions

# Type Alias: ReflectionLoopOptions\<TDraft, TCritique\>

> **ReflectionLoopOptions**\<`TDraft`, `TCritique`\> = `object`

Defined in: [packages/ai/src/runtime/reflection.ts:28](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L28)

## Type Parameters

### TDraft

`TDraft`

### TCritique

`TCritique`

## Properties

### accept

> **accept**: [`ReflectionAcceptFn`](ReflectionAcceptFn.md)\<`TDraft`, `TCritique`\>

Defined in: [packages/ai/src/runtime/reflection.ts:36](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L36)

***

### critique

> **critique**: [`ReflectionCritiqueFn`](ReflectionCritiqueFn.md)\<`TDraft`, `TCritique`\>

Defined in: [packages/ai/src/runtime/reflection.ts:35](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L35)

***

### draft

> **draft**: [`ReflectionDraftFn`](ReflectionDraftFn.md)\<`TDraft`\>

Defined in: [packages/ai/src/runtime/reflection.ts:34](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L34)

***

### maxIterations?

> `optional` **maxIterations**: `number`

Defined in: [packages/ai/src/runtime/reflection.ts:32](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L32)

***

### name

> **name**: `string`

Defined in: [packages/ai/src/runtime/reflection.ts:29](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L29)

***

### preset?

> `optional` **preset**: `string`

Defined in: [packages/ai/src/runtime/reflection.ts:31](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L31)

***

### profile?

> `optional` **profile**: `string`

Defined in: [packages/ai/src/runtime/reflection.ts:30](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L30)

***

### refine?

> `optional` **refine**: [`ReflectionRefineFn`](ReflectionRefineFn.md)\<`TDraft`, `TCritique`\>

Defined in: [packages/ai/src/runtime/reflection.ts:37](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L37)

***

### stopOnStagnation?

> `optional` **stopOnStagnation**: `boolean`

Defined in: [packages/ai/src/runtime/reflection.ts:33](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/runtime/reflection.ts#L33)
