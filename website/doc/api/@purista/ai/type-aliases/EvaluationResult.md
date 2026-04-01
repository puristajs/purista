[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / EvaluationResult

# Type Alias: EvaluationResult

> **EvaluationResult** = `object`

Defined in: [packages/ai/src/evaluation/helpers.ts:21](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/evaluation/helpers.ts#L21)

Aggregated metrics for one workload/dataset pair.

## Properties

### dataset

> **dataset**: `string`

Defined in: [packages/ai/src/evaluation/helpers.ts:24](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/evaluation/helpers.ts#L24)

***

### manifestVersion

> **manifestVersion**: `string`

Defined in: [packages/ai/src/evaluation/helpers.ts:23](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/evaluation/helpers.ts#L23)

***

### samples

> **samples**: [`EvaluationSample`](EvaluationSample.md)[]

Defined in: [packages/ai/src/evaluation/helpers.ts:31](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/evaluation/helpers.ts#L31)

***

### summary

> **summary**: `object`

Defined in: [packages/ai/src/evaluation/helpers.ts:25](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/evaluation/helpers.ts#L25)

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

Defined in: [packages/ai/src/evaluation/helpers.ts:22](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/evaluation/helpers.ts#L22)
