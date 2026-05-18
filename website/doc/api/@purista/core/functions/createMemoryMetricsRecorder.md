[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createMemoryMetricsRecorder

# Function: createMemoryMetricsRecorder()

> **createMemoryMetricsRecorder**(`options?`): [`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md) & `object`

Defined in: [core/metrics/createMemoryMetricsRecorder.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/createMemoryMetricsRecorder.ts#L21)

Memory recorder useful for deterministic unit tests.

## Parameters

### options?

[`PuristaMetricsRuntimeOptions`](../interfaces/PuristaMetricsRuntimeOptions.md) = `{}`

## Returns

[`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md) & `object`

## Example

```ts
const recorder = createMemoryMetricsRecorder()
recorder.recordFrameworkMetric('purista.command.executions', 1)
expect(recorder.records).toHaveLength(1)
```
