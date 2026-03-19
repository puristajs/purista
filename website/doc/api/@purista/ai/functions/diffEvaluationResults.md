[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / diffEvaluationResults

# Function: diffEvaluationResults()

> **diffEvaluationResults**(`a`, `b`): `object`

Defined in: [packages/ai/src/evaluation/helpers.ts:62](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/evaluation/helpers.ts#L62)

Produces a quick diff between two runs so regressions are easy to spot.

## Parameters

### a

[`EvaluationResult`](../type-aliases/EvaluationResult.md)

### b

[`EvaluationResult`](../type-aliases/EvaluationResult.md)

## Returns

`object`

### baseline

> **baseline**: `object` = `a.summary`

#### baseline.avgDurationMs?

> `optional` **avgDurationMs**: `number`

#### baseline.failures

> **failures**: `number`

#### baseline.successes

> **successes**: `number`

#### baseline.total

> **total**: `number`

### candidate

> **candidate**: `object` = `b.summary`

#### candidate.avgDurationMs?

> `optional` **avgDurationMs**: `number`

#### candidate.failures

> **failures**: `number`

#### candidate.successes

> **successes**: `number`

#### candidate.total

> **total**: `number`

### deltaDuration

> **deltaDuration**: `number`

### deltaSuccess

> **deltaSuccess**: `number`

### workload

> **workload**: `string` = `a.workload`
