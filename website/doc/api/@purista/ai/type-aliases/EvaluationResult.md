[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / EvaluationResult

# Type Alias: EvaluationResult

> **EvaluationResult** = `object`

Defined in: [packages/ai/src/evaluation/helpers.ts:19](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L19)

Aggregated metrics for one workload/dataset pair.

## Properties

### dataset

> **dataset**: `string`

Defined in: [packages/ai/src/evaluation/helpers.ts:22](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L22)

***

### manifestVersion

> **manifestVersion**: `string`

Defined in: [packages/ai/src/evaluation/helpers.ts:21](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L21)

***

### samples

> **samples**: [`EvaluationSample`](EvaluationSample.md)[]

Defined in: [packages/ai/src/evaluation/helpers.ts:29](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L29)

***

### summary

> **summary**: `object`

Defined in: [packages/ai/src/evaluation/helpers.ts:23](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L23)

#### avgDurationMs?

> `optional` **avgDurationMs**: `number`

#### failures

> **failures**: `number`

#### successes

> **successes**: `number`

#### total

> **total**: `number`

***

### workload

> **workload**: `string`

Defined in: [packages/ai/src/evaluation/helpers.ts:20](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L20)
