[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ReflectionLoopOptions

# Type Alias: ReflectionLoopOptions\<TDraft, TCritique\>

> **ReflectionLoopOptions**\<`TDraft`, `TCritique`\> = `object`

Defined in: [packages/ai/src/runtime/reflection.ts:29](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L29)

## Type Parameters

### TDraft

`TDraft`

### TCritique

`TCritique`

## Properties

### accept

> **accept**: [`ReflectionAcceptFn`](ReflectionAcceptFn.md)\<`TDraft`, `TCritique`\>

Defined in: [packages/ai/src/runtime/reflection.ts:37](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L37)

***

### critique

> **critique**: [`ReflectionCritiqueFn`](ReflectionCritiqueFn.md)\<`TDraft`, `TCritique`\>

Defined in: [packages/ai/src/runtime/reflection.ts:36](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L36)

***

### draft

> **draft**: [`ReflectionDraftFn`](ReflectionDraftFn.md)\<`TDraft`\>

Defined in: [packages/ai/src/runtime/reflection.ts:35](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L35)

***

### maxIterations?

> `optional` **maxIterations**: `number`

Defined in: [packages/ai/src/runtime/reflection.ts:33](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L33)

***

### name

> **name**: `string`

Defined in: [packages/ai/src/runtime/reflection.ts:30](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L30)

***

### preset?

> `optional` **preset**: `string`

Defined in: [packages/ai/src/runtime/reflection.ts:32](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L32)

***

### profile?

> `optional` **profile**: `string`

Defined in: [packages/ai/src/runtime/reflection.ts:31](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L31)

***

### refine?

> `optional` **refine**: [`ReflectionRefineFn`](ReflectionRefineFn.md)\<`TDraft`, `TCritique`\>

Defined in: [packages/ai/src/runtime/reflection.ts:38](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L38)

***

### stopOnStagnation?

> `optional` **stopOnStagnation**: `boolean`

Defined in: [packages/ai/src/runtime/reflection.ts:34](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/reflection.ts#L34)
