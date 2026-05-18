[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createNoopMetricsRecorder

# Function: createNoopMetricsRecorder()

> **createNoopMetricsRecorder**(): [`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md)

Defined in: [core/metrics/createNoopMetricsRecorder.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/createNoopMetricsRecorder.ts#L12)

Creates a recorder that intentionally drops all metrics.

## Returns

[`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md)

## Example

```ts
const recorder = createNoopMetricsRecorder()
recorder.recordFrameworkMetric('purista.command.executions', 1)
```
